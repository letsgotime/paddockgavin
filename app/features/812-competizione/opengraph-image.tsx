import { ImageResponse } from "next/og"

/* A bespoke card for this entry, in the site's house style (see the root
   app/opengraph-image.tsx: the four-bar stripe, the PG monogram, Satori's
   one-div-one-layout rule). Next.js serves this over the root card for any
   URL under this route automatically; no wiring needed elsewhere. */

export const runtime = "edge"
export const alt = "The 812 Competizione: The Paddock Files"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
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
        <div style={{ display: "flex", height: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, background: "#F8B800" }} />
          <div style={{ flex: 1, background: "#00D2BE" }} />
          <div style={{ flex: 1, background: "#005185" }} />
          <div style={{ flex: 1, background: "#848482" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 80px" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#F8B800",
              marginBottom: 28,
            }}
          >
            The Paddock Files · Entry 01
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 900,
              fontSize: 76,
              letterSpacing: "-2.5px",
              lineHeight: 1.02,
              color: "#EDF1F6",
              maxWidth: 1000,
            }}
          >
            <span>The 812</span>
            <span style={{ color: "#00D2BE" }}>Competizione</span>
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 36 }}>
            {[["819 hp", "at 9,250 rpm"], ["9,500 rpm", "redline"], ["1 of 999", "built"]].map(([a, b]) => (
              <div key={a} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 30, color: "#FFFFFF" }}>{a}</span>
                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: 16, color: "#8B93A7", letterSpacing: "0.04em", marginTop: 4 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 80px", borderTop: "1px solid #27384F", flexShrink: 0 }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 16, color: "#8B93A7", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            paddockgavin.com/features
          </span>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#848482", letterSpacing: "0.08em" }}>
            Nashville, TN
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
