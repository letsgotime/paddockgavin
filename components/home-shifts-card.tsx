"use client"

const DAY: string[] = [
  "Gates open at 8. I&apos;m usually there before the cars.",
  "Every delivery gets unloaded, inspected, photographed, logged. Nothing hits the floor unchecked.",
  "Lot Ops &amp; Events Manager in Lebanon. The calendar, the keys, and the handoffs run through me.",
  "A building full of exotics teaches you quickly that details are the whole job.",
  "Event days start before sunrise and end after the last guest clears the rope.",
  "The lot taught me that reputation lives in the small stuff — a returned call, a clean bay, a car that&apos;s ready.",
]

const NIGHT: string[] = [
  "When the gate shuts, the laptop opens. Different work, same standard.",
  "Building AI tools for lot ops, inventory, and lead capture — the problems I run into at work are problems other people have too.",
  "Writing about cars, hustle, and what it actually looks like to work around something you love.",
  "Detailing student. Paint correction, ceramic coating, the whole process — not a weekend thing, a discipline.",
  "I document what I build because when I was starting out, I needed someone to go first.",
  "Started with a bucket and a borrowed hose. The tools changed. The approach didn&apos;t.",
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
          background: "rgba(242,201,76,0.06)",
          border: "1px solid rgba(242,201,76,0.18)",
          padding: "clamp(28px,4vw,48px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "#F2C94C",
            }}
          >
            Day shift &middot; 08:00 &rarr; 18:00
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
            <span style={{ color: "#F2C94C" }}>Lebanon, Tennessee.</span>
          </h3>
        </div>

        <div style={{ height: 1, background: "rgba(242,201,76,0.2)", width: "100%" }} />

        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
          {DAY.map((text, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 9,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  border: "1.5px solid #F2C94C",
                  display: "block",
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, Helvetica, sans-serif",
                  fontSize: "clamp(14px,1.4vw,16px)",
                  lineHeight: 1.65,
                  color: "#C4CBD6",
                }}
                dangerouslySetInnerHTML={{ __html: text }}
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
            Night shift &middot; 18:00 &rarr; late
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

        <div style={{ height: 1, background: "rgba(87,199,245,0.18)", width: "100%" }} />

        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
          {NIGHT.map((text, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 9,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  border: "1.5px solid #57C7F5",
                  display: "block",
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, Helvetica, sans-serif",
                  fontSize: "clamp(14px,1.4vw,16px)",
                  lineHeight: 1.65,
                  color: "#C4CBD6",
                }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
