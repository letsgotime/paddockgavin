import type { Metadata } from "next"
import { ApplyPage } from "../_apply"

export const metadata: Metadata = {
  title: "Enter a Car — The Piston Powered Ranch",
  description:
    "Three hundred places on the field, all of them chosen. Submit a car for The Piston Powered Ranch, Saturday October 10 2026 at Rancho Jaramillo, an hour south of Nashville.",
}

export default function Page() {
  return (
    <ApplyPage
      kicker="Enter a car"
      title="Three hundred places. All of them chosen."
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
      cta={{ label: "Submit your car", href: "https://pistonpoweredranch.com/console/#submit" }}
    />
  )
}
