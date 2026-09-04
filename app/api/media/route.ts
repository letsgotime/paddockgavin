import { NextResponse } from "next/server"
import { issueSignedToken, presignUrl } from "@vercel/blob"
import { bearerFrom, emailFromToken, isStaff } from "@/lib/ranch/neon"

/**
 * Short-lived signed URLs for submitted media.
 *
 * The Blob store is private, so nothing under it is readable by URL.
 * Submitted vehicle photographs routinely show plates and VINs in the pixels,
 * so read access is gated on a verified token belonging to a staff address,
 * mirroring what is_staff() enforces in Postgres. Deliberately a second,
 * independent check: row level security protects the rows, this protects the
 * pixels.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const URL_TTL_MS = 10 * 60 * 1000
const MAX_PER_REQUEST = 120

export async function POST(req: Request) {
  const bearer = bearerFrom(req)
  if (!bearer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })

  const email = await emailFromToken(bearer)
  if (!email) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })

  if (!(await isStaff(bearer))) {
    return NextResponse.json({ error: "Not authorised for submitted media" }, { status: 403 })
  }

  let body: { pathnames?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 })
  }
  const pathnames = Array.isArray(body.pathnames) ? body.pathnames : []
  if (!pathnames.length) return NextResponse.json({ error: "No pathnames given" }, { status: 400 })
  if (pathnames.length > MAX_PER_REQUEST) {
    return NextResponse.json({ error: `Too many items (max ${MAX_PER_REQUEST})` }, { status: 400 })
  }

  const validUntil = Date.now() + URL_TTL_MS

  try {
    const urls = await Promise.all(
      pathnames.map(async (raw) => {
        const pathname = String(raw || "")
        /* Only ever sign things under a namespace this route owns: submitted
           entrant media, staff workbench attachments, chat attachments and
           profile avatars. Anything else, traversal included, is refused
           rather than signed. */
        const allowed =
          pathname.startsWith("submissions/") ||
          pathname.startsWith("workbench/") ||
          pathname.startsWith("chat/") ||
          pathname.startsWith("avatars/")
        if (!allowed || pathname.includes("..")) return { pathname, error: "Refused" }

        const signed = await issueSignedToken({ pathname, operations: ["get"], validUntil })
        const { presignedUrl } = await presignUrl(signed, {
          operation: "get",
          pathname,
          access: "private",
          validUntil,
        })
        return { pathname, url: presignedUrl }
      }),
    )
    return NextResponse.json({ urls, expiresAt: validUntil })
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Could not sign media URLs"
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}
