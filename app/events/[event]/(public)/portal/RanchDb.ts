/**
 * The one browser database client, borrowed rather than copied.
 *
 * It is served from this same origin at /vendor/ranch-db.js and every ranch
 * tool already imports it. Copying its sign in algorithm here would make a
 * fourth copy of the thing that was just reduced to one, so the portal loads
 * that file at runtime instead.
 *
 * The specifier is built at runtime so the bundler leaves it alone: a literal
 * import of a cross deployment URL is something Turbopack tries to resolve at
 * build time and cannot.
 */

export interface RanchDb {
  rpc: (fn: string, body?: unknown) => Promise<unknown>
  me: () => Promise<string>
  signIn: (email: string, password: string) => Promise<string | null>
  magicLink: (email: string, callbackURL?: string) => Promise<string | null>
  signInWithGoogle: (callbackURL?: string) => Promise<string | null>
  signOut: () => Promise<void>
  sendEmailCode: (email: string) => Promise<string | null>
  verifyEmailCode: (email: string, otp: string) => Promise<string | null>
  NEEDS_VERIFICATION?: string
}

/** What signIn returns when the address has never been confirmed. */
export const NEEDS_VERIFICATION = "needs-verification"

let loading: Promise<RanchDb> | null = null

/** Long enough for a bad connection, short enough not to look frozen. */
const LOAD_TIMEOUT_MS = 12_000

/**
 * The client, or a rejection. Never a promise that hangs.
 *
 * This is a script fetched from the network at runtime, so it can be slow, it
 * can 404 after a bad deploy, and on a phone at the back of the field it can
 * simply never arrive. Without a deadline the page waits on it forever and
 * shows "one moment" until somebody gives up, which is the worst way to fail:
 * indistinguishable from working, and it never resolves.
 *
 * A failed load is not cached, so a retry is a real retry rather than the same
 * rejection handed back.
 */
export function ranchDb(): Promise<RanchDb> {
  if (!loading) {
    const url = "/vendor/ranch-db.js"
    const load = new Function("u", "return import(u)")(url) as Promise<RanchDb>
    loading = Promise.race([
      load,
      new Promise<RanchDb>((_, reject) =>
        setTimeout(() => reject(new Error("sign in took too long to load")), LOAD_TIMEOUT_MS),
      ),
    ]).catch((e) => {
      loading = null
      throw e
    })
  }
  return loading
}
