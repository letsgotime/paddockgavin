#!/usr/bin/env node
/**
 * Walks every public path and every form on pistonpoweredranch.com and says
 * what answered. Run it before a promote and after one. Nothing it sends is
 * recorded: every form post fills the honeypot, which the routes answer with
 * a polite ok and no row, no email.
 *
 *   node scripts/smoke.mjs            the live site
 *   node scripts/smoke.mjs https://…  a preview
 */
const BASE = (process.argv[2] || "https://pistonpoweredranch.com").replace(/\/$/, "")
const PAGES = [
  ["/", 200], ["/entry", 200], ["/vendor", 200], ["/sponsor", 200], ["/store", 200], ["/entries", 200],
  ["/vendor/booth", 200], ["/clubs", 200], ["/map", 200], ["/rsvp", 308], ["/status", 200],
  ["/sitemap.xml", 200], ["/robots.txt", 200], ["/llms.txt", 200], ["/brand/rj-icon-32.png", 200],
  ["/no-such-gate", 404],
]
const FORMS = [
  ["/api/rsvp", { name: "Smoke", email: "smoke@example.com", party: 1, fax: "honeypot" }, 200],
  ["/api/apply", { kind: "entry", name: "Smoke", reach: "smoke@example.com", org: "Smoke car", fax: "honeypot" }, 200],
  ["/api/stripe/checkout", { item: "not-a-thing", eventSlug: "pistonpoweredranch" }, 400],
  ["/api/stripe/webhook", {}, 400],
  ["/api/upload-session", {}, 403],
]
let bad = 0
const line = (ok, what, detail) => { if (!ok) bad++; console.log(`${ok ? "ok " : "BAD"} ${what.padEnd(34)} ${detail}`) }
for (const [path, want] of PAGES) {
  const t = Date.now()
  const r = await fetch(BASE + path, { redirect: "manual", headers: { "User-Agent": "ranch-smoke" } })
  line(r.status === want, `GET ${path}`, `${r.status} in ${Date.now() - t} ms${r.status === want ? "" : ` (wanted ${want})`}`)
}
for (const [path, body, want] of FORMS) {
  const r = await fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "ranch-smoke" }, body: JSON.stringify(body) })
  line(r.status === want, `POST ${path}`, `${r.status}${r.status === want ? "" : ` (wanted ${want})`}`)
}
const h = await fetch(BASE + "/", { headers: { "User-Agent": "ranch-smoke" } })
for (const k of ["strict-transport-security", "x-content-type-options", "x-frame-options", "content-security-policy-report-only"]) line(h.headers.has(k), `header ${k}`, h.headers.has(k) ? "present" : "missing")
console.log(bad ? `\n${bad} problem(s)` : "\nAll clear")
process.exit(bad ? 1 : 0)
