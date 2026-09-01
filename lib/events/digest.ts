import { Pool } from "pg"
import type { EventRow } from "./types"

/**
 * What is actually true this week.
 *
 * Every number here is counted, and every name is one that has committed. A
 * section with nothing to report is left out rather than padded, because a
 * weekly letter that invents news to fill itself is a weekly letter people
 * stop opening, and because the rule on this estate is that nothing goes out
 * that is not settled.
 *
 * Nothing in here decides who receives it. That is recipients(), which reads
 * the unsubscribe column, and the send route, which does the honouring.
 */

let pool: Pool | null = null
function db(): Pool | null {
  const url = process.env.CRM_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: url, max: 3 })
  return pool
}

export interface DigestNews {
  daysLeft: number | null
  heads: number
  rsvps: number
  /** Committed only. Named because they said yes, never because we asked. */
  newPartners: { company: string; kind: "sponsor" | "vendor" }[]
  allPartners: { company: string; kind: "sponsor" | "vendor" }[]
  runOfShow: { time_label: string; activity: string }[]
}

export interface Recipient {
  id: string
  name: string | null
  email: string
  token: string
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const at = (d: Date) =>
    Date.parse(new Date(d).toLocaleDateString("en-CA", { timeZone: "America/Chicago" }) + "T00:00:00Z")
  const left = Math.round((at(new Date(iso)) - at(new Date())) / 86400000)
  return left < 0 ? null : left
}

export async function gatherNews(event: EventRow, sinceDays = 7): Promise<DigestNews | null> {
  const p = db()
  if (!p) return null
  try {
    const [counts, fresh, all, ros] = await Promise.all([
      p.query(
        `select count(*)::int as rsvps, coalesce(sum(party_size), 0)::int as heads
           from public.spectators where event_id = $1 and unsubscribed_at is null`,
        [event.id],
      ),
      p.query(
        `select company, type as kind from public.accounts
          where event_id = $1 and pipeline_stage = 'committed'
            and created_at > now() - ($2 || ' days')::interval
            and coalesce(company, '') <> ''
          order by company`,
        [event.id, String(sinceDays)],
      ),
      p.query(
        `select company, type as kind from public.accounts
          where event_id = $1 and pipeline_stage = 'committed' and coalesce(company, '') <> ''
          order by company`,
        [event.id],
      ),
      p.query(`select time_label, activity from public.public_run_of_show order by sort_order`),
    ])
    return {
      daysLeft: daysUntil(event.starts_at),
      rsvps: counts.rows[0].rsvps,
      heads: counts.rows[0].heads,
      newPartners: fresh.rows,
      allPartners: all.rows,
      runOfShow: ros.rows,
    }
  } catch {
    return null
  }
}

/**
 * Who gets it.
 *
 * Anybody who has not unsubscribed, and not twice in the same week. The
 * last_sent_at guard is what makes a second run of the same week harmless,
 * which matters because the alternative is a person receiving the same letter
 * twice and never opening the third.
 */
export async function recipients(eventId: string, minHoursBetween = 120): Promise<Recipient[]> {
  const p = db()
  if (!p) return []
  try {
    const { rows } = await p.query(
      `select id::text, name, email, unsub_token::text as token
         from public.spectators
        where event_id = $1
          and unsubscribed_at is null
          and coalesce(email, '') <> ''
          and (last_sent_at is null or last_sent_at < now() - ($2 || ' hours')::interval)
        order by created_at`,
      [eventId, String(minHoursBetween)],
    )
    return rows as Recipient[]
  } catch {
    return []
  }
}

export async function markSent(ids: string[]): Promise<void> {
  const p = db()
  if (!p || ids.length === 0) return
  try {
    await p.query(`update public.spectators set last_sent_at = now() where id = any($1::uuid[])`, [ids])
  } catch {
    /* The letter went. Failing to stamp it is not worth failing the run over,
       and the worst case is the guard above holding somebody back a week. */
  }
}

export async function unsubscribe(token: string): Promise<boolean> {
  const p = db()
  if (!p) return false
  try {
    const { rowCount } = await p.query(
      `update public.spectators set unsubscribed_at = now()
        where unsub_token = $1::uuid and unsubscribed_at is null`,
      [token],
    )
    /* Already gone counts as done: somebody clicking twice should not be told
       it failed. */
    return rowCount !== null
  } catch {
    return false
  }
}
