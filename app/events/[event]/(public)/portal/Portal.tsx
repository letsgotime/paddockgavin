"use client"

import { useCallback, useEffect, useState } from "react"
import { ranchDb, NEEDS_VERIFICATION, type RanchDb } from "./RanchDb"
import { statusCopy } from "@/lib/events/entry-status"

/**
 * The portal, in four states: working, signed out, unverified, and yours.
 *
 * Nothing here decides what you may see. The three functions it calls are
 * SECURITY DEFINER and scope every row to the caller in Postgres, so this
 * file is a view onto whatever the database is willing to hand over, and a
 * tampered client gets nothing extra for its trouble.
 */

const INK = "#0A1523"
const PAPER = "#EDF1F6"
const MUTED = "#9FAAB8"
const LINE = "rgba(255,255,255,.14)"
const GLASS = "rgba(18,32,50,.72)"
const RED_FILL = "#E5141A"
const RED_TEXT = "#FF1A21"
const DISPLAY = "Cinzel, Georgia, serif"
const BODY = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const TONE: Record<string, string> = { wait: "#F2C94C", yes: "#00D2BE", hold: "#6E8FE8", no: RED_TEXT }

interface Entry { id: number; kind: string; subject: string | null; status: string; submitted_at: string; status_token: string | null }
interface Account { id: string; kind: string; company: string; status: string; stage: string }
interface Rsvp { id: string; event_slug: string; event_name: string; party_size: number; subscribed: boolean; rsvped_at: string }
type Claim = { state: string; email?: string; entries: number; accounts: number; rsvps: number }

export default function Portal({ eventSlug, eventName }: { eventSlug: string; eventName: string }) {
  const [db, setDb] = useState<RanchDb | null>(null)
  const [claim, setClaim] = useState<Claim | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [busy, setBusy] = useState(true)
  const [note, setNote] = useState<string | null>(null)

  const load = useCallback(async (client: RanchDb) => {
    setBusy(true)
    try {
      /* A link out of one of our emails carries the entry's own token, and
         holding it is proof of reaching that inbox. That is the path that
         works today: Neon Auth is not verifying addresses yet, so the email
         match inside claim_mine cannot fire for anybody. Redeemed first, so
         the lists below already include whatever it attached. */
      const token = new URLSearchParams(location.search).get("t")
      if (token) {
        await client.rpc("claim_submission", { p_token: token })
        history.replaceState(null, "", location.pathname)
      }
      const c = (await client.rpc("claim_mine")) as Claim
      setClaim(c)
      if (c?.state === "ok") {
        const [e, a, r] = await Promise.all([
          client.rpc("my_entries"),
          client.rpc("my_accounts"),
          client.rpc("my_rsvps"),
        ])
        setEntries((e as Entry[]) || [])
        setAccounts((a as Account[]) || [])
        setRsvps((r as Rsvp[]) || [])
      } else {
        setEntries([])
        setAccounts([])
        setRsvps([])
      }
    } catch {
      setNote("We could not reach your account just now. Try again in a moment.")
    } finally {
      setBusy(false)
    }
  }, [])

  const [dead, setDead] = useState(false)

  const boot = useCallback(() => {
    setDead(false)
    setBusy(true)
    let alive = true
    ranchDb()
      .then((client) => {
        if (!alive) return
        setDb(client)
        return load(client)
      })
      .catch(() => {
        if (!alive) return
        setBusy(false)
        setDead(true)
      })
    return () => { alive = false }
  }, [load])

  useEffect(() => boot(), [boot])

  if (busy && !claim && !dead) return <Frame><P>One moment.</P></Frame>

  /* The sign in client is fetched over the network, so it can fail to arrive.
     Say so and offer the way back, rather than sitting on "one moment" or
     showing an empty sign in form that cannot possibly work. */
  if (dead) {
    return (
      <Frame>
        <Head kicker="Not loading" title="We cannot reach sign in" />
        <P>
          This needs one file from our server and it did not arrive. It is usually a connection,
          and it is usually gone by the second try.
        </P>
        <Row>
          <Button onClick={boot}>Try again</Button>
          <Button href={`/events/${eventSlug}`} ghost>The event</Button>
        </Row>
      </Frame>
    )
  }

  if (!claim || claim.state === "signed-out") {
    return <Frame><SignIn db={db} onDone={() => db && load(db)} /></Frame>
  }

  if (claim.state === "unverified") {
    return (
      <Frame>
        <Head kicker="Almost there" title="Confirm your email" />
        <P>
          We sent a note to <strong style={{ color: PAPER }}>{claim.email}</strong>. Open it and your entry
          will be waiting here. Until an address is confirmed we cannot show what belongs to it, because
          otherwise anyone could type it in.
        </P>
        <Button onClick={() => db && load(db)}>I have confirmed it</Button>
      </Frame>
    )
  }

  const nothing = entries.length === 0 && accounts.length === 0 && rsvps.length === 0

  return (
    <Frame>
      <Head kicker="Your account" title={nothing ? "Nothing here yet" : "Where you stand"} />
      {note && <P>{note}</P>}

      {nothing && (
        <>
          <P>
            Nothing is attached to <strong style={{ color: PAPER }}>{claim.email}</strong> yet. If you told us
            you are coming, entered a car, or asked about a space, use the same address you used then and
            it will appear here.
          </P>
          <Paste onToken={async (tok) => {
            if (!db) return
            await db.rpc("claim_submission", { p_token: tok })
            await load(db)
          }} />
          <Row>
            <Button href={`/events/${eventSlug}/entry`}>Enter a car</Button>
            <Button href={`/events/${eventSlug}/vendor`} ghost>Vendor row</Button>
            <Button href={`/events/${eventSlug}/sponsor`} ghost>Sponsor the day</Button>
            <Button href={`/events/${eventSlug}/store`} ghost>The store</Button>
          </Row>
        </>
      )}

      {rsvps.length > 0 && (
        <Section title={rsvps.length === 1 ? "You are coming" : "You are coming to"}>
          {rsvps.map((r) => (
            <RsvpCard key={r.id} rsvp={r} db={db} onSaved={() => db && load(db)} />
          ))}
        </Section>
      )}

      {entries.length > 0 && (
        <Section title={entries.length === 1 ? "Your car" : "Your cars"}>
          {entries.map((e) => {
            const s = statusCopy(e.status)
            return (
              <Card key={e.id} accent={TONE[s.tone]}>
                <Label>{e.subject || "Your entry"}</Label>
                <Strong>{s.head}</Strong>
                <P small>{s.line}</P>
                {e.status_token && (
                  <a href={`/events/${eventSlug}/entry-status?t=${e.status_token}`} rel="noreferrer"
                     style={{ color: RED_TEXT, font: `700 14px/1.4 ${BODY}`, textDecoration: "none" }}>
                    Keep this link
                  </a>
                )}
              </Card>
            )
          })}
        </Section>
      )}

      {accounts.length > 0 && (
        <Section title={accounts.length === 1 ? "Your space" : "Your spaces"}>
          {accounts.map((a) => (
            <Card key={a.id} accent={a.stage === "committed" ? "#00D2BE" : "#F2C94C"}>
              <Label>{a.kind === "sponsor" ? "Sponsor" : "Vendor row"}</Label>
              <Strong>{a.company}</Strong>
              <P small>
                {a.stage === "committed"
                  ? "Confirmed for the tenth of October. We will write with the load in times nearer the day."
                  : "In conversation. Nothing is settled yet, and we will come back to you either way."}
              </P>
            </Card>
          ))}
        </Section>
      )}

      <div style={{ marginTop: 30 }}>
        <Row>
          <Button href={`/events/${eventSlug}/store`} ghost>The store</Button>
        </Row>
      </div>

      <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${LINE}` }}>
        <button onClick={async () => { await db?.signOut(); location.reload() }}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
                   color: MUTED, font: `600 14px/1.4 ${BODY}` }}>
          Sign out
        </button>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------ pieces */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      background: INK, minHeight: "100dvh", display: "flex", justifyContent: "center",
      padding: "max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))",
      fontFamily: BODY,
    }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Archivo:wght@400;600;700&display=swap" />
      <div style={{
        width: "100%", maxWidth: 620, alignSelf: "flex-start", background: GLASS,
        border: `1px solid ${LINE}`, borderRadius: 16, padding: "clamp(20px,5vw,34px)",
        boxShadow: "0 22px 60px rgba(4,9,16,.55)",
      }}>
        {children}
      </div>
    </main>
  )
}

function Head({ kicker, title }: { kicker: string; title: string }) {
  return (
    <>
      <div style={{ height: 3, width: 48, background: RED_FILL, borderRadius: 2 }} />
      <p style={{ margin: "18px 0 6px", font: `700 11px/1 ${MONO}`, letterSpacing: ".2em",
                  textTransform: "uppercase", color: RED_TEXT }}>{kicker}</p>
      <h1 style={{ margin: "0 0 16px", fontFamily: DISPLAY, fontWeight: 700, color: PAPER,
                   fontSize: "clamp(28px,6.4vw,40px)", lineHeight: 1.08 }}>{title}</h1>
    </>
  )
}

function P({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return <p style={{ margin: "0 0 14px", color: MUTED, fontSize: small ? 15 : 16.5, lineHeight: 1.6 }}>{children}</p>
}

function Strong({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 6px", color: PAPER, font: `700 19px/1.3 ${BODY}` }}>{children}</p>
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 8px", font: `700 11px/1 ${MONO}`, letterSpacing: ".16em",
                     textTransform: "uppercase", color: MUTED }}>{children}</p>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 26 }}>
      <h2 style={{ margin: "0 0 12px", fontFamily: DISPLAY, fontWeight: 700, color: PAPER, fontSize: 21 }}>{title}</h2>
      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </section>
  )
}

function Card({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div style={{ background: "rgba(10,21,35,.86)", border: `1px solid ${LINE}`,
                  borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: "16px 18px" }}>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>{children}</div>
}

function Button({ children, onClick, href, ghost, type }:
  { children: React.ReactNode; onClick?: () => void; href?: string; ghost?: boolean; type?: "submit" }) {
  const style: React.CSSProperties = {
    display: "inline-block", font: `700 14px/1 ${BODY}`, letterSpacing: ".04em",
    textTransform: "uppercase", color: "#FFFFFF",
    background: ghost ? "transparent" : RED_FILL,
    border: ghost ? `1px solid ${LINE}` : `1px solid ${RED_FILL}`,
    borderRadius: 11, padding: "14px 20px", textDecoration: "none", cursor: "pointer",
  }
  if (href) return <a href={href} style={style}>{children}</a>
  return <button type={type || "button"} onClick={onClick} style={style}>{children}</button>
}

/* ------------------------------------------------------------------ signing in */

function SignIn({ db, onDone }: { db: RanchDb | null; onDone: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [needsCode, setNeedsCode] = useState(false)
  const [code, setCode] = useState("")

  const run = async (fn: () => Promise<string | null>, ok?: string) => {
    if (!db) return
    setBusy(true); setMsg(null)
    const problem = await fn()
    setBusy(false)
    /* Not a wrong password: the account exists and this address has never been
       confirmed, which blocks sign in entirely on this project. Ask for the
       code rather than printing the sentinel at somebody. */
    if (problem === NEEDS_VERIFICATION) {
      setNeedsCode(true)
      setMsg("This address has not been confirmed. We have sent a six digit code to it.")
      await db.sendEmailCode(email)
      return
    }
    if (problem) setMsg(problem)
    else if (ok) setMsg(ok)
    else onDone()
  }

  const confirm = async () => {
    if (!db) return
    setBusy(true); setMsg(null)
    const problem = await db.verifyEmailCode(email, code)
    if (problem) { setBusy(false); setMsg(problem); return }
    /* Confirming usually hands back a session, because auto sign in after
       verification is on. Try the password once more regardless, so nobody is
       left with a confirmed address and a locked door. */
    const second = await db.signIn(email, password)
    setBusy(false)
    if (second && second !== NEEDS_VERIFICATION) { setMsg(second); return }
    onDone()
  }

  /* 16px floor on every field: anything smaller and iOS zooms the page on
     focus, which on a phone reads as the layout breaking. */
  const field: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", fontSize: 16, fontFamily: BODY,
    color: PAPER, background: "rgba(10,21,35,.86)", border: `1px solid ${LINE}`,
    borderRadius: 10, padding: "13px 14px", marginBottom: 10,
  }

  return (
    <>
      <Head kicker="Your account" title="Sign in" />
      <P>
        Use the same address you entered a car with, or asked about a space with, and everything of yours
        will be here.
      </P>
      <form onSubmit={(ev) => { ev.preventDefault(); run(() => db!.signIn(email, password)) }}>
        <label htmlFor="pe" style={{ display: "block", font: `600 13px/1.6 ${BODY}`, color: MUTED }}>Email</label>
        <input id="pe" style={field} type="email" autoComplete="email" required
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pp" style={{ display: "block", font: `600 13px/1.6 ${BODY}`, color: MUTED }}>Password</label>
        <input id="pp" style={field} type="password" autoComplete="current-password" required minLength={8}
               value={password} onChange={(e) => setPassword(e.target.value)} />
        {/* Google is out for now. It reached the auth service and got a valid
            redirect back, then went nowhere, and a door that looks open and is
            not is worse than one that is plainly shut. The password and the
            emailed link both work. */}
        <Row>
          <Button type="submit">{busy ? "One moment" : "Sign in"}</Button>
        </Row>
      </form>

      {needsCode && (
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${LINE}` }}>
          <label htmlFor="potp" style={{ display: "block", font: `600 13px/1.6 ${BODY}`, color: MUTED }}>
            Code from your email
          </label>
          <input id="potp" inputMode="numeric" autoComplete="one-time-code" maxLength={8}
            value={code} onChange={(e) => setCode(e.target.value)}
            style={{ ...field, letterSpacing: ".3em", fontFamily: MONO }} />
          <Row>
            <Button onClick={confirm}>{busy ? "Checking" : "Confirm and sign in"}</Button>
            <Button ghost onClick={() => run(() => db!.sendEmailCode(email), "New code sent.")}>
              Send a new code
            </Button>
          </Row>
        </div>
      )}
      <p style={{ margin: "16px 0 0" }}>
        <button onClick={() => run(() => db!.magicLink(email, location.href), "Check your email for the link.")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
                   color: RED_TEXT, font: `600 14px/1.4 ${BODY}` }}>
          Email me a link instead
        </button>
      </p>
      {msg && <p style={{ margin: "14px 0 0", color: PAPER, fontSize: 15, lineHeight: 1.55 }}>{msg}</p>}
    </>
  )
}

/**
 * For somebody who has the link from their email but landed here instead.
 *
 * Takes the whole address rather than asking a person to find the token
 * inside it, because nobody should have to read a query string.
 */
function Paste({ onToken }: { onToken: (t: string) => Promise<void> }) {
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const submit = async () => {
    const found = value.trim().match(/[?&]t=([A-Za-z0-9._-]{8,128})/) || value.trim().match(/^([A-Za-z0-9._-]{32,128})$/)
    if (!found) { setMsg("That does not look like one of our links. Paste the whole address."); return }
    setBusy(true); setMsg(null)
    await onToken(found[1])
    setBusy(false)
    setMsg("If that link is still good, your entry is above now.")
  }

  return (
    <div style={{ margin: "6px 0 18px" }}>
      <label htmlFor="pt" style={{ display: "block", font: "600 13px/1.6 " + BODY, color: MUTED }}>
        Have a link from one of our emails? Paste it here.
      </label>
      <input id="pt" value={value} onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", fontSize: 16, fontFamily: BODY, color: PAPER,
                 background: "rgba(10,21,35,.86)", border: "1px solid " + LINE, borderRadius: 10,
                 padding: "13px 14px", marginBottom: 10 }} />
      <Button onClick={submit}>{busy ? "One moment" : "Find my entry"}</Button>
      {msg && <p style={{ margin: "12px 0 0", color: PAPER, fontSize: 15, lineHeight: 1.55 }}>{msg}</p>}
    </div>
  )
}

/**
 * An RSVP, and the two things somebody actually wants to change about one:
 * how many of them are coming, and whether we write to them.
 *
 * Both are saved through set_rsvp, which scopes the update to the caller's own
 * row in Postgres, so an id belonging to somebody else edits nothing. The count
 * is what the cooking and the parking are planned against, so it is clamped
 * server side rather than trusted.
 */
function RsvpCard({ rsvp, db, onSaved }: { rsvp: Rsvp; db: RanchDb | null; onSaved: () => void }) {
  const [size, setSize] = useState(rsvp.party_size)
  const [subscribed, setSubscribed] = useState(rsvp.subscribed)
  const [busy, setBusy] = useState(false)
  const [said, setSaid] = useState<string | null>(null)

  const dirty = size !== rsvp.party_size || subscribed !== rsvp.subscribed

  const save = async () => {
    if (!db) return
    setBusy(true)
    setSaid(null)
    const ok = await db.rpc("set_rsvp", { p_id: rsvp.id, p_party_size: size, p_subscribed: subscribed })
    setBusy(false)
    if (ok) { setSaid("Saved."); onSaved() }
    else setSaid("We could not save that. Try again in a moment.")
  }

  return (
    <Card accent="#00D2BE">
      <Label>{rsvp.event_name}</Label>
      <Strong>{size === 1 ? "One of you" : `${size} of you`}</Strong>
      <P small>
        Nothing to print and nothing to book. Spectating is free, so bring whoever you meant to bring.
      </P>

      <label htmlFor={`n-${rsvp.id}`} style={{ display: "block", font: `600 13px/1.6 ${BODY}`, color: MUTED }}>
        How many of you
      </label>
      <input
        id={`n-${rsvp.id}`}
        type="number"
        min={1}
        max={40}
        value={size}
        onChange={(ev) => setSize(Math.max(1, Math.min(40, Number(ev.target.value) || 1)))}
        style={{
          width: 110, boxSizing: "border-box", fontSize: 16, fontFamily: BODY, color: PAPER,
          background: "rgba(10,21,35,.86)", border: `1px solid ${LINE}`, borderRadius: 10,
          padding: "12px 14px", margin: "0 0 14px",
        }}
      />

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={subscribed}
          onChange={(ev) => setSubscribed(ev.target.checked)}
          style={{ width: 20, height: 20, marginTop: 2, accentColor: RED_FILL }}
        />
        <span style={{ color: MUTED, fontSize: 15, lineHeight: 1.55 }}>
          Write to me once a week until the day. One short note, and then nothing.
        </span>
      </label>

      {dirty && (
        <Button onClick={save}>{busy ? "Saving" : "Save"}</Button>
      )}
      {said && <p style={{ margin: "12px 0 0", color: PAPER, fontSize: 15 }}>{said}</p>}
    </Card>
  )
}
