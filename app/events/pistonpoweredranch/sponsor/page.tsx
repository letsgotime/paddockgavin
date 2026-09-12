import type { Metadata } from "next"
import { ranchShare } from "@/lib/events/ranch-share"
import { ApplyPage } from "../_apply"


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
        "Presenting, Title, Secondary and Supporting positions are available, and Community Partner for those who back the day without a campaign. Pricing is a conversation, not a rate card, because what a partner needs is rarely what a sheet lists.",
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
        { t: "Presenting Sponsor", b: "One partner, above the title. The day carries your name." },
        { t: "Title Sponsor", b: "The lead position on the field, on the collateral, and at the gate." },
        { t: "Secondary and Supporting", b: "A named place on the field and in everything that carries the day." },
        { t: "Community Partner", b: "Backing the day without a campaign, named as such." },
        { t: "Hosted seats", b: "The Terrace: a shaded tent, table service and ranch raised Angus. The Owner's Table adds the quiet ride out and time with Oscar. Ask for the details." },
        { t: "Tell us the goal", b: "What you want the day to do for you, and we will build the position around it." },
      ]}
      form={{ kind: "sponsor-application", head: "Tell us what you want the day to do for you.", orgLabel: "Company or brand", askLabel: "What you sell, who you want in front of, and what a win looks like" }}
      closeLine="Every enquiry is answered."
      cta={{ label: "Start the conversation", href: "#apply" }}
      hideMission
    />
  )
}
