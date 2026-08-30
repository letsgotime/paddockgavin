import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Press",
  description: "PaddockGavin is an independent automotive publication covering exotic and collector cars from inside the operation that moves them.",
}

const UPDATED = "August 2026"

const masthead = [
  { role: "Editor and lead photographer", who: "Gavin Brooks", contact: "DM @PaddockGavin" },
  { role: "Publication", who: "PaddockGavin · paddockgavin.com", contact: "Nashville, Tennessee" },
  { role: "Founded", who: "2026 · successor to GoTime Motorsports, 2021", contact: "" },
  { role: "Beat", who: "Exotic and collector cars, logistics, events, detailing", contact: "" },
]

const audience = [
  { metric: "Instagram followers", figure: "~7,900", source: "@PaddockGavin, verifiable in-app" },
  { metric: "Views, trailing 30 days", figure: "~1,000,000", source: "Instagram Insights" },
  { metric: "Publishing cadence", figure: "Multiple times weekly", source: "Post history" },
  { metric: "Primary audience", figure: "Enthusiasts, owners, collectors, trade", source: "Instagram Insights" },
  { metric: "Editorial archive", figure: "paddockgavin.com", source: "Dated, public, permanent" },
]

const coverage = [
  "Manufacturer launches, first drives and press-fleet loans",
  "Auctions and collector sales — consignment through to the block",
  "Concours, cars and coffee, club meets and regional shows",
  "Track days, test days and paddock access",
  "Detailing, restoration and preservation",
  "The trade itself — how cars get where they are going",
]

const standards = [
  "Paid, gifted and affiliate content is disclosed on the piece, before you read it, per FTC guidance.",
  "A loan, a meal or event access does not buy a favourable review, and no partnership is accepted that asks for one.",
  "Corrections are published rather than quietly edited.",
  "Embargoes are honoured to the minute.",
  "Nothing is published from a private facility without the operator's permission.",
]

const credentialChecklist = [
  { item: "Masthead with editorial contact", status: "On this page" },
  { item: "Audience figures with source", status: "On this page" },
  { item: "Editorial standards and disclosure policy", status: "On this page" },
  { item: "Letter of assignment on publication letterhead", status: "Available on request, same day" },
  { item: "Business entity + W-9 / EIN", status: "Available on request" },
  { item: "Certificate of insurance", status: "Available on request" },
  { item: "Prior credential history", status: "Building — regional shows first" },
  { item: "Headshot and government ID", status: "Available on request" },
  { item: "Dated public archive", status: "paddockgavin.com" },
]

export default function PressPage() {
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
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,.1)",
          padding: "clamp(48px,6vw,88px) clamp(20px,5vw,80px) clamp(32px,4vw,56px)",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ margin: "0 0 18px", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".22em", textTransform: "uppercase", color: "#91918F" }}>
            Press &amp; Media
          </p>
          <h1 style={{ margin: "0 0 18px", fontWeight: 900, fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-.025em", lineHeight: 1.05, color: "#FFFFFF" }}>
            Independent publication.{" "}
            <span style={{ color: "#00D2BE" }}>Everything you need to credential us.</span>
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: 17, lineHeight: 1.6, color: "#C4CBD6", maxWidth: 640 }}>
            PaddockGavin is an independent automotive publication covering exotic and collector cars from inside the operation that moves them. Everything a credentialing office needs is on this page.
          </p>
          <p style={{ margin: 0, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", color: "#91918F" }}>
            Last updated {UPDATED}
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px,4vw,64px) clamp(20px,5vw,80px)" }}>

        {/* Masthead */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>01</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>The masthead</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
              <thead>
                <tr>
                  {["Role", "Who", "Contact"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F", borderBottom: "1px solid rgba(255,255,255,.1)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {masthead.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 14px", color: "#91918F", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".1em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.role}</td>
                    <td style={{ padding: "11px 14px", color: "#EDF1F6", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.who}</td>
                    <td style={{ padding: "11px 14px", color: "#00D2BE", fontSize: 13.5, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: "16px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#B4B6B2" }}>
            Original photography and video only. Nothing here is syndicated, aggregated or reposted from another outlet.
          </p>
        </section>

        {/* Audience */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>02</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>Audience</h2>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Verifiable on request, with platform-native screenshots and a downloadable one-page kit.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
              <thead>
                <tr>
                  {["Metric", "Figure", "Source"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F", borderBottom: "1px solid rgba(255,255,255,.1)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audience.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 14px", color: "#B4B6B2", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.metric}</td>
                    <td style={{ padding: "11px 14px", color: "#F2C94C", fontWeight: 700, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 15, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.figure}</td>
                    <td style={{ padding: "11px 14px", color: "#91918F", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Coverage */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>03</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>What gets covered</h2>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            The beat is the part of car culture that happens before the cameras usually arrive — transport and logistics, condition and intake, the practical detail of living with these cars, and the rooms where people stand next to them.
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {coverage.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 15, lineHeight: 1.55, color: "#C4CBD6" }}>
                <span style={{ color: "#00D2BE", flexShrink: 0, marginTop: 2 }}>&#8212;</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Requesting a credential */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>04</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>Requesting a credential from us</h2>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Bringing us to your event, or offering a vehicle loan? DM @PaddockGavin with the date, the location and what access is on offer. Assignment letters on publication letterhead, a W-9, certificates of insurance and prior credential history are all available on request, same day.
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.6, color: "#91918F", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>
            What a credentialing office typically needs:
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
              <thead>
                <tr>
                  {["Item", "Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F", borderBottom: "1px solid rgba(255,255,255,.1)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {credentialChecklist.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 14px", color: "#C4CBD6", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.item}</td>
                    <td style={{ padding: "11px 14px", color: row.status.startsWith("On") || row.status.startsWith("Available") ? "#00D2BE" : "#91918F", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".06em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Editorial standards */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>05</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>Editorial standards</h2>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {standards.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 15.5, lineHeight: 1.55, color: "#C4CBD6" }}>
                <span style={{ color: "#00D2BE", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ margin: "20px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#B4B6B2" }}>
            Vehicles photographed at duPont REGISTRY appear with my employer&apos;s permission, in my capacity as their Lot Operations and Events Manager. Their inventory and facility are theirs. That relationship is disclosed everywhere it is relevant rather than left for someone to discover.
          </p>
        </section>

        {/* Assets */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>06</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>Assets for publication</h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Logos, headshots, a one-page media kit and high-resolution stills are available for editorial use when covering PaddockGavin, Supercar IQ™, Tires &amp; Timepieces™ or The Gloss Game™. Ask and they are sent within the day.
          </p>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Use of those assets is for coverage of us. It is not a licence to the wider library — that is on the{" "}
            <Link href="/legal/trademarks" style={{ color: "#00D2BE", textDecoration: "none" }}>intellectual property page</Link>.
          </p>
        </section>

        {/* CTA */}
        <div
          style={{
            background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
            backdropFilter: "blur(22px) saturate(155%)",
            WebkitBackdropFilter: "blur(22px) saturate(155%)",
            border: "1px solid rgba(255,255,255,.11)",
            borderLeft: "3px solid #00D2BE",
            padding: "clamp(24px,3vw,40px)",
            marginBottom: 40,
          }}
        >
          <p style={{ margin: "0 0 6px", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#91918F" }}>
            Get in touch
          </p>
          <p style={{ margin: "0 0 20px", fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", color: "#FFFFFF" }}>
            Credentialing us for your event?
          </p>
          <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.6, color: "#C4CBD6" }}>
            Send the date, the location and what access is on offer. Assignment letters, a W-9, certificates of insurance and prior credential history are all available the same day.
          </p>
          <a
            href="https://ig.me/m/PaddockGavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "13px 28px",
              background: "#00D2BE",
              color: "#00302B",
              fontFamily: "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif",
              fontWeight: 800,
              fontSize: 13.5,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Start the conversation
          </a>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 8 }}>
          <Link href="/" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>&larr; Home</Link>
          <Link href="/partner" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>Brand partnerships &rarr;</Link>
        </div>
      </div>
    </main>
  )
}
