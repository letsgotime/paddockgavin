import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageBackdrop } from "@/components/page-backdrop"
import { Section } from "@/components/home-sections"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"
const SITE = "https://paddockgavin.com"

export interface Faq { q: string; a: string }
export interface Lane {
  id: string
  eyebrow: string
  title: string
  lead: string
  steps: { title: string; body: string }[]
  cta: { href: string; label: string }
}
export interface SourcingPageProps {
  path: string
  eyebrow: string
  h1: string
  lead: string
  backdrop: string
  cta: { href: string; label: string }
  secondary: { href: string; label: string }
  photo?: { src: string; alt: string; caption?: string }
  lanes: Lane[]
  faqs: Faq[]
  related: { href: string; label: string; note: string }[]
}

function isExternal(href: string) {
  return href.startsWith("http")
}

/**
 * Buying, selling and consignment on one page, each lane its own section with
 * its own anchor. The FAQ is real questions from the related-search list,
 * answered only with what is true today; the FAQPage markup is the same questions.
 */
export function SourcingPage(p: SourcingPageProps) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.h1,
    serviceType: "Exotic and collector car sourcing, brokering and consignment",
    provider: { "@id": `${SITE}/#business` },
    areaServed: { "@type": "City", name: "Nashville", containedInPlace: { "@type": "State", name: "Tennessee" } },
    url: `${SITE}${p.path}`,
  }
  const primary: React.CSSProperties = { display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqLd, serviceLd]) }} />
      <SiteNav active="broker" />
      <PageBackdrop src={p.backdrop} opacity={0.18} />

      <div className="pg-stage" style={{ paddingTop: "clamp(18px,3vw,40px)" }}>
        <div className="pg-e2" style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.6vw,44px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: "#F2C94C" }}>{p.eyebrow}</p>
          <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "16ch", textWrap: "balance" as never }}>{p.h1}</h1>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.55, color: "#C4CBD6", maxWidth: "56ch" }}>{p.lead}</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", paddingTop: 6 }}>
            {isExternal(p.cta.href)
              ? <a href={p.cta.href} target="_blank" rel="noopener noreferrer" style={primary}>{p.cta.label}</a>
              : <Link href={p.cta.href} style={primary}>{p.cta.label}</Link>}
            <Link href={p.secondary.href} className="pg-textlink">{p.secondary.label}</Link>
          </div>
          <nav aria-label="On this page" style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.1)" }}>
            {p.lanes.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="pg-e0 pg-tap" style={{ padding: "0 16px", fontFamily: MONO, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", textDecoration: "none", clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>
                {l.eyebrow}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {p.photo && (
        <div className="pg-stage" style={{ paddingTop: "clamp(14px,2vw,22px)" }}>
          <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="pg-e1" style={{ position: "relative", overflow: "hidden", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)" }}>
              <Image src={p.photo.src} alt={p.photo.alt} width={2000} height={700} sizes="(max-width: 900px) 100vw, 1080px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            {p.photo.caption && (
              <figcaption style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#848482" }}>
                {p.photo.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      {p.lanes.map((lane) => (
        <div key={lane.id} className="pg-stage" style={{ scrollMarginTop: 90 }} id={lane.id}>
          <Section id={`${lane.id}-lane`} eyebrow={lane.eyebrow} tone="#F2C94C" title={lane.title} cta={lane.cta.href.startsWith("http") ? { ...lane.cta, external: true } : lane.cta}>
            <p style={{ margin: 0 }}>{lane.lead}</p>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {lane.steps.map((s, i) => (
                <li key={s.title} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, padding: "4px 0 18px 16px", borderLeft: "2px solid rgba(242,201,76,.5)" }}>
                  <span style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1, color: "#F2C94C" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span style={{ display: "block", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 17, color: "#FFFFFF", marginBottom: 4 }}>{s.title}</span>
                    <span style={{ display: "block", fontSize: 16, lineHeight: 1.55, color: "#C4CBD6" }}>{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      ))}

      <div className="pg-stage">
        <Section id="faq" eyebrow="Before you write" tone="#00D2BE" title="The questions people ask first">
          <dl className="pg-e1" style={{ margin: 0, display: "grid", padding: "4px 20px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)" }}>
            {p.faqs.map((f, i) => (
              <div key={f.q} style={{ padding: "18px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.09)" }}>
                <dt style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 17, color: "#FFFFFF", marginBottom: 6 }}>{f.q}</dt>
                <dd style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "#C4CBD6" }}>{f.a}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>

      <div className="pg-stage" style={{ paddingTop: 0 }}>
        <nav aria-label="Related" className="pg-also">
          {p.related.map((it) => {
            const style: React.CSSProperties = { display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, minHeight: 44, padding: "14px 2px", borderTop: "1px solid rgba(255,255,255,.12)", textDecoration: "none" }
            const inner = (
              <>
                <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6" }}>{it.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>{it.note}</span>
              </>
            )
            return isExternal(it.href)
              ? <a key={it.href} href={it.href} target="_blank" rel="noopener noreferrer" style={style}>{inner}</a>
              : <Link key={it.href} href={it.href} style={style}>{inner}</Link>
          })}
        </nav>
      </div>

      <SiteFooter />
    </>
  )
}
