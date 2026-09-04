import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * The Neon endpoints, for the server side.
 *
 * The browser gets these from /vendor/ranch-db.js, which it cannot share with
 * this side: that module is served over HTTP and imports the vendored client,
 * neither of which a route handler can do. So the endpoints live in two files
 * rather than twenty four, and this is the second one.
 *
 * Moved here from the tools deployment's api/_neon.js on 3 September 2026,
 * unchanged in substance: same Data API, same pinned JWKS origin, same event.
 */

export const DATA_API =
  "https://ep-broad-truth-auz9r4ir.apirest.c-10.us-east-1.aws.neon.tech/neondb/rest/v1";

/**
 * September 2026: auth moved off Neon's hosted endpoint onto our own
 * self-hosted Better Auth server (lib/auth.js, mounted at /api/auth). JWKS
 * is now served from there too, which is why this is a relative path rather
 * than a second hostname — a Vercel function can't reliably know its own
 * public origin, but every request it handles already carries one.
 */
export const AUTH_PATH = "/api/auth";

/** Where jose fetches the keys that verify a caller's session token. */
export const JWKS_PATH = AUTH_PATH + "/jwks";

/**
 * The one canonical origin the Better Auth server issues tokens from, mirrored
 * exactly from lib/auth.js resolveBaseURL(): BETTER_AUTH_URL if set, otherwise
 * the custom domain. The token issuer AND its verifying keys both live here.
 *
 * SECURITY: this MUST NOT be derived from the incoming request. An endpoint
 * that fetches its JWKS from a request-controlled host (x-forwarded-host /
 * host) can be handed a spoofed host pointing at an attacker's own key set;
 * the attacker then signs a token with any `email` they like and it verifies.
 * For endpoints that read data over the privileged, RLS-bypassing connection
 * (api/account.js), that is a full read-any-attendee bypass. Pinning the host
 * means only tokens genuinely signed by our server's private key verify, and
 * the `email` claim is one our server set from the authenticated user.
 */
export const AUTH_ORIGIN = process.env.BETTER_AUTH_URL || "https://pistonpoweredranch.com";

/** Issuer origin for jose's optional issuer check; same value as AUTH_ORIGIN. */
export const AUTH_ISSUER = AUTH_ORIGIN;

/** The fixed JWKS URL. Never request-derived — see AUTH_ORIGIN. */
export const JWKS_URL = `${AUTH_ORIGIN}${JWKS_PATH}`;

/**
 * One JWKS set, built once. The URL is pinned to AUTH_ORIGIN, so unlike the
 * tools deployment there is nothing request-shaped to cache per host: every
 * caller verifies against the same published keys.
 */
let jwks = null;
export function ranchJwks() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(JWKS_URL));
  return jwks;
}

/**
 * The two questions the database answers about a caller, by replaying their
 * own token. Authorisation comes from public.staff_allowlist, never from a
 * list in code: adding somebody to the allowlist is the whole job, and the
 * row level policies read the same table.
 */
async function ask(fn, bearer) {
  try {
    const res = await fetch(`${DATA_API}/rpc/${fn}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
      body: "{}",
    });
    if (!res.ok) return false;
    return (await res.text()).trim() === "true";
  } catch {
    return false;
  }
}
export const isStaff = (bearer) => ask("is_staff", bearer);
export const canSeeMoney = (bearer) => ask("can_see_money", bearer);

/** The bearer token on a request, or an empty string. */
export function bearerFrom(req) {
  const auth = req.headers.get("authorization") || "";
  return auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
}

/**
 * Verifies a caller's session token and returns their address, or "".
 * Cryptographic: the signature is checked against the keys our own auth
 * server publishes, and the issuer is pinned.
 */
export async function emailFromToken(bearer) {
  if (!bearer) return "";
  try {
    const { payload } = await jwtVerify(bearer, ranchJwks());
    return String(payload.email || payload.sub_email || "").toLowerCase();
  } catch {
    return "";
  }
}

/** The Piston Powered Ranch, Saturday 10 October 2026. */
export const EVENT_ID = "6ad3f289-8103-4c69-b10e-923790fb8a88";
