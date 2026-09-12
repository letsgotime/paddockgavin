import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* The first entry in this format. Gavin's call, 2026-09-12: rebrand the
   source material as a PaddockGavin Vehicle Feature, use every photo, and
   blur the build plate's serial number and configuration codes rather than
   cut the photo entirely, since the owner has no objection to it running.

   Sourced from a spec deck built while Gavin worked lot operations at a
   dealership, before that role ended 4 September. The car passed through
   the lot; it was never his, so nothing here claims otherwise and it does
   not appear in the personal garage at /cars. Every fact below is true of
   the model as Ferrari built it, not of this specific unit: no chassis
   number, no client name, no dealership name. The source deck carried
   "GoTime Motorsports" and a "Vault Badge" trademark on every page and
   claimed "direct access to duPont Registry Exchange buyers and inventory";
   none of that travels here. */

const TITLE = "The 812 Competizione"
/* Gavin is naming this entry. TITLE above is a placeholder using the model
   name; swap it for the real title when he has one. Nothing else on the
   page depends on the wording here. */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)"

const SPECS: [string, string][] = [
  ["Engine", "6.5L naturally aspirated V12"],
  ["Power", "819 hp at 9,250 rpm"],
  ["Redline", "9,500 rpm, the highest in any road-going Ferrari"],
  ["Transmission", "7-speed dual-clutch"],
  ["0 to 62 mph", "2.85 seconds"],
  ["Top speed", "211 mph"],
  ["Production", "999 coupés, 599 Aperta convertibles"],
]

const DETAILS = [
  {
    tone: "#F2C94C",
    eyebrow: "Glass delete",
    h: "The rear window is gone",
    body: "Ferrari pulled the rear glass out entirely and put a vented aluminium panel in its place, three pairs of fins pressed straight into the metal. It manages the air coming off the roof instead of showing what is behind it, and it is the one detail a photo does not prepare you for.",
    img: "glass-delete",
    alt: "The vented aluminium rear panel that replaces the glass, seen from above in showroom light",
    caption: "The panel Ferrari uses instead of a window.",
  },
  {
    tone: "#00D2BE",
    eyebrow: "Bonnet architecture",
    h: "A carbon blade over the intakes",
    body: "A fixed carbon fibre blade sits above the front clamshell and steers air over the car instead of into it, with louvres at the fender tops to let the wheel arches breathe. None of it is there to look fast. It is there to keep the front end planted at a top speed most cars never see.",
    img: "bonnet-blade",
    alt: "The carbon fibre air blade fixed above the open bonnet",
    caption: "Fixed, not decorative. It has a job to do at speed.",
  },
  {
    tone: "#4BA3DE",
    eyebrow: "Atelier",
    h: "Built through Ferrari's personalization programme",
    body: "Cars built through Atelier carry paint mixed to sample, stitching in a colour nobody else ordered, and carbon or forged options a standard order sheet does not offer. This one went through that programme. What exactly was chosen is between the buyer and Ferrari; the plate further down records it, and the plate is why the specifics stay off this page.",
    img: "atelier-sill",
    alt: "The ATELIER sill plate reading Personalized with Ferrari",
    caption: "Personalized with Ferrari, on the sill.",
  },
]

export const metadata: Metadata = {
  title: TITLE,
  description:
    "A Ferrari 812 Competizione, one of 999 built with the name, documented off the transporter: the glass-delete rear panel, the naturally aspirated V12 redlined at 9,500 rpm, and the Atelier personalization plate.",
  openGraph: {
    title: TITLE,
    description:
      "One of 999. The rear glass deleted for a vented panel, a V12 that revs to 9,500 rpm, and the build plate that made it one-of-one.",
    url: "https://paddockgavin.com/features/812-competizione",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

function Eyebrow({ children, tone = "#F2C94C" }: { children: React.ReactNode; tone?: string }) {
  return (
    <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".2em", textTransform: "uppercase", color: "#B4B6B2" }}>
      <i aria-hidden="true" style={{ width: 22, height: 2, background: tone, flex: "0 0 auto" }} />
      {children}
    </p>
  )
}

function Photo({ img, alt, ratio, caption }: { img: string; alt: string; ratio: string; caption?: string }) {
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="pg-e0" style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", clipPath: NOTCH }}>
        <Image src={`/images/features/812c/${img}.webp`} alt={alt} fill sizes="(max-width: 900px) 100vw, 1080px" style={{ objectFit: "cover" }} />
      </div>
      {caption && (
        <figcaption style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#848482" }}>{caption}</figcaption>
      )}
    </figure>
  )
}

export default function Page() {
  return (
    <>
      <PageBackdrop src="/images/features/812c/backdrop.webp" opacity={0.16} />
      <SiteNav />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1080, margin: "0 auto", padding: "clamp(16px,3vw,28px) clamp(12px,4vw,40px) clamp(60px,8vw,110px)", display: "flex", flexDirection: "column", gap: "clamp(44px,6vw,84px)" }}>

        {/* Hero */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vw,26px)" }}>
          <Eyebrow>PaddockGavin Vehicle Feature</Eyebrow>
          <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.026em", color: "#FFFFFF", textWrap: "balance" }}>
            {TITLE}
          </h1>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            A transporter backed up to the bay with an 812 Competizione on the top deck, one of 999
            built with the name. It was not mine. It came through while I was running lot operations,
            and this is what it looked like up close before it went anywhere.
          </p>
          <Photo img="cover" alt="A car transporter backed up to the bay, ramp down, empty before the reveal" ratio="16 / 10" caption="Before the doors opened." />
        </section>

        {/* The reveal */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#00D2BE">The reveal</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
            It arrived with the rear glass deleted
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            Ferrari had pulled the rear glass out entirely and put a vented aluminium panel in its
            place, three pairs of fins pressed straight into the metal. That does not read from a
            photo of a truck. Standing behind the car, it is the first thing you notice.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            <Photo img="reveal-wide" alt="The 812 Competizione on the transporter's top deck, seen from below and behind" ratio="3 / 4" />
            <Photo img="reveal-close" alt="A closer view of the car coming off the transporter, rear glass replaced with the vented panel" ratio="3 / 4" />
          </div>
          <Photo img="side-profile" alt="A side profile of the car on the transporter's ramp, outdoors in full sun" ratio="16 / 10" caption="Off the ramp, in full sun." />
        </section>

        {/* The numbers */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow>The numbers</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            What Ferrari built, not what this one has
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            These figures describe the 812 Competizione as a model. They say nothing about the
            specific car in these photos, which is the point.
          </p>
          <div className="pg-e1" style={{ clipPath: NOTCH, padding: "clamp(6px,1vw,10px) clamp(14px,2vw,22px)" }}>
            <dl style={{ margin: 0 }}>
              {SPECS.map(([k, v], i) => (
                <div key={k} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 18px", padding: "13px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.09)" }}>
                  <dt style={{ margin: 0, fontFamily: MONO, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#9AA4B2", flex: "0 0 180px" }}>{k}</dt>
                  <dd style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6", flex: "1 1 auto" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* What makes it different */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,4vw,44px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Eyebrow tone="#4BA3DE">What makes it different</Eyebrow>
            <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
              Three things a spec sheet undersells
            </h2>
          </div>
          {DETAILS.map((d) => (
            <div key={d.h} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "clamp(16px,2.6vw,32px)", alignItems: "center" }} className="pg-detail-row">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Eyebrow tone={d.tone}>{d.eyebrow}</Eyebrow>
                <h3 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.14, letterSpacing: "-.018em", color: "#FFFFFF" }}>{d.h}</h3>
                <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 16.5, lineHeight: 1.6, color: "#C4CBD6" }}>{d.body}</p>
              </div>
              <Photo img={d.img} alt={d.alt} ratio="4 / 3" caption={d.caption} />
            </div>
          ))}
        </section>

        {/* Inside */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#F2C94C">Inside</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            A cockpit built around the redline
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            The tachometer sits dead centre, white-faced, and everything either side of it is a
            touch control or a paddle. Ferrari's own logic: nothing critical is more than a thumb
            away from the wheel.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            <Photo img="wheel-wide" alt="The carbon fibre steering wheel, instrument cluster visible behind it" ratio="4 / 5" />
            <Photo img="dash-cluster" alt="A closer view of the instrument cluster and its white-faced tachometer" ratio="4 / 5" />
          </div>
        </section>

        {/* Up close */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#00D2BE">Up close</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            The V12, and the hardware underneath it
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            No turbocharger anywhere near it, and a redline higher than any road-going Ferrari has
            carried. Underneath, forged wheels and carbon ceramic rotors do the stopping.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            <Photo img="v12" alt="The naturally aspirated V12 engine, red cam covers visible under the open bonnet" ratio="4 / 3" caption="6.5 litres, no turbo, 9,500 rpm." />
            <Photo img="brake-detail" alt="A forged wheel and carbon ceramic brake rotor, low angle" ratio="4 / 3" caption="Forged wheel, carbon ceramic rotor." />
          </div>
        </section>

        {/* The build sheet */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#B4B6B2">The build sheet</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            One plate, and the parts we are not printing
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            Every Atelier car carries a plate like this one, riveted under the boot lid: a serial
            number, the model, and every option chosen against a blank sheet. The car in these
            photos was personalized down to a two-layer paint and a set of forged wheels finished
            to match. The serial number and the full configuration are blurred below. They identify
            one specific car and the person who ordered it, and neither is this page&rsquo;s to publish.
          </p>
          <Photo img="plate-blurred" alt="The Atelier personalization plate, model name and header legible, serial number and configuration blurred" ratio="5 / 3" caption="Ferrari's own record of the build. The number is the owner's, not this page's." />
        </section>

        {/* Where it fits */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#B4B6B2">Where it fits</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            Documented on the lot, not in the garage
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            This car passed through lot operations while I ran it, before that role ended in
            September 2026. It was never mine, so it does not sit in <Link href="/cars" style={{ color: "#00D2BE" }}>the garage</Link>,
            which is the register of what I have actually owned. It sits here instead, under
            PaddockGavin, then trading as GoTime Motorsports, which is who documented it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center" }}>
            <Link href="/lot-ops" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
              How the lot ran
            </Link>
            <Link href="/cars" className="pg-textlink">The garage</Link>
          </div>
        </section>

      </main>

      <style>{`
        @media (max-width: 760px) {
          .pg-detail-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SiteFooter />
    </>
  )
}
