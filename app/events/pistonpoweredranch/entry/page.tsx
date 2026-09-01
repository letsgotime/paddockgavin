import type { Metadata } from "next"
import { ApplyPage } from "../_apply"


/* Copy audited against the concours register on 30 August 2026: no tells from
   the Redline list, no Pebble, Amelia or Monterey, no em or en dashes, every
   number on the page confirmed elsewhere in the plan. This is an audit, not a
   Redline run: the copy has not been back through the tool since it was
   written. */
export const metadata: Metadata = {
  /* Its own address, not the event page's. All three of these inherited
     one canonical from the shared layout, so they told a crawler they
     were the same page and only one of them could ever rank. */
  alternates: { canonical: "https://pistonpoweredranch.com/entry" },
  title: "Enter a Car · The Piston Powered Ranch",
  description:
    "Three hundred places on the field, chosen from Nashville and from collections that travel. Submit a car for The Piston Powered Ranch, Saturday October 10 2026 at Rancho Jaramillo.",
}

export default function Page() {
  return (
    <ApplyPage
      kicker="Enter a car"
      title="Three hundred places. Chosen from Nashville, and from collections that travel."
      lede="Submit your car and you will hear back either way."
      body={[
        "We look for exotics, muscle, and golf carts worth a second look, in two, four or six seats. Trucks and SUVs do not show on this field.",
        "We read every entry ourselves. Photographs help. History helps more.",
      ]}
      img="/images/918-p1.webp"
      focal="center 50%"
      bandImg="/images/ranch/ppr-field.jpg"
      bandFocal="center 45%"
      closeImg="/images/aston-wheel.webp"
      tone="#00D2BE"
      asksHead="What to send"
      asks={[
        { t: "The car", b: "Year, make, model, and what makes this one worth the drive." },
        { t: "Photographs", b: "Exterior and interior, as it sits today." },
        { t: "History", b: "Ownership, restoration, races, anything the field should know." },
        { t: "Who is bringing it", b: "You, or the person who will be standing beside it." },
      ]}
      note="Waiting in silence is its own answer. Every submission gets a reply."
      closeLine="Send it. You will hear back either way."
      cta={{ label: "Submit your car", href: "#apply" }}
      form={{
        kind: "entry",
        head: "Submit your car",
        orgLabel: "Year, make and model",
        askLabel: "Tell us about the car. History helps more than photographs.",
      }}
    />
  )
}
