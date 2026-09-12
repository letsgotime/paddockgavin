import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageBackdrop } from "@/components/page-backdrop"
import { ARCHIVO, MONO, NOTCH, FullBleed, Eyebrow, Frame, PullQuote, DetailSpread, DETAIL_SPREAD_RESPONSIVE_CSS, type DetailBlock } from "@/components/paddock-files"

/* The first entry in The Paddock Files. Gavin's call, 2026-09-12: rebrand
   the source material under this name, use every usable photo, and blur
   the build plate's serial number and configuration codes rather than cut
   the photo entirely, since the owner has no objection to it running.

   Sourced from a spec deck built while Gavin worked lot operations at a
   dealership, before that role ended 4 September. The car passed through
   the lot; it was never his, so nothing here claims otherwise and it does
   not appear in the personal garage at /cars. Every fact below is true of
   the model as Ferrari built it, not of this specific unit: no chassis
   number, no client name, no dealership name, no paint name, no mileage,
   no option-list detail — that is exactly what the plate blur is hiding,
   so it cannot reappear as prose. The source deck carried "GoTime
   Motorsports" and a "Vault Badge" trademark on every page and claimed
   "direct access to duPont Registry Exchange buyers and inventory"; none
   of that travels here.

   The shared layout (FullBleed, Eyebrow, Frame, PullQuote, DetailSpread)
   moved to components/paddock-files.tsx once a second entry made it a real
   pattern rather than a one-off. Anything entry-specific stays here. */

const DIR = "812c"
const TITLE = "The 812 Competizione"
/* Gavin is naming this entry; TITLE is a placeholder using the model name.
   The series name, The Paddock Files, is fixed — swap only TITLE. */

const SPECS: [string, string][] = [
  ["Engine", "6.5L naturally aspirated V12"],
  ["Power", "819 hp at 9,250 rpm"],
  ["Torque", "510 lb-ft at 7,000 rpm"],
  ["Redline", "9,500 rpm, the highest in any road-going Ferrari"],
  ["Transmission", "7-speed dual-clutch"],
  ["Drivetrain", "Rear-wheel drive, four-wheel steering"],
  ["0 to 62 mph", "2.85 seconds"],
  ["0 to 124 mph (est.)", "7.5 seconds"],
  ["Top speed", "211 mph"],
  ["Dry weight", "1,487 kg / 3,278 lb"],
  ["Weight distribution", "49% front, 51% rear"],
  ["Tyres", "Michelin Cup2R"],
  ["Production", "999 coupés, 599 Aperta convertibles"],
]

const DETAILS: DetailBlock[] = [
  {
    tone: "#F2C94C",
    eyebrow: "Glass delete",
    h: "The rear window is gone",
    body: "Ferrari pulled the rear glass out entirely and put a vented aluminium panel in its place, three pairs of fins pressed straight into the metal, a production first for the brand. Ferrari's own figure is roughly 10% more rear downforce than the 812 Superfast carries. It manages the air coming off the roof instead of showing what is behind it, and it is the one detail a photo does not prepare you for.",
    img: "glass-delete",
    alt: "The vented aluminium rear panel that replaces the glass, seen from above in showroom light",
    caption: "The panel Ferrari uses instead of a window.",
    flip: false,
  },
  {
    tone: "#00D2BE",
    eyebrow: "Bonnet architecture",
    h: "A carbon blade over the intakes",
    body: "A fixed carbon fibre blade sits above the front clamshell and steers air over the car instead of into it, with louvres at the fender tops to let the wheel arches breathe. None of it is there to look fast. It is there to keep the front end planted at a top speed most cars never see.",
    img: "bonnet-blade",
    alt: "The carbon fibre air blade fixed above the open bonnet",
    caption: "Fixed, not decorative. It has a job to do at speed.",
    flip: true,
  },
  {
    tone: "#4BA3DE",
    eyebrow: "Atelier",
    h: "Built through Ferrari's personalization programme",
    body: "Cars built through Atelier carry paint mixed to sample, stitching in a colour nobody else ordered, and carbon or forged options a standard order sheet does not offer. This one went through that programme. What exactly was chosen is between the buyer and Ferrari; the plate further down records it, and the plate is why the specifics stay off this page.",
    img: "atelier-sill",
    alt: "The ATELIER sill plate reading Personalized with Ferrari",
    caption: "Personalized with Ferrari, on the sill.",
    flip: false,
  },
]

export const metadata: Metadata = {
  title: `${TITLE} · The Paddock Files`,
  description:
    "A Ferrari 812 Competizione, one of 999 built with the name, documented off the transporter: the glass-delete rear panel, the naturally aspirated V12 redlined at 9,500 rpm, and the Atelier personalization plate.",
  openGraph: {
    title: `${TITLE} · The Paddock Files`,
    description:
      "One of 999. The rear glass deleted for a vented panel, a V12 that revs to 9,500 rpm, and the build plate that made it one-of-one.",
    url: "https://paddockgavin.com/features/812-competizione",
    /* No explicit images array: this route's own opengraph-image.tsx is
       picked up automatically by file convention. Setting images here
       would override that with the site's generic card. */
  },
  twitter: { card: "summary_large_image" },
}

export default function Page() {
  return (
    <>
      <PageBackdrop src={`/images/features/${DIR}/backdrop.webp`} opacity={0.14} />
      <SiteNav />

      {/* Full-bleed hero — the magazine cover */}
      <FullBleed>
        <section style={{ position: "relative", minHeight: "clamp(420px,64vh,720px)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src={`/images/features/${DIR}/reveal-close.webp`} alt="A Ferrari 812 Competizione backed off a transporter, rear glass replaced with a vented panel" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 58%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,12,20,.96) 4%,rgba(6,12,20,.62) 42%,rgba(6,12,20,.14) 72%,rgba(6,12,20,.32) 100%)" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(6,12,20,.5) 0%,transparent 26%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1080, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(18px,4vw,40px) clamp(36px,6vw,64px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
            <Eyebrow dark tone="#F2C94C">The Paddock Files &middot; Entry 01</Eyebrow>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(40px,9vw,92px)", lineHeight: .98, letterSpacing: "-.03em", color: "#FFFFFF", textWrap: "balance" as never, textShadow: "0 2px 28px rgba(0,0,0,.5)" }}>
              {TITLE}
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.55, color: "#DDE3EB", maxWidth: "56ch", textShadow: "0 1px 10px rgba(0,0,0,.55)" }}>
              One of 999. The highest-revving engine Ferrari has ever put in a road car, and by the
              brand&rsquo;s own telling, the last and purest expression of its front-engine V12 before
              the lineup turns hybrid.
            </p>
          </div>
        </section>
      </FullBleed>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 760, margin: "0 auto", padding: "clamp(40px,7vw,84px) clamp(18px,4vw,40px) clamp(60px,8vw,110px)", display: "flex", flexDirection: "column", gap: "clamp(52px,7vw,92px)" }}>

        {/* Opening */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vw,22px)" }}>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(19px,2.4vw,23px)", lineHeight: 1.55, color: "#EDF1F6", fontWeight: 400 }}>
            A transporter backed up to the bay with an 812 Competizione on the top deck. It was not
            mine. It came through while I was running lot operations, and this is what it looked like
            up close before it went anywhere.
          </p>
        </section>

        {/* The reveal — a wide two-up, then a full-bleed breather */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
          <Eyebrow tone="#00D2BE">The reveal</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF", textWrap: "balance" as never }}>
            It arrived with the rear glass deleted
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            Ferrari had pulled the rear glass out entirely and put a vented aluminium panel in its
            place, three pairs of fins pressed straight into the metal. That does not read from a
            photo of a truck. Standing behind the car, it is the first thing you notice.
          </p>
        </section>
      </main>

      <FullBleed style={{ marginTop: "clamp(-8px,-1vw,0px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(420px,100%),1fr))", gap: 3 }}>
          <div style={{ position: "relative", aspectRatio: "4 / 5" }}>
            <Image src={`/images/features/${DIR}/reveal-wide.webp`} alt="The 812 Competizione on the transporter's top deck, seen from below and behind" fill sizes="(max-width: 840px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", aspectRatio: "4 / 5" }}>
            <Image src={`/images/features/${DIR}/side-profile.webp`} alt="A side profile of the car on the transporter's ramp, outdoors in full sun" fill sizes="(max-width: 840px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </FullBleed>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 760, margin: "0 auto", padding: "clamp(52px,7vw,92px) clamp(18px,4vw,40px) 0", display: "flex", flexDirection: "column", gap: "clamp(52px,7vw,92px)" }}>

        <PullQuote>
          &ldquo;It is the highest-revving engine Ferrari has ever put in a road car.&rdquo;
        </PullQuote>

        {/* The numbers */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,24px)" }}>
          <Eyebrow>The numbers</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            What Ferrari built, not what this one has
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            These figures describe the 812 Competizione as a model. They say nothing about the
            specific car in these photos, which is the point.
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
            Figures marked (est.) are enthusiast estimates compiled from public sources, not
            published by Ferrari. This page is not affiliated with, sponsored by, or endorsed by
            Ferrari S.p.A.
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

        {/* Inside */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#F2C94C">Inside</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            A cockpit built around the redline
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            The tachometer sits dead centre, white-faced, flanked by two customizable TFT displays,
            and everything either side of the wheel rim is a touch control or a paddle. It is part
            of what Ferrari calls the Carbon Driver Zone, the same logic as a Formula 1 car: nothing
            critical is more than a thumb away from the wheel.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            <Frame dir={DIR} img="wheel-wide" alt="The carbon fibre steering wheel, instrument cluster visible behind it" ratio="4 / 5" />
            <Frame dir={DIR} img="dash-cluster" alt="A closer view of the instrument cluster and its white-faced tachometer" ratio="4 / 5" />
          </div>
        </section>

        {/* Up close */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#00D2BE">Up close</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            The V12, and the hardware underneath it
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            No turbocharger anywhere near it, and a redline higher than any road-going Ferrari has
            carried. Underneath, forged 20-inch wheels and carbon ceramic rotors do the stopping,
            gripped by brushed aluminium calipers with the Ferrari script cast into them.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            <Frame dir={DIR} img="v12" alt="The naturally aspirated V12 engine, red cam covers visible under the open bonnet" ratio="4 / 3" />
            <Frame dir={DIR} img="brake-detail" alt="A forged wheel and carbon ceramic brake rotor, low angle" ratio="4 / 3" />
          </div>
        </section>

        {/* The build sheet */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#B4B6B2">The build sheet</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            One plate, and the parts we are not printing
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            Every Atelier car carries a plate like this one, riveted under the boot lid: a serial
            number, the model, and every option chosen against a blank sheet. The car in these
            photos was personalized down to a two-layer paint and a set of forged wheels finished
            to match. The serial number and the full configuration are blurred below. They identify
            one specific car and the person who ordered it, and neither is this page&rsquo;s to publish.
          </p>
          <Frame dir={DIR} img="plate-blurred" alt="The Atelier personalization plate, model name and header legible, serial number and configuration blurred" ratio="5 / 3" />
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#848482" }}>
            Ferrari&rsquo;s own record of the build. The number is the owner&rsquo;s, not this page&rsquo;s.
          </p>
        </section>

        {/* Where it fits */}
        <section className="pg-e1" style={{ clipPath: NOTCH, padding: "clamp(26px,4vw,44px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
          <Eyebrow tone="#B4B6B2">Where it fits</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.04, letterSpacing: "-.024em", color: "#FFFFFF" }}>
            Documented on the lot, not in the garage
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>
            This car passed through lot operations while I ran it, before that role ended in
            September 2026. It was never mine, so it does not sit in <Link href="/cars" style={{ color: "#00D2BE" }}>the garage</Link>,
            which is the register of what I have actually owned. It sits here instead, in The
            Paddock Files, under PaddockGavin, then trading as GoTime Motorsports, which is who
            documented it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center" }}>
            <Link href="/lot-ops" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
              How the lot ran
            </Link>
            <Link href="/features" className="pg-textlink">More from The Paddock Files</Link>
            <Link href="/cars" className="pg-textlink">The garage</Link>
          </div>
        </section>

      </main>

      <style>{DETAIL_SPREAD_RESPONSIVE_CSS}</style>

      <SiteFooter />
    </>
  )
}
