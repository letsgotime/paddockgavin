import { Pool } from "pg"

/**
 * The ranch database, with the rights the public forms need.
 *
 * Every public write used to happen in the browser through the Data API on
 * an anonymous token from Neon's hosted auth. That endpoint answers 404 now,
 * so from the moment the auth moved, every car entry and every RSVP was
 * mailed and never recorded. This is the connection the old Vercel functions
 * used for the same job, on the direct host rather than the pooler so a
 * session setting cannot be lost mid request. Small pool, it lives per
 * function instance.
 */
let pool: Pool | null = null

export function ranchDb(): Pool | null {
  const url = process.env.RANCH_DATABASE_URL || process.env.PISTON_RANCH_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: url.replace(/-pooler\./, "."), max: 3 })
  return pool
}

/** The consents a person gives on a public form, kept with the record. */
export interface Consent {
  /** Text messages about their entry, their RSVP and the day. Opt in. */
  sms: boolean
  /** Event emails. Required for an accepted car, offered to everyone. */
  event_email: boolean
  /** News of future PaddockGavin events. Opt in. */
  pg_events: boolean
  at: string
}

export function consentFrom(raw: unknown): Consent {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  return {
    sms: c.sms === true,
    event_email: c.event_email !== false,
    pg_events: c.pg_events === true,
    at: new Date().toISOString(),
  }
}
