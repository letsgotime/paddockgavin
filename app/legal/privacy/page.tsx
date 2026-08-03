import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy — PaddockGavin",
  description: "What this site collects, who else can see it, how long it is kept, and how to ask for it to be removed.",
}

const UPDATED = "August 2026"

const sections = [
  {
    num: "01",
    heading: "The short version",
    body: [
      "I collect what you type into a form, and nothing else about you personally. I do not sell your information — not to anyone, not ever, at any price. No advertising trackers, no data brokers, no third-party ad pixels. You do not need an account, and there is nothing to log into. Leave a form blank and I have no idea who you are.",
    ],
  },
  {
    num: "02",
    heading: "What a form collects",
    body: [
      "The forms on this site — booking the floor, RSVPing to Creator Day, asking me to find a car, a partnership enquiry — ask for a name, a way to reach you, and whatever you write in the message. That is it. There is no hidden field.",
      "Enquiries reach me by email through Resend, a transactional mail provider. They pass the message through and do not use it for anything of their own. Nothing you send is added to a marketing list, because there is no marketing list.",
    ],
    table: {
      head: ["What", "Why", "How long"],
      rows: [
        ["Your name", "So I know who I am replying to", "Until the conversation is finished, then archived"],
        ["Email, phone or handle", "So I can reply", "Same"],
        ["Your message", "It is the thing you wanted to tell me", "Same"],
        ["Which form, and the date", "So an event RSVP does not get answered as a car enquiry", "Same"],
      ],
    },
  },
  {
    num: "03",
    heading: "What the servers see",
    body: [
      "Like every website, the infrastructure logs technical information: an IP address, a browser type, the page requested, the time. That is Cloudflare, sitting in front of the site to keep it up and to absorb attacks. It is security and delivery, not analytics about you, and I do not use it to build a profile of anybody.",
    ],
    table: {
      head: ["Service", "What it does here", "Its policy"],
      rows: [
        ["Cloudflare", "Hosting, security, video and images", "cloudflare.com/privacypolicy"],
        ["Behold", "Reads my public Instagram posts onto the wall", "behold.so/privacy"],
        ["Resend", "Delivers form enquiries to my inbox", "resend.com/legal/privacy-policy"],
        ["Google Fonts", "Serves the typeface", "policies.google.com/privacy"],
      ],
    },
  },
  {
    num: "04",
    heading: "Cookies",
    body: [
      "This site sets no advertising or tracking cookies. Cloudflare may set a strictly necessary cookie to tell a visitor apart from an attack. There is no consent banner because there is nothing to consent to, and I would rather not put one in your way for the sake of appearances.",
    ],
  },
  {
    num: "05",
    heading: "When you leave",
    body: [
      "Buy the book and you are on Amazon. Buy merchandise and you are on Etsy. Ask about automation and you are on Paddock20. Follow a social link and you are on that platform. Each has its own privacy policy and its own collection, and from the moment you click, theirs applies rather than mine.",
      "Buy a car and duPont collects what a dealer has to — identification, financing details, title paperwork. That is their process on their licence, held under their policy, and I neither receive nor keep it.",
    ],
    table: {
      head: ["Where you land", "Whose policy"],
      rows: [
        ["Amazon — The Gloss Game", "Amazon Privacy Notice"],
        ["Etsy — merchandise", "Etsy Privacy Policy"],
        ["paddock20.com — automation", "Paddock20's policy"],
        ["supercariq.com", "Its own policy at launch"],
        ["Instagram, LinkedIn", "Meta's and LinkedIn's"],
        ["duPont REGISTRY — a vehicle purchase", "duPont REGISTRY's policy"],
      ],
    },
  },
  {
    num: "06",
    heading: "Affiliate links",
    body: [
      "Some outbound links earn a commission if you buy. Those links may carry a tag that tells the seller the visit came from here. It tells them the referral was mine. It does not tell me who you are, and I never see your order.",
    ],
  },
  {
    num: "07",
    heading: "Your say over it",
    body: [
      "Ask me what I hold about you and I will tell you. Ask me to delete it and I will, unless I am required to keep it. Ask me to correct it and I will. There is no form for this and no wait — DM @PaddockGavin and say what you want done.",
      "Tennessee's Information Protection Act took effect on 1 July 2025 and applies to businesses above $25 million in revenue or handling 175,000 Tennessee residents' data. This site is far below both thresholds. The rights above are offered anyway, to everyone, wherever you live.",
    ],
  },
  {
    num: "08",
    heading: "Children",
    body: [
      "This site is not directed at children under 13 and I do not knowingly collect anything from them. If a child has sent something through a form, tell me and it is deleted the same day.",
    ],
  },
  {
    num: "09",
    heading: "Being filmed at an event",
    body: [
      "Donuts with duPont REGISTRY, Creator Day and the rest happen on duPont REGISTRY's floor, and they are photographed. Being there means you may appear in a frame. Your car may appear too. If you would rather not, find me at the event or DM @PaddockGavin with enough detail to identify the shot, and it comes down.",
    ],
  },
  {
    num: "10",
    heading: "Changes, and reaching me",
    body: [
      "If this policy changes the date at the top changes with it, and a material change gets said out loud rather than slipped in. Questions, requests and complaints all go to the same place: DM @PaddockGavin.",
    ],
  },
]

export default function PrivacyPage() {
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
            Legal &middot; Privacy
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
            What I collect,{" "}
            <span style={{ color: "#00D2BE" }}>and what I do with it</span>
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: 17, lineHeight: 1.6, color: "#C4CBD6", maxWidth: 620 }}>
            No account to make, no newsletter you didn&apos;t ask for, and nothing sold to anybody. Here is the whole of it.
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
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-.015em", color: "#FFFFFF" }}>
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
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
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

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 8 }}>
          <Link href="/" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>
            &larr; Home
          </Link>
          <Link href="/legal/terms" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>
            Terms &rarr;
          </Link>
          <Link href="/legal/trademarks" style={{ fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", fontWeight: 700 }}>
            Trade marks &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
