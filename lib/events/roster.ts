import { Pool } from "pg"

/**
 * The field: the cars that have actually been accepted.
 *
 * Public, and deliberately thin. A submission carries an applicant's name, an
 * email, a phone number and photographs that routinely have plates and VINs in
 * them. None of that belongs on a page anybody can open, so this reads two
 * columns and derives a third, and cannot return the rest even by mistake.
 *
 * Only accepted cars appear. A pending entry is a decision nobody has made
 * yet, and publishing it would tell an owner they were in before the desk had
 * said so.
 */

let pool: Pool | null = null
function db(): Pool | null {
  const url = process.env.CRM_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: url, max: 3 })
  return pool
}

export interface RosterCar {
  id: string
  /** What they are bringing, as they described it. */
  car: string
}

/**
 * Two form shapes, because the entry form changed and the earlier rows stayed.
 * The older one put the car in details.org, the newer in details.vehicle. A
 * roster that read only one would silently drop half the field.
 */
const CAR = `coalesce(
  nullif(btrim(details->>'vehicle'), ''),
  nullif(btrim(details->>'org'), '')
)`

export async function loadRoster(eventId: string): Promise<RosterCar[] | null> {
  const p = db()
  if (!p) return null
  try {
    const { rows } = await p.query(
      `select id::text as id, ${CAR} as car
         from public.submissions
        where type = 'vehicle'
          and lower(status) in ('approved', 'accepted')
          and ${CAR} is not null
        order by ${CAR}`,
      [],
    )
    return rows.map((r) => ({ id: r.id, car: r.car }))
  } catch {
    return null
  }
}

/** How many are in, and how many are still with the judges. */
export async function rosterCounts(): Promise<{ accepted: number; pending: number } | null> {
  const p = db()
  if (!p) return null
  try {
    const { rows } = await p.query(
      `select
         count(*) filter (where lower(status) in ('approved','accepted'))::int as accepted,
         count(*) filter (where lower(status) = 'pending')::int                as pending
       from public.submissions
       where type = 'vehicle'`,
    )
    return { accepted: rows[0].accepted, pending: rows[0].pending }
  } catch {
    return null
  }
}
