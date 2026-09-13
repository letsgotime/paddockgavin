import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShopBuy } from "@/components/shop-buy"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PRODUCTS, BRANDS, bySlug, priceRange, buyable, SHOP_MISSION } from "@/lib/shop/catalogue"

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = bySlug(slug)
  if (!p) return { title: "Not found · PaddockGavin" }
  const url = `https://paddockgavin.com/shop/${p.slug}`
  /* The shop carries both marks, so the page names the one the product
     actually wears. A Rancho Jaramillo tee titled "PaddockGavin" is the same
     mixed signal as a ranch email in PaddockGavin gold. */
  const house = BRANDS[p.brand].name
  return {
    title: `${p.name} · ${house}`,
    description: p.blurb,
    alternates: { canonical: url },
    openGraph: { title: p.name, description: p.blurb, url, siteName: house, type: "website" },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = bySlug(slug)
  if (!p) notFound()
  const b = BRANDS[p.brand]
  const price = priceRange(p)
  const live = p.variants.some(buyable)

  /* Product structured data.
   *
   * Without this a product page is a blue link: no price, no availability, no
   * eligibility for a shopping result. The offer is only claimed when a real
   * price exists, because advertising an offer with no amount is the kind of
   * markup that gets a whole domain demoted. */
  const cents = p.variants.map((v) => v.cents).filter((c): c is number => typeof c === "number" && c > 0)
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.blurb,
    brand: { "@type": "Brand", name: b.name },
    url: `https://paddockgavin.com/shop/${p.slug}`,
  }
  if (cents.length) {
    jsonLd.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: (Math.min(...cents) / 100).toFixed(2),
      highPrice: (Math.max(...cents) / 100).toFixed(2),
      offerCount: cents.length,
      availability: "https://schema.org/InStock",
      url: `https://paddockgavin.com/shop/${p.slug}`,
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main style={{ background: "#0A1523", minHeight: "100vh", paddingTop: 96 }}>
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
          <Link
            href="/shop"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#7f8a99",
              textDecoration: "none",
            }}
          >
            &larr; The shop
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(340px,100%),1fr))",
              gap: "clamp(22px,3.5vw,46px)",
              margin: "22px 0 0",
              alignItems: "start",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.13)",
                background: p.backdrop
                  ? `linear-gradient(rgba(10,21,35,.6),rgba(10,21,35,.84)), url(${p.backdrop}) center/cover`
                  : "#111C2B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 30,
              }}
            >
              <span
                style={{
                  font: `900 clamp(26px,3.6vw,40px)/1.06 ${ARCHIVO}`,
                  letterSpacing: "-.028em",
                  color: b.accent,
                  textAlign: "center",
                }}
              >
                {p.name}
              </span>
            </div>

            <div>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: b.accent,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {b.name} &middot; {p.kind}
              </p>
              <h1
                style={{
                  font: `900 clamp(30px,4.6vw,50px)/1.03 ${ARCHIVO}`,
                  letterSpacing: "-.032em",
                  color: "#EDF1F6",
                  margin: "12px 0 0",
                }}
              >
                {p.name}
              </h1>
              <p style={{ margin: "12px 0 0", font: `400 17px/1.6 ${ARCHIVO}`, color: "#A9B4C2" }}>
                {p.blurb}
              </p>

              <p
                style={{
                  margin: "18px 0 0",
                  font: `800 24px/1 ${ARCHIVO}`,
                  color: live ? "#EDF1F6" : "#7f8a99",
                }}
              >
                {price ?? "Not on sale yet"}
              </p>

              {/* One button per variant rather than a select plus a button. Print
                  on demand means every size is its own payment link anyway, and
                  a disabled control that says why beats a live one that fails. */}
              <ShopBuy product={p} accent={b.accent} />

              {!live && (
                <p style={{ margin: "13px 0 0", font: `400 14px/1.6 ${ARCHIVO}`, color: "#7f8a99" }}>
                  The artwork is finished. This goes on sale as soon as the payment link is in, and
                  it will not carry a price until that price is real.
                </p>
              )}

              <div style={{ margin: "26px 0 0", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 20 }}>
                {p.body.map((t, i) => (
                  <p key={i} style={{ margin: i ? "12px 0 0" : 0, font: `400 15.5px/1.65 ${ARCHIVO}`, color: "#A9B4C2" }}>
                    {t}
                  </p>
                ))}
                {p.madeToOrder && (
                  <p style={{ margin: "16px 0 0", font: `400 13.5px/1.6 ${ARCHIVO}`, color: "#7f8a99" }}>
                    Made to order, so nothing sits in a box waiting to be thrown away. Allow around
                    two weeks. Ordering by the last week of September puts it on the field with you.
                  </p>
                )}
                <p style={{ margin: "16px 0 0", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.12)", font: `400 13.5px/1.6 ${ARCHIVO}`, color: "#9FAAB8" }}>
                  {SHOP_MISSION}
                </p>
              </div>
            </div>
          </div>

          <div style={{ height: "clamp(50px,8vh,90px)" }} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
