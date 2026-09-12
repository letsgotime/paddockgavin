import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageBackdrop } from "@/components/page-backdrop"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* The index for The Paddock Files. Add an entry here the same day its
   page ships, in the order it should read on this list (newest first). */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"

const ENTRIES = [
  {
    n: "02",
    slug: "singer-964",
    title: "The Singer 964",
    dek: "A 1992 Porsche 911 taken apart and rebuilt by Singer: an Ed Pink-built flat-six, a center-fill fuel cap, and a cabin trimmed to one buyer's own spec.",
    img: "singer964/hero",
  },
  {
    n: "01",
    slug: "812-competizione",
    title: "The 812 Competizione",
    dek: "One of 999. The rear glass deleted for a vented panel, a naturally aspirated V12 that revs to 9,500 rpm, and the build plate that made it one-of-one.",
    img: "812c/reveal-close",
  },
]

export const metadata: Metadata = {
  title: "The Paddock Files",
  description:
    "In-depth features on the cars that come through PaddockGavin: the engineering, the numbers, and the details a spec sheet leaves out.",
  openGraph: {
    title: "The Paddock Files",
    description: "In-depth features on the cars that come through PaddockGavin.",
    url: "https://paddockgavin.com/features",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "The Paddock Files" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function FeaturesIndex() {
  return (
    <>
      <PageBackdrop src="/images/features/812c/backdrop.webp" opacity={0.14} />
      <SiteNav />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1080, margin: "0 auto", padding: "clamp(16px,3vw,28px) clamp(12px,4vw,40px) clamp(60px,8vw,110px)", display: "flex", flexDirection: "column", gap: "clamp(36px,5vw,60px)" }}>

        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)" }}>
          <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: "#9AA4B2" }}>
            <i aria-hidden="true" style={{ width: 24, height: 2, background: "#F2C94C", flex: "0 0 auto" }} />
            PaddockGavin
          </p>
          <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.028em", color: "#FFFFFF", textWrap: "balance" as never }}>
            The Paddock Files
          </h1>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "62ch" }}>
            The cars that come through, looked at properly: what the engineering actually does, the
            real numbers behind the spec sheet, and the one or two details a listing photo never
            shows. Not every car I see gets one. Only the ones worth this much attention do.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,1.8vw,18px)" }}>
          {ENTRIES.map((e) => (
            <Link key={e.slug} href={`/features/${e.slug}`} className="pg-e0" style={{ display: "grid", gridTemplateColumns: "minmax(0,280px) minmax(0,1fr)", clipPath: NOTCH, textDecoration: "none", overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 3", minHeight: 160 }}>
                <Image src={`/images/features/${e.img}.webp`} alt={e.title} fill sizes="(max-width: 700px) 100vw, 280px" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, padding: "clamp(18px,2.6vw,30px)" }}>
                <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#F2C94C" }}>Entry {e.n}</span>
                <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.14, letterSpacing: "-.02em", color: "#FFFFFF" }}>{e.title}</h2>
                <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 15.5, lineHeight: 1.55, color: "#9AA4B2", maxWidth: "58ch" }}>{e.dek}</p>
              </div>
            </Link>
          ))}
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
