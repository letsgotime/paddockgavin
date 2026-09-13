import Image from "next/image"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"
import { getFollowerCount, formatFollowers } from "@/lib/social"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

/**
 * The first screen says who this is. The previous opener was an Instagram
 * caption set as a headline over an empty card that faded in; the H1 was
 * screen-reader only. This one is the one e2 surface on the screen.
 */
export async function HomeHero() {
  const { followers } = await getFollowerCount()
  return (
    <>
      <PageBackdrop src="/images/donuts-floor.webp" />
      <section
        data-sec="intro"
        className="pg-stage"
        style={{ paddingTop: "clamp(18px,3vw,40px)", paddingBottom: "clamp(18px,3vw,36px)" }}
      >
        <div
          className="pg-e2 pg-hero"
          style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden" }}
        >
          <div className="pg-hero-copy">
            <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: "#F2C94C" }}>
              Automotive &middot; Events &middot; Detailing &middot; Tech &middot; Nashville
            </p>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.025em", color: "#FFFFFF", textWrap: "balance" as never }}>
              Closer to the cars.
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.55, color: "#C4CBD6", maxWidth: "52ch" }}>
              Most people only ever see these cars on a screen. I put on days where you can stand next to them, wrote the book on keeping one looking right, and give straight answers if you are thinking of buying one.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", paddingTop: 6 }}>
              <Link href="#wall" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>
                Watch the latest
              </Link>
              <Link href="/cars" className="pg-textlink">The garage</Link>
            </div>
          </div>
          <div className="pg-hero-photo">
            <Image src="/images/gavin-gwagen.webp" alt="Gavin Brooks on the lot" fill priority sizes="(max-width: 800px) 100vw, 44vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
            <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.55),rgba(10,21,35,0) 45%)" }} />
          </div>
        </div>

        {/* Proof strip: the four numbers, once */}
        <dl className="pg-proof pg-e1" style={{ margin: "clamp(14px,2vw,22px) 0 0" }}>
          {[
            { v: "10 Oct", k: "the next open day" },
            { v: "Free",   k: "to come and look" },
            { v: formatFollowers(followers).replace("~", ""), k: "followers" },
          ].map((s) => (
            <div key={s.k} style={{ padding: "14px 16px 12px" }}>
              <dt style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1, letterSpacing: "-.03em", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{s.v}</dt>
              <dd style={{ margin: "6px 0 0", fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".16em", textTransform: "uppercase", color: "#B4B6B2" }}>{s.k}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
