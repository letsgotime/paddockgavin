import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PGE, PGEEyebrow } from "@/components/pge-brand"

/* Sourced entirely from the GoTime Motorsports event summaries for editions 2
   and 3, supplied by Gavin on 2026-09-07. Nothing here is estimated.

   The client is deliberately unnamed. Those summaries were written for the
   client and are marked confidential, and GoTime's own outward sales deck
   described them as "Authorized Patek Philippe, Rolex, & Fine Jewelry Store"
   rather than by name. This page follows that precedent. For the same reason
   it carries none of the client's business results, none of the advertising
   spend, and no photograph with the jeweler's signage in it. */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)"

/* Set this when the next date is confirmed and the page starts announcing it.
   Until then the page says the date is not set, which is true. */
/* Sunday, not the Saturday the first two ran on. Confirmed by Gavin on
   7 September, and the page says the day out loud so nobody assumes. */
const NEXT: { date: string; place: string; href: string } | null = {
  date: "Sunday 6 December 2026",
  place: "Scottsdale, Arizona",
  href: "https://ig.me/m/itspaddockgavin",
}

const EDITIONS = [
  {
    n: "Two",
    date: "Saturday 13 May 2023",
    people: "500+",
    cars: "130",
    value: "$45M+",
    reach: "17 cities across Arizona and California",
    note: "The weekend before Mother’s Day, so the watch side ran Tudor.",
  },
  {
    n: "Three",
    date: "Saturday 28 October 2023",
    people: "1,500",
    cars: "190+",
    value: "$59M+",
    reach: "20 cities across Arizona and California",
    note: "It ran before the holidays, with three times the spring crowd.",
  },
]

/* Every car below is named in the display register for one of the two
   editions, with the build numbers as the register recorded them. */
const CARS = [
  { car: "Ferrari Enzo", price: "$4M+", note: "1 of 399, and 1 of 7 in Giallo Yellow" },
  { car: "Aston Martin One-77", price: "$3.5M", note: "1 of 77" },
  { car: "Ferrari F40", price: "$3M", note: "1 of 1,311" },
  { car: "Aston Martin DB5", price: "$3M", note: "The Goldfinger car. 1 of 1,059" },
  { car: "Porsche Carrera GT", price: "$2M", note: "1 of 1,270" },
  { car: "Lamborghini Aventador SVJ", price: "$900k", note: "Three of them, from a run of 800" },
  { car: "Lexus LFA", price: "$875k", note: "1 of 500" },
  { car: "Ferrari SF90", price: "$800k", note: "6 of 699" },
  { car: "Lamborghini Ultimae", price: "$700k", note: "1 of 350" },
  { car: "McLaren 765LT", price: "$670k", note: "Four of them, two the 300-run Spider" },
  { car: "Lamborghini Countach", price: "$650k", note: "1 of 2,000" },
  { car: "Lamborghini Murciélago", price: "$650k", note: "1 of 4,099" },
  { car: "Rolls-Royce Phantom", price: "$535k", note: "Bespoke Hermès orange interior" },
  { car: "Ferrari 812 Superfast", price: "$400k", note: "Four of them, from a run of 999" },
  { car: "Ferrari 296 GTS", price: "$400k", note: "Its first public unveiling" },
  { car: "Rolls-Royce Ghost", price: "$425k", note: "Black Badge, in Tiffany paint" },
]

const CREDITS = [
  { role: "On the cars", who: "Scottsdale Ferrari, Scottsdale Lamborghini, Highline Autos" },
  { role: "In the car park", who: "Blue House Coffee, Pearl’s Mini Donuts, DJ Joel Avena, The Lavatory" },
  { role: "Along the row", who: "Secured Sneakers, The NOW, Hydrate, Nektar, EVO, Leverage Wines, Evans Furs, Sante" },
]

export const metadata: Metadata = {
  title: "Tires & Timepieces",
  description:
    "An early morning of cars and watches in a Scottsdale jeweler’s car park. Gates open at half past seven, it’s done by ten, and anybody can walk in for free. The next one is Sunday 6 December 2026.",
  openGraph: {
    title: "Tires & Timepieces",
    description:
      "Cars and watches in a Scottsdale jeweler’s car park, early on a weekend morning, free to walk in. From PaddockGavin Events.",
    url: "https://paddockgavin.com/events/tires-and-timepieces",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tires and Timepieces" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

function Eyebrow({ children, tone = PGE.teal }: { children: React.ReactNode; tone?: string }) {
  return (
    <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".2em", textTransform: "uppercase", color: "#B4B6B2" }}>
      <i aria-hidden="true" style={{ width: 22, height: 2, background: tone, flex: "0 0 auto" }} />
      {children}
    </p>
  )
}

export default function TiresAndTimepiecesPage() {
  return (
    <>
      <PageBackdrop src="/images/tt/tt-night.webp" opacity={0.22} />
      <SiteNav />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1080, margin: "0 auto", padding: "clamp(16px,3vw,28px) clamp(12px,4vw,40px) clamp(60px,8vw,110px)", display: "flex", flexDirection: "column", gap: "clamp(44px,6vw,84px)" }}>

        {/* Hero: the morning, not the money */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vw,26px)" }}>
          <PGEEyebrow>PaddockGavin Events &middot; Scottsdale</PGEEyebrow>
          <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.026em", color: "#FFFFFF", textWrap: "balance" }}>
            Tires &amp; Timepieces
          </h1>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            A jeweler in Scottsdale that sells Patek Philippe and Rolex lent us its car park for a
            morning, twice. We filled it with cars, opened the gates at half past seven, and anybody
            could walk in. By ten it was over and the street was empty again.
          </p>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            Every ticket has been free.{" "}
            {NEXT ? (
              <>
                The next one is <a href="#next" className="pg-textlink">{NEXT.date}</a>.
              </>
            ) : null}
          </p>

          <div className="pg-e2" style={{ position: "relative", aspectRatio: "2 / 1", overflow: "hidden", clipPath: NOTCH, marginTop: 6 }}>
            <Image src="/images/tt/tt-aerial.webp" alt="Looking down on the event: cars parked along both sides of the street and people walking between them" fill sizes="(max-width: 900px) 100vw, 1080px" style={{ objectFit: "cover" }} priority />
          </div>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#848482" }}>
            The October 2023 edition, from above.
          </p>
        </section>

        {/* What the morning was */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow>Two and a half hours</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
            What you get when you walk in
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.62, color: "#C4CBD6", maxWidth: "62ch" }}>
            <p style={{ margin: 0 }}>
              Free coffee from Blue House and hot donuts from Pearl&rsquo;s at the gate. A DJ under
              the awning. Further down the row you could get a massage or a B-12 shot, or try on
              sneakers.
            </p>
            <p style={{ margin: 0 }}>
              The shopping was never the point. If you had only seen an F40 on a screen, you could
              stand a foot away from one and ask the owner what it&rsquo;s like to drive. Most of
              the owners were right there, and happy to tell you.
            </p>
          </div>
        </section>

        {/* The record */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow>So far</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            Two editions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "clamp(12px,1.6vw,18px)" }}>
            {EDITIONS.map((e) => (
              <div key={e.n} className="pg-e1" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "clamp(18px,2.4vw,26px)", clipPath: NOTCH }}>
                <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".18em", textTransform: "uppercase", color: PGE.teal }}>
                  Edition {e.n}
                </p>
                <p style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.16, letterSpacing: "-.018em", color: "#FFFFFF" }}>
                  {e.date}
                </p>
                <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "1fr auto", gap: "9px 16px", fontFamily: ARCHIVO, fontSize: 15.5, color: "#C4CBD6" }}>
                  {[["People through", e.people], ["Cars on display", e.cars]].map(([k, v]) => (
                    <div key={k} style={{ display: "contents" }}>
                      <dt style={{ margin: 0, color: "#9AA4B2" }}>{k}</dt>
                      <dd style={{ margin: 0, fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "#EDF1F6" }}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15, lineHeight: 1.55, color: "#9AA4B2" }}>
                  People came from {e.reach}. {e.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next */}
        <section id="next" style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)", scrollMarginTop: 120 }}>
          <Eyebrow>The next one</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            {NEXT ? "It’s on the calendar" : "It’s coming back"}
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            {NEXT
              ? `The next Tires and Timepieces is ${NEXT.date}, in ${NEXT.place}. It’s a Sunday this time, not a Saturday. Gates open at half past seven, it’s done by ten, and spectating is still free.`
              : "The next date is being set, and it posts here first. Spectating stays free. If you want to know when, or you have a car for the field below, message me."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center" }}>
            <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
              Tell me you want in
            </a>
            <Link href="/events" className="pg-textlink">Every event</Link>
            <Link href="/partner" className="pg-textlink">Sponsor one</Link>
          </div>
        </section>

        {/* The field: the register, kept as proof, below the fold */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vw,26px)" }}>
          <Eyebrow tone="#4BA3DE">The display register</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF", textWrap: "balance" }}>
            The field
          </h2>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            These are some of the cars from the register for both editions, with build numbers as
            recorded. The register valued the spring field at more than $45 million and the October
            field at more than $59 million.
          </p>
          <div className="pg-e2" style={{ position: "relative", aspectRatio: "16 / 11", overflow: "hidden", clipPath: NOTCH }}>
            <Image src="/images/tt/tt-enzo.webp" alt="A Giallo Yellow Ferrari Enzo with both doors up, parked on the street at Tires and Timepieces" fill sizes="(max-width: 900px) 100vw, 1080px" style={{ objectFit: "cover", objectPosition: "center 55%" }} />
          </div>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#848482" }}>
            Ferrari Enzo. One of 399 built, and one of seven finished in this yellow.
          </p>
          <div className="pg-e1" style={{ clipPath: NOTCH, padding: "clamp(6px,1vw,10px) clamp(14px,2vw,22px)" }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {CARS.map((c, i) => (
                <li key={c.car} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 14px", padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.09)" }}>
                  <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16.5, color: "#EDF1F6", flex: "1 1 auto", minWidth: 0 }}>{c.car}</span>
                  <span style={{ fontFamily: MONO, fontSize: 14, fontVariantNumeric: "tabular-nums", color: "#B4B6B2", flex: "0 0 auto" }}>{c.price}</span>
                  <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#9AA4B2", flex: "1 0 100%" }}>{c.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))", gap: "clamp(10px,1.4vw,16px)" }}>
            {[
              { src: "/images/tt/tt-one77.webp", alt: "An Aston Martin One-77 on the street at Tires and Timepieces", ratio: "3 / 4" },
              { src: "/images/tt/tt-turbo.webp", alt: "A Porsche 911 Turbo S parked in the row", ratio: "3 / 4" },
              { src: "/images/tt/tt-street.webp", alt: "People walking the row of cars along the street", ratio: "3 / 4" },
            ].map((g) => (
              <div key={g.src} className="pg-e0" style={{ position: "relative", aspectRatio: g.ratio, overflow: "hidden", clipPath: NOTCH }}>
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 700px) 100vw, 340px" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>

        {/* Credits */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
          <Eyebrow tone="#B4B6B2">Credits</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.022em", color: "#FFFFFF" }}>
            Who made it happen
          </h2>
          <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {CREDITS.map((c) => (
              <div key={c.role} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <dt style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".16em", textTransform: "uppercase", color: "#848482" }}>{c.role}</dt>
                <dd style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 16.5, lineHeight: 1.55, color: "#C4CBD6" }}>{c.who}</dd>
              </div>
            ))}
          </dl>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.6, color: "#9AA4B2", maxWidth: "62ch" }}>
            Tires and Timepieces was produced for an authorized Patek Philippe and Rolex jeweler in
            Scottsdale, by PaddockGavin, then trading as GoTime Motorsports.
          </p>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
