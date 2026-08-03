import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0A0E1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial Black, Arial, sans-serif",
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: "-0.5px",
        }}
      >
        <span style={{ color: "#F8B800" }}>P</span>
        <span style={{ color: "#00D2BE", marginLeft: -2 }}>G</span>
      </div>
    ),
    { ...size },
  )
}
