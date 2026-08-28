import type { Metadata } from "next"
import { ApplyPage } from "../_apply"

export const metadata: Metadata = {
  title: "Sponsor the Day — The Piston Powered Ranch",
  description:
    "Title, category exclusive and supporting sponsorship for The Piston Powered Ranch, October 10 2026 at Rancho Jaramillo an hour south of Nashville. A share of every net dollar benefits Community Elementary School.",
}

export default function Page() {
  return (
    <ApplyPage
      kicker="Sponsor the day"
      title="Who you reach"
      lede="Three hundred collector cars. The people who own them. Their families. Several hundred more who came to see what showed up."
      body={[
        "Twelve acres an hour south of Nashville, on a working ranch that opens for one Saturday.",
        "Title sponsorship, category exclusives, and supporting positions are available. Pricing is a conversation, not a rate card, because what a partner needs is rarely what a sheet lists.",
      ]}
      img="/images/ranch/ppr-dusk.jpg"
      focal="center 58%"
      bandImg="/images/donuts-overflow.webp"
      bandFocal="center 55%"
      closeImg="/images/ranch/ppr-walk.jpg"
      tone="#F2C94C"
      asksHead="Positions"
      asks={[
        { t: "Title", b: "The lead position on the field, on the collateral, and at the gate." },
        { t: "Category exclusive", b: "Sole presence in your category for the day. Non dealer." },
        { t: "Supporting", b: "A named place on the field and in everything that carries the day." },
        { t: "Tell us the goal", b: "What you want the day to do for you, and we will build the position around it." },
      ]}
      note="A share of every net dollar goes to Community Elementary School. Your name sits beside that."
      form={{ kind: "sponsor-application", head: "Tell us what you want the day to do for you.", orgLabel: "Company or brand", askLabel: "What you sell, who you want in front of, and what a win looks like" }}
      closeLine="Every enquiry is answered."
      cta={{ label: "Start the conversation", href: "#apply" }}
    />
  )
}
