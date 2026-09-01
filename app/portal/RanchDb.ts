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
}

let loading: Promise<RanchDb> | null = null

export function ranchDb(): Promise<RanchDb> {
  if (!loading) {
    const url = "/vendor/ranch-db.js"
    loading = new Function("u", "return import(u)")(url) as Promise<RanchDb>
  }
  return loading
}
