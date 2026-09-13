import Image from "next/image"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PILLARS } from "@/lib/site-data"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)"
const BTN_NOTCH = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"
const TECH = PILLARS.tech.tone

const h2: React.CSSProperties = { margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", textWrap: "balance" as never }
const p: React.CSSProperties = { margin: 0, fontFamily: ARCHIVO, fontSize: 17, lineHeight: 1.62, color: "#C4CBD6", maxWidth: "60ch" }

function Tag({ children, tone = TECH, ink = "#0A1523" }: { children: React.ReactNode; tone?: string; ink?: string }) {
  return (
    <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: tone, padding: "6px 16px", alignSelf: "flex-start" }}>
      <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: ink }}>{children}</span>
    </span>
  )
}

function Button({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase",
        background: ghost ? "transparent" : "#F2C94C", color: ghost ? "#EDF1F6" : "#101010", border: ghost ? "1px solid rgba(255,255,255,.3)" : 0,
        padding: "15px 26px", clipPath: BTN_NOTCH, textDecoration: "none",
      }}
    >
      {children}
    </Link>
  )
}

/** A glass card with a faint photograph behind the text. */
function Card({ img, pos = "center", tone = TECH, children }: { img: string; pos?: string; tone?: string; children: React.ReactNode }) {
  return (
    <section className="pg-e1" style={{ position: "relative", isolation: "isolate", overflow: "hidden", borderLeft: `3px solid ${tone}`, clipPath: NOTCH, padding: "clamp(22px,3.2vw,34px)", display: "flex", flexDirection: "column", gap: 16 }}>
      <Image src={img} alt="" aria-hidden fill loading="lazy" sizes="(max-width: 920px) 100vw, 920px" style={{ objectFit: "cover", objectPosition: pos, opacity: 0.3, zIndex: -1 }} />
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(160deg,rgba(14,26,42,.96) 0%,rgba(14,26,42,.86) 50%,rgba(14,26,42,.55) 100%)" }} />
      {children}
    </section>
  )
}

/** A full photograph with the text over its lower edge. */
function Photo({ src, alt, pos = "center 55%", children }: { src: string; alt: string; pos?: string; children: React.ReactNode }) {
  return (
    <section style={{ position: "relative", border: "1px solid rgba(255,255,255,.12)", clipPath: NOTCH, overflow: "hidden", display: "flex", alignItems: "flex-end", minHeight: "clamp(340px,46vh,480px)" }}>
      <Image src={src} alt={alt} fill loading="lazy" sizes="(max-width: 920px) 100vw, 920px" style={{ objectFit: "cover", objectPosition: pos }} />
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.96) 16%,rgba(10,21,35,.55) 60%,rgba(10,21,35,.3) 100%)" }} />
      <div style={{ position: "relative", padding: "clamp(22px,3.2vw,34px)", display: "flex", flexDirection: "column", gap: 14, maxWidth: 680 }}>
        {children}
      </div>
    </section>
  )
}

export default function WhyAPaddockPage() {
  return (
    <>
      <SiteNav active="why" />
      <PageBackdrop src="/images/cage-rig.webp" opacity={0.16} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,22px)" }}>
        <section style={{ position: "relative", minHeight: "clamp(380px,52vh,540px)", border: "1px solid rgba(255,255,255,.14)", clipPath: NOTCH, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src="/images/cullinan-doors.webp" alt="A Murcielago with a door up, waiting on the transporter behind it" fill priority sizes="(max-width: 920px) 100vw, 920px" style={{ objectFit: "cover", objectPosition: "center 55%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.96) 12%,rgba(10,21,35,.5) 58%,rgba(10,21,35,.32) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,42px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
            <p style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 12.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6" }}>
              <i aria-hidden="true" style={{ width: 26, height: 3, background: TECH, display: "block" }} />
              {PILLARS.tech.label}
            </p>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>
              Why a <span style={{ color: "#F2C94C" }}>paddock</span>
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(17px,1.9vw,20px)", lineHeight: 1.56, color: "#EDF1F6", maxWidth: "50ch", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
              I wasn&rsquo;t looking for a name. I was trying to describe how I like to spend my time: around cars, around people who know things, and learning whatever comes next.
            </p>
          </div>
        </section>

        <Card img="/images/918-p1.webp" pos="center 42%">
          <Tag>The word</Tag>
          <h2 style={h2}>What a paddock is</h2>
          <p style={p}>It&rsquo;s the part of a racetrack most people never see: behind pit lane, where the transporters park and the teams work.</p>
          <p style={{ ...p, color: "#EDF1F6" }}>Nobody in a paddock is showing off. Everybody has something apart, and everybody is happy to tell you why. You learn more standing around one for an afternoon than you do reading for a year.</p>
        </Card>

        <Card img="/images/918-pipes.webp" pos="center 38%">
          <Tag>Always learning</Tag>
          <h2 style={h2}>Spreadsheets, then code, then agents</h2>
          <p style={p}>I started in spreadsheets, building pivot tables before no-code tools existed. Certifications across the Microsoft and Google enterprise stacks came next, then full-stack development, and now agentic engineering: software that plans and carries out work alongside the person who knows the job.</p>
          <p style={p}>AI speeds up somebody who already knows how the work is done. It does not replace knowing it.</p>
          <p style={{ ...p, color: "#EDF1F6" }}>The lot is where that got tested. Supercar IQ grew out of a question that came up there every day: what exactly is this car, and what is it worth?</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <Button href="/supercar-iq">Supercar IQ</Button>
            <Button href="/scoreboard" ghost>What I build</Button>
          </div>
        </Card>

        <Photo src="/images/tt/tt-918-veyron.webp" alt="A Porsche 918 Spyder and a Bugatti Veyron parked side by side at Tires & Timepieces" pos="center 50%">
          <Tag tone="#EDF1F6">Watches</Tag>
          <h2 style={h2}>Where the cars met the watches</h2>
          <p style={{ ...p, color: "#EDF1F6", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
            Tires &amp; Timepieces started with a jeweler in Scottsdale that sells Patek Philippe and Rolex. Twice we filled its car park with rare cars on a Saturday morning and let anybody walk in. A good watch and a good car reward the same kind of attention, which is why they share a car park so easily.
          </p>
          <p style={{ margin: 0 }}>
            <Link href="/events/tires-and-timepieces" className="pg-textlink">Tires &amp; Timepieces</Link>
          </p>
        </Photo>

        <Photo src="/images/ferrari-upperdeck.webp" alt="A Ferrari on the upper deck of a transporter">
          <Tag tone="#F2C94C" ink="#101010">The lot</Tag>
          <h2 style={h2}>On the lot, Lebanon, Tennessee</h2>
          <p style={{ ...p, color: "#EDF1F6", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
            The bay door went up and a transporter was already waiting. Everything that came off a truck got checked, cleaned, photographed and written up before it went anywhere, and everything leaving got verified first. There is real fraud in this business, and somebody had trusted us with a car they love.
          </p>
          <p style={{ margin: 0 }}>
            <Link href="/lot-ops" className="pg-textlink">The mornings, in full</Link>
          </p>
        </Photo>

        <Card img="/images/g993-ramp.webp" pos="center 58%" tone="#F2C94C">
          <Tag tone="#F2C94C" ink="#101010">Ownership</Tag>
          <h2 style={h2}>What living with one is like</h2>
          <p style={p}>Choosing a car says a lot about a person: what they find beautiful, and what they are willing to put up with.</p>
          <p style={p}>Then you live with it. It picks up a smell. It develops a rattle you stop hearing. You learn where it is slow and you forgive it. None of that is in a listing, and it is what I try to write down.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <Button href="/cars">The Garage</Button>
            <Button href="/gloss-game" ghost>The Gloss Game</Button>
          </div>
        </Card>

        <section className="pg-e1" style={{ borderLeft: `3px solid ${TECH}`, clipPath: NOTCH, padding: "clamp(22px,3.2vw,34px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <Tag>One question</Tag>
          <h2 style={h2}>The same question, asked two ways</h2>
          <p style={p}>People meet the events and the software separately and assume they are different jobs. They are closer than they look. On the lot, every car had to be checked, photographed and written up before anybody saw it. Supercar IQ reads a car from a photo and pulls its spec, its recalls and what it is worth.</p>
          <p style={{ ...p, color: "#EDF1F6" }}>Both start with somebody standing next to a car, wanting to know what it really is.</p>
        </section>
      </main>

      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteFooter />
      </div>
    </>
  )
}
