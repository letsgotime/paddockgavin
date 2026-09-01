"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"
import { useCrm } from "@/lib/crm/useCrm"
import { signIn, signOut, magicLink, requestReset, signInWithGoogle } from "@/lib/crm/client"
import { PADDOCKGAVIN } from "@/lib/crm/brand"
import { RAIL, tool, toolHref, type Tool } from "@/lib/tools"

/**
 * The frame every CRM surface sits in.
 *
 * One job: work out who you are and which event this route is about, then
 * either show the surface or the sign in. Twelve tools used to each answer
 * those questions for themselves, three round trips apiece, and they drifted.
 * Now it happens once per navigation and the surface receives the answer.
 *
 * The rail is the same shape as the one on the ranch tools, deliberately, so
 * moving between the old surfaces and the ported ones does not feel like two
 * different products while the port is half done.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export default function CrmShell({ slug, children }: { slug: string; children: ReactNode }) {
  const crm = useCrm(slug)
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [linkBusy, setLinkBusy] = useState(false)
  const [linkSaid, setLinkSaid] = useState("")
  const [resetBusy, setResetBusy] = useState(false)
  const [resetSaid, setResetSaid] = useState("")
  const [googleBusy, setGoogleBusy] = useState(false)
  const [googleSaid, setGoogleSaid] = useState("")

  /* The CRM is our product, so the chrome is Paddock Amber whichever event is
     loaded. The event's own colour appears once, as a dot on the rail, so you
     can tell at a glance which world you are working in without the tool
     repainting itself into somebody else's brand. */
  const accent = PADDOCKGAVIN.accent
  const eventDot = crm.event?.accent || PADDOCKGAVIN.second!

  if (crm.unknownEvent) {
    return (
      <Frame>
        <h1 style={h1}>No such event</h1>
        <p style={lede}>
          Nothing in the CRM answers to <code style={code}>{slug}</code>. Check the address, or
          pick one from <Link href="/events" style={{ color: accent }}>the events list</Link>.
        </p>
      </Frame>
    )
  }

  if (crm.staff === null) {
    return (
      <Frame>
        <p style={{ ...lede, fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase" }}>
          Checking
        </p>
      </Frame>
    )
  }

  if (!crm.staff) {
    return (
      <Frame>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: accent }}>
          {crm.event?.name ?? "The events CRM"}
        </div>
        <h1 style={h1}>Staff sign in</h1>
        <p style={lede}>
          This is the working side of the event. Use the address the invitation went to. There is no
          password to remember: put it in the box and press the button, and a link arrives that signs
          you in.
        </p>
        <div style={{ display: "grid", gap: 11, maxWidth: 380, marginTop: 22 }}>
          <button
            type="button"
            disabled={googleBusy}
            onClick={async () => {
              setGoogleBusy(true)
              setGoogleSaid("")
              const problem = await signInWithGoogle(window.location.href)
              if (problem) {
                setGoogleBusy(false)
                setGoogleSaid(problem)
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              font: `700 15px/1 ${ARCHIVO}`,
              color: "#14181D",
              background: "#FFFFFF",
              border: "1px solid #DADCE0",
              borderRadius: 10,
              padding: "13px 18px",
              cursor: "pointer",
              opacity: googleBusy ? 0.6 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 010-3.44V4.95H.96a9 9 0 000 8.1l3.01-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
            </svg>
            {googleBusy ? "Taking you to Google" : "Continue with Google"}
          </button>
          {googleSaid ? <p style={{ ...lede, color: "#FF1A21", fontSize: 14, margin: 0 }}>{googleSaid}</p> : null}

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "6px 0" }}>
            <i style={{ flex: 1, height: 1, background: "rgba(255,255,255,.14)" }} />
            <span style={{ font: `500 12px/1 ${MONO}`, letterSpacing: ".14em", textTransform: "uppercase", color: "#8892A0" }}>or</span>
            <i style={{ flex: 1, height: 1, background: "rgba(255,255,255,.14)" }} />
          </div>

          <label style={lbl} htmlFor="crmEmail">Email</label>
          <input id="crmEmail" type="email" autoComplete="email" required value={email}
                 onChange={(e) => setEmail(e.target.value)} style={input} />
          <button
            type="button"
            disabled={linkBusy}
            onClick={async () => {
              const to = email.trim()
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
                setLinkSaid("Put your email in the box first.")
                return
              }
              setLinkBusy(true)
              setLinkSaid("")
              const problem = await magicLink(to, window.location.href)
              setLinkBusy(false)
              setLinkSaid(problem ?? "Check your email. The link signs you straight in, and it works once.")
            }}
            style={{ ...primary, background: accent, opacity: linkBusy ? 0.6 : 1 }}
          >
            {linkBusy ? "Sending" : "Email me a sign in link"}
          </button>
          {linkSaid ? <p style={{ ...lede, fontSize: 14, margin: 0 }}>{linkSaid}</p> : null}
        </div>

        <p style={{ ...lede, fontSize: 14, marginTop: 26, marginBottom: 0, opacity: 0.8 }}>
          Or use a password, if you set one.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            setErr("")
            const problem = await signIn(email.trim(), pass)
            setBusy(false)
            if (problem) setErr(problem)
            else void crm.refresh()
          }}
          style={{ display: "grid", gap: 11, maxWidth: 380, marginTop: 10 }}
        >
          <label style={lbl} htmlFor="crmPass">Password</label>
          <input id="crmPass" type="password" autoComplete="current-password" required value={pass}
                 onChange={(e) => setPass(e.target.value)} style={input} />
          <button type="submit" disabled={busy} style={{ ...primary, background: accent, opacity: busy ? 0.6 : 1 }}>
            {busy ? "Signing in" : "Sign in"}
          </button>
          {err ? <p style={{ ...lede, color: "#FF1A21", fontSize: 14, margin: 0 }}>{err}</p> : null}
          <button
            type="button"
            disabled={resetBusy}
            onClick={async () => {
              const to = email.trim()
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
                setResetSaid("Put your email in the box at the top first.")
                return
              }
              setResetBusy(true)
              setResetSaid("")
              const problem = await requestReset(to, window.location.href)
              setResetBusy(false)
              setResetSaid(problem ?? "If that address has a password, a reset is on its way to it.")
            }}
            style={{
              background: "none",
              border: 0,
              padding: 0,
              justifySelf: "start",
              font: `500 14px/1.5 ${ARCHIVO}`,
              color: accent,
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
              opacity: resetBusy ? 0.6 : 1,
            }}
          >
            {resetBusy ? "Sending" : "Forgotten it? Send a reset link"}
          </button>
          {resetSaid ? <p style={{ ...lede, fontSize: 14, margin: 0 }}>{resetSaid}</p> : null}
        </form>
      </Frame>
    )
  }

  /* One list, in lib/tools.ts. A surface moves into the CRM by changing its
     `where` there, and this rail follows without being edited. */
  const visible = RAIL.map(tool)
    .filter((t): t is Tool => Boolean(t))
    .filter((t) => !t.money || crm.money)
  const initials = (crm.profile?.full_name || crm.me || "?")
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()

  return (
    <div style={{ minHeight: "100vh", background: "#070d14", color: "#dbe2ea", fontFamily: ARCHIVO }}>
      <style>{`
        .crmRail{position:fixed;left:0;top:0;bottom:0;z-index:40;width:60px;overflow:hidden;
          display:flex;flex-direction:column;background:rgba(11,18,27,.82);
          border-right:1px solid rgba(255,255,255,.11);backdrop-filter:blur(22px) saturate(1.5);
          -webkit-backdrop-filter:blur(22px) saturate(1.5);transition:width .2s cubic-bezier(.16,.84,.32,1)}
        .crmRail:hover,.crmRail:focus-within{width:212px}
        .crmRail .lbl{opacity:0;transition:opacity .16s;white-space:nowrap}
        .crmRail:hover .lbl,.crmRail:focus-within .lbl{opacity:1}
        .crmBody{padding-left:60px}
        .crmScrim{display:none}
        @media (max-width:900px){
          .crmRail{width:264px;transform:translateX(-101%);transition:transform .24s cubic-bezier(.16,.84,.32,1);
            box-shadow:0 0 40px rgba(0,0,0,.6)}
          .crmRail.open{transform:none}
          .crmRail .lbl{opacity:1}
          .crmBody{padding-left:0;padding-top:52px}
          .crmPill{display:flex!important}
          .crmScrim.on{display:block;position:fixed;inset:0;z-index:39;background:rgba(4,8,13,.55)}
        }
        @media (prefers-reduced-motion:reduce){.crmRail{transition:none}}
      `}</style>

      <button className="crmPill" onClick={() => setOpen((v) => !v)} aria-label="Open navigation"
        style={{ display: "none", position: "fixed", left: 12, top: 10, zIndex: 41, height: 36,
          alignItems: "center", padding: "0 14px", borderRadius: 999, cursor: "pointer", color: "#fff",
          border: "1px solid rgba(255,255,255,.19)", background: "rgba(11,18,27,.86)",
          font: `700 12.5px/1 ${ARCHIVO}` }}>
        {crm.event?.name ?? "CRM"}
      </button>
      <div className={`crmScrim${open ? " on" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`crmRail${open ? " open" : ""}`} aria-label="Event navigation">
        <div style={{ padding: "13px 0 11px 17px", borderBottom: "1px solid rgba(255,255,255,.09)" }}>
          <div className="lbl" style={{ font: `900 12.5px/1.25 ${ARCHIVO}`, color: "#fff",
            letterSpacing: "-.01em", display: "flex", alignItems: "center", gap: 7 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%",
              background: eventDot, flex: "0 0 auto" }} />
            {crm.event?.name}
          </div>
          <div className="lbl" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#7f8a99", marginTop: 4 }}>
            {crm.event?.status === "active" ? "In planning" : crm.event?.status ?? ""}
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {visible.map((s) => {
            const href = toolHref(s, slug)
            const away = s.where !== "crm"
            const here = !away && (path === href || path?.startsWith(href + "/"))
            const body = (
              <>
                {here ? <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3,
                  borderRadius: "0 3px 3px 0", background: accent }} /> : null}
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                     style={{ flex: "0 0 auto" }}>
                  <path d={s.icon} />
                </svg>
                <span className="lbl" style={{ font: `600 13px/1 ${ARCHIVO}` }}>{s.label}</span>
                {away ? (
                  <span className="lbl" aria-hidden="true"
                        style={{ font: `400 12px/1 ${MONO}`, color: "#6c7a8a", marginLeft: "auto", paddingRight: 14 }}>
                    &#8599;
                  </span>
                ) : null}
              </>
            )
            const style = {
              display: "flex", alignItems: "center", gap: 13, height: 42, paddingLeft: 18,
              textDecoration: "none", position: "relative" as const, whiteSpace: "nowrap" as const,
              color: here ? "#fff" : "#a9b4c2",
              background: here ? "rgba(248,184,0,.1)" : "transparent",
            }
            /* Not ported yet: a plain link off to the tools deployment, marked
               with an arrow so the hop is visible before it happens. */
            return away ? (
              <a key={s.key} href={href} title={`${s.label} (on the tools site)`}
                 onClick={() => setOpen(false)} style={style}>
                {body}
              </a>
            ) : (
              <Link key={s.key} href={href} title={s.label} onClick={() => setOpen(false)} style={style}>
                {body}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: "11px 0 14px 17px", borderTop: "1px solid rgba(255,255,255,.09)",
          display: "flex", alignItems: "center", gap: 11, whiteSpace: "nowrap" }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#00d2be",
            color: "#04211d", font: `900 10px/26px ${ARCHIVO}`, textAlign: "center", flex: "0 0 auto" }}>
            {initials}
          </span>
          <button className="lbl" onClick={() => { void signOut().then(() => crm.refresh()) }}
            style={{ font: `600 11.5px/1 ${ARCHIVO}`, color: "#7f8a99", background: "none",
              border: 0, cursor: "pointer", padding: 0, textAlign: "left" }}>
            {crm.profile?.full_name || crm.me}
            <br />
            <span style={{ fontSize: 10.5, color: "#5f6a77" }}>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="crmBody">{children}</div>
    </div>
  )
}

/* ---------- the signed out / error frame ---------- */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#070d14", color: "#dbe2ea", fontFamily: ARCHIVO,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>{children}</div>
    </div>
  )
}

const h1: React.CSSProperties = {
  margin: "10px 0 0", font: `900 clamp(30px,6vw,44px)/1.02 ${ARCHIVO}`,
  letterSpacing: "-.032em", color: "#fff",
}
const lede: React.CSSProperties = { margin: "12px 0 0", fontSize: 16, color: "#a9b4c2", maxWidth: "58ch" }
const lbl: React.CSSProperties = {
  fontFamily: MONO, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase",
  color: "#7f8a99", fontWeight: 600, marginBottom: -6,
}
const input: React.CSSProperties = {
  font: `400 15px/1.4 ${ARCHIVO}`, color: "#fff", background: "rgba(0,0,0,.3)",
  border: "1px solid rgba(255,255,255,.13)", borderRadius: 10, padding: "11px 13px",
}
const primary: React.CSSProperties = {
  font: `900 15px/1 ${ARCHIVO}`, color: "#04211d", border: 0, borderRadius: 12,
  padding: "13px 22px", cursor: "pointer", marginTop: 4,
}
const code: React.CSSProperties = {
  fontFamily: MONO, fontSize: 14, background: "rgba(255,255,255,.08)",
  padding: "2px 6px", borderRadius: 4,
}
