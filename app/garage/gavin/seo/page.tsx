"use client"

import { useState, useCallback } from "react"

const arch = "Archivo, Helvetica, sans-serif"
const mono = "ui-monospace, 'Courier New', Courier, monospace"

const NAVY   = "#0A0E1A"
const PANEL  = "#0E1A2A"
const CARD   = "#111D2E"
const BORDER = "rgba(255,255,255,.08)"
const YELLOW = "#F8B800"
const TEAL   = "#00D2BE"
const BLUE   = "#005185"
const STEEL  = "#848482"
const WHITE  = "#EDF1F6"
const MUTED  = "#8B93A7"
const RED    = "#FF1A21"
const GREEN  = "#22C55E"
const ORANGE = "#F97316"

function scoreColor(n: number) {
  if (n >= 90) return GREEN
  if (n >= 50) return ORANGE
  return RED
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 28, stroke = 5
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={70} height={70} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={35} cy={35} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
        <circle cx={35} cy={35} r={r} fill="none" stroke={scoreColor(score)} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .6s ease" }} />
        <text x={35} y={35} textAnchor="middle" dominantBaseline="central"
          style={{ transform: "rotate(90deg)", transformOrigin: "35px 35px", fontFamily: arch, fontWeight: 900, fontSize: 15, fill: scoreColor(score) }}>
          {score}
        </text>
      </svg>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: MUTED }}>{label}</span>
    </div>
  )
}

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", background: color + "22", color, fontFamily: mono, fontSize: 11, letterSpacing: ".06em" }}>
      {children}
    </span>
  )
}

function StatCard({ label, value, sub, color = WHITE }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: MUTED }}>{label}</span>
      <span style={{ fontFamily: arch, fontWeight: 900, fontSize: 28, lineHeight: 1, color }}>{value}</span>
      {sub && <span style={{ fontFamily: mono, fontSize: 11, color: MUTED }}>{sub}</span>}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractLighthouse(vitals: any) {
  const task = vitals?.tasks?.[0]
  const cats = task?.result?.[0]?.lighthouse?.categories
  if (!cats) return null
  return {
    performance:    Math.round((cats.performance?.score    ?? 0) * 100),
    seo:            Math.round((cats.seo?.score            ?? 0) * 100),
    accessibility:  Math.round((cats.accessibility?.score  ?? 0) * 100),
    bestPractices:  Math.round((cats["best-practices"]?.score ?? 0) * 100),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractOnPage(onPage: any) {
  const task = onPage?.tasks?.[0]
  const r = task?.result?.[0]
  if (!r) return null
  return {
    pagesTotal:      r.page_metrics?.pages_count ?? 0,
    brokenLinks:     r.page_metrics?.broken_links ?? 0,
    missingTitle:    r.page_metrics?.pages_without_title ?? 0,
    missingDesc:     r.page_metrics?.pages_without_description ?? 0,
    missingH1:       r.page_metrics?.pages_without_h1 ?? 0,
    crawlability:    r.crawl_status?.description ?? "not set",
    onPageScore:     Math.round(r.on_page_score ?? 0),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBacklinks(backlinks: any) {
  const r = backlinks?.tasks?.[0]?.result?.[0]
  if (!r) return null
  return {
    total:       r.backlinks ?? 0,
    referring:   r.referring_domains ?? 0,
    dofollow:    r.dofollow_backlinks ?? 0,
    rank:        r.rank ?? "not set",
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRankings(rankings: any, keywords: string[]) {
  if (!rankings?.tasks) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rankings.tasks.map((task: any, i: number) => {
    const items = task?.result?.[0]?.items ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hit = items.find((item: any) =>
      item.type === "organic" &&
      (item.url?.includes("paddockgavin.com") || item.domain?.includes("paddockgavin.com"))
    )
    return {
      keyword: keywords[i] ?? task?.data?.keyword ?? `Keyword ${i + 1}`,
      position: hit?.rank_absolute ?? null,
      url: hit?.url ?? null,
      totalResults: task?.result?.[0]?.se_results_count ?? 0,
    }
  })
}

export default function SeoDashboard() {
  const [data, setData]       = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [ran, setRan]         = useState(false)

  const runAudit = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/seo-audit")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setRan(true)
    } catch (e: unknown) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any
  const lh        = d ? extractLighthouse(d.vitals)   : null
  const op        = d ? extractOnPage(d.onPage)       : null
  const bl        = d ? extractBacklinks(d.backlinks) : null
  const rankings  = d ? extractRankings(d.rankings, d.keywords ?? []) : []
  const fetchedAt = d?.fetchedAt ? new Date(d.fetchedAt).toLocaleString("en-US", { timeZone: "America/Chicago" }) : null

  return (
    <main style={{ background: NAVY, minHeight: "100vh", fontFamily: arch }}>

      {/* Header */}
      <div style={{ background: PANEL, borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: MUTED }}>SEO Command</span>
        <span style={{ fontFamily: mono, fontSize: 10, color: BLUE }}>paddockgavin.com</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {fetchedAt && <span style={{ fontFamily: mono, fontSize: 10, color: MUTED }}>Last run {fetchedAt} CT</span>}
          <button
            onClick={runAudit}
            disabled={loading}
            style={{
              padding: "10px 24px", fontFamily: arch, fontWeight: 700, fontSize: 13, letterSpacing: ".06em",
              background: loading ? STEEL : YELLOW, color: NAVY, border: "none", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? .7 : 1, transition: "all .2s",
            }}
          >
            {loading ? "Running audit..." : ran ? "Re-run Audit" : "Run Audit"}
          </button>
        </div>
      </div>

      <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Error */}
        {error && (
          <div style={{ background: "#300", border: "1px solid #600", padding: "16px 20px", color: RED, fontFamily: mono, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!ran && !loading && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "64px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: MUTED }}>DataForSEO · Live Audit</div>
            <p style={{ margin: 0, fontFamily: arch, fontWeight: 900, fontSize: 32, color: WHITE, maxWidth: "16ch", lineHeight: 1.05 }}>
              Full site audit on demand
            </p>
            <p style={{ margin: 0, fontFamily: arch, fontSize: 16, color: MUTED, maxWidth: "40ch", lineHeight: 1.6 }}>
              Hits DataForSEO directly: on-page scores, keyword rankings, backlinks, and Lighthouse Core Web Vitals for paddockgavin.com.
            </p>
            <button
              onClick={runAudit}
              style={{ marginTop: 8, padding: "14px 40px", fontFamily: arch, fontWeight: 900, fontSize: 15, letterSpacing: ".06em", background: YELLOW, color: NAVY, border: "none", cursor: "pointer" }}
            >
              Run Audit
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "48px 32px", textAlign: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: ".2em", color: TEAL }}>Pulling data from DataForSEO...</span>
          </div>
        )}

        {/* Results */}
        {ran && !loading && d && (
          <>
            {/* Lighthouse scores */}
            {lh && (
              <section>
                <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Lighthouse · Core Web Vitals</div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "28px 32px", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
                  <ScoreRing score={lh.performance}   label="Performance" />
                  <ScoreRing score={lh.seo}           label="SEO" />
                  <ScoreRing score={lh.accessibility} label="Accessibility" />
                  <ScoreRing score={lh.bestPractices} label="Best Practices" />
                </div>
              </section>
            )}

            {/* On-page summary */}
            {op && (
              <section>
                <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>On-Page Audit</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 1, background: BORDER }}>
                  <StatCard label="On-Page Score"    value={op.onPageScore}    color={scoreColor(op.onPageScore)} sub="out of 100" />
                  <StatCard label="Pages Crawled"    value={op.pagesTotal} />
                  <StatCard label="Broken Links"     value={op.brokenLinks}    color={op.brokenLinks   > 0 ? RED : GREEN} />
                  <StatCard label="Missing Title"    value={op.missingTitle}   color={op.missingTitle  > 0 ? RED : GREEN} />
                  <StatCard label="Missing Desc"     value={op.missingDesc}    color={op.missingDesc   > 0 ? ORANGE : GREEN} />
                  <StatCard label="Missing H1"       value={op.missingH1}      color={op.missingH1     > 0 ? RED : GREEN} />
                </div>
              </section>
            )}

            {/* Backlinks */}
            {bl && (
              <section>
                <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Backlinks</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 1, background: BORDER }}>
                  <StatCard label="Total Backlinks"     value={bl.total.toLocaleString()} />
                  <StatCard label="Referring Domains"   value={bl.referring.toLocaleString()} />
                  <StatCard label="Dofollow"            value={bl.dofollow.toLocaleString()} color={TEAL} />
                  <StatCard label="Domain Rank"         value={bl.rank} color={YELLOW} />
                </div>
              </section>
            )}

            {/* Keyword rankings */}
            {rankings.length > 0 && (
              <section>
                <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Keyword Rankings · United States</div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Keyword", "Position", "URL", "Results"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily: mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: MUTED }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.map((r: { keyword: string; position: number | null; url: string | null; totalResults: number }, i: number) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
                          <td style={{ padding: "14px 20px", fontFamily: arch, fontSize: 14, color: WHITE }}>{r.keyword}</td>
                          <td style={{ padding: "14px 20px" }}>
                            {r.position
                              ? <Pill color={r.position <= 10 ? GREEN : r.position <= 30 ? ORANGE : RED}>#{r.position}</Pill>
                              : <Pill color={STEEL}>Not ranked</Pill>}
                          </td>
                          <td style={{ padding: "14px 20px", fontFamily: mono, fontSize: 11, color: TEAL, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.url ? r.url.replace("https://", "") : "not set"}
                          </td>
                          <td style={{ padding: "14px 20px", fontFamily: mono, fontSize: 12, color: MUTED }}>
                            {r.totalResults ? r.totalResults.toLocaleString() : "not set"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Raw JSON toggle */}
            <details style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <summary style={{ padding: "14px 20px", fontFamily: mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: MUTED, cursor: "pointer" }}>
                Raw API Response
              </summary>
              <pre style={{ margin: 0, padding: "0 20px 20px", fontFamily: mono, fontSize: 11, color: MUTED, overflowX: "auto", maxHeight: 400, overflowY: "auto" }}>
                {JSON.stringify(d, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </main>
  )
}
