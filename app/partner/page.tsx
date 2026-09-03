import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Brand Partnerships",
  description: "Around a million views a month, and an audience that owns the cars you make things for. Products, tools, coatings, events, affiliate programs.",
}

const stats = [
  { k: "~1,000,000", v: "Views / month" },
  { k: "~7,900", v: "Instagram followers" },
  { k: "Owners &\ncollectors", v: "Primary audience" },
  { k: "Lebanon, TN", v: "The showroom floor" },
]

const formats = [
  {
    title: "Product feature",
    desc: "Your product in context, on the car, in the garage, at the lot. One specific detail, shown honestly.",
  },
  {
    title: "Detailing & coatings",
    desc: "Paint correction, ceramic coatings, glass treatments. Demonstrated on real cars, in real conditions.",
  },
  {
    title: "Event sponsorship",
    desc: "Tires & Timepieces™ and the shows I run. Floor presence and content from the event.",
  },
  {
    title: "Affiliate programme",
    desc: "A tracked link in relevant content. Commission on referred sales. Disclosed every time.",
  },
  {
    title: "Custom",
    desc: "Something that fits the car, the room, and the audience. Tell me what you are trying to do.",
  },
]

const rules = [
  "Paid, gifted and affiliate content is labelled on the piece, before you read it · FTC rules and the right way to do it.",
  "A payment gets a fair look. It does not get a good review. If something is bad I say so or say nothing.",
  "No partnership is accepted that requires editorial approval or restricts what I can say.",
  "One brand per category at a time, so nothing competes with itself on the same page.",
]

export default function PartnerPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A1523",
        color: "#B4B6B2",
        fontFamily: "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Hero */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,.1)",
          padding: "clamp(48px,6vw,88px) clamp(20px,5vw,80px) clamp(32px,4vw,56px)",
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <p style={{ margin: "0 0 18px", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".22em", textTransform: "uppercase", color: "#91918F" }}>
            Brand Partnerships
          </p>
          <h1 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: "var(--t-h1)", letterSpacing: "-.025em", lineHeight: 1.05, color: "#FFFFFF" }}>
            Put it in front of{" "}
            <span style={{ color: "#F2C94C" }}>people who buy cars</span>
          </h1>
          <p style={{ margin: "0 0 36px", fontSize: 18, lineHeight: 1.6, color: "#C4CBD6", maxWidth: 660 }}>
            ~1,000,000 views a month, and an audience that owns the cars you make things for. Products, tools, coatings, events, affiliate programs.
          </p>

          {/* Stat row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 1,
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(18px,2.5vw,28px) clamp(16px,2vw,24px)",
                  background: "#0A1523",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: "clamp(20px,2.8vw,30px)",
                    fontWeight: 700,
                    letterSpacing: "-.02em",
                    color: "#F2C94C",
                    whiteSpace: "pre-line",
                  }}
                  dangerouslySetInnerHTML={{ __html: s.k }}
                />
                <p
                  style={{
                    margin: 0,
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 11,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#91918F",
                  }}
                >
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(32px,4vw,64px) clamp(20px,5vw,80px)" }}>

        {/* Partnership formats */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <h2 style={{ margin: "0 0 28px", fontWeight: 800, fontSize: "var(--t-h2)", letterSpacing: "-.025em", color: "#FFFFFF" }}>
            What we do together
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 16 }}>
            {formats.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderTop: "3px solid #F2C94C",
                  padding: "clamp(20px,2.5vw,28px)",
                }}
              >
                <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 16, color: "#FFFFFF", letterSpacing: "-.01em" }}>{f.title}</p>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "#B4B6B2" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The rules */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <h2 style={{ margin: "0 0 20px", fontWeight: 800, fontSize: "var(--t-h2)", letterSpacing: "-.025em", color: "#FFFFFF" }}>
            The rules of the partnership
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {rules.map((r, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: 15.5, lineHeight: 1.55, color: "#C4CBD6" }}>
                <span style={{ color: "#F2C94C", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* Enquiry CTA */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "var(--t-h2)", letterSpacing: "-.025em", color: "#FFFFFF" }}>
            Start a partnership
          </h2>
          <p style={{ margin: "0 0 28px", fontSize: 16, lineHeight: 1.6, color: "#C4CBD6", maxWidth: 560 }}>
            Tell me who you are, what the product or program is, and what you are trying to do. I will tell you whether there is a fit.
          </p>
          <div
            style={{
              background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
              border: "1px solid rgba(255,255,255,.11)",
              borderLeft: "3px solid #F2C94C",
              padding: "clamp(24px,3vw,40px)",
            }}
          >
            <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.6, color: "#C4CBD6" }}>
              The fastest way in is a DM. Include your brand name, what you make, and what kind of partnership you have in mind. Replies within 24 hours.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="https://ig.me/m/itspaddockgavin"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "13px 28px",
                  background: "#F2C94C",
                  color: "#101010",
                  fontWeight: 800,
                  fontSize: 13.5,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                DM @itspaddockgavin
              </a>
              <Link
                href="/press"
                style={{
                  display: "inline-block",
                  padding: "13px 28px",
                  border: "1px solid rgba(255,255,255,.2)",
                  color: "#EDF1F6",
                  fontWeight: 700,
                  fontSize: 13.5,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Media kit &rarr;
              </Link>
            </div>
          </div>
        </section>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 8 }}>
          <Link href="/" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>&larr; Home</Link>
          <Link href="/press" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>Press page &rarr;</Link>
        </div>
      </div>
    </main>
  )
}
