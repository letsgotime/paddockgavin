"use client"

import { use, useCallback, useEffect, useRef, useState } from "react"
import { db } from "@/lib/crm/client"

/**
 * Targets, ported into the CRM.
 *
 * The first surface to move off the ranch domain, chosen because it exercises
 * the whole spine and has no public face to break: it reads and writes, it is
 * event scoped, and every row it touches is behind row level security.
 *
 * The one real change from the version it replaces is that the event id is no
 * longer a constant in the file. It arrives from the route, which is the whole
 * point of the rebuild: a second event is a row rather than a fork.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const DOMAINS: Array<[string, string, string, string]> = [
  ["sponsor", "Sponsors", "#F2C94C", "Brands buying a position on the day"],
  ["vendor", "Vendors", "#00D2BE", "Sellers on the field"],
  ["hospitality", "Hospitality", "#9B7FE0", "Food, drink and the hosted areas"],
  ["hard_cost", "Hard costs", "#3D8FD6", "Things we buy or hire"],
  ["facility", "Facility and services", "#7F8A99", "What makes the site work"],
  ["club", "Car clubs", "#00D2BE", "Blocks arriving together"],
  ["talent", "Talent", "#9B7FE0", "People who bring an audience"],
  ["media", "Media", "#3D8FD6", "Who covers it"],
]
const WARMTH = [["", "Not set"], ["cold", "Cold"], ["warm", "Warm"], ["introduced", "Introduced"], ["in-conversation", "In conversation"]]
const STATUS = [["considering", "Considering"], ["shortlist", "Shortlist"], ["chosen", "Chosen"], ["passed", "Passed"]]

type Category = { id: number; name: string; domain: string; need: string | null; sort: number }
type Candidate = {
  id: string; category_id: number | null; name: string; detail: string | null
  status: string; warmth: string | null; owner: string | null
  contact_name: string | null; contact_email: string | null; contact_phone: string | null
  website: string | null; sort: number; created_by: string | null; created_at: string
}
type Save = "ready" | "dirty" | "saving" | "saved" | "error"

export default function Targets({ params }: { params: Promise<{ event: string }> }) {
  const { event } = use(params)
  const [cats, setCats] = useState<Category[]>([])
  const [pros, setPros] = useState<Candidate[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [eventId, setEventId] = useState<string | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [save, setSave] = useState<Save>("ready")
  const [why, setWhy] = useState("")

  /* One promise chain per row, so two quick edits cannot land out of order,
     and zero returned rows counts as a failure, because that is exactly what
     a policy refusal looks like from the client. */
  const chain = useRef<Record<string, Promise<unknown>>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const pending = useRef<Record<string, Record<string, unknown>>>({})

  const load = useCallback(async () => {
    const c = db()
    if (!c) return
    const ev = await c.from("events").select("id").eq("slug", event).limit(1)
    const id = ev.error || !ev.data?.length ? null : (ev.data[0] as { id: string }).id
    setEventId(id)

    const [cat, cand, staff] = await Promise.all([
      c.from("categories").select("*").order("sort"),
      c.from("account_candidates").select("*").order("sort"),
      c.from("staff_allowlist").select("email,name"),
    ])
    if (!cat.error) setCats((cat.data || []) as Category[])
    if (!cand.error) {
      // The board keeps its own candidates against accounts. Those belong to
      // the board, not here, so only category backed rows are counted.
      setPros(((cand.data || []) as Candidate[]).filter((x) => x.category_id != null))
    }
    if (!staff.error) {
      const m: Record<string, string> = {}
      for (const s of (staff.data || []) as Array<{ email: string; name: string | null }>) {
        if (s.name) m[s.email.toLowerCase()] = s.name
      }
      setNames(m)
    }
  }, [event])

  useEffect(() => {
    void load()
    const t = setInterval(() => {
      if (!document.hidden && !Object.keys(pending.current).length) void load()
    }, 20000)
    return () => clearInterval(t)
  }, [load])

  function flush(id: string) {
    const patch = pending.current[id]
    if (!patch) return
    delete pending.current[id]
    setSave("saving")
    chain.current[id] = (chain.current[id] ?? Promise.resolve())
      .then(() => db()!.from("account_candidates").update(patch).eq("id", id).select("id"))
      .then((r) => {
        if (r?.error) throw new Error(r.error.message)
        if (!r?.data?.length) throw new Error("nothing came back, which is what a permission refusal looks like")
        setSave("saved")
      })
      .catch((e: Error) => { setSave("error"); setWhy(e.message) })
    return chain.current[id]
  }

  function queue(id: string, patch: Record<string, unknown>, delay = 700) {
    pending.current[id] = { ...(pending.current[id] ?? {}), ...patch }
    clearTimeout(timers.current[id])
    setSave("dirty")
    timers.current[id] = setTimeout(() => flush(id), delay)
  }

  function edit(id: string, field: keyof Candidate, value: string) {
    setPros((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
    queue(id, { [field]: value === "" && (field === "warmth") ? null : value },
      field === "status" || field === "warmth" ? 0 : 700)
  }

  const forCat = (id: number) =>
    pros.filter((p) => String(p.category_id) === String(id)).sort((a, b) => a.sort - b.sort)

  async function addCategory(domain: string) {
    const name = window.prompt("New category. What is it called?")
    if (!name?.trim() || !eventId) return
    const mx = cats.filter((c) => c.domain === domain).reduce((n, c) => Math.max(n, c.sort || 0), 0)
    const r = await db()!.from("categories")
      .insert([{ event_id: eventId, name: name.trim(), domain, sort: mx + 10 }]).select("id")
    if (r.error || !r.data?.length) { setSave("error"); setWhy(r.error?.message ?? "the insert came back empty, which is a permission refusal"); return }
    await load()
    setOpen(Number((r.data[0] as { id: number }).id))
  }

  async function addProspect() {
    if (open == null) return
    const mx = forCat(open).reduce((n, x) => Math.max(n, x.sort || 0), 0)
    const r = await db()!.from("account_candidates")
      .insert([{ category_id: open, name: "", status: "considering", sort: mx + 10 }]).select("*")
    if (r.error || !r.data?.length) { setSave("error"); setWhy(r.error?.message ?? "the insert came back empty, which is a permission refusal"); return }
    setPros((p) => [...p, r.data![0] as Candidate])
  }

  async function removeProspect(id: string) {
    const row = pros.find((p) => p.id === id)
    if (!window.confirm(`Remove ${row?.name || "this name"}?`)) return
    const r = await db()!.from("account_candidates").delete().eq("id", id).select("id")
    if (r.error) { setSave("error"); setWhy(r.error.message); return }
    setPros((p) => p.filter((x) => x.id !== id))
  }

  const withName = cats.filter((c) => forCat(c.id).length > 0).length
  const openCat = cats.find((c) => c.id === open) ?? null

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "30px 20px 90px", fontFamily: ARCHIVO }}>
      <style>{`
        .tgCats{display:grid;grid-template-columns:repeat(auto-fill,minmax(258px,1fr));gap:11px;margin-top:12px}
        .tgCat{padding:14px 16px;cursor:pointer;position:relative;overflow:hidden;border-radius:16px;
          background:rgba(17,27,40,.58);border:1px solid rgba(255,255,255,.11);
          backdrop-filter:blur(20px) saturate(1.5);-webkit-backdrop-filter:blur(20px) saturate(1.5)}
        .tgCat::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--tone);opacity:.85}
        .tgCat:hover{border-color:rgba(255,255,255,0.82)}
        .tgSheet{position:fixed;inset:0;z-index:60;display:none}
        .tgSheet.on{display:block}
        .tgSheet .sc{position:absolute;inset:0;background:rgba(4,8,13,.66);backdrop-filter:blur(3px)}
        .tgSheet .pn{position:absolute;right:0;top:0;bottom:0;width:min(620px,100%);overflow:auto;
          background:rgba(12,20,30,.95);border-left:1px solid rgba(255,255,255,.11);
          backdrop-filter:blur(26px) saturate(1.5);padding:22px 22px 40px}
        .tgRow{margin-top:11px;padding:13px 15px;border-radius:13px;background:rgba(255,255,255,.045);
          border:1px solid rgba(255,255,255,.11)}
        .tgR1{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center}
        .tgGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
        @media (max-width:560px){.tgGrid{grid-template-columns:1fr}}
        .tgIn{font:inherit;font-size:14px;color:#fff;width:100%;min-width:0;background:rgba(0,0,0,.28);
          border:1px solid rgba(255,255,255,.11);border-radius:9px;padding:8px 10px}
        .tgIn:focus{outline:none;border-color:#F2C94C}
      `}</style>

      <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#F2C94C", fontWeight: 600 }}>
        Targets
      </div>
      <h1 style={{ margin: "9px 0 0", font: `900 clamp(28px,5vw,42px)/1.02 ${ARCHIVO}`, letterSpacing: "-.032em", color: "#fff" }}>
        Who we are chasing
      </h1>
      <p style={{ margin: "11px 0 0", fontSize: 16, color: "#a9b4c2", maxWidth: "62ch" }}>
        Every category the day needs, from the title sponsor down to the porta johns, and every name
        any of us is working for it. If a category is missing, add it and everybody sees it.
      </p>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", marginTop: 20, padding: "12px 17px", borderRadius: 16, background: "rgba(17,27,40,.58)", border: "1px solid rgba(255,255,255,.11)" }}>
        {([["Categories", cats.length, "#fff"], ["With a name", withName, "#00D2BE"],
           ["Nobody yet", cats.length - withName, "#FF1A21"], ["Names in play", pros.length, "#F2C94C"]] as const).map(([l, v, c]) => (
          <span key={l} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#a9b4c2" }}>
            {l}<b style={{ display: "block", fontSize: 19, fontWeight: 900, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</b>
          </span>
        ))}
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase",
          color: save === "error" ? "#FF1A21" : save === "saved" ? "#00D2BE" : "#7f8a99" }}>
          {{ ready: "Up to date", dirty: "Unsaved", saving: "Saving", saved: "Saved", error: `Not saved: ${why}` }[save]}
        </span>
      </div>

      {DOMAINS.map(([key, label, tone, blurb]) => {
        const set = cats.filter((c) => c.domain === key).sort((a, b) => a.sort - b.sort)
        return (
          <section key={key} style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 11, flexWrap: "wrap", paddingBottom: 8, borderBottom: "2px solid rgba(255,255,255,.11)" }}>
              <h2 style={{ margin: 0, fontSize: 12.5, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 900, color: tone }}>{label}</h2>
              <em style={{ fontStyle: "normal", fontSize: 12.5, color: "#7f8a99" }}>{blurb}</em>
              <button onClick={() => addCategory(key)} style={{ marginLeft: "auto", font: `700 11.5px/1 ${ARCHIVO}`, cursor: "pointer", color: "#dbe2ea", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.11)", borderRadius: 999, padding: "6px 13px" }}>
                + Add a category
              </button>
            </div>
            {set.length ? (
              <div className="tgCats">
                {set.map((c) => {
                  const p = forCat(c.id)
                  const chosen = p.filter((x) => x.status === "chosen").length
                  return (
                    <article key={c.id} className="tgCat" style={{ ["--tone" as string]: tone, borderColor: p.length ? "rgba(0,210,190,.4)" : undefined }} onClick={() => setOpen(c.id)}>
                      <b style={{ display: "block", fontSize: 15.5, fontWeight: 900, color: "#fff", letterSpacing: "-.01em" }}>{c.name}</b>
                      {c.need ? <span style={{ display: "block", marginTop: 4, fontSize: 12.5, lineHeight: 1.45, color: "#a9b4c2" }}>{c.need}</span> : null}
                      <span style={{ display: "block", marginTop: 9, fontFamily: MONO, fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#7f8a99" }}>
                        {p.length ? <><b style={{ color: "#00D2BE" }}>{p.length}</b> in play</> : <span style={{ color: "#FF1A21" }}>nobody yet</span>}
                        {chosen ? <> &middot; <b style={{ color: "#00D2BE" }}>{chosen}</b> chosen</> : null}
                      </span>
                    </article>
                  )
                })}
              </div>
            ) : <p style={{ marginTop: 12, fontSize: 14, color: "#a9b4c2" }}>Nothing here yet.</p>}
          </section>
        )
      })}

      <div className={`tgSheet${openCat ? " on" : ""}`}>
        <div className="sc" onClick={() => setOpen(null)} />
        <div className="pn">
          <button onClick={() => setOpen(null)} aria-label="Close" style={{ position: "absolute", right: 16, top: 14, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", border: "1px solid rgba(255,255,255,.11)", background: "rgba(255,255,255,.06)", color: "#dbe2ea", font: "inherit", fontSize: 17 }}>×</button>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#F2C94C", fontWeight: 600 }}>
            {DOMAINS.find((d) => d[0] === openCat?.domain)?.[1] ?? openCat?.domain}
          </div>
          <h3 style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 900, letterSpacing: "-.02em", color: "#fff" }}>{openCat?.name}</h3>
          {openCat?.need ? <p style={{ margin: "9px 0 0", fontSize: 14, color: "#a9b4c2" }}>{openCat.need}</p> : null}

          {openCat && forCat(openCat.id).length ? forCat(openCat.id).map((x) => (
            <div key={x.id} className="tgRow">
              <div className="tgR1">
                <input className="tgIn" value={x.name} placeholder="Who are they" onChange={(e) => edit(x.id, "name", e.target.value)} />
                <select className="tgIn" value={x.status} onChange={(e) => edit(x.id, "status", e.target.value)} style={{ width: "auto" }}>
                  {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <button onClick={() => removeProspect(x.id)} aria-label="Remove" style={{ background: "none", border: 0, color: "#a9b4c2", fontSize: 17, cursor: "pointer", padding: "0 4px" }}>×</button>
              </div>
              <div className="tgGrid">
                <input className="tgIn" value={x.contact_name ?? ""} placeholder="Contact name" onChange={(e) => edit(x.id, "contact_name", e.target.value)} />
                <select className="tgIn" value={x.warmth ?? ""} onChange={(e) => edit(x.id, "warmth", e.target.value)}>
                  {WARMTH.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <input className="tgIn" value={x.contact_email ?? ""} placeholder="Email" onChange={(e) => edit(x.id, "contact_email", e.target.value)} />
                <input className="tgIn" value={x.contact_phone ?? ""} placeholder="Phone" onChange={(e) => edit(x.id, "contact_phone", e.target.value)} />
                <input className="tgIn" value={x.website ?? ""} placeholder="Website" onChange={(e) => edit(x.id, "website", e.target.value)} />
                <input className="tgIn" value={x.owner ?? ""} placeholder="Whose contact is it" onChange={(e) => edit(x.id, "owner", e.target.value)} />
              </div>
              <textarea className="tgIn" style={{ marginTop: 8, minHeight: 44 }} value={x.detail ?? ""} placeholder="What we know, and what the ask is" onChange={(e) => edit(x.id, "detail", e.target.value)} />
              {x.created_by ? (
                <div style={{ marginTop: 7, fontFamily: MONO, fontSize: 10, color: "#7f8a99" }}>
                  Added by {names[x.created_by.toLowerCase()] ?? x.created_by.split("@")[0]}
                </div>
              ) : null}
            </div>
          )) : <p style={{ marginTop: 12, fontSize: 14, color: "#a9b4c2" }}>No names against this yet. If you know somebody, put them in.</p>}

          <button onClick={addProspect} style={{ marginTop: 12, font: `700 12.5px/1 ${ARCHIVO}`, cursor: "pointer", color: "#dbe2ea", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.11)", borderRadius: 999, padding: "9px 16px" }}>
            + Add a name
          </button>
        </div>
      </div>
    </main>
  )
}
