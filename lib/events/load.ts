import { Pool } from "pg"
import type { EventRow } from "./types"

export type { EventBrand, EventCta, EventAct, EventContent, EventRow } from "./types"

/**
 * Reading an event on the server, for the public page.
 *
 * The public page has to arrive as HTML with its words in it. A search engine
 * that gets an empty shell and a fetch indexes an empty shell, and this is the
 * page the event is found by.
 *
 * The Data API cannot do that: it requires a JWT even for rows anybody may
 * read, the browser client mints one anonymously, and there is no anonymous
 * endpoint to call from a server. So this reads Postgres directly.
 *
 * DATABASE_URL on this deployment points at the newsletter project, not the
 * CRM, which is why this looks for its own variable. Without it the page falls
 * back to rendering in the browser: everything still works, the words simply
 * are not in the HTML. Set CRM_DATABASE_URL and the fallback stops being used.
 */

let pool: Pool | null = null

function db(): Pool | null {
  const url = process.env.CRM_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: url, max: 3 })
  return pool
}

/** Null when there is no connection, or no such event. The caller tells them apart. */
export async function loadEvent(slug: string): Promise<EventRow | null> {
  const p = db()
  if (!p) return null
  try {
    const { rows } = await p.query(
      `select id, slug, name, venue_name, venue_address, starts_at, ends_at,
              charity, status, domain, tagline, accent,
              coalesce(brand, '{}'::jsonb) as brand,
              coalesce(content, '{}'::jsonb) as content
         from public.events
        where slug = $1
        limit 1`,
      [slug],
    )
    return (rows[0] as EventRow) ?? null
  } catch {
    /* A page that cannot reach the database should still render in the
       browser rather than showing an error to somebody looking for a car show. */
    return null
  }
}

export async function loadEventSlugs(): Promise<string[]> {
  const p = db()
  if (!p) return []
  try {
    const { rows } = await p.query(`select slug from public.events where status <> 'archived'`)
    return rows.map((r: { slug: string }) => r.slug)
  } catch {
    return []
  }
}

export interface RunOfShowRow { time_label: string; activity: string }
export interface MapFeatureRow { kind: string; name: string; category: string | null; blurb: string | null }
export interface PartnerRow { company: string; category?: string | null; tier?: string | null }

/**
 * The day, as the public sees it.
 *
 * Reads public_run_of_show, a view over the operational list filtered to the
 * lines marked is_public. The full list carries load-in, traffic control and
 * load-out, which are nobody's business but ours.
 *
 * run_of_show has no event_id, so this is the same list for every event. That
 * is a real gap for a second event and is worth fixing before there is one.
 */
export async function loadRunOfShow(): Promise<RunOfShowRow[]> {
  const p = db()
  if (!p) return []
  try {
    const { rows } = await p.query(`select time_label, activity from public.public_run_of_show order by sort_order`)
    return rows as RunOfShowRow[]
  } catch {
    return []
  }
}

/** Zones, routes and points of interest. Hidden features never leave the CRM. */
export async function loadMapFeatures(eventId: string): Promise<MapFeatureRow[]> {
  const p = db()
  if (!p) return []
  try {
    const { rows } = await p.query(
      `select kind, name, category, blurb
         from public.map_features
        where event_id = $1 and status <> 'hidden'
        order by case kind when 'zone' then 0 when 'poi' then 1 else 2 end, sort`,
      [eventId],
    )
    return rows as MapFeatureRow[]
  } catch {
    return []
  }
}

/**
 * Who is actually coming, which is only ever the committed ones.
 *
 * The views do that filtering, because every account is still 'applied' and a
 * list built on status would publish the ones we are chasing. Neither view
 * carries a figure, so a price cannot reach a public page by accident.
 */
export async function loadPartners(eventId: string): Promise<{ vendors: PartnerRow[]; sponsors: PartnerRow[] }> {
  const p = db()
  if (!p) return { vendors: [], sponsors: [] }
  try {
    const [v, s] = await Promise.all([
      p.query(`select company, category from public.public_vendors where event_id = $1 order by company`, [eventId]),
      p.query(`select company, tier from public.public_sponsors where event_id = $1 order by company`, [eventId]),
    ])
    return { vendors: v.rows as PartnerRow[], sponsors: s.rows as PartnerRow[] }
  } catch {
    return { vendors: [], sponsors: [] }
  }
}
