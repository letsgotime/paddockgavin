import { Pool } from "pg"

/**
 * One person's entry, found by the token in their link.
 *
 * No sign in. Somebody who filled in a form should not need an account to ask
 * what happened to it, and every submission already carries a status_token
 * that nothing has ever read. This reads it.
 *
 * The token is the whole key, so the query is exact and the route says the
 * same thing for a token that never existed as for one that did: a wrong link
 * should not tell a stranger whether a right one exists.
 *
 * staff_notes is not granted to this role. What the desk writes about an entry
 * stays at the desk.
 */

let pool: Pool | null = null
function db(): Pool | null {
  const url = process.env.CRM_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: url, max: 3 })
  return pool
}

export interface EntryStatus {
  id: string
  type: string
  applicantName: string | null
  /** What they told us they are bringing. */
  subject: string | null
  message: string | null
  status: string
  submittedAt: string
  updatedAt: string | null
}

const TOKEN = /^[A-Za-z0-9._-]{8,128}$/

export async function loadEntryByToken(token: string): Promise<EntryStatus | null> {
  if (!TOKEN.test(token)) return null
  const p = db()
  if (!p) return null
  try {
    const { rows } = await p.query(
      `select id::text, type, applicant_name, details, status, created_at, updated_at
         from public.submissions
        where status_token = $1
        limit 1`,
      [token],
    )
    if (!rows.length) return null
    const r = rows[0]
    const d = (r.details || {}) as Record<string, string>
    return {
      id: r.id,
      type: r.type,
      applicantName: r.applicant_name,
      subject: d.org || null,
      message: d.message || null,
      status: r.status || "pending",
      submittedAt: r.created_at,
      updatedAt: r.updated_at,
    }
  } catch {
    return null
  }
}

/**
 * What each state means, in the words the emails already use.
 *
 * Nothing here promises a date we have not set. "Pending" says we will write
 * either way rather than inventing a week, because the entry emails say the
 * same and two answers that disagree is worse than one that is vague.
 */
export function statusCopy(status: string): { head: string; line: string; tone: "wait" | "yes" | "hold" | "no" } {
  switch ((status || "").toLowerCase()) {
    case "approved":
    case "accepted":
      return {
        head: "You are in",
        line: "Your car has a place on the field. Everything you need for the day comes by email nearer the time, and there is nothing to book.",
        tone: "yes",
      }
    case "waitlisted":
      return {
        head: "On the waiting list",
        line: "Three hundred places and more cars than that. You are on the list, and if a place opens we will write to you before we write to anybody else.",
        tone: "hold",
      }
    case "declined":
    case "rejected":
      return {
        head: "Not this time",
        line: "We could not fit your car in this year. That is a decision about one field on one Saturday and nothing else, and you are welcome to come and look.",
        tone: "no",
      }
    default:
      return {
        head: "With the judges",
        line: "Your entry is in and nobody has decided yet. Every car is looked at one at a time, and you will hear either way rather than being left in silence.",
        tone: "wait",
      }
  }
}
