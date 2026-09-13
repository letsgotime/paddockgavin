/* PaddockGavin Events: its own mark, inside the same glass and notch language as the parent brand. */
export const PGE = {
  name: "PaddockGavin Events",
  short: "PGE",
  teal: "#00D2BE",
  blue: "#005185",
  ink: "#00302B",
} as const

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export function PGEMark({ height = 36 }: { height?: number }) {
  return (
    <svg width={(height * 76) / 40} height={height} viewBox="0 0 76 40" role="img" aria-label={PGE.name} style={{ display: "block", flex: "0 0 auto" }}>
      <path d="M0 0H76V29L65 40H0Z" fill={PGE.blue} />
      <path d="M0 0H7V40H0Z" fill={PGE.teal} />
      <path d="M7 34H70L64 40H7Z" fill={PGE.teal} />
      <text x="42" y="27" textAnchor="middle" fontFamily={ARCHIVO} fontWeight={900} fontSize="21" letterSpacing="1.5" fill="#FFFFFF">
        PGE
      </text>
    </svg>
  )
}

export function PGELockup({ height = 36 }: { height?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <PGEMark height={height} />
      <span style={{ display: "flex", flexDirection: "column", gap: 3, lineHeight: 1 }}>
        <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: Math.max(15, height * 0.5), letterSpacing: "-.01em", textTransform: "uppercase", color: "#FFFFFF" }}>
          PaddockGavin <span style={{ color: PGE.teal }}>Events</span>
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#B4B6B2" }}>
          Cars, people, and a day out
        </span>
      </span>
    </span>
  )
}

export function PGEEyebrow({ children = PGE.name }: { children?: React.ReactNode }) {
  return (
    <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: PGE.teal }}>
      <PGEMark height={18} />
      {children}
    </p>
  )
}
