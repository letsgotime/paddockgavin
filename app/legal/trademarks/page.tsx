import type { Metadata } from "next"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"

export const metadata: Metadata = {
  title: "Trade marks",
  description: "The marks, the work, and what happens when somebody helps themselves. Stated once, clearly, so nobody has to guess.",
}

const UPDATED = "August 2026"

const marks = [
  { mark: "PaddockGavin™", covers: "The brand, this site, the channel, the PG mark", status: "Application in progress" },
  { mark: "Supercar IQ™", covers: "The app, point a phone at a car and it tells you what it is", status: "Application in progress · in development" },
  { mark: "I Got Receipts™", covers: "Format and phrase, in use across content", status: "Application in progress" },
  { mark: "Paddock20™", covers: "The agency, software, automation, marketing", status: "Application in progress" },
  { mark: "GavinBrooksHQ™", covers: "The operator practice, systems and consulting", status: "Application in progress" },
  { mark: "The Gloss Game™", covers: "The book and the method in it", status: "Published · in use" },
  { mark: "Tires & Timepieces™", covers: "The car and watch show", status: "In use" },
  { mark: "The Scoreboard™", covers: "The format, the status system, and the way builds are displayed and scored", status: "Application in progress" },
]

const canDo = [
  "Link to anything here, anywhere, as much as you like.",
  "Share a post through the platform's own share or repost button, with attribution intact.",
  "Quote a short passage with credit and a link, for commentary, criticism or news.",
  "Embed a clip using the platform's embed code, unaltered.",
  "Screenshot something to talk about it, with the mark left on.",
]

const willGetLetter = [
  "Re-uploading photos or video as your own content.",
  "Removing, cropping or covering a watermark.",
  "Any commercial use, ads, products, dealer listings, a marketplace post, without written permission.",
  "Training a model on this library.",
  "Using the marks or the PG logo to suggest I made, endorsed or partnered on something I did not.",
  "Scraping the site wholesale.",
  "Copying the Scoreboard format, the design system or the code.",
]

export default function TrademarksPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#B4B6B2",
        fontFamily: "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <PageBackdrop src="/images/f458-extinguisher.webp" pos="center 40%" opacity={0.2} />
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,.1)",
          padding: "clamp(48px,6vw,88px) clamp(20px,5vw,80px) clamp(32px,4vw,56px)",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p
            style={{
              margin: "0 0 18px",
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 11.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#91918F",
            }}
          >
            Legal &middot; Intellectual Property
          </p>
          <h1
            style={{
              margin: "0 0 18px",
              fontWeight: 900,
              fontSize: "clamp(32px,5vw,56px)",
              letterSpacing: "-.025em",
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
          >
            Everything here{" "}
            <span style={{ color: "#F2C94C" }}>has an owner</span>
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: 17, lineHeight: 1.6, color: "#C4CBD6", maxWidth: 640 }}>
            The marks, the work, and what happens when somebody helps themselves. Stated once, clearly, so nobody has to guess.
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12,
              letterSpacing: ".14em",
              color: "#91918F",
            }}
          >
            Last updated {UPDATED}
          </p>
        </div>
      </header>

      <div className="pg-e1" style={{ maxWidth: 820, margin: "clamp(20px,3vw,36px) auto", padding: "clamp(28px,4vw,56px) clamp(20px,5vw,64px)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)" }}>

        {/* 01 The marks */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>01</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>The marks</h2>
          </div>
          <p style={{ margin: "0 0 24px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            These are mine. Each is in use in commerce, and applications are in progress with the United States Patent and Trademark Office.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
              <thead>
                <tr>
                  {["Mark", "What it covers", "Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F", borderBottom: "1px solid rgba(255,255,255,.1)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marks.map((m, i) => (
                  <tr key={i}>
                    <td style={{ padding: "12px 14px", color: "#EDF1F6", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,.06)", whiteSpace: "nowrap" }}>{m.mark}</td>
                    <td style={{ padding: "12px 14px", color: "#C4CBD6", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{m.covers}</td>
                    <td style={{ padding: "12px 14px", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".08em", color: "#00D2BE", borderBottom: "1px solid rgba(255,255,255,.06)", whiteSpace: "nowrap" }}>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: "20px 0 0", fontSize: 14, lineHeight: 1.6, color: "#91918F" }}>
            ™, not ®, and that is deliberate. A mark in use carries common-law rights from the day it is used, and ™ is the honest way to claim them while an application is pending. Nothing here is shown as registered until the certificate is in hand.
          </p>
        </section>

        {/* 02 The Scoreboard */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>02</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>The Scoreboard</h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            The Scoreboard is not a list of projects. It is a format: a timing-tower layout where every build carries one real datum, a launch date that counts itself down, where to buy it, or the year it was retired, scored by status and grouped by whether it ships, runs or is finished.
          </p>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            The arrangement, the status vocabulary, the scoring logic and the way it plugs into live data are mine. The idea of listing your projects is not protectable and never claimed to be. This specific layout, these specific states and this scoring format are. Using them without permission is an infringement claim, not a conversation.
          </p>
        </section>

        {/* 03 The work itself */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>03</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>The work itself</h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Every photograph, every clip, every caption, every word of copy, the design system, the colour palette, the component library and the code that runs this site are original work and mine, protected by copyright from the moment they were made.
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Photographs and video made on dealer lots are published with the dealer&apos;s permission. Their inventory and facility are theirs. That relationship is disclosed everywhere it is relevant.
          </p>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Watermarks are copyright management information. Under 17 U.S.C. § 1202, removing or altering them to disguise where a file came from is a violation in its own right, on top of the copying. It carries statutory damages of $2,500 to $25,000 per instance, and unlike ordinary infringement damages it does not require the work to have been registered first. Cropping the mark out is not a workaround. It is a second claim.
          </p>
        </section>

        {/* 04 What you can do */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>04</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>What you can do without asking</h2>
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 0", listStyle: "none" }}>
            {canDo.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 15.5, lineHeight: 1.55, color: "#C4CBD6" }}>
                <span style={{ color: "#00D2BE", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ margin: "20px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#B4B6B2" }}>
            Most people asking whether they can use something are asking in good faith, and the answer is usually yes. DM @itspaddockgavin and ask, it takes a minute and it saves both of us the other kind of conversation.
          </p>
        </section>

        {/* 05 What gets a letter */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>05</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>What gets a letter</h2>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {willGetLetter.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 15.5, lineHeight: 1.55, color: "#C4CBD6" }}>
                <span style={{ color: "#F2C94C", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ margin: "20px 0 0", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            The process is not dramatic. A takedown notice goes to the platform, and the platform acts, because this is what that mechanism is for. Where the use is commercial, or the mark has been taken off, the notice is the first step rather than the only one. Statutory damages under § 1202 do not need a registration and they are counted per instance, which adds up faster than most people expect.
          </p>
        </section>

        {/* 06 Reporting */}
        <section style={{ marginBottom: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", color: "#F2C94C", flexShrink: 0 }}>06</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>Reporting something</h2>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
            Found your own work here without credit? Tell me and I will fix it or take it down, same day. That runs both ways or it is not a principle.
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 14.5, lineHeight: 1.6, color: "#91918F", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", letterSpacing: ".08em", textTransform: "uppercase" }}>
            A notice moves fastest with all of this in it:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {[
              "What was taken, with a link to the original.",
              "Where it is now, with a direct link.",
              "Your name and how to reach you.",
              "A statement that you believe the use is unauthorised.",
              "A statement, under penalty of perjury, that the information is accurate and you are the owner or authorised to act for them.",
              "Your signature, electronic is fine.",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 15, lineHeight: 1.55, color: "#C4CBD6" }}>
                <span style={{ color: "#91918F", flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ margin: "20px 0 0", fontSize: 15, lineHeight: 1.6, color: "#C4CBD6" }}>
            Send it to DM @itspaddockgavin. Copyright and trade mark notices get answered before anything else in the inbox.
          </p>
        </section>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 8 }}>
          <Link href="/" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>&larr; Home</Link>
          <Link href="/legal/terms" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>Terms &rarr;</Link>
          <Link href="/legal/privacy" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>Privacy &rarr;</Link>
        </div>
      </div>
    </main>
  )
}
