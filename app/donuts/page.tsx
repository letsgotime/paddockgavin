import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function lastSaturdayOf(year: number, month: number): Date {
  const d = new Date(year, month + 1, 0)
  d.setDate(d.getDate() - ((d.getDay() + 1) % 7))
  return d
}

function nextLastSaturday(): Date {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let d = lastSaturdayOf(now.getFullYear(), now.getMonth())
  if (d < today) d = lastSaturdayOf(now.getFullYear(), now.getMonth() + 1)
  return d
}

export default function DonutsPage() {
  const d         = nextLastSaturday()
  const nextMonth = MONTHS[d.getMonth()] + " " + d.getFullYear()
  const nextDay   = String(d.getDate())

  const DETAILS = [
    { k: "When",     v: "Last Sat, 8am" },
    { k: "Where",    v: "Lebanon, TN" },
    { k: "Cost",     v: "Free" },
    { k: "Coffee",   v: "Yes" },
    { k: "Bring a car", v: "Please do" },
  ]

  const KNOW = [
    { label: "No registration",  body: "Show up. There is no list and no ticket — park it and come in." },
    { label: "Every kind of car", body: "It is not a marque meet. Bring the daily, the project, or the one you just picked up." },
    { label: "The floor changes", body: "Whatever came in that week is what you will be standing next to. That is the whole draw." },
  ]

  return (
    <>
      <SiteNav active="donuts" />

      {/* Speed stripe bar */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 90, display: "flex", height: 3, pointerEvents: "none" }}>
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
          minHeight: "74svh",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/donuts-lot.webp"
            alt="Donuts with duPont — the car park filling up early"
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
            background: "linear-gradient(103deg,rgba(10,21,35,.9) 0%,rgba(10,21,35,.6) 42%,rgba(10,21,35,.08) 80%)",
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
                Donuts with duPont
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
                Free
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
                Come join us
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
                to see the new models.
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
              Donuts with duPont, oh we have coffee too. Last Saturday of every month, on the showroom floor in Lebanon, Tennessee. Bring the car you drove, or just bring yourself.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="#next"
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
                }}
              >
                When is the next one
              </a>
              <a
                href="#floor"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,.26)",
                  padding: "15px 26px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                Inquire for private events
              </a>
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
          Out in the car park. It fills up early and keeps filling
        </p>
      </section>

      {/* Next date */}
      <section
        id="next"
        style={{
          background: "#0A1523",
          padding: "clamp(52px,7vw,104px) clamp(14px,4vw,64px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            borderTop: "1px solid rgba(255,255,255,.14)",
            padding: "13px 0 0",
            marginBottom: "clamp(28px,3.6vw,48px)",
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
            The next one
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
            Monthly
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))",
            gap: "clamp(24px,3vw,52px)",
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(26px,2.4vw,36px)",
                lineHeight: 1.1,
                letterSpacing: "-.02em",
                color: "#F8B800",
              }}
            >
              {nextMonth}
            </p>
            <p
              style={{
                margin: "0 0 22px",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(52px,7vw,104px)",
                lineHeight: 0.86,
                letterSpacing: "-.03em",
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {nextDay}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 18,
                lineHeight: 1.6,
                color: "#B9C2CE",
                maxWidth: "44ch",
              }}
            >
              Doors from 8am. Coffee and donuts are on us, and the floor is open until noon.
            </p>
          </div>

          {/* Details card */}
          <div
            style={{
              background: "#0E1A2A",
              border: "1px solid rgba(255,255,255,.15)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 11,
                padding: "12px 16px 10px",
                borderBottom: "1px solid rgba(255,255,255,.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "#9BA5B3",
                  flex: "0 0 auto",
                }}
              >
                Details
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
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  flex: "0 0 auto",
                }}
              >
                duPont REGISTRY
              </span>
            </div>
            <div style={{ padding: "5px 16px 13px" }}>
              {DETAILS.map(row => (
                <div
                  key={row.k}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 9,
                    padding: "9px 0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      letterSpacing: ".13em",
                      textTransform: "uppercase",
                      color: "#9BA5B3",
                      flex: "0 0 auto",
                    }}
                  >
                    {row.k}
                  </span>
                  <i
                    style={{
                      flex: "1 1 auto",
                      height: 0,
                      borderBottom: "1px dotted rgba(255,255,255,.26)",
                      transform: "translateY(-4px)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      flex: "0 1 auto",
                      textAlign: "right",
                    }}
                  >
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Know before you go */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(210px,100%),1fr))",
            gap: 1,
            background: "rgba(255,255,255,.13)",
            border: "1px solid rgba(255,255,255,.13)",
            marginTop: "clamp(28px,3.4vw,46px)",
          }}
        >
          {KNOW.map(k => (
            <div
              key={k.label}
              style={{
                background: "#0E1A2A",
                padding: "18px 18px 17px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  color: "#9BA5B3",
                }}
              >
                {k.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontSize: 17.5,
                  lineHeight: 1.5,
                  color: "#DDE3EB",
                }}
              >
                {k.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Private floor section */}
      <section
        id="floor"
        style={{
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          display: "flex",
          flexDirection: "column",
          minHeight: "66svh",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/donuts-inside.webp"
            alt="Donuts morning inside — two red Ferraris and the floor already full"
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(255deg,rgba(10,21,35,.9) 0%,rgba(10,21,35,.58) 44%,rgba(10,21,35,.06) 82%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 3,
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "clamp(20px,4vw,60px)",
          }}
        >
          <div
            style={{
              width: "min(520px,100%)",
              background: "rgba(20,34,53,.56)",
              backdropFilter: "blur(26px) saturate(1.5)",
              WebkitBackdropFilter: "blur(26px) saturate(1.5)",
              border: "1px solid rgba(255,255,255,.14)",
              borderTop: "1px solid rgba(255,255,255,.26)",
              borderLeft: "2px solid #00D2BE",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              boxShadow: "0 34px 90px -24px rgba(0,0,0,.8)",
              padding: "clamp(24px,2.6vw,38px)",
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
                Your own event
              </span>
              <i
                style={{
                  flex: "1 1 auto",
                  height: 5,
                  background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 6px)",
                }}
              />
            </div>
            <h2 style={{ margin: "0 0 18px" }}>
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
                The same floor,
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(28px,2.4vw,37px)",
                  lineHeight: 1.14,
                  letterSpacing: "-.02em",
                  color: "#00D2BE",
                }}
              >
                any Saturday you like.
              </span>
            </h2>
            <p
              style={{
                margin: "0 0 26px",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 18,
                lineHeight: 1.6,
                color: "#B9C2CE",
              }}
            >
              It is not just the room that makes this place special, it is what is passing through while you are there. Booking it out is part of my job. Send me a date and I will check it.
            </p>
            <Link
              href="/events#inquire"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                background: "#00D2BE",
                color: "#0E1A2A",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              Check a date
            </Link>
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
          Donuts morning, inside. Two red Ferraris and the floor already full
        </p>
      </section>

      <SiteFooter />
    </>
  )
}
