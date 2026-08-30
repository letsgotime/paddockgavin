"use client"

/**
 * The events CRM's connection to Postgres.
 *
 * Same Neon project, same Neon Auth, same staff_allowlist as the tools that
 * were built on the ranch domain, so nobody signs up again: Gavin, Oscar,
 * Bekah, Arnie and Josh already have accounts and they work here on the first
 * try. What moves is the front end, not the identity.
 *
 * These two URLs are public by design. Every row is protected by row level
 * security keyed on the caller's token, so knowing the endpoint buys nothing;
 * that is the same posture the ranch pages have always had.
 */
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js"

export const DATA_API =
  "https://ep-broad-truth-auz9r4ir.apirest.c-10.us-east-1.aws.neon.tech/neondb/rest/v1"
export const AUTH_URL =
  "https://ep-broad-truth-auz9r4ir.neonauth.c-10.us-east-1.aws.neon.tech/neondb/auth"

export type Db = ReturnType<typeof createClient>

let cached: Db | null = null

/** One client per browser tab. Null only if the module failed to construct. */
export function db(): Db | null {
  if (cached) return cached
  try {
    cached = createClient({
      auth: { url: AUTH_URL, allowAnonymous: true, adapter: SupabaseAuthAdapter() },
      dataApi: { url: DATA_API },
    })
    return cached
  } catch {
    return null
  }
}

export async function accessToken(): Promise<string | null> {
  const c = db()
  if (!c) return null
  try {
    const s = await c.auth.getSession()
    return s?.data?.session?.access_token ?? null
  } catch {
    return null
  }
}

/**
 * Calls a Postgres function through PostgREST.
 *
 * The neon-js wrapper does not attach the bearer token to rpc(), which is why
 * is_staff() answered false for genuine staff until this was written by hand.
 * db.from() does attach it, so only RPCs need this.
 */
export async function rpc<T = unknown>(fn: string, body: unknown = {}): Promise<T | null> {
  const token = await accessToken()
  if (!token) return null
  try {
    const res = await fetch(`${DATA_API}/rpc/${fn}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const text = await res.text()
    try {
      return JSON.parse(text) as T
    } catch {
      return text.trim() as unknown as T
    }
  } catch {
    return null
  }
}

export async function isStaff(): Promise<boolean> {
  return (await rpc<boolean>("is_staff")) === true
}

/** Cost and margin are Oscar, Gavin and Bekah only. Enforced in the policies too. */
export async function canSeeMoney(): Promise<boolean> {
  return (await rpc<boolean>("can_see_money")) === true
}

export async function whoAmI(): Promise<string> {
  return (await rpc<string>("me")) ?? ""
}

export type Profile = {
  email: string
  full_name: string | null
  avatar_path: string | null
  role: string | null
  title: string | null
  org: string | null
  phone: string | null
}

/** Creates the person record on first sign in, seeded from the allowlist. */
export async function ensureProfile(): Promise<Profile | null> {
  return await rpc<Profile>("ensure_profile")
}

export type EventRow = {
  id: string
  slug: string
  name: string
  venue_name: string | null
  venue_address: string | null
  starts_at: string | null
  ends_at: string | null
  charity: string | null
  status: string | null
  /** the vanity domain attached while this event is being planned, or null */
  domain: string | null
  tagline: string | null
  accent: string | null
  /** the client's tokens: their logo, colours and display face, our glass */
  brand: unknown
}

/**
 * Resolves the event from the URL segment. This is the whole point of the
 * rebuild: no page holds a hardcoded event id any more, it comes from the
 * route, so a second event is a row rather than a fork.
 */
export async function eventBySlug(slug: string): Promise<EventRow | null> {
  const c = db()
  if (!c) return null
  const r = await c.from("events").select("*").eq("slug", slug).limit(1)
  if (r.error || !r.data?.length) return null
  return r.data[0] as EventRow
}

/** Signs in, and creates the account on first use, the way the console does. */
export async function signIn(email: string, password: string): Promise<string | null> {
  const c = db()
  if (!c) return "No connection to the database."
  const first = await c.auth.signInWithPassword({ email, password })
  if (!first.error) return null

  const made = await c.auth.signUp({ email, password })
  if (made.error) return made.error.message || first.error.message || "Could not sign in."
  if (!made.data?.session) {
    const again = await c.auth.signInWithPassword({ email, password })
    if (again.error) return "Account created. Press sign in once more."
  }
  return null
}

export async function signOut(): Promise<void> {
  try {
    await db()?.auth.signOut()
  } catch {
    /* already gone */
  }
}
