import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageBackdrop } from "@/components/page-backdrop"
import { ARCHIVO, MONO, NOTCH, FullBleed, Eyebrow, Frame, PullQuote, DetailSpread, DETAIL_SPREAD_RESPONSIVE_CSS, type DetailBlock } from "@/components/paddock-files"

/* The second entry in The Paddock Files. Sourced from a spec deck built
   while Gavin worked lot operations, before that role ended 4 September.
   The car passed through the lot; it was never his, so it does not appear
   in the personal garage at /cars, same as the first entry.

   The source deck put a Ferrari deal's boilerplate under its own numbers:
   "consult an authorized Ford GT representative" and a GoTime Motorsports
   trademark and DM CTA on the closing page. None of that travels here,
   for the same reason it did not on the first entry.

   The deck disagreed with itself on the donor car's model year: 1991 on
   its own typed spec sheet, 1992 on the physical commission plate
   photographed on the car itself (the plate also carries the build
   month and city, kept off this page as unit-specific, the same
   treatment the first entry gave its own plate). The plate is primary
   evidence; the typed sheet is not. This page says 1992. */

const DIR = "singer964"
const TITLE = "The Singer 964"
/* Gavin is naming this entry; TITLE is a placeholder. Swap only this. */

const SPECS: [string, string][] = [
  ["Donor", "1992 Porsche 911 (964 chassis)"],
  ["Programme", "Singer Classic Study"],
  ["Engine", "4.0L air-cooled flat-six, built by Ed Pink Racing Engines"],
  ["Power (est.)", "500 hp at 8,000 rpm"],
  ["Transmission", "6-speed manual"],
  ["Brakes", "Brembo carbon-ceramic"],
  ["Suspension", "Öhlins, adjustable"],
  ["Dry weight (est.)", "~2,400 lb"],
  ["Body", "Targa"],
  ["Paint", "British Racing Green"],
  ["Built", "California"],
]

const DETAILS: DetailBlock[] = [
  {
    tone: "#F2C94C",
    eyebrow: "Fuel filler",
    h: "A center-fill cap, moved for a reason",
    body: "Singer relocated the filler to the middle of the rear deck, a direct nod to the RSR endurance racers, where a center fill lets both sides of the pit crew work the car during a stop. Machined from billet, it does the same job here that it always did: getting fuel in faster, from either side.",
    img: "fuel-cap",
    alt: "The center-fill fuel cap, machined billet, set into the rear deck",
    caption: "Motorsport placement, on a car that will never see a pit lane.",
    flip: false,
  },
  {
    tone: "#00D2BE",
    eyebrow: "The rear",
    h: "A spoiler that moves, an exhaust that centers",
    body: "The rear deck carries a grille lifted straight from the original 911, a spoiler that raises with speed, and dual center-exit exhaust tips set into a bespoke rear valance. Every element is reworked, not replaced outright: the shape stays recognizably a 911, refined rather than redrawn.",
    img: "rear-detail",
    alt: "The rear deck with spoiler raised, dual center-exit exhaust tips, and the Porsche script",
    caption: "Recognizably a 911. Refined, not redrawn.",
    flip: true,
  },
  {
    tone: "#4BA3DE",
    eyebrow: "The cabin",
    h: "Leather, houndstooth, and a signature",
    body: "Hermès-orange leather runs the dash, doors and seats, cut against a burgundy houndstooth check on the seat centers and floor mats. A commission like this is trimmed to the buyer's own spec, the same way the 812 Competizione's Atelier programme works: nobody else has this exact combination, and that is the point of paying for one.",
    img: "interior-wide",
    alt: "The full cabin, orange leather and burgundy houndstooth, steering wheel and gated shifter visible",
    caption: "Cut to one buyer's own spec. Nobody else has this exact car.",
    flip: false,
  },
]

export const metadata: Metadata = {
  title: `${TITLE} · The Paddock Files`,
  description:
    "A 1992 Porsche 911 reimagined by Singer Vehicle Design, documented on the lot: the Ed Pink-built 4.0L flat-six, the center-fill fuel cap, and a cabin trimmed to one buyer's own spec.",
  openGraph: {
    title: `${TITLE} · The Paddock Files`,
    description:
      "A 964-generation 911, taken apart and rebuilt by Singer. British Racing Green over Hermès orange, an Ed Pink flat-six, and a plate signed under the boot lid.",
    url: "https://paddockgavin.com/features/singer-964",
  },
  twitter: { card: "summary_large_image" },
}

export default function Page() {
  return (
    <>
      <PageBackdrop src={`/images/features/${DIR}/the-lot.webp`} opacity={0.14} />
      <SiteNav />

      {/* Full-bleed hero — the magazine cover */}
      <FullBleed>
        <section style={{ position: "relative", minHeight: "clamp(420px,64vh,720px)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src={`/images/features/${DIR}/hero.webp`} alt="A green Singer-reimagined Porsche 911, targa top up, parked in the shop" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 42%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,12,20,.96) 4%,rgba(6,12,20,.62) 42%,rgba(6,12,20,.14) 72%,rgba(6,12,20,.32) 100%)" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(6,12,20,.5) 0%,transparent 26%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1080, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(18px,4vw,40px) clamp(36px,6vw,64px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
            <Eyebrow dark tone="#00D2BE">The Paddock Files &middot; Entry 02</Eyebrow>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(40px,9vw,92px)", lineHeight: .98, letterSpacing: "-.03em", color: "#FFFFFF", textWrap: "balance" as never, textShadow: "0 2px 28px rgba(0,0,0,.5)" }}>
              {TITLE}
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.55, color: "#DDE3EB", maxWidth: "56ch", textShadow: "0 1px 10px rgba(0,0,0,.55)" }}>
              A 1992 Porsche 911 that went to Singer Vehicle Design and came back with almost
              nothing left untouched. British Racing Green outside, Hermès orange in, an Ed
              Pink-built flat-six where the original engine used to be.
            </p>
          </div>
        </section>
      </FullBleed>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 760, margin: "0 auto", padding: "clamp(40px,7vw,84px) clamp(18px,4vw,40px) clamp(60px,8vw,110px)", display: "flex", flexDirection: "column", gap: "clamp(52px,7vw,92px)" }}>

        {/* Opening */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vw,22px)" }}>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(19px,2.4vw,23px)", lineHeight: 1.55, color: "#EDF1F6", fontWeight: 400 }}>
            It was not mine. It sat on the same floor while I was running lot operations, a few
            spots down from an RWB build and an E36 M3 Lightweight, and this is what it looked
            like up close.
          </p>
        </section>

        {/* What Singer actually does */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
          <Eyebrow tone="#00D2BE">What a commission is</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF", textWrap: "balance" as never }}>
            Not a restoration. A second car, from the first one
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            Singer takes a donor 911 from the 964 generation, built between 1989 and 1994, and
            rebuilds it down to the body panels: new carbon fibre skin over the original shape,
            a reworked engine, and an interior trimmed entirely to the buyer&rsquo;s own spec.
            What comes back keeps the silhouette everyone recognizes and almost nothing else
            from the car that went in.
          </p>
        </section>
      </main>

      <FullBleed style={{ marginTop: "clamp(-8px,-1vw,0px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(420px,100%),1fr))", gap: 3 }}>
          <div style={{ position: "relative", aspectRatio: "4 / 5" }}>
            <Image src={`/images/features/${DIR}/front-clean.webp`} alt="Front three-quarter view of the Singer 911, targa top up" fill sizes="(max-width: 840px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", aspectRatio: "4 / 5" }}>
            <Image src={`/images/features/${DIR}/front-wide.webp`} alt="A wider front three-quarter view, other cars visible in the shop behind it" fill sizes="(max-width: 840px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </FullBleed>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 760, margin: "0 auto", padding: "clamp(52px,7vw,92px) clamp(18px,4vw,40px) 0", display: "flex", flexDirection: "column", gap: "clamp(52px,7vw,92px)" }}>

        <PullQuote tone="#00D2BE">
          &ldquo;What comes back keeps the silhouette and almost nothing else from the car that
          went in.&rdquo;
        </PullQuote>

        {/* The numbers */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,24px)" }}>
          <Eyebrow>The numbers</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            What the commission actually specced
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            Figures for this build, drawn from the deck it was documented with. Where a figure
            was not stated to a precision worth repeating as fact, it is marked as an estimate
            rather than presented as certain.
          </p>
          <div className="pg-e1" style={{ clipPath: NOTCH, padding: "clamp(6px,1vw,10px) clamp(16px,2.4vw,26px)" }}>
            <dl style={{ margin: 0 }}>
              {SPECS.map(([k, v], i) => (
                <div key={k} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 18px", padding: "13px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.09)" }}>
                  <dt style={{ margin: 0, fontFamily: MONO, fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#9AA4B2", flex: "0 0 190px" }}>{k}</dt>
                  <dd style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6", flex: "1 1 auto", fontVariantNumeric: "tabular-nums" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 13.5, lineHeight: 1.55, color: "#77828F" }}>
            Figures marked (est.) are estimates from the documentation this build was recorded
            with, not published specifications. This page is not affiliated with, sponsored by,
            or endorsed by Singer Vehicle Design or Porsche AG.
          </p>
        </section>
      </main>

      {/* What makes it different — alternating full-bleed detail spreads */}
      <section style={{ display: "flex", flexDirection: "column", gap: "clamp(4px,1vw,10px)", marginTop: "clamp(40px,6vw,72px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 clamp(18px,4vw,40px) clamp(24px,3.4vw,34px)" }}>
          <Eyebrow tone="#4BA3DE">What makes it different</Eyebrow>
          <h2 style={{ margin: "10px 0 0", fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF", textWrap: "balance" as never }}>
            Three things a spec sheet undersells
          </h2>
        </div>
        {DETAILS.map((d) => <DetailSpread key={d.h} d={d} dir={DIR} />)}
      </section>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 760, margin: "0 auto", padding: "clamp(52px,7vw,92px) clamp(18px,4vw,40px) 0", display: "flex", flexDirection: "column", gap: "clamp(52px,7vw,92px)" }}>

        {/* Up close */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#F2C94C">Up close</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            Three details worth stopping for
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            A door opened onto a cabin that matches the paint outside, brushed metal mirrors set
            against green with the depth of field doing the rest of the talking, and a front
            grille that still looks hand-fitted rather than stamped.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            <Frame dir={DIR} img="door-open" alt="The driver's door open, steering wheel and dash visible against the green paint" ratio="4 / 5" />
            <Frame dir={DIR} img="mirror-dof" alt="A brushed side mirror against the green paint, shallow depth of field" ratio="4 / 5" />
            <Frame dir={DIR} img="vent" alt="The front grille and vent, close on the fit and the hardware" ratio="4 / 5" />
          </div>
        </section>

        {/* On the lot */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#00D2BE">On the lot</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            It was not the only rare thing on the floor
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            An RWB-built 911 sat a few spots down, and an E36 M3 Lightweight was parked in the
            background of half these photos without ever being the subject of one. That is what
            the floor actually looked like most mornings: one car worth stopping for, then
            another one.
          </p>
          <Frame dir={DIR} img="the-lot" alt="The Singer 911 in the foreground with an RWB-built 911 and other cars further back in the shop" ratio="16 / 10" />
        </section>

        {/* The build sheet */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#B4B6B2">The build sheet</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            A plate, screwed in and signed
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            Singer records every commission on a small plate riveted under the boot lid, signed
            rather than stamped. This one names the donor year and the shop it came out of. The
            exact build date and the buyer it was commissioned for are not this page&rsquo;s to
            publish, the same way the 812 Competizione&rsquo;s serial number was not.
          </p>
          <Frame dir={DIR} img="plate" alt="The Singer commission plate, riveted under the boot lid" ratio="5 / 2" />
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#848482" }}>
            Singer&rsquo;s own record of the commission. Signed, not stamped.
          </p>
        </section>

        {/* The trunk */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#4BA3DE">The trunk</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            Quilted leather where a spare tyre used to live
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            The front trunk carries a quilted leather liner in the same orange as the cabin, a
            fitted travel bag, and the car&rsquo;s own documentation, laid in like a piece of luggage
            rather than bolted-down storage.
          </p>
          <Frame dir={DIR} img="trunk" alt="The front trunk, lined in quilted orange leather, with a travel bag and documents" ratio="4 / 3" />
        </section>

        {/* Where it fits */}
        <section className="pg-e1" style={{ clipPath: NOTCH, padding: "clamp(26px,4vw,44px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
          <Eyebrow tone="#B4B6B2">Where it fits</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            Documented on the lot, not in the garage
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            Like the 812 Competizione before it, this car passed through lot operations while I
            ran it, before that role ended in September 2026. It was never mine, so it does not
            sit in <Link href="/cars" style={{ color: "#00D2BE" }}>the garage</Link>, the register
            of what I have actually owned. It sits here instead, in The Paddock Files, under
            PaddockGavin, then trading as GoTime Motorsports, which is who documented it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center" }}>
            <Link href="/lot-ops" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
              How the lot ran
            </Link>
            <Link href="/features/812-competizione" className="pg-textlink">Entry 01, the 812 Competizione</Link>
            <Link href="/features" className="pg-textlink">More from The Paddock Files</Link>
          </div>
        </section>

      </main>

      <style>{DETAIL_SPREAD_RESPONSIVE_CSS}</style>

      <SiteFooter />
    </>
  )
}
