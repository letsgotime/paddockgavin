import Image from "next/image"
import Link from "next/link"

const SHOTS = [
  { src: "/images/918-p1.webp",        caption: "918 Spyder and McLaren P1" },
  { src: "/images/918-pipes.webp",     caption: "918 exhaust pipes" },
  { src: "/images/918-grey.webp",      caption: "918 Spyder rear quarter" },
  { src: "/images/aston-wheel.webp",   caption: "Aston Martin Vantage cabin" },
  { src: "/images/cullinan-doors.webp",caption: "Rolls-Royce Cullinan at car show" },
  { src: "/images/carrera-traffic.jpg",caption: "Carrera S in Nashville traffic" },
]

export function HomeGarage() {
  return (
    <section
      data-screen-label="The garage"
      id="garage"
      style={{
        background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
        clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
        padding: "clamp(22px,3.2vw,36px)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-block",
            transform: "skewX(-12deg)",
            background: "#B4B6B2",
            padding: "6px 16px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: "skewX(12deg)",
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#101010",
            }}
          >
            The garage
          </span>
        </span>
        <i
          aria-hidden="true"
          style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)" }}
        />
        <span
          style={{
            fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
            fontSize: 13,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#B4B6B2",
          }}
        >
          The personal register
        </span>
      </div>

      <h2
        style={{
          margin: 0,
          fontFamily: "Archivo, Helvetica, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(26px,3.8vw,42px)",
          lineHeight: 1.02,
          letterSpacing: "-.024em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          maxWidth: "20ch",
        }}
      >
        Everything I&apos;ve owned,{" "}
        <span style={{ color: "#F8B800" }}>and what happened to it</span>
      </h2>

      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(120px,45%),1fr))",
          gap: 16,
          borderTop: "1px solid rgba(255,255,255,.12)",
          borderBottom: "1px solid rgba(255,255,255,.12)",
          padding: "16px 0",
        }}
      >
        {[
          { label: "Owned", value: "29" },
          { label: "Across", value: "30+ years" },
          { label: "Shot on", value: "A phone" },
        ].map((s) => (
          <span key={s.label} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 16,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "#00D2BE",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </span>
          </span>
        ))}
      </div>

      {/* Photo grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(min(150px,31%),1fr))",
          gap: "clamp(10px,1.4vw,14px)",
        }}
      >
        {SHOTS.map((s) => (
          <Link
            key={s.src}
            href="/gallery"
            style={{
              position: "relative",
              display: "block",
              aspectRatio: "4/3",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.11)",
              background: "rgba(21,37,56,.5)",
              clipPath:
                "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
            }}
          >
            <Image
              src={s.src}
              alt={s.caption}
              fill
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </Link>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link
          href="/garage"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "Archivo, Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            background: "#F8B800",
            color: "#101010",
            padding: "15px 26px",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            textDecoration: "none",
          }}
        >
          Open the register
        </Link>
        <Link
          href="/gallery"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "Archivo, Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            color: "#EDF1F6",
            border: "1px solid rgba(255,255,255,.28)",
            padding: "15px 26px",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            textDecoration: "none",
          }}
        >
          See the full gallery
        </Link>
      </div>
    </section>
  )
}
