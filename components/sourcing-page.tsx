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
export interface SourcingPageProps {
  path: string
  eyebrow: string
  h1: string
  lead: string
  backdrop: string
  steps: { title: string; body: string }[]
  nashville: string
  faqs: Faq[]
  related: { href: string; label: string; note: string }[]
}

/**
 * One page per phrase people type. Each page is one lane of the same
 * business, in that lane's words, and every one of them ends at the intake.
 * The FAQ is real questions from the related-search list, answered only
 * with what is true today; the FAQPage markup is the same questions.
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
    serviceType: "Exotic and collector car sourcing and brokering",
    provider: { "@id": `${SITE}/#business` },
    areaServed: { "@type": "City", name: "Nashville", containedInPlace: { "@type": "State", name: "Tennessee" } },
    url: `${SITE}${p.path}`,
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqLd, serviceLd]) }} />
      <SiteNav active="intake" />
      <PageBackdrop src={p.backdrop} opacity={0.18} />

      <div className="pg-stage" style={{ paddingTop: "clamp(18px,3vw,40px)" }}>
        <div className="pg-e2" style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.6vw,44px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: "#F2C94C" }}>{p.eyebrow}</p>
          <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "16ch", textWrap: "balance" as never }}>{p.h1}</h1>
          <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.55, color: "#C4CBD6", maxWidth: "56ch" }}>{p.lead}</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", paddingTop: 6 }}>
            <Link href="/intake" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>Start the intake</Link>
            <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer" className="pg-textlink">or DM @itspaddockgavin</a>
          </div>
        </div>
      </div>

      <div className="pg-stage">
        <Section id="how" eyebrow="How it works" tone="#F2C94C" title="Three steps, and I am on every one of them">
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
            {p.steps.map((s, i) => (
              <li key={s.title} className="pg-e0" style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, padding: "16px 18px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}>
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

      <div className="pg-stage">
        <Section id="nashville" eyebrow="Nashville, Tennessee" tone="#00D2BE" title="Based in Nashville" cta={{ href: "/intake", label: "Start the intake" }} link={{ href: "/cars", label: "The Garage" }}>
          <p style={{ margin: 0 }}>{p.nashville}</p>
        </Section>
      </div>

      <div className="pg-stage">
        <Section id="faq" eyebrow="Before you write" tone="#F2C94C" title="The questions people type on the way in">
          <dl style={{ margin: 0, display: "grid", gap: 10 }}>
            {p.faqs.map((f) => (
              <div key={f.q} className="pg-e1" style={{ padding: "16px 18px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}>
                <dt style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 17, color: "#FFFFFF", marginBottom: 6 }}>{f.q}</dt>
                <dd style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "#C4CBD6" }}>{f.a}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>

      <div className="pg-stage" style={{ paddingTop: 0 }}>
        <nav aria-label="Related" className="pg-also">
          {p.related.map((it) => (
            <Link key={it.href} href={it.href} className="pg-e0" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "14px 16px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6" }}>{it.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>{it.note}</span>
            </Link>
          ))}
        </nav>
      </div>

      <SiteFooter />
    </>
  )
}
