import type { Metadata } from "next"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* The third rung of the ladder the whole site is built on: stand next to
   them, hear them run, drive them yourself. /events is the first rung. This
   is the third.

   Substance comes from the GoTime Motorsports HPDE deck. The format, the run
   groups, the session times, the helmet and waiver rules and the three tiers
   are all from it. What is NOT from it: any suggestion that a day has already
   happened. Gavin, 2026-09-07: "WE never did AZ, Nashville will be our first."
   So nothing here is written in past tense and no attendance is claimed.

   No prices. The deck's tiers were priced for an Arizona venue that was never
   booked, and a price without a track or a date behind it is a guess.

   No photographs from the deck. Those were illustrative stock for an event
   that never ran, and one of them carries another club's sticker. Using them
   would show a day that did not happen. The backdrop is Gavin's own. */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)"
const DM = "https://ig.me/m/itspaddockgavin"

/* Set when the first Nashville date and venue are booked. */
const FIRST: { date: string; venue: string } | null = null

const SESSION = [
  { t: "7:00 AM", w: "Registration opens. Waiver signed on paper, wristband on." },
  { t: "7:30 AM", w: "Safety meeting. Nobody goes out who missed it." },
  { t: "8:00 AM", w: "Track opens. Four hours, three run groups, equal time each." },
  { t: "12:00 PM", w: "Morning session ends, afternoon registration opens." },
  { t: "1:00 PM", w: "Afternoon session runs the same way until five." },
]

const BRING = [
  { k: "A helmet", v: "Mandatory, no exceptions. Rentals are available if you do not own one yet." },
  { k: "Your own car", v: "Prepared for high performance driving before you arrive. Fluids, pads, tyres, nothing loose in the cabin." },
  { k: "A signed waiver", v: "On paper, at registration. The wristband you get there is what the marshals look for." },
  { k: "Insurance, if you want it", v: "Track insurance is sold separately and is not required. It is worth reading about before you decide." },
]

const TIERS = [
  {
    name: "Paddock",
    line: "The day itself",
    has: ["Track pass for the session", "Four hours of driving in your own car", "Professional instructors"],
  },
  {
    name: "Race Day",
    line: "The day, and proof you were there",
    has: ["Everything in Paddock", "Professional action photographs of your car", "Preferred paddock parking", "Discount on apparel"],
  },
  {
    name: "Winner’s Circle",
    line: "The day, unhurried",
    has: ["Everything in Race Day", "Breakfast and lunch", "A deeper apparel discount", "Time with the pro driver, and a photograph"],
  },
]

export const metadata: Metadata = {
  title: "Track Days and Autocross near Nashville",
  description:
    "Drive your own car on a circuit, with professional instructors and run groups by experience. The first one near Nashville is being scheduled, and autocross runs with Pro Touring Rally. Here is exactly what a day is.",
  openGraph: {
    title: "Drive it yourself",
    description:
      "Your own car, on a circuit, with instructors and run groups by experience. The first one near Nashville is being scheduled.",
    url: "https://paddockgavin.com/track-days",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Track days and autocross near Nashville" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

function Eyebrow({ children, tone = "#F2C94C" }: { children: React.ReactNode; tone?: string }) {
  return (
    <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".2em", textTransform: "uppercase", color: "#B4B6B2" }}>
      <i aria-hidden="true" style={{ width: 22, height: 2, background: tone, flex: "0 0 auto" }} />
      {children}
    </p>
  )
}

export default function TrackDaysPage() {
  return (
    <>
      <PageBackdrop src="/images/g993-fire.webp" opacity={0.16} />
      <SiteNav />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1080, margin: "0 auto", padding: "clamp(16px,3vw,28px) clamp(12px,4vw,40px) clamp(60px,8vw,110px)", display: "flex", flexDirection: "column", gap: "clamp(44px,6vw,84px)" }}>

        {/* Hero */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vw,26px)" }}>
          <Eyebrow>Nashville · Being scheduled</Eyebrow>
          <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.026em", color: "#FFFFFF", textWrap: "balance" }}>
            Drive it yourself
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.62, color: "#C4CBD6", maxWidth: "62ch" }}>
            <p style={{ margin: 0 }}>
              Standing next to a car you love is one thing. Sitting in your own on a circuit, with
              nothing in front of you and somebody in the passenger seat who knows the line, is a
              different thing entirely. Almost nobody gets to find that out, and the reason is
              usually that the first step looks harder than it is.
            </p>
            <p style={{ margin: 0 }}>
              So this page is the whole of it. What a day is, hour by hour. What you have to bring.
              What it costs you in nerve rather than money. The first one near Nashville is being
              scheduled now, and it will be the first we have run here, which is worth saying
              plainly rather than dressing up.
            </p>
            <p style={{ margin: 0 }}>
              You do not need a race car. You need the car you already own, a helmet, and a morning.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center", paddingTop: 2 }}>
            <a href={DM} target="_blank" rel="noopener noreferrer" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
              Put me in the first group
            </a>
            <Link href="/events" className="pg-textlink">The events</Link>
          </div>
        </section>

        {/* The day */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow tone="#00D2BE">The format</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
            What a day actually is
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            Two sessions, twenty five cars in each. Three run groups sorted by how much track time
            you have already had, and every group gets the same amount of it. You pick the group
            that honestly describes you, and nobody is going to be embarrassed by choosing the
            first one.
          </p>
          <ol className="pg-e1" style={{ margin: 0, padding: "clamp(8px,1.2vw,14px) clamp(16px,2.2vw,24px)", listStyle: "none", clipPath: NOTCH }}>
            {SESSION.map((s, i) => (
              <li key={s.t} style={{ display: "flex", flexWrap: "wrap", gap: "2px 18px", padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.09)" }}>
                <span style={{ fontFamily: MONO, fontSize: 14, fontVariantNumeric: "tabular-nums", letterSpacing: ".04em", color: "#F2C94C", flex: "0 0 84px" }}>{s.t}</span>
                <span style={{ fontFamily: ARCHIVO, fontSize: 16.5, lineHeight: 1.55, color: "#C4CBD6", flex: "1 1 240px", minWidth: 0 }}>{s.w}</span>
              </li>
            ))}
          </ol>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.6, color: "#9AA4B2", maxWidth: "62ch" }}>
            Bring people to watch if you want. Spectators are welcome, it is standing room, and
            nobody who is not driving goes on the track. And it runs in the rain.
          </p>
        </section>

        {/* What to bring */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow tone="#4BA3DE">Before you arrive</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            Four things, and one of them is optional
          </h2>
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "clamp(12px,1.6vw,18px)" }}>
            {BRING.map((b) => (
              <div key={b.k} className="pg-e1" style={{ display: "flex", flexDirection: "column", gap: 8, padding: "clamp(16px,2.2vw,22px)", clipPath: NOTCH }}>
                <dt style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: 17, letterSpacing: "-.012em", color: "#FFFFFF" }}>{b.k}</dt>
                <dd style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.55, color: "#9AA4B2" }}>{b.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Tiers */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow>Three ways in</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            Same track time, different day around it
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            Every one of these puts you on track for the same four hours. What changes is what
            happens between sessions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(250px,100%),1fr))", gap: "clamp(12px,1.6vw,18px)" }}>
            {TIERS.map((t, i) => (
              <div key={t.name} className={i === 2 ? "pg-e2" : "pg-e1"} style={{ display: "flex", flexDirection: "column", gap: 12, padding: "clamp(18px,2.4vw,26px)", clipPath: NOTCH }}>
                <p style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-.018em", color: "#FFFFFF" }}>{t.name}</p>
                <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".08em", textTransform: "uppercase", color: "#F2C94C" }}>{t.line}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {t.has.map((h) => (
                    <li key={h} style={{ display: "flex", gap: 9, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.5, color: "#C4CBD6" }}>
                      <i aria-hidden="true" style={{ marginTop: 8, width: 5, height: 5, borderRadius: "50%", background: "#00D2BE", flex: "0 0 auto" }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.6, color: "#9AA4B2", maxWidth: "62ch" }}>
            {FIRST
              ? `Pricing for ${FIRST.venue} is on the registration page.`
              : "No prices here yet, on purpose. What a day costs depends on the circuit, and the circuit is what is being settled now. The numbers post here the day they are real."}
          </p>
        </section>

        {/* Autocross */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow tone="#00D2BE">With Pro Touring Rally</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
            Autocross, if a circuit is too big a first step
          </h2>
          <div className="pg-e1" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "clamp(18px,2.6vw,28px)", clipPath: NOTCH }}>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.62, color: "#C4CBD6", maxWidth: "62ch" }}>
              Cones on a large flat surface, one car on course at a time, second gear most of the
              way. It is slower than a track day and it teaches you more per minute, because you
              get the same corner again and again until you stop getting it wrong.
            </p>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.62, color: "#C4CBD6", maxWidth: "62ch" }}>
              It is also the cheapest way to find out whether you actually like driving fast, in
              the car sitting on your driveway, with nothing to lose but cones. We run these with
              Pro Touring Rally.
            </p>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.6, color: "#9AA4B2" }}>
              Dates come from the same place as everything else here. Ask and I will tell you when
              the next one is.
            </p>
          </div>
        </section>

        {/* Close */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#B4B6B2">The first one</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
            {FIRST ? "It is booked" : "Say now and you are in the first group"}
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            {FIRST
              ? `${FIRST.date}, at ${FIRST.venue}.`
              : "Twenty five cars a session is not many, and the people who say early are the ones who get the morning run group. Tell me what you drive and how much track time you have had, and I will tell you which group you belong in and when the date lands."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center" }}>
            <a href={DM} target="_blank" rel="noopener noreferrer" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
              Tell me what you drive
            </a>
            <Link href="/events" className="pg-textlink">Every event</Link>
            <Link href="/partner" className="pg-textlink">Sponsor one</Link>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
