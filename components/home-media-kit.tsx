import Image from "next/image"
import Link from "next/link"

export function HomeMediaKit() {
  return (
    <section
      data-screen-label="Media kit"
      id="mediakit"
      style={{
        position: "relative",
        background: "linear-gradient(150deg,rgba(248,184,0,.09),rgba(255,255,255,.014))",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(248,184,0,.26)",
        borderLeft: "3px solid #F8B800",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
        clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
        padding: "clamp(22px,3.2vw,34px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Image
        src="/images/donuts-inside.webp"
        alt=""
        aria-hidden
        fill
        style={{ objectFit: "cover", opacity: 0.5, zIndex: -1 }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: -1,
          background: "linear-gradient(160deg,rgba(14,26,42,.96) 0%,rgba(14,26,42,.88) 52%,rgba(14,26,42,.6) 100%)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span
          style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px" }}
        >
          <span
            style={{
              display: "inline-block", transform: "skewX(12deg)",
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5,
              letterSpacing: ".16em", textTransform: "uppercase", color: "#101010",
            }}
          >
            For brands
          </span>
        </span>
        <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)", display: "block" }} />
        <span
          style={{
            fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
            fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F",
          }}
        >
          The media kit
        </span>
      </div>
      <h2
        style={{
          margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900,
          fontSize: "clamp(26px,3.8vw,42px)", lineHeight: 1.02, letterSpacing: "-.024em",
          textTransform: "uppercase", color: "#FFFFFF", maxWidth: "18ch",
        }}
      >
        The audience,{" "}
        <span style={{ color: "#F8B800" }}>in numbers</span>
      </h2>
      <p
        style={{
          margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17,
          lineHeight: 1.58, color: "#C4CBD6", maxWidth: "56ch",
        }}
      >
        Vertical, phone-first, captions on &mdash; most of it watched with the sound off. If you want your product in front of people who live in a garage, write me.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(130px,45%),1fr))",
          gap: 16,
          borderTop: "1px solid rgba(255,255,255,.14)",
          borderBottom: "1px solid rgba(255,255,255,.14)",
          padding: "16px 0",
        }}
      >
        {[
          { label: "Cars owned",      value: "29" },
          { label: "Found for others", value: "78" },
          { label: "Events run",      value: "200+" },
          { label: "Based",           value: "Nashville, TN" },
        ].map(r => (
          <span key={r.label} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>{r.label}</span>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 16, letterSpacing: ".08em", color: "#00D2BE", fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="#contact"
          style={{
            display: "inline-flex", alignItems: "center",
            fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
            letterSpacing: ".04em", textTransform: "uppercase",
            background: "#F8B800", color: "#101010", padding: "15px 26px",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            textDecoration: "none",
          }}
        >
          Pitch a brand deal
        </a>
        <Link
          href="/connect"
          style={{
            display: "inline-flex", alignItems: "center",
            fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
            letterSpacing: ".04em", textTransform: "uppercase",
            color: "#EDF1F6", border: "1px solid rgba(255,255,255,.28)", padding: "15px 26px",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            textDecoration: "none",
          }}
        >
          Every link
        </Link>
      </div>
    </section>
  )
}
