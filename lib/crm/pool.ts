import { Pool } from "pg"

/**
 * The CRM database, from the server.
 *
 * This deployment's DATABASE_URL points at the newsletter project. The event,
 * the submissions, the accounts and the payments live in the CRM project, and
 * CRM_DATABASE_URL is the role that may read and write them. That role is
 * deliberately narrow: it can update a submission's status and details, record
 * a payment, and read the public views. It cannot create accounts, which stay
 * with HQ, where a person decides who goes on the vendor row.
 */
let pool: Pool | null = null

export function crm(): Pool | null {
  const url = process.env.CRM_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: url, max: 3 })
  return pool
}
