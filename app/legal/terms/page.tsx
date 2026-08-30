import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms",
  description: "What you can do with what you find here, what happens when a car changes hands, and which of these things is mine versus my employer's.",
}

const UPDATED = "August 2026"

const sections = [
  {
    num: "01",
    heading: "Who you are dealing with",
    body: [
      "PaddockGavin is Gavin Brooks, of Nashville, Tennessee. Everything published here is published by me personally. By day I am the Lot Operations and Events Manager at duPont REGISTRY in Lebanon, Tennessee. That is an employment relationship, not a partnership, and this website is mine, not theirs.",
      "Some of what you see here happens on duPont REGISTRY's floor, with duPont REGISTRY's cars. Some of it is entirely my own. Each section says which, because blurring the two would be unfair to them and dishonest to you.",
    ],
  },
  {
    num: "02",
    heading: "The content, and permission to be here",
    body: [
      "Photographs and video captured at duPont REGISTRY are made and published with my employer's permission, in my capacity as their employee. That permission runs to me. It does not run to you.",
      "Everything on this site is protected by copyright: the photographs, the video, the writing, the captions, the layout, the code and the design system. You may look at it, link to it, and share a link. You may not copy it, repost it, re-upload it, feed it to a model, or use it in anything commercial without written permission.",
      "The watermark is not decoration. Where a mark appears on an image or a clip, it is copyright management information under 17 U.S.C. § 1202. Removing it, cropping it out or altering it to hide where the file came from is its own violation, separate from the copying. It carries statutory damages of $2,500 to $25,000 per instance, with no requirement that the work be registered first. If you find one of my files with the mark taken off, so will I.",
      "I enforce this. Takedowns go out, and where the use is commercial or the mark has been removed, it does not stop at a takedown. duPont REGISTRY holds and enforces its own rights in its own property, separately and at its own discretion; nothing here speaks for them.",
      "Think a use might be fine? Ask first. DM @PaddockGavin. Most reasonable requests get a yes.",
    ],
  },
  {
    num: "03",
    heading: "Cars, and where a sale begins and ends",
    body: [
      "I am not a licensed dealer and I do not sell cars. What I have is access, and a job that puts me around inventory all day.",
      "If you want a car, I pass you to the sales team at duPont REGISTRY. Every part of the transaction begins and ends with them: the paperwork, the financing, the title, the funds, the delivery. All of it on their dealer licence, under their terms. I am paid by duPont REGISTRY as their employee. There is no broker fee to you.",
      "Nothing on this site is an offer to sell a vehicle, a price quote, or a promise that a particular car is available. Cars move. An offer only exists once duPont REGISTRY puts it in writing.",
    ],
    table: {
      head: ["What", "Who"],
      rows: [
        ["Finding the car, answering questions", "Me"],
        ["The price, the contract, the financing", "duPont REGISTRY"],
        ["Title, funds, delivery, warranty", "duPont REGISTRY"],
        ["Anything that goes wrong with the sale", "duPont REGISTRY — take it to them"],
      ],
    },
  },
  {
    num: "04",
    heading: "What is mine, and where it lives",
    body: [
      "Separate from the day job, these are my own ventures. They are not duPont REGISTRY's, they do not run on their time, and they are governed by the terms of whichever platform they sit on.",
      "Buy the book and Amazon handles the order, the payment and the return. Hire me for automation and the engagement runs through Paddock20 with its own contract. Follow a link from here to any of them and you have left this site — their privacy policy and their terms take over at the click.",
      "Consultation is advice, not a warranty. Cars, paint, coatings, watches and tools are all things that can be damaged by the person handling them. What I tell you is what I would do with my own. What you do with yours is on you.",
    ],
    table: {
      head: ["Mine", "Where it happens", "Whose terms apply"],
      rows: [
        ["The Gloss Game — the book", "Amazon", "Amazon's"],
        ["Merchandise", "Etsy", "Etsy's"],
        ["AI and automation consulting", "paddock20.com", "Paddock20's"],
        ["Detailing consultation", "Arranged directly with me", "These terms"],
        ["Timepiece consultation", "Arranged directly with me", "These terms"],
        ["Garage build and organisation consultation", "Arranged directly with me", "These terms"],
        ["Supercar IQ™", "supercariq.com", "Its own terms at launch"],
      ],
    },
  },
  {
    num: "05",
    heading: "The marks",
    body: [
      "PaddockGavin, Supercar IQ™, I Got Receipts™, Paddock20™, GavinBrooksHQ™ and the PG mark are my trade marks, in use in commerce and with registration in progress. The Scoreboard™ — the format, the status system and the way builds are displayed and scored — is mine as well.",
      "The trade mark page lists all of it in full, with status. Using any of it to suggest I made, endorsed or partnered on something I did not is the one thing here that will get an unfriendly letter rather than a friendly one.",
    ],
  },
  {
    num: "06",
    heading: "Partners, and telling you when I am paid",
    body: [
      "I take brand partnerships and some links here earn a commission. When a post, a page or a clip is paid, gifted or affiliate-linked, it says so, on the piece itself, before you read it. That is the Federal Trade Commission's rule and it is also the deal — the recommendations are worth nothing to you if you cannot tell which ones were bought.",
      "A payment gets someone a fair look. It does not get them a good review. If a product is bad I say so or I say nothing, and I will not run a partnership that requires otherwise.",
    ],
  },
  {
    num: "07",
    heading: "What I cannot promise",
    body: [
      "This site is provided as-is, without warranty of availability, accuracy or fitness for a particular purpose. Specifications, prices, dates and availability change without notice. Advice here is general in nature: it is not a professional inspection, appraisal, valuation or legal opinion. Links to other sites are not endorsements of those sites or their content. To the fullest extent permitted by Tennessee law, I am not liable for indirect or consequential loss arising from use of this site.",
    ],
  },
  {
    num: "08",
    heading: "Events, and being on somebody else's property",
    body: [
      "Donuts with duPont REGISTRY, Creator Day and anything else on that floor takes place at a duPont REGISTRY facility, under their rules and their insurance. Attending means agreeing to those rules and to the site's photography policy. Drive sensibly in the lot. What happens to your car on the way there and back is between you and your insurer.",
    ],
  },
  {
    num: "09",
    heading: "Where a dispute goes",
    body: [
      "These terms are governed by the laws of the State of Tennessee, without regard to conflict-of-law rules. Any dispute belongs in the state or federal courts serving Wilson County or Davidson County, Tennessee, and both of us agree to that.",
      "If a court finds one clause unenforceable, the rest still stands. I may update these terms; the date at the top is the version you are reading, and continuing to use the site is how you accept a change.",
    ],
  },
  {
    num: "10",
    heading: "Reaching a person",
    body: [
      "One inbox, and it is mine. DM @PaddockGavin, or use the form on any page. Copyright and trade mark notices get answered first. The trade mark page lists what to include so it can be acted on straight away.",
    ],
  },
]

export default function TermsPage() {
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
            Legal &middot; Terms
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
            The terms,{" "}
            <span style={{ color: "#F2C94C" }}>in plain English</span>
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: 17, lineHeight: 1.6, color: "#C4CBD6", maxWidth: 620 }}>
            What you can do with what you find here, what happens when a car changes hands, and which of these things is mine versus my employer&apos;s.
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

      {/* Sections */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px,4vw,64px) clamp(20px,5vw,80px)" }}>
        {sections.map((s) => (
          <section
            key={s.num}
            style={{
              marginBottom: "clamp(40px,5vw,64px)",
              paddingBottom: "clamp(40px,5vw,64px)",
              borderBottom: "1px solid rgba(255,255,255,.07)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".2em",
                  color: "#F2C94C",
                  flexShrink: 0,
                }}
              >
                {s.num}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "clamp(18px,2vw,24px)",
                  letterSpacing: "-.015em",
                  color: "#FFFFFF",
                }}
              >
                {s.heading}
              </h2>
            </div>
            {s.body.map((p, i) => (
              <p key={i} style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.65, color: "#C4CBD6" }}>
                {p}
              </p>
            ))}
            {s.table && (
              <div style={{ overflowX: "auto", marginTop: 20 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif",
                    fontSize: 14.5,
                  }}
                >
                  <thead>
                    <tr>
                      {s.table.head.map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                            fontSize: 11,
                            letterSpacing: ".18em",
                            textTransform: "uppercase",
                            color: "#91918F",
                            borderBottom: "1px solid rgba(255,255,255,.1)",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: "11px 14px",
                              color: ci === 0 ? "#EDF1F6" : "#B4B6B2",
                              fontWeight: ci === 0 ? 600 : 400,
                              borderBottom: "1px solid rgba(255,255,255,.06)",
                              verticalAlign: "top",
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {/* Back nav */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 8 }}>
          <Link href="/" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>
            &larr; Home
          </Link>
          <Link href="/legal/privacy" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>
            Privacy policy &rarr;
          </Link>
          <Link href="/legal/trademarks" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>
            Trade marks &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
