import type { Metadata } from "next"
import { ranchShare } from "@/lib/events/ranch-share"
import { ApplyPage, ARCHIVO, MONO, CLIP_SM } from "../_apply"

/* The tent does not exist yet, so there is no real photo of it to show.
   Built typographic rather than forcing a stock or rendered image into a
   page that otherwise runs on real Rancho Jaramillo photography only. */
const TENT_PARTNER = "Mechanics on a Mission"

function TentSponsorBlock() {
  return (
    <section id="tent" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(40px,9vh,96px)" }}>
      <div
        data-r=""
        style={{ position: "relative", border: "1px solid rgba(255,255,255,.16)", borderTop: "4px solid #E5141A", background: "linear-gradient(165deg,rgba(229,20,26,.14),rgba(10,21,35,.6) 55%)", backdropFilter: "blur(16px) saturate(150%)", WebkitBackdropFilter: "blur(16px) saturate(150%)", clipPath: CLIP_SM, padding: "clamp(28px,4.5vw,52px)", display: "grid", gap: 22 }}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#FF1A21" }}>
          Open for the first time
        </span>
        <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(30px,5vw,56px)", lineHeight: 0.98, letterSpacing: "-.026em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "14ch" }}>
          The Hospitality Tent
        </h2>
        <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.9vw,19px)", lineHeight: 1.55, color: "#E7ECF3", maxWidth: "52ch" }}>
          An upscale, shaded room off the show field, built bigger and nicer than anything else general admission opens into. Near the food, in sight of the cars, a place to get out of the heat and stay a while.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "10px 32px", borderTop: "1px solid rgba(255,255,255,.16)", paddingTop: 20 }}>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15, lineHeight: 1.6, color: "#C9D1DB" }}>
            You staff it: your own people, your own product, in the room all day. What a booth gets in a glance, the tent gets over a real conversation, and your name is on it the whole time guests are on the field.
          </p>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15, lineHeight: 1.6, color: "#C9D1DB" }}>
            Built first as the <strong style={{ color: "#FFFFFF" }}>{TENT_PARTNER} Hospitality Tent</strong>, their name on the field they already work every day the show runs.
          </p>
        </div>
        <a
          className="pgGo"
          href="#apply"
          style={{ justifySelf: "start", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#E5141A", color: "#FFFFFF", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}
        >
          Ask about the tent
        </a>
      </div>
    </section>
  )
}


/* Copy audited against the concours register on 30 August 2026: no tells from
   the Redline list, no Pebble, Amelia or Monterey, no em or en dashes, every
   number on the page confirmed elsewhere in the plan. This is an audit, not a
   Redline run: the copy has not been back through the tool since it was
   written. */
export const metadata: Metadata = ranchShare({
  path: "/sponsor",
  title: "Sponsor the Day · The Piston Powered Ranch",
  description:
    "Sponsor The Piston Powered Ranch, October 10 2026 at Rancho Jaramillo: Presenting, Title, Secondary and Supporting positions available.",
})

export default function Page() {
  return (
    <ApplyPage
      kicker="Sponsor the day"
      title="Who you reach"
      lede="Three hundred collector cars. The people who own them. Their families. Several hundred more who came to see what showed up."
      body={[
        "Open pasture an hour south of Nashville, on a working ranch that opens for one Saturday.",
        "Bronze, Silver, Gold and Platinum each carry an allocation of transport, because the cars have to get here and that is the part nobody budgets for. Title sits above them. Community Partner is for those who back the day without a campaign.",
        "Hosted seats sit beside the sponsorship, in two rooms: The Terrace, on the rail above the show field, and The Owner's Table, which goes further out.",
      ]}
      img="/images/ranch/ppr-pasture.jpg"
      focal="center 58%"
      bandImg="/images/ranch/g-cattle.webp"
      bandFocal="center 55%"
      closeImg="/images/ranch/g-bales.webp"
      tone="#E5141A"
      asksHead="Positions"
      asks={[
        { t: "Title Sponsor", b: "The lead position on the field, on the collateral, and at the gate. What it takes is a conversation." },
        { t: "Platinum", b: "Two trucks of transport, and the position on the field that goes with them." },
        { t: "Gold", b: "A whole truck, and a named place in everything that carries the day." },
        { t: "Silver", b: "Two thirds of a truck, and your name on the field." },
        { t: "Bronze", b: "A quarter truck, and the first rung with your name on it." },
        { t: "Community Partner", b: "Backing the day without a campaign, named as such." },
        { t: "Hosted seats", b: "The Terrace: rail-side above the show field, table service and ranch raised Angus. The Owner's Table adds the quiet ride out and time with Oscar. Ask for the details." },
        { t: "Tell us the goal", b: "What you want the day to do for you, and we will build the position around it." },
      ]}
      form={{ kind: "sponsor-application", head: "Tell us what you want the day to do for you.", orgLabel: "Company or brand", askLabel: "What you sell, who you want in front of, and what a win looks like" }}
      closeLine="Every enquiry is answered."
      cta={{ label: "Start the conversation", href: "#apply" }}
      hideMission
      extra={<TentSponsorBlock />}
    />
  )
}
