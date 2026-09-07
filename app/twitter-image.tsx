import { ImageResponse } from "next/og"
import { headers } from "next/headers"

export const runtime = "edge"
export const alt = "PaddockGavin"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const RANCH_CARD = "https://pistonpoweredranch.com/og/ppr-rancho-og-v2.jpg"

export default async function OGImage() {
  /* The ranch's door shares the ranch's card. Without this a ranch page that
     names no image of its own, entry status and the 404 above all, carried
     the paddock's. The host is checked as well as the brand header so the
     answer does not depend on the middleware having run. */
  const h = await headers()
  const host = h.get("host") || ""
  if (h.get("x-pg-brand") === "pistonpoweredranch" || /(^|\.)pistonpoweredranch\.com$/.test(host)) {
    const card = await fetch(RANCH_CARD)
    return new Response(card.body, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    })
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0A0E1A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Arial Black, Arial, sans-serif",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Four-bar speed stripe */}
        <div style={{ display: "flex", height: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, background: "#F8B800" }} />
          <div style={{ flex: 1, background: "#00D2BE" }} />
          <div style={{ flex: 1, background: "#005185" }} />
          <div style={{ flex: 1, background: "#848482" }} />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
          }}
        >
          {/* PG monogram */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
            <div
              style={{
                display: "flex",
                fontWeight: 900,
                fontSize: 72,
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              <span style={{ color: "#F8B800" }}>P</span>
              <span style={{ color: "#00D2BE", marginLeft: -6 }}>G</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 24,
                borderLeft: "2px solid #27384F",
                paddingLeft: 24,
              }}
            >
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 32,
                  letterSpacing: "-0.5px",
                  lineHeight: 1,
                }}
              >
                <span style={{ color: "#F8B800" }}>PADDOCK</span>
                <span style={{ color: "#00D2BE" }}>GAVIN</span>
              </span>
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#848482",
                  letterSpacing: "0.08em",
                  marginTop: 6,
                }}
              >
                A LIFE BENT TOWARD CARS.
              </span>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontWeight: 900,
              fontSize: 68,
              letterSpacing: "-2px",
              lineHeight: 1.05,
              color: "#EDF1F6",
              maxWidth: 900,
            }}
          >
            Automotive. Tech.
            <br />
            <span style={{ color: "#F8B800" }}>Lifestyle.</span>
          </div>

          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
              fontSize: 22,
              color: "#8B93A7",
              marginTop: 28,
              letterSpacing: "0.02em",
            }}
          >
            Gavin Brooks. Cars, the events, and the software behind them. Nashville, Tennessee.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 80px",
            borderTop: "1px solid #27384F",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 16,
              color: "#8B93A7",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            paddockgavin.com
          </span>
          <span
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 14,
              color: "#848482",
              letterSpacing: "0.08em",
            }}
          >
            Nashville, TN
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
