import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PRODUCTS, BRANDS, bySlug, priceRange, buyable } from "@/lib/shop/catalogue"

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
  return {
    title: `${p.name} · The Shop · PaddockGavin`,
    description: p.blurb,
    alternates: { canonical: url },
    openGraph: { title: p.name, description: p.blurb, url, siteName: "PaddockGavin", type: "website" },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = bySlug(slug)
  if (!p) notFound()
  const b = BRANDS[p.brand]
  const price = priceRange(p)
  const live = p.variants.some(buyable)

  return (
    <>
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, margin: "18px 0 0" }}>
                {p.variants.map((v) => {
                  const ok = buyable(v)
                  return ok ? (
                    <a
                      key={v.label}
                      href={v.buyUrl}
                      rel="noopener"
                      style={{
                        font: `800 14px/1 ${ARCHIVO}`,
                        letterSpacing: ".04em",
                        color: "#04211d",
                        background: b.accent,
                        padding: "13px 20px",
                        borderRadius: 10,
                        textDecoration: "none",
                      }}
                    >
                      {v.label}
                    </a>
                  ) : (
                    <span
                      key={v.label}
                      aria-disabled="true"
                      style={{
                        font: `700 14px/1 ${ARCHIVO}`,
                        letterSpacing: ".04em",
                        color: "#6b7684",
                        border: "1px solid rgba(255,255,255,.14)",
                        padding: "13px 20px",
                        borderRadius: 10,
                      }}
                    >
                      {v.label}
                    </span>
                  )
                })}
              </div>

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
