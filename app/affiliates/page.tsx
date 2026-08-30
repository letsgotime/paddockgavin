import type { Metadata } from "next"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Affiliates & Partners",
  description:
    "The brands I actually use and the people who shot the photos. Codes where I have them, credit where it is owed, and a standing offer to fix anything I got wrong.",
  openGraph: {
    title: "Affiliates & Partners",
    description:
      "The brands I actually use and the people who shot the photos. Codes where I have them, credit where it is owed.",
    url: "https://paddockgavin.com/affiliates",
  },
  alternates: { canonical: "https://paddockgavin.com/affiliates" },
}

const disp = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"
const serif = "Newsreader,Georgia,'Times New Roman',serif"
const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const GARAGE: {
  name: string
  desc: string
  code?: string
  href: string
  paid?: boolean
}[] = [
  {
    name: "bigboi",
    desc: "The dryer. Air before a towel touches anything.",
    href: "https://ibigboi.com/en-us/products/blowr-pro-mkii-car-dryer",
    paid: true,
  },
  {
    name: "Obsessed Garage",
    desc: "Towels, mitts, the wall rack, the foam cannon.",
    href: "https://www.obsessedgarage.com",
    paid: true,
  },
  {
    name: "CarPro",
    desc: "Six products across four chapters. The coatings and the toppers.",
    href: "https://www.amazon.com/dp/B0BWYX1J85",
    paid: true,
  },
  {
    name: "AMMO NYC",
    desc: "Frothe, Mousse, Plum. And most of how I think about this.",
    href: "https://ammonyc.com",
  },
  {
    name: "GYEON",
    desc: "Foam, tire cleaner, leather shield.",
    href: "https://gyeonusa.com",
  },
  {
    name: "The Rag Company",
    desc: "The towel rotation. The part that actually saves paint.",
    href: "https://www.amazon.com/dp/B0166U4PVC",
    paid: true,
  },
  {
    name: "Griot's Garage",
    desc: "The G9, and the tire dressing when I want satin not shine.",
    href: "https://www.griotsgarage.com/g9-random-orbital-polisher/",
  },
]

const SHIFT: {
  name: string
  desc: string
  href: string
  paid?: boolean
}[] = [
  {
    name: "Genius Consciousness",
    desc: "What I take before a long day on the lot or a late one in the garage.",
    href: "https://thegeniusbrand.com/products/genius-consciousness",
    paid: true,
  },
]

const CREW: { name: string; role: string }[] = [
  { name: "Becky", role: "Photography" },
  { name: "BRIX Films", role: "Film" },
  { name: "Bekah", role: "Production" },
]

/* ─── shared tile styles ─── */
const tileBase: React.CSSProperties = {
  background: "#0A1523",
  padding: "30px 26px 28px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minHeight: 220,
  position: "relative",
  borderRight: "1px solid rgba(255,255,255,.10)",
  borderBottom: "1px solid rgba(255,255,255,.10)",
}

export default function AffiliatesPage() {
  return (
    <>
      <SiteNav />
      <main style={{ background: "#0A1523", color: "#D4DAE2", overflowX: "hidden" }}>

        {/* ── Hero ── */}
        <section style={{ padding: "clamp(70px,10vw,120px) clamp(18px,5vw,64px) clamp(20px,3vw,36px)" }}>
          <p style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".26em", textTransform: "uppercase", color: "#00D2BE", margin: "0 0 20px" }}>
            Affiliates &amp; Partners &middot; codes &middot; the people
          </p>
          <h1 style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(46px,11vw,124px)", lineHeight: .86, letterSpacing: "-.045em", textTransform: "uppercase", color: "#fff", margin: "0 0 24px" }}>
            Credit<br />where<br />it is due
          </h1>
          <p style={{ fontFamily: serif, fontSize: "clamp(20px,2.6vw,29px)", lineHeight: 1.4, fontWeight: 300, fontStyle: "italic", color: "#EDF1F6", margin: "0 0 30px", maxWidth: "28ch" }}>
            The brands I actually use, and the people who took the photographs.
          </p>
        </section>

        {/* ── Disclosure note ── */}
        <section style={{ padding: "0 clamp(18px,5vw,64px) clamp(34px,5vw,62px)" }}>
          <p style={{ fontFamily: mono, fontSize: 12, lineHeight: 1.75, color: "#B8BEC8", borderLeft: "2px solid #00D2BE", padding: "2px 0 2px 16px", margin: 0, maxWidth: "70ch" }}>
            <b style={{ color: "#EDF1F6", fontWeight: 400 }}>5 of the links on this page pay me a commission</b>{" "}
            and each one is marked. Nothing is here because it pays. Everything here is something I bought
            with my own money first, most of it years before anybody offered me anything.
          </p>
        </section>

        {/* ── 01 In the garage ── */}
        <section style={{ padding: "clamp(50px,8vw,104px) clamp(18px,5vw,64px)" }}>
          {/* Folio */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <i style={{ fontStyle: "normal", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", color: "#B8BEC8" }}>01</i>
            <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>In the garage</span>
            <span style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.13)" }} />
          </div>

          <div style={{ display: "grid", gap: "clamp(24px,4.4vw,64px)", marginBottom: "clamp(20px,3vw,36px)" }}>
            <div>
              <h2 style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(25px,4.2vw,44px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>
                What I actually reach for
              </h2>
              <p style={{ fontFamily: disp, fontSize: 16, lineHeight: 1.64, color: "#D4DAE2", margin: 0, maxWidth: "64ch" }}>
                Where there is a code, it is yours. Where there is not one yet, the link still goes to the
                right place and I will put the code up the day it exists.
              </p>
            </div>
          </div>

          {/* Wall grid */}
          <div style={{ display: "grid", borderTop: "1px solid rgba(255,255,255,.10)", borderLeft: "1px solid rgba(255,255,255,.10)" }}
            className="pg-wall">
            {GARAGE.map((b) => (
              <div key={b.name} style={tileBase}>
                {b.paid && (
                  <span style={{ position: "absolute", top: 16, right: 20, fontFamily: mono, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>
                    Paid link
                  </span>
                )}
                <p style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(23px,2.6vw,29px)", lineHeight: 1.02, letterSpacing: "-.035em", color: "#fff", textTransform: "uppercase", margin: 0 }}>
                  {b.name}
                </p>
                <p style={{ margin: 0, fontFamily: serif, fontSize: 15.5, lineHeight: 1.5, color: "#B8BEC8", flex: "1 1 auto" }}>
                  {b.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                  {b.code ? (
                    <span style={{ display: "inline-flex", alignItems: "center", transform: "skewX(-12deg)", background: "#00D2BE", padding: "8px 15px" }}>
                      <b style={{ transform: "skewX(12deg)", fontFamily: mono, fontSize: 12, letterSpacing: ".16em", color: "#00302B", fontWeight: 700 }}>{b.code}</b>
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", transform: "skewX(-12deg)", border: "1px solid rgba(255,255,255,.24)", padding: "8px 15px" }}>
                      <b style={{ transform: "skewX(12deg)", fontFamily: mono, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#B8BEC8", fontWeight: 400 }}>Code coming</b>
                    </span>
                  )}
                  <a href={b.href} rel="noopener nofollow sponsored" target="_blank"
                    style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#00D2BE", borderBottom: "1px solid rgba(0,210,190,.4)", paddingBottom: 2, marginLeft: "auto", textDecoration: "none" }}>
                    Visit &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 02 The other shift ── */}
        <section style={{ padding: "0 clamp(18px,5vw,64px) clamp(50px,8vw,104px)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <i style={{ fontStyle: "normal", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", color: "#B8BEC8" }}>02</i>
            <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>The other shift</span>
            <span style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.13)" }} />
          </div>
          <h2 style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(25px,4.2vw,44px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>
            Not car care
          </h2>
          <p style={{ fontFamily: disp, fontSize: 16, lineHeight: 1.64, color: "#D4DAE2", margin: "0 0 clamp(18px,2.6vw,32px)", maxWidth: "64ch" }}>
            Two shifts, and the second one runs late. This is what gets me through it.
          </p>
          <div style={{ display: "grid", borderTop: "1px solid rgba(255,255,255,.10)", borderLeft: "1px solid rgba(255,255,255,.10)", maxWidth: 420 }}>
            {SHIFT.map((b) => (
              <div key={b.name} style={tileBase}>
                {b.paid && (
                  <span style={{ position: "absolute", top: 16, right: 20, fontFamily: mono, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>
                    Paid link
                  </span>
                )}
                <p style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(23px,2.6vw,29px)", lineHeight: 1.02, letterSpacing: "-.035em", color: "#fff", textTransform: "uppercase", margin: 0 }}>
                  {b.name}
                </p>
                <p style={{ margin: 0, fontFamily: serif, fontSize: 15.5, lineHeight: 1.5, color: "#B8BEC8", flex: "1 1 auto" }}>
                  {b.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", transform: "skewX(-12deg)", border: "1px solid rgba(255,255,255,.24)", padding: "8px 15px" }}>
                    <b style={{ transform: "skewX(12deg)", fontFamily: mono, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#B8BEC8", fontWeight: 400 }}>Code coming</b>
                  </span>
                  <a href={b.href} rel="noopener nofollow sponsored" target="_blank"
                    style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#00D2BE", borderBottom: "1px solid rgba(0,210,190,.4)", paddingBottom: 2, marginLeft: "auto", textDecoration: "none" }}>
                    Visit &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 The crew ── */}
        <section style={{ padding: "0 clamp(18px,5vw,64px) clamp(50px,8vw,104px)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <i style={{ fontStyle: "normal", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", color: "#B8BEC8" }}>03</i>
            <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>The crew</span>
            <span style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.13)" }} />
          </div>
          <h2 style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(25px,4.2vw,44px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>
            The people who made it look like this
          </h2>
          <p style={{ fontFamily: serif, fontSize: "clamp(18px,2vw,20px)", lineHeight: 1.7, color: "#D4DAE2", margin: "0 0 8px", maxWidth: "64ch" }}>
            Every photo and every clip on this site came from somebody standing somewhere holding something,
            usually early, usually in bad light, usually while I was busy.
          </p>
          <p style={{ fontFamily: serif, fontSize: "clamp(18px,2vw,20px)", lineHeight: 1.7, color: "#D4DAE2", margin: "0 0 clamp(14px,2.4vw,28px)", maxWidth: "64ch" }}>
            You made the experience the experience. I could not have done any of this without you.
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.13)" }}>
            {CREW.map((c) => (
              <div key={c.name} style={{ display: "grid", gap: "5px clamp(14px,3vw,34px)", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,.075)", alignItems: "baseline", gridTemplateColumns: "minmax(0,300px) 1fr" }}>
                <h3 style={{ fontFamily: disp, fontWeight: 800, fontSize: 18, lineHeight: 1.2, color: "#fff", margin: 0 }}>{c.name}</h3>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#00D2BE" }}>{c.role}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".06em", color: "#B8BEC8", margin: "20px 0 26px" }}>
            Contracted through{" "}
            <a href="https://instagram.com/itspaddockgavin" rel="noopener" target="_blank" style={{ color: "#00D2BE" }}>@itspaddockgavin</a>.
            Produced by Bekah.
          </p>
          <p style={{ fontFamily: mono, fontSize: 12, lineHeight: 1.75, color: "#B8BEC8", borderLeft: "2px solid #00D2BE", padding: "2px 0 2px 16px", margin: 0, maxWidth: "70ch" }}>
            <b style={{ color: "#EDF1F6", fontWeight: 400 }}>This list is shorter than it should be.</b>{" "}
            Names go up as I work back through the tags, rather than guessing and putting the wrong name
            under somebody else&apos;s picture.
          </p>
        </section>

        {/* ── Reach-out card ── */}
        <section style={{ padding: "0 clamp(18px,5vw,64px) clamp(70px,10vw,120px)" }}>
          <div style={{ background: "linear-gradient(150deg,rgba(0,81,133,.94),rgba(0,81,133,.55))", border: "1px solid #0A6BAA", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 26px),calc(100% - 26px) 100%,0 100%)", padding: "clamp(26px,4.4vw,50px)" }}>
            <h2 style={{ fontFamily: disp, fontWeight: 900, fontSize: "clamp(25px,4.2vw,44px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 18px" }}>
              If your work is here and your name isn&apos;t
            </h2>
            <p style={{ fontFamily: serif, fontSize: 17.5, lineHeight: 1.65, color: "#DCE8F2", margin: "0 0 18px", maxWidth: "58ch" }}>
              Everything on this site was shot with me and handed to me. Nothing is coming down. The only
              thing missing is a name on it, and that is a five minute fix.
            </p>
            <p style={{ fontFamily: serif, fontSize: 17.5, lineHeight: 1.65, color: "#DCE8F2", margin: "0 0 18px", maxWidth: "58ch" }}>
              I have thousands of photos and I cannot tell you which frame belongs to which person.
              I remember the people.
            </p>
            <p style={{ fontFamily: serif, fontSize: 17.5, lineHeight: 1.65, color: "#DCE8F2", margin: "0 0 18px", maxWidth: "58ch" }}>
              So if you shot something here and your name is not under it, that is my filing and nothing
              else. Send me the photo and I will put your name on it, same day if I am near a laptop.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 10 }}>
              <a href="mailto:paddock20auto@gmail.com?subject=Photo%20credit"
                style={{ display: "inline-flex", alignItems: "center", fontFamily: disp, fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#00D2BE", color: "#00302B", padding: "17px 32px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 13px),calc(100% - 13px) 100%,0 100%)", textDecoration: "none" }}>
                Tell me which one
              </a>
              <a href="https://ig.me/m/itspaddockgavin" rel="noopener" target="_blank"
                style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#BBD4E6", borderBottom: "1px solid rgba(187,212,230,.4)", paddingBottom: 2, textDecoration: "none" }}>
                or DM @itspaddockgavin
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />

      <style>{`
        .pg-wall {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .pg-wall { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1000px) {
          .pg-wall { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  )
}
