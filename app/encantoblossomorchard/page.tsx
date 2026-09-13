import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageBackdrop } from "@/components/page-backdrop"
import { PGEEyebrow } from "@/components/pge-brand"

export const metadata: Metadata = {
  title: "Encanto Blossom Orchard",
  description:
    "An orchard in Shelbyville, Tennessee that PaddockGavin Events is walking as a possible venue. Nothing is booked yet.",
}

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const CLIP_LG = "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)"

export default function EncantoPage() {
  return (
    <>
      <SiteNav active="events" />
      <PageBackdrop src="/images/cullinan-speedway.webp" pos="center 40%" opacity={0.2} />
      <main style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto", padding: "clamp(90px,12vw,140px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: 22 }}>
        <section style={{ position: "relative", minHeight: "clamp(320px,46vh,460px)", border: "1px solid rgba(255,255,255,.12)", clipPath: CLIP_LG, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src="/images/carrera-traffic.webp" alt="Orchard country outside Shelbyville, Tennessee" fill style={{ objectFit: "cover" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 10%,rgba(10,21,35,.45) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,40px)", display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
            <PGEEyebrow>PaddockGavin Events &middot; Shelbyville, TN</PGEEyebrow>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>
              Encanto Blossom
              <br />
              <span style={{ color: "#00D2BE" }}>Orchard</span>
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.56, color: "#E4E9F0", maxWidth: "54ch" }}>
              An orchard we are walking as a possible venue for a future event. Nothing is booked yet, and dates will post here first.
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          {[["Status", "In scoping"], ["Place", "Shelbyville, TN"], ["Dates", "None set"], ["Next", "Site walk"]].map(([k, v]) => (
            <div key={k} style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.55)", padding: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#848482" }}>{k}</span>
              <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6" }}>{v}</span>
            </div>
          ))}
        </section>

        <Link href="/events" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", alignSelf: "flex-start" }}>
          All events
        </Link>
      </main>
      <SiteFooter />
    </>
  )
}
