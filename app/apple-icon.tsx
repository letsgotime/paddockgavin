import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0A0E1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        {/* Four-bar speed stripe top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", height: 8 }}>
          <div style={{ flex: 1, background: "#F8B800" }} />
          <div style={{ flex: 1, background: "#00D2BE" }} />
          <div style={{ flex: 1, background: "#005185" }} />
          <div style={{ flex: 1, background: "#848482" }} />
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Arial Black, Arial, sans-serif",
            fontWeight: 900,
            fontSize: 80,
            letterSpacing: "-3px",
          }}
        >
          <span style={{ color: "#F8B800" }}>P</span>
          <span style={{ color: "#00D2BE", marginLeft: -8 }}>G</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
