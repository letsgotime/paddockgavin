"use client"

const DAY: { icon: string; text: string }[] = [
  { icon: "○", text: "Gates open at 8. I&apos;m usually there before the cars." },
  { icon: "○", text: "Every truck delivery — unloaded, inspected, photographed, logged. Nothing touches the floor unchecked." },
  { icon: "○", text: "Lot Ops & Events Manager, duPont REGISTRY Lebanon. The calendar, the keys, and the coffee run through me." },
  { icon: "○", text: "125,000+ sq ft of exotics. I know where every car is. That&apos;s not a flex — it&apos;s the job." },
  { icon: "○", text: "Event days mean setup at sunrise and breakdown after the last guest clears the rope." },
  { icon: "○", text: "The lot teaches you that reputation is built in the small stuff. A clean bay. A returned call. A car that&apos;s ready." },
]

const NIGHT: { icon: string; text: string }[] = [
  { icon: "○", text: "Laptop opens when the gate shuts. Different work, same standard." },
  { icon: "○", text: "Building AI-assisted tools for lot ops, inventory, and lead capture — because the problems I solve at work are problems other people have too." },
  { icon: "○", text: "Author. Writing about the intersection of cars, hustle, and what it means to work around something you actually love." },
  { icon: "○", text: "Detailing connoisseur. Not a hobbyist — a student. Paint correction, ceramic coating, the whole process." },
  { icon: "○", text: "I document the build because other people in the same spot needed someone to go first." },
  { icon: "○", text: "Still the same guy who started with a bucket and a borrowed hose. Just with better tools." },
]

export function HomeShiftsCard() {
  return (
    <section
      aria-label="Day shift and night shift"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))",
        gap: "clamp(2px,0.3vw,4px)",
        width: "100%",
      }}
    >
      {/* ── DAY SHIFT ── */}
      <div
        style={{
          background: "rgba(248,184,0,0.06)",
          border: "1px solid rgba(248,184,0,0.18)",
          padding: "clamp(28px,4vw,48px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "#F8B800",
            }}
          >
            Day shift · 08:00 &rarr; 18:00
          </span>
          <h3
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px,2.8vw,32px)",
              lineHeight: 1.05,
              letterSpacing: "-.025em",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            On the lot.<br />
            <span style={{ color: "#F8B800" }}>duPont REGISTRY.</span>
          </h3>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(248,184,0,0.2)", width: "100%" }} />

        {/* Bullets */}
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {DAY.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 3,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  border: "1.5px solid #F8B800",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontSize: "clamp(14px,1.4vw,16px)",
                  lineHeight: 1.6,
                  color: "#C4CBD6",
                }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ── NIGHT SHIFT ── */}
      <div
        style={{
          background: "rgba(87,199,245,0.05)",
          border: "1px solid rgba(87,199,245,0.16)",
          padding: "clamp(28px,4vw,48px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "#57C7F5",
            }}
          >
            Night shift · 18:00 &rarr; late
          </span>
          <h3
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px,2.8vw,32px)",
              lineHeight: 1.05,
              letterSpacing: "-.025em",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            After hours.<br />
            <span style={{ color: "#57C7F5" }}>Building the rest.</span>
          </h3>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(87,199,245,0.18)", width: "100%" }} />

        {/* Bullets */}
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {NIGHT.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 3,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  border: "1.5px solid #57C7F5",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontSize: "clamp(14px,1.4vw,16px)",
                  lineHeight: 1.6,
                  color: "#C4CBD6",
                }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
