import { Resend } from "resend"

/**
 * The mail client, built on first use rather than on import.
 *
 * The SDK throws out of its constructor when the key is missing, so a
 * `new Resend(process.env.RESEND_API_KEY)` at the top of a route file runs
 * while `next build` collects page data and takes the whole build down with
 * it. Three route files did that. A build with no key in the environment died
 * on the first one it reached, and the error named that route while the thing
 * actually broken was the deploy: every other route, and every page, was fine
 * and none of them shipped.
 *
 * The key is set on Vercel, so this was invisible until someone built without
 * one. It stayed one rotation, one rename, or one missing preview variable
 * away from stopping a deploy for a contact form.
 *
 * So the client is built inside the request instead. A route that needs mail
 * and cannot have it answers for itself, and nothing else notices.
 */

let cachedKey: string | undefined
let cached: Resend | null = null

/**
 * The client, or null when there is no usable key.
 *
 * Memoised against the key it was built from, so a rotated value is picked up
 * rather than served from a stale client.
 */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (key === cachedKey) return cached

  cachedKey = key
  try {
    cached = new Resend(key)
  } catch (err) {
    /* A key that is set but malformed throws here too, the same way it does
       in lib/ranch/auth.js. Caught, so the route can answer 503 rather than
       fall over in the middle of a send. */
    console.error("[resend] RESEND_API_KEY is set but the client would not build:", (err as Error)?.message)
    cached = null
  }
  return cached
}
