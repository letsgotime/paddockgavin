import type { Metadata } from "next"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PRODUCTS, BRANDS, priceRange, anyBuyable } from "@/lib/shop/catalogue"

export const metadata: Metadata = {
  title: "The Shop · PaddockGavin",
  description:
    "Tees, caps, mugs and bags under the Rancho Jaramillo and PaddockGavin marks. Made to order, shipped before the tenth of October.",
  alternates: { canonical: "https://paddockgavin.com/shop" },
  openGraph: {
    title: "The Shop · PaddockGavin",
    description: "Tees, caps, mugs and bags under the Rancho Jaramillo and PaddockGavin marks.",
    url: "https://paddockgavin.com/shop",
    siteName: "PaddockGavin",
    type: "website",
  },
}

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export default function Page() {
  return (
    <>
      <SiteNav />
      <main style={{ background: "#0A1523", minHeight: "100vh", paddingTop: 96 }}>
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#F2C94C",
              margin: 0,
              fontWeight: 600,
            }}
          >
            The shop
          </p>
          <h1
            style={{
              font: `900 clamp(38px,7vw,68px)/1 ${ARCHIVO}`,
              letterSpacing: "-.035em",
              color: "#EDF1F6",
              margin: "14px 0 0",
            }}
          >
            Wear it on the tenth
          </h1>
          <p
            style={{
              margin: "16px 0 0",
              maxWidth: "58ch",
              font: `400 18px/1.6 ${ARCHIVO}`,
              color: "#A9B4C2",
            }}
          >
            Everything here is made to order under one of two marks, so nothing sits in a box
            waiting to be thrown away. Order before the last week of September and it arrives in
            time to be worn on the field rather than carried home in a bag.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(min(300px,100%),1fr))",
              gap: "clamp(16px,2.4vw,28px)",
              margin: "clamp(34px,5vw,54px) 0 0",
            }}
          >
            {PRODUCTS.map((p) => {
              const b = BRANDS[p.brand]
              const price = priceRange(p)
              const live = anyBuyable(p)
              return (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <article
                    style={{
                      border: "1px solid rgba(255,255,255,.13)",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "rgba(255,255,255,.03)",
                      height: "100%",
                    }}
                  >
                    {/* No product photography yet, so the ground is a ranch frame
                        under the mark. It reads as designed rather than missing,
                        and a real photograph is one field when there is one. */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "4 / 3",
                        background: p.backdrop
                          ? `linear-gradient(rgba(10,21,35,.62),rgba(10,21,35,.82)), url(${p.backdrop}) center/cover`
                          : "#111C2B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 22,
                      }}
                    >
                      <span
                        style={{
                          font: `900 clamp(20px,2.4vw,26px)/1.1 ${ARCHIVO}`,
                          letterSpacing: "-.02em",
                          color: b.accent,
                          textAlign: "center",
                        }}
                      >
                        {p.name}
                      </span>
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 13,
                          fontFamily: MONO,
                          fontSize: 10,
                          letterSpacing: ".16em",
                          textTransform: "uppercase",
                          color: "#EDF1F6",
                          background: "rgba(0,0,0,.42)",
                          padding: "4px 8px",
                          borderRadius: 5,
                        }}
                      >
                        {b.name}
                      </span>
                    </div>
                    <div style={{ padding: "15px 17px 18px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <h2
                          style={{
                            font: `800 17.5px/1.25 ${ARCHIVO}`,
                            letterSpacing: "-.018em",
                            color: "#EDF1F6",
                            margin: 0,
                          }}
                        >
                          {p.name}
                        </h2>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontFamily: MONO,
                            fontSize: 12,
                            color: live ? "#EDF1F6" : "#7f8a99",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {price ?? "Soon"}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "7px 0 0",
                          font: `400 14.5px/1.55 ${ARCHIVO}`,
                          color: "#A9B4C2",
                        }}
                      >
                        {p.blurb}
                      </p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          <p
            style={{
              margin: "clamp(30px,4vw,44px) 0 0",
              maxWidth: "62ch",
              font: `400 14.5px/1.6 ${ARCHIVO}`,
              color: "#7f8a99",
              paddingBottom: "clamp(50px,8vh,90px)",
            }}
          >
            Anything marked Soon has its artwork finished and is waiting on the payment link.
            Nothing here carries a price until it is a real one.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
