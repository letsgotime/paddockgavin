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
