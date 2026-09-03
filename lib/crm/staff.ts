/**
 * Who is calling, when the caller is one of the team.
 *
 * The console signs people in through Better Auth and gives every page a short
 * lived JWT. Rather than verify that token here with a second copy of the key
 * handling, the token is handed to the Neon Data API, which already verifies
 * it against the published keys on every request, and asked the two questions
 * the database can answer: is_staff(), which checks the allowlist and that the
 * address is confirmed, and me(), which returns the address.
 *
 * A token that is expired, forged or belongs to somebody who is not on the
 * list answers false or nothing, and the route refuses.
 */
const DATA_API = "https://ep-broad-truth-auz9r4ir.apirest.c-10.us-east-1.aws.neon.tech/neondb/rest/v1"

export interface Staff {
  email: string
}

export async function staffFromRequest(req: Request): Promise<Staff | null> {
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : ""
  if (!token || token.length > 4096) return null

  const call = async (fn: string): Promise<string | null> => {
    try {
      const r = await fetch(`${DATA_API}/rpc/${fn}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
        cache: "no-store",
      })
      if (!r.ok) return null
      return (await r.text()).trim()
    } catch {
      return null
    }
  }

  if ((await call("is_staff")) !== "true") return null
  const me = (await call("me")) || ""
  return { email: me.replace(/^"|"$/g, "") }
}
