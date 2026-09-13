/**
 * Self-hosted Better Auth server for the Piston Powered Ranch console.
 *
 * Moved here from the tools deployment on 3 September 2026 and mounted at
 * app/api/auth/[...all]/route.ts. Nothing about the configuration changed:
 * same tables, same canonical origin, same signing key, so every session
 * issued before the move is still valid after it.
 *
 * This replaces Neon's hosted auth endpoint (which was itself Better Auth,
 * run on Neon's servers against a Neon-managed Google OAuth app). We now run
 * the same Better Auth engine ourselves, against the *same* database tables
 * Neon was already using (schema `neon_auth`: user, session, account,
 * verification, jwks), so every existing sign-in, staff allowlist entry, and
 * RLS policy (is_staff(), can_see_money(), etc.) keeps working untouched.
 * Those policies verify a session by checking a signature against a public
 * key stored in neon_auth.jwks via the pg_session_jwt extension — they never
 * called out to Neon's servers directly, so swapping who *issues* the token
 * requires no schema or policy change at all.
 */
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins/jwt";
import { magicLink } from "better-auth/plugins/magic-link";
import { emailOTP } from "better-auth/plugins/email-otp";
import { Resend } from "resend";
import { renderRanchEmail, renderRanchText } from "@/lib/email/ranch";

/**
 * The connection string, read when a request arrives rather than when this
 * module is imported.
 *
 * On the tools deployment this was a plain Vercel function and nothing
 * imported it at build time. Next collects route metadata during the build,
 * so a throw at import turned a missing variable into a failed build. It is
 * now a 503 on the endpoint instead, which is both true and survivable: the
 * rest of the site builds and serves.
 *
 * Not CRM_DATABASE_URL. That is the narrow crm_app role, which deliberately
 * cannot touch neon_auth; the auth server owns those tables.
 */
function databaseUrl() {
  return (
    process.env.RANCH_DATABASE_URL ||
    process.env.PISTON_RANCH_DATABASE_URL ||
    process.env.DATABASE_URL ||
    ""
  );
}

/** Whether this deployment can run the sign in server at all. */
export function authConfigured() {
  return Boolean(databaseUrl());
}

/**
 * The direct endpoint, not the pooler.
 *
 * The connection string in the environment points at Neon's pooler, which
 * is PgBouncer in transaction mode: a backend is lent out per transaction,
 * and anything session level, like the SET search_path below, stays on
 * whichever backend happened to run it. Most requests kept landing on that
 * backend and worked. When the pooler started a fresh one mid session,
 * get-session failed with `relation "user" does not exist`; pg_stat_activity
 * showed the new backend starting in the same second as the failure.
 *
 * On the direct endpoint a client keeps its backend for its whole life, so
 * the SET holds. Neon's direct host is the pooled host without -pooler; if
 * the string is already direct this is a no-op. A small pool, because these
 * are per function instance and the direct endpoint counts every one.
 */
let pool = null;
function getPool() {
  if (pool) return pool;
  const url = databaseUrl();
  if (!url) throw new Error("No database connection string. Set RANCH_DATABASE_URL.");
  pool = new Pool({ connectionString: url.replace(/-pooler\./, ".").replace(/([?&])sslmode=(require|prefer|verify-ca)\b/, "$1sslmode=verify-full"), max: 4 });
  pool.on("connect", (client) => {
    client.query("SET search_path TO neon_auth, public");
  });
  return pool;
}

/**
 * Better Auth's Kysely adapter has no per-adapter "schema" option, so it
 * always issues unqualified table names ("user", "session", ...). Those
 * tables live in `neon_auth`, not `public` — Neon's hosted auth server put
 * them there precisely so an app's own tables in `public` never collide
 * with them. Setting search_path on every new physical connection resolves
 * unqualified names against neon_auth first, without any adapter hacks or
 * table renames, and without touching the connection string other code
 * (api/_neon.js, vendor/ranch-db.js) already relies on.
 */

// Guarded: a malformed RESEND_API_KEY throws inside the Resend constructor
// (it builds an Authorization header eagerly), which would otherwise take
// down the entire auth server rather than just email delivery.
let resend = null;
if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    console.log("[v0] RESEND_API_KEY is set but invalid, emails will be skipped:", error?.message);
  }
}

const FROM_EMAIL = "Piston Powered Ranch <noreply@pistonpoweredranch.com>";

/**
 * The four emails that decide whether somebody gets in.
 *
 * These were the last unstyled messages on the site: bare `<p>Click the link
 * below</p>`, scaffolding from the first build that nobody went back for,
 * arriving from a ranch with thirty-nine designed emails behind it. The first
 * thing a new vendor ever saw of us was the one message that looked like
 * nothing.
 *
 * They render through the same module as the rest now, so a sign-in link
 * carries the same masthead as the invitation that asked for it. Each also
 * prints its URL in full underneath the button: buttons get stripped, links
 * get mangled by scanners, and a person retyping an address beats a person
 * writing in to say the button did nothing.
 */
function authEmail({ eyebrow, heading, preheader, blocks, reason }) {
  const mail = {
    preheader,
    eyebrow,
    heading,
    blocks,
    reason,
    disclaimer: "This is an automatic message. Nobody monitors replies to this address.",
  };
  return { html: renderRanchEmail(mail), text: renderRanchText(mail) };
}

/**
 * Say so when the mail did not go.
 *
 * This used to catch the failure, log it, and return as though it had worked.
 * Better Auth then told the page the link was sent, the page told the person
 * the link was sent, and the person waited for an email that did not exist.
 * A sign-in that fails silently is worse than one that fails: there is nothing
 * to report and nothing to retry.
 *
 * Throwing surfaces it at the endpoint, which is what the caller already knows
 * how to show. The same goes for a missing key: in production that is a
 * misconfiguration, and pretending otherwise means every sign-in on the site
 * quietly stops working with nothing in the logs to say why.
 */
async function sendAuthEmail({ to, subject, html, text }) {
  if (!resend) {
    console.error("[ranch/auth] RESEND_API_KEY is not set, so no sign in email can be sent:", subject);
    throw new Error("Email is not configured on this deployment.");
  }
  try {
    const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html, text });
    /* Resend reports a rejected send in the body, not by throwing. Without
       this the caught branch below never runs for the commonest failures:
       a suppressed address, an unverified domain, a spent quota. */
    if (error) throw new Error(error.message || String(error));
  } catch (error) {
    console.error("[ranch/auth] sign in email failed:", subject, error?.message || error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * pistonpoweredranch.com is the one canonical domain for this app — every
 * sign-in, magic-link, and session cookie must resolve there, not the
 * *.vercel.app deployment URL. Better Auth sets the session cookie on
 * whatever host baseURL points at, so baseURL has to be the custom domain
 * or logins land on the wrong host and the cookie never reaches the pages
 * the user actually visits.
 *
 * BETTER_AUTH_URL still wins if it is ever set (e.g. to test a different
 * host), but we deliberately do NOT fall back to VERCEL_PROJECT_PRODUCTION_URL
 * / VERCEL_URL for the base URL — those resolve to *.vercel.app and would
 * silently pull auth off the canonical domain.
 */
const CANONICAL_URL = "https://pistonpoweredranch.com";

function resolveBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  return CANONICAL_URL;
}

// Origin allowlist for Better Auth's CSRF check. The canonical apex + www
// cover production; the .vercel.app deployment URL and localhost stay listed
// so preview deployments and local dev keep working. The Vercel-provided
// hostnames are also pushed in case the production alias changes.
const trustedOrigins = [
  "https://pistonpoweredranch.com",
  "https://www.pistonpoweredranch.com",
  "https://paddockgavin.com",
  "https://www.paddockgavin.com",
  "http://localhost:3000",
];
if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  trustedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
}
if (process.env.VERCEL_URL) {
  trustedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

function build() {
  return betterAuth({
  database: getPool(),
  baseURL: resolveBaseURL(),
  basePath: "/api/auth",
  trustedOrigins,

  // The existing neon_auth schema uses singular table names (user, session,
  // account, verification, jwks) — Better Auth defaults to the same, so no
  // modelName overrides are required. Postgres resolves them via the
  // search_path set on the pooled connection role (neon_auth ahead of
  // public), matching how the hosted Neon Auth endpoint read them.

  // Better Auth 1.7 requires every account row to carry an `issuer` and
  // scopes provider identity by (issuer, accountId). The 8 existing rows
  // in neon_auth.account predate that column (all `credential`, no
  // Google rows yet, no collisions — checked directly against the live
  // database before choosing this). "provider-id" is the supported path
  // for a populated pre-1.7 table: it keeps the same provider-scoped
  // identity those rows already have (synthetic namespace
  // local:credential / local:oauth:google) instead of trying to infer a
  // verified OIDC issuer retroactively. The matching backfill migration
  // lives in scripts/backfill-account-issuer.mjs — it must run once
  // before this config reaches production, or every existing sign-in
  // breaks against the new NOT NULL column.
  account: {
    identityStrategy: "provider-id",
  },

  emailAndPassword: {
    enabled: true,
    /* An account that has never confirmed its address cannot sign in.

       Without this, sendOnSignUp posted a verification email and nothing
       enforced it, so anybody could sign up as any address and be treated as
       that person. is_staff() was hardened in the database to require a
       confirmed address, which closed the worst of it: six allowlisted
       addresses with no account yet were each claimable by whoever typed
       them. This closes the rest, including the portal matching entries by
       email.

       Safe to switch on because the three staff accounts are confirmed. Anyone
       unconfirmed now meets the code box on the sign in screen rather than a
       dead end, which is the part that was missing when this was tried before
       and locked everybody out. */
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Reset your Piston Powered Ranch password",
        ...authEmail({
          eyebrow: "Your account",
          heading: "Set a new password",
          preheader: "A link to choose a new password for the ranch.",
          blocks: [
            { kind: "lead", text: "Somebody asked to reset the password on this address. If that was you, the link below sets a new one." },
            { kind: "button", label: "Choose a new password", href: url },
            { kind: "links", rows: [{ label: "Or paste this into your browser", url }] },
            { kind: "quiet", text: "If it was not you, nothing has changed and you can ignore this. The link stops working shortly, and it can only be used once." },
          ],
          reason: "You are receiving this because a password reset was requested for this address.",
        }),
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Confirm your email for The Piston Powered Ranch",
        ...authEmail({
          eyebrow: "One step left",
          heading: "Confirm this address",
          preheader: "Confirm your email and your ranch account is open.",
          blocks: [
            { kind: "lead", text: "Confirming tells us the address is really yours. It takes one click, and then your account is open." },
            { kind: "button", label: "Confirm my email", href: url },
            { kind: "links", rows: [{ label: "Or paste this into your browser", url }] },
            { kind: "quiet", text: "If you were not expecting this, you can ignore it. Nothing happens until the link is used." },
          ],
          reason: "You are receiving this because this address was used to open a Piston Powered Ranch account.",
        }),
      });
    },
  },

  plugins: [
    // Issues a signed JWT (and publishes its public key into neon_auth.jwks)
    // on every session — this is what pg_session_jwt / auth.uid() verify
    // against in Postgres RLS policies. This is the load-bearing plugin: it
    // is the entire reason self-hosted Better Auth can stand in for Neon's
    // hosted endpoint without touching a single RLS policy.
    jwt({
      /* neon_auth.jwks was created by Neon's hosted auth with the older
         Better Auth schema: id, publicKey, privateKey, createdAt, expiresAt.
         The plugin in this version also writes alg and crv, Postgres refused
         the insert, and because the plugin signs on every session response
         that took get-session down with it. Write the shape the table has;
         alg falls back to EdDSA and crv is inside the public JWK itself.

         History, so nobody repeats 3 Sep: the hosted key (187b8b45) that was
         in this table was encrypted with Neon's secret, not ours, and every
         /api/auth/token answered 500 until this server minted its own key.
         That row is deleted; the server signs with 365e32bf. */
      adapter: {
        createJwk: async (webKey, ctx) =>
          ctx.context.adapter.create({
            model: "jwks",
            data: {
              publicKey: webKey.publicKey,
              privateKey: webKey.privateKey,
              createdAt: webKey.createdAt || new Date(),
              ...(webKey.expiresAt ? { expiresAt: webKey.expiresAt } : {}),
            },
          }),
      },
      jwt: {
        definePayload: ({ user }) => ({
          email: user.email,
          sub_email: user.email,
          /* The Data API maps this claim onto the Postgres role
             (jwt_role_claim_key is ".role"). Without it a valid token still
             runs as the anonymous role, and every policy written
             `to authenticated` quietly returns nothing to signed in staff. */
          role: "authenticated",
        }),
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendAuthEmail({
          to: email,
          subject: "Your sign in link for The Piston Powered Ranch",
          ...authEmail({
            eyebrow: "Sign in",
            heading: "Here is your way in",
            preheader: "One tap and you are signed in, back where you left off.",
            blocks: [
              { kind: "lead", text: "No password needed. Open this on the same device you asked from and it takes you straight back to the page you were on." },
              { kind: "button", label: "Sign me in", href: url },
              { kind: "links", rows: [{ label: "Or paste this into your browser", url }] },
              { kind: "quiet", text: "The link expires shortly and works once. If you did not ask for it, ignore it: nobody can get in without opening it." },
            ],
            reason: "You are receiving this because a sign in link was requested for this address.",
          }),
        });
      },
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        const subject =
          type === "sign-in"
            ? "Your Piston Powered Ranch sign-in code"
            : "Your Piston Powered Ranch verification code";
        await sendAuthEmail({
          to: email,
          subject,
          ...authEmail({
            eyebrow: "Sign in",
            heading: type === "sign-in" ? "Your sign in code" : "Your verification code",
            preheader: "A short code to type back into the ranch.",
            blocks: [
              { kind: "lead", text: "Type this back into the page that asked for it." },
              { kind: "facts", rows: [{ label: "Code", value: otp }] },
              { kind: "quiet", text: "It expires shortly and works once. If you did not ask for a code, ignore this message." },
            ],
            reason: "You are receiving this because a code was requested for this address.",
          }),
        });
      },
    }),
  ],

  advanced: {
    // Every id column in neon_auth (user, session, account, verification,
    // jwks) is `uuid NOT NULL DEFAULT gen_random_uuid()`. Better Auth's
    // default id generator produces short non-UUID strings, which Postgres
    // would reject outright, so every insert needs a real UUID instead.
    database: {
      generateId: "uuid",
    },
    // Required by the cross-site v0 preview iframe — without this, a
    // successful login in the preview appears to sign back out on the next
    // request because the session cookie is dropped. Production keeps
    // Better Auth's secure first-party defaults.
    ...(process.env.NODE_ENV === "development"
      ? {
          defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
          },
        }
      : {}),
  },
});
}

/**
 * One instance, made on the first request that needs it. Everything above is
 * configuration; nothing connects to Postgres until this is called.
 */
let instance = null;
export function getAuth() {
  if (!instance) instance = build();
  return instance;
}

