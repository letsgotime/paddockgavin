import { NextResponse, type NextRequest } from "next/server"

/**
 * One page, two front doors.
 *
 * paddockgavin.com/events/pistonpoweredranch is the event inside our hub, in
 * our brand. pistonpoweredranch.com is the same page, same template, same
 * database, wearing Rancho Jaramillo's. Nothing is cloned: a clone is two
 * things to keep in step and one of them always rots. The host picks the
 * tokens and the markup is identical.
 *
 * Entries, RSVPs and submissions all land in the same Neon tables whichever
 * door they came through, because the form does not know or care what the
 * address bar says.
 */

const EVENT_HOSTS: Record<string, string> = {
  "pistonpoweredranch.com": "pistonpoweredranch",
  "www.pistonpoweredranch.com": "pistonpoweredranch",
}

/**
 * Short paths on the event's own domain.
 *
 * pistonpoweredranch.com/entry rather than
 * pistonpoweredranch.com/events/pistonpoweredranch/entry, which is the hub's
 * filing system leaking onto somebody else's address. The page is the same
 * one either way; only the address bar is shorter.
 */
const SHORT_PATHS = new Set(["/entry", "/vendor", "/sponsor", "/targets"])

/**
 * The team tools live on their own deployment, so these cannot be rewritten
 * without proxying their assets too. A redirect gives the same short address
 * and lands on the real thing.
 */
const TOOLS = "https://piston-powered-ranch.vercel.app"
const TOOL_PATHS: Record<string, string> = {
  "/journey": "/journeys/",
  "/journeys": "/journeys/",
  "/collateral": "/collateral/",
  "/brand": "/brand/rancho/",
  "/chat": "/chat/",
  "/console": "/console/",
}

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0]
  const slug = EVENT_HOSTS[host]
  if (!slug) return NextResponse.next()

  const url = req.nextUrl.clone()
  const path = url.pathname.replace(/\/+$/, "") || "/"

  // Tools sit on another deployment. Send people there rather than pretending.
  const tool = TOOL_PATHS[path]
  if (tool) return NextResponse.redirect(new URL(tool, TOOLS), 307)

  // The bare domain is the event's landing page.
  if (url.pathname === "/") {
    url.pathname = `/events/${slug}`
  } else if (SHORT_PATHS.has(path)) {
    url.pathname = `/events/${slug}${path}`
  }

  const res = NextResponse.rewrite(url)
  // Read by the layout to pick the brand server side, so the page arrives in
  // the right colours rather than repainting once JavaScript works out where
  // it is.
  res.headers.set("x-pg-brand", slug)
  return res
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
