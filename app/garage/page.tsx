import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const TOTAL = 29

// The cars. Slots without an entry render as open numbered placeholders.
const CARS: { name: string; meta: string }[] = [
  // { name: "1997 Porsche 993 Carrera S", meta: "2004 – 2008" },
]

// Photo grid — shots Gavin has
const SHOTS = [
  { src: "/images/g993-out.webp",           alt: "Sage green 993 custom off the Troy Carz carrier" },
  { src: "/images/g993-cabin.webp",         alt: "993 interior — carbon dash, terracotta leather, manual shifter" },
  { src: "/images/g993-ramp.webp",          alt: "993 nose and gold Brembo wheel on the carrier ramp" },
  { src: "/images/g993-fire-sq.webp",       alt: "993 carbon floor with fire extinguisher mounted" },
  { src: "/images/ferrari-upperdeck.webp",  alt: "Black Ferrari loaded on upper deck of enclosed hauler" },
  { src: "/images/ferrari-red.webp",        alt: "Red Ferrari 488 on the floor with Defenders and exotics" },
  { src: "/images/ford-gt-studio.webp",     alt: "Shooting the white Ford GT Le Mans race car in studio" },
  { src: "/images/gavin-gwagen.webp",       alt: "Gavin with the white Mercedes-Maybach G650" },
  { src: "/images/918-p1.webp",             alt: "918 Spyder and McLaren P1" },
  { src: "/images/918-grey.webp",           alt: "918 Spyder rear quarter" },
  { src: "/images/918-pipes.webp",          alt: "918 exhaust pipes" },
  { src: "/images/aston-wheel.webp",        alt: "Aston Martin cabin" },
  { src: "/images/cullinan-doors.webp",     alt: "Rolls-Royce Cullinan" },
  { src: "/images/carrera-traffic.jpg",     alt: "Carrera S in Nashville traffic" },
]

function buildRows() {
  const total = Math.max(TOTAL, CARS.length)
  return Array.from({ length: total }, (_, i) => {
    const c = CARS[i]
    return {
      n:         String(i + 1).padStart(2, "0"),
      name:      c ? c.name : "Slot open",
      meta:      c ? c.meta : "\u2014",
      numColor:  c ? "#F8B800" : "#5A6472",
      nameColor: c ? "#FFFFFF" : "#6E7887",
      metaColor: c ? "#B8C1CD" : "#5A6472",
      filled:    Boolean(c),
    }
  })
}

export default function GaragePage() {
  const rows    = buildRows()
  const total   = rows.length
  const filled  = CARS.length
  const current = CARS.filter(c => /still here/i.test(c.meta)).length

  return (
    <>
      <SiteNav active="cars" />

      {/* Speed stripe accent bar */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          display: "flex",
          height: 3,
          pointerEvents: "none",
        }}
      >
        <i style={{ flex: "1 1 0", background: "#F8B800" }} />
        <i style={{ flex: "1 1 0", background: "#00D2BE" }} />
        <i style={{ flex: "1 1 0", background: "#005185" }} />
        <i style={{ flex: "1 1 0", background: "#B4B6B2" }} />
      </div>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          display: "flex",
          flexDirection: "column",
          minHeight: "62svh",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/918-p1.webp"
            alt="918 Spyder and McLaren P1 — two of them"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(103deg,rgba(10,21,35,.92) 0%,rgba(10,21,35,.62) 44%,rgba(10,21,35,.06) 82%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 3,
            flex: "1 1 auto",
            display: "flex",
            alignItems: "flex-end",
            padding: "clamp(20px,4vw,60px)",
          }}
        >
          <div
            style={{
              width: "min(560px,100%)",
              background: "rgba(20,34,53,.56)",
              backdropFilter: "blur(26px) saturate(1.5)",
              WebkitBackdropFilter: "blur(26px) saturate(1.5)",
              border: "1px solid rgba(255,255,255,.14)",
              borderTop: "1px solid rgba(255,255,255,.26)",
              borderLeft: "2px solid #F8B800",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              boxShadow: "0 34px 90px -24px rgba(0,0,0,.8)",
              padding: "clamp(24px,2.6vw,40px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 22 }}>
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(15px,1.05vw,19px)",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  flex: "0 0 auto",
                }}
              >
                The register
              </span>
              <i
                style={{
                  flex: "1 1 auto",
                  height: 5,
                  background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 6px)",
                }}
              />
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(13.5px,.85vw,16px)",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  color: "#B8C1CD",
                  flex: "0 0 auto",
                }}
              >
                Personal
              </span>
            </div>
            <h1 style={{ margin: "0 0 18px" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(31px,3.2vw,48px)",
                  lineHeight: 1,
                  letterSpacing: "-.024em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                }}
              >
                The cars that
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(30px,3.1vw,46px)",
                  lineHeight: 1.1,
                  letterSpacing: "-.02em",
                  color: "#F8B800",
                }}
              >
                have been mine.
              </span>
            </h1>
            <p
              style={{
                margin: "0 0 24px",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 18,
                lineHeight: 1.6,
                color: "#B9C2CE",
              }}
            >
              Not inventory, not a dealer lot. These are the ones I bought, ran, argued with and sold on, long before anyone paid me to be near a car. The list is still growing, which is rather the point.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2vw,30px)" }}>
              {[
                { label: "Owned",     val: String(total)   },
                { label: "Logged",    val: String(filled)  },
                { label: "Still here",val: String(current) },
              ].map(s => (
                <span key={s.label} style={{ display: "inline-flex", gap: 6, alignItems: "baseline" }}>
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      letterSpacing: ".13em",
                      textTransform: "uppercase",
                      color: "#9BA5B3",
                    }}
                  >
                    {s.label}
                  </span>
                  <b
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.val}
                  </b>
                </span>
              ))}
            </div>
          </div>
        </div>

        <p
          style={{
            position: "relative",
            zIndex: 4,
            margin: 0,
            background: "rgba(8,17,29,.9)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(255,255,255,.14)",
            padding: "clamp(10px,1.6vh,18px) clamp(14px,3vw,30px) clamp(12px,2vh,22px)",
            fontFamily: "Archivo, Helvetica, sans-serif",
            fontWeight: 600,
            fontSize: 14.5,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#DFE5ED",
          }}
        >
          Mine. Nothing on this page belongs to duPont REGISTRY
        </p>
      </section>

      {/* The register table */}
      <section
        style={{
          background: "#0A1523",
          padding: "clamp(50px,7vw,100px) clamp(14px,4vw,64px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            borderTop: "1px solid rgba(255,255,255,.14)",
            padding: "13px 0 0",
            marginBottom: "clamp(26px,3.4vw,44px)",
          }}
        >
          <span
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(15px,1.05vw,19px)",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#EDF1F6",
              flex: "0 0 auto",
            }}
          >
            The register
          </span>
          <i
            style={{
              flex: "1 1 auto",
              height: 5,
              background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 6px)",
            }}
          />
          <span
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(13.5px,.85vw,16px)",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "#B8C1CD",
              flex: "0 0 auto",
            }}
          >
            01 &ndash; {String(total).padStart(2, "0")}
          </span>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,.14)",
            background: "#0E1A2A",
            maxWidth: 860,
          }}
        >
          {rows.map(r => (
            <div
              key={r.n}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "0 clamp(12px,1.6vw,20px)",
                alignItems: "baseline",
                borderBottom: "1px solid rgba(255,255,255,.09)",
                padding: "13px clamp(13px,1.6vw,22px)",
              }}
            >
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 14,
                  letterSpacing: ".12em",
                  color: r.numColor,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.n}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 9,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: 16.5,
                    letterSpacing: ".02em",
                    textTransform: "uppercase",
                    color: r.nameColor,
                    flex: "0 1 auto",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.name}
                </span>
                <i
                  style={{
                    flex: "1 1 auto",
                    height: 0,
                    borderBottom: "1px dotted rgba(255,255,255,.2)",
                    transform: "translateY(-4px)",
                  }}
                />
              </span>
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: r.metaColor,
                  whiteSpace: "nowrap",
                }}
              >
                {r.meta}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "clamp(18px,2.2vw,26px)",
            fontFamily: "Archivo, Helvetica, sans-serif",
            fontSize: 17,
            lineHeight: 1.6,
            color: "#9BA5B3",
            maxWidth: "60ch",
          }}
        >
          {filled === 0
            ? `${total} numbered slots, waiting on the list. Every slot is reserved — the register fills itself in one pass once the paperwork is out.`
            : `${filled} of ${total} logged. The rest are coming as I dig the paperwork out.`}
        </p>
      </section>

      {/* Photo grid */}
      <section
        style={{
          background: "#0E1A2A",
          padding: "clamp(46px,6vw,90px) clamp(14px,4vw,64px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            borderTop: "1px solid rgba(255,255,255,.14)",
            padding: "13px 0 0",
            marginBottom: "clamp(22px,2.8vw,36px)",
          }}
        >
          <span
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(15px,1.05vw,19px)",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#EDF1F6",
              flex: "0 0 auto",
            }}
          >
            The ones I have shots of
          </span>
          <i
            style={{
              flex: "1 1 auto",
              height: 5,
              background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 6px)",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(min(210px,45%),1fr))",
            gap: 8,
          }}
        >
          {SHOTS.map(s => (
            <figure
              key={s.src}
              style={{
                margin: 0,
                position: "relative",
                background: "#0A1523",
                border: "1px solid rgba(255,255,255,.1)",
                overflow: "hidden",
                aspectRatio: "4/3",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
              }}
            >
              <Image src={s.src} alt={s.alt} fill style={{ objectFit: "cover" }} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      {/* Find a car CTA */}
      <section
        style={{
          background: "#0A1523",
          padding: "clamp(44px,6vw,88px) clamp(14px,4vw,64px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))",
            gap: "clamp(24px,3vw,52px)",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 16px" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(29px,2.5vw,39px)",
                  lineHeight: 1.02,
                  letterSpacing: "-.024em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                }}
              >
                Looking for one
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(28px,2.4vw,37px)",
                  lineHeight: 1.14,
                  letterSpacing: "-.02em",
                  color: "#F8B800",
                }}
              >
                like these?
              </span>
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 18,
                lineHeight: 1.6,
                color: "#B9C2CE",
                maxWidth: "52ch",
              }}
            >
              We source through duPont REGISTRY. Tell me the spec and the budget &mdash; 78 found so far, most of them before they were listed.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/intake"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                background: "#F8B800",
                color: "#0E1A2A",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
                textDecoration: "none",
                transition: "filter .18s",
              }}
            >
              Send me a spec
            </Link>
            <Link
              href="/gallery"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#EDF1F6",
                border: "1px solid rgba(255,255,255,.28)",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              See the gallery
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
