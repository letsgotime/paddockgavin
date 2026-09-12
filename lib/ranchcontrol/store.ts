import { randomUUID } from "node:crypto"
import { ranchDb } from "@/lib/ranch/ranch-db"
import { DIALS, ROWS, DEFAULT_DIALS, usd, when } from "@/lib/ranchcontrol/data"
import type { ChangeEntry, FullState, SheetEntry, SponsorEntry } from "@/lib/ranchcontrol/data"

/**
 * Ranch control's own store: one table, one row per document path, the same
 * shape the source artifact's `store.doc(path).set(...)` used. Everyone on
 * the team writes through this; there is no per user row, only the shared
 * `ranch_control_docs` table on the ranch's own Neon project.
 */

const CHANGE_CAP = 50

interface DocRow {
  path: string
  data: Record<string, unknown>
}

function db() {
  const pool = ranchDb()
  if (!pool) throw new Error("no_database")
  return pool
}

async function upsert(path: string, data: unknown, who: string) {
  await db().query(
    `insert into ranch_control_docs (path, data, updated_by, updated_at)
     values ($1, $2::jsonb, $3, now())
     on conflict (path) do update set data = excluded.data, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    [path, JSON.stringify(data), who],
  )
}

async function appendChange(who: string, what: string) {
  const at = when()
  const ts = Date.now()
  await upsert(`changes/${randomUUID()}`, { who, at, ts, what }, who)
  /* Capped to the newest 50, matching the source artifact's limit(30) read,
     a little more generous since this is the durable copy rather than a live
     listener page. Cheap: the table never has more than a few dozen rows. */
  await db().query(
    `delete from ranch_control_docs
     where path like 'changes/%'
       and path not in (
         select path from ranch_control_docs where path like 'changes/%' order by updated_at desc limit $1
       )`,
    [CHANGE_CAP],
  )
}

export async function getFullState(): Promise<FullState> {
  const pool = db()
  const [assumeRes, sheetRes, sponsorRes, changeRes] = await Promise.all([
    pool.query<DocRow>(`select path, data from ranch_control_docs where path = 'assume/main'`),
    pool.query<DocRow>(`select path, data from ranch_control_docs where path like 'sheet/%'`),
    pool.query<DocRow>(`select path, data from ranch_control_docs where path like 'sponsors/%'`),
    pool.query<DocRow>(`select path, data from ranch_control_docs where path like 'changes/%' order by updated_at desc limit ${CHANGE_CAP}`),
  ])

  const dials: Record<string, number> = { ...DEFAULT_DIALS }
  const savedDials = assumeRes.rows[0]?.data
  if (savedDials) {
    for (const d of DIALS) {
      const v = savedDials[d.k]
      if (typeof v === "number" && Number.isFinite(v)) dials[d.k] = v
    }
  }

  const sheet: Record<string, SheetEntry> = {}
  for (const row of ROWS) {
    sheet[row.k] = { rate: row.rate ?? null, qty: typeof row.qty === "number" ? row.qty : undefined }
  }
  for (const r of sheetRes.rows) {
    const k = r.path.slice("sheet/".length)
    if (sheet[k]) sheet[k] = { ...sheet[k], ...(r.data as SheetEntry) }
  }

  const sponsors: Record<string, SponsorEntry> = {}
  for (const r of sponsorRes.rows) {
    sponsors[r.path.slice("sponsors/".length)] = r.data as SponsorEntry
  }

  const changes: ChangeEntry[] = changeRes.rows.map((r) => r.data as unknown as ChangeEntry)

  return { dials, sheet, sponsors, changes }
}

/** Every dial value lives in one document, so a single dial write rewrites the whole set. */
export async function writeDial(k: string, v: number, who: string): Promise<void> {
  const dialDef = DIALS.find((d) => d.k === k)
  if (!dialDef) throw new Error("bad_key")

  const cur = await db().query<DocRow>(`select data from ranch_control_docs where path = 'assume/main'`)
  const dials: Record<string, number> = { ...DEFAULT_DIALS }
  const saved = cur.rows[0]?.data
  if (saved) {
    for (const d of DIALS) {
      const sv = saved[d.k]
      if (typeof sv === "number" && Number.isFinite(sv)) dials[d.k] = sv
    }
  }
  const was = dials[k]
  const now = Number.isFinite(v) ? Math.max(0, v) : 0
  dials[k] = now

  await upsert("assume/main", { ...dials, updatedBy: who, updatedAt: when() }, who)
  await appendChange(who, `${dialDef.label}: ${was} to ${now}`)
}

/** A rate or a qty on one row. The other field is carried over untouched, matching the source. */
export async function writeSheetField(k: string, f: "rate" | "qty", v: number | null, who: string): Promise<void> {
  const row = ROWS.find((r) => r.k === k)
  if (!row) throw new Error("bad_key")

  const cur = await db().query<DocRow>(`select data from ranch_control_docs where path = $1`, [`sheet/${k}`])
  const saved = (cur.rows[0]?.data ?? {}) as SheetEntry
  const beforeRate = saved.rate === undefined ? row.rate : saved.rate
  const beforeQty = saved.qty === undefined ? row.qty ?? 0 : saved.qty

  const val = f === "rate" ? (v === null || !Number.isFinite(v) ? null : Number(v)) : Math.max(0, Math.round(Number(v) || 0))

  const body: SheetEntry = {
    rate: f === "rate" ? (val as number | null) : beforeRate,
    qty: f === "qty" ? (val as number) : beforeQty,
    updatedBy: who,
    updatedAt: when(),
  }
  await upsert(`sheet/${k}`, body, who)

  const a = f === "rate" ? (beforeRate === null ? "nothing" : usd(beforeRate)) : beforeQty
  const b = f === "rate" ? (val === null ? "nothing" : usd(val as number)) : val
  await appendChange(who, `${row.n}: ${f} ${a} to ${b}`)
}

const SPONSOR_FIELDS = ["company", "contact", "method", "owner", "degree", "note"] as const

/** A sponsor slot is a full replace, the same as the source's save button: every field on the card, every save. */
export async function writeSponsor(id: string, body: Record<string, unknown>, who: string): Promise<void> {
  if (!/^[a-z-]+-[123]$/.test(id)) throw new Error("bad_key")

  const clean: SponsorEntry = {}
  for (const f of SPONSOR_FIELDS) {
    const raw = body?.[f]
    clean[f] = typeof raw === "string" ? raw.trim().slice(0, 400) : ""
  }
  const full: SponsorEntry = { ...clean, updatedBy: who, updatedAt: when() }
  await upsert(`sponsors/${id}`, full, who)

  const label = id.replace(/-(\d)$/, ", slot $1")
  const what = `${label}: ${clean.company || "cleared"}${clean.owner ? " taken by " + clean.owner : ""}${clean.degree ? " (" + clean.degree + " degree)" : ""}`
  await appendChange(who, what)
}
