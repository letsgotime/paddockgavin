import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";

/**
 * Signs and verifies the short-lived upload session.
 *
 * The route that issues one is app/api/upload-session/route.ts; this is the
 * signing pair, kept apart so /api/upload can verify without importing a
 * route handler.
 *
 * Turnstile tokens are single-use at siteverify, but one vehicle submission can
 * be 50 photos plus video, voice and documents, each its own call to
 * /api/upload. Verifying per file would fail on the second one with
 * "timeout-or-duplicate". So the human is checked once here, and the result is
 * a signed session that authorises that submitter's uploads for a short window.
 *
 * Rollout: with TURNSTILE_SECRET unset this reports enforced:false and issues
 * no session, and /api/upload stays open exactly as it is today. Setting the
 * secret turns enforcement on with no code change.
 */

export const SESSION_TTL_MS = 30 * 60 * 1000;
const SUBMISSION_TYPES = new Set(["vehicle", "vendor", "sponsor"]);

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

export function signSession(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  const mac = createHmac("sha256", secret).update(body).digest("base64url");
  return `v1.${body}.${mac}`;
}

export function verifySession(token, secret) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const expected = createHmac("sha256", secret).update(parts[1]).digest("base64url");
  const a = Buffer.from(parts[2]);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!payload || typeof payload.e !== "number" || Date.now() > payload.e) return null;
  return payload;
}

/**
 * Whether the human check is actually enforceable, which is not the same
 * question as whether somebody set a variable.
 *
 * The two routes used to answer it separately, and on 3 September they
 * disagreed: the session exchange had no secret and told the browser the gate
 * was off, while the upload endpoint had one and demanded a session the
 * browser had been told it did not need. Every photograph on the entry form
 * was refused with "Verification required. Refresh the form and try again."
 * One function now, imported by both.
 */
export function gateEnforced() {
  return Boolean(process.env.TURNSTILE_SECRET);
}

export function sessionSecret() {
  // A dedicated secret is preferred; fall back to the Turnstile secret so
  // enabling the gate never depends on remembering a second variable.
  return process.env.UPLOAD_SESSION_SECRET || process.env.TURNSTILE_SECRET || "";
}
