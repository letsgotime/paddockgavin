import type { Metadata } from "next"
import Link from "next/link"
import { ranchShare } from "@/lib/events/ranch-share"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { BoothPicker } from "./BoothPicker"

export const metadata: Metadata = {
  ...ranchShare({
    path: "/vendor/booth",
    title: "Reserve a booth · The Piston Powered Ranch",
    description:
      "Vendor booth space at The Piston Powered Ranch, Saturday 10 October 2026 at Rancho Jaramillo in Unionville, Tennessee.",
  }),
  robots: { index: false, follow: false },
}

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const ACCENT = "#FF1A21" // Jaramillo Red lit for small text on the ink, 4.74:1. Text only, never a fill

export default function Page() {
  return (
    <>
      <SiteNav />
      {/* pgClear: on the ranch door the mark and its tagline sit over the top
          of every page, and at 96px of padding the Your booth label printed
          straight through them. The layout adds the room. */}
      <main className="pgClear" style={{ background: "#0A1523", minHeight: "100vh", paddingTop: 96 }}>
        <section style={{ maxWidth: 780, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
          <Link
            href="/events/pistonpoweredranch/vendor"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#8b95a3",
              textDecoration: "none",
            }}
          >
            &larr; Vendor row
          </Link>

          <p
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: ACCENT,
              margin: "20px 0 0",
              fontWeight: 600,
            }}
          >
            Your booth
          </p>
          <h1
            style={{
              font: `900 clamp(32px,5.4vw,52px)/1.02 ${ARCHIVO}`,
              letterSpacing: "-.034em",
              color: "#EDF1F6",
              margin: "12px 0 0",
            }}
          >
            Reserve your space
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              maxWidth: "58ch",
              font: `400 17.5px/1.6 ${ARCHIVO}`,
              color: "#a9b4c2",
            }}
          >
            The row is kept short so every stall is worth walking to. Pick a footprint, tell us what
            you need, and the standard space is paid for here. Larger builds are quoted on what you
            are putting in them.
          </p>

          <div
            style={{
              margin: "clamp(26px,4vw,40px) 0 0",
              padding: "clamp(20px,3vw,30px)",
              border: "1px solid rgba(255,255,255,.13)",
              borderRadius: 18,
              background: "rgba(255,255,255,.03)",
            }}
          >
            <BoothPicker />
          </div>

          <div
            style={{
              margin: "clamp(28px,4vw,42px) 0 0",
              paddingTop: 22,
              borderTop: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 480 }}>
              <tbody>
                {[
                  ["When", "Saturday 10 October 2026"],
                  ["Trading", "9am to 3pm"],
                  ["Where", "Rancho Jaramillo, Unionville, Tennessee"],
                  ["Power", "Generator only. There is no mains in the row."],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td
                      style={{
                        padding: "9px 16px 9px 0",
                        fontFamily: MONO,
                        fontSize: 10,
                        letterSpacing: ".15em",
                        textTransform: "uppercase",
                        color: "#8b95a3",
                        whiteSpace: "nowrap",
                        verticalAlign: "top",
                      }}
                    >
                      {k}
                    </td>
                    <td style={{ padding: "9px 0", font: `400 15px/1.5 ${ARCHIVO}`, color: "#EDF1F6" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p
              style={{
                margin: "18px 0 0",
                font: `400 13.5px/1.6 ${ARCHIVO}`,
                color: "#8b95a3",
                maxWidth: "58ch",
              }}
            >
              Proof of liability insurance is needed before the day. The site plan with your pitch
              marked goes out in the last week of September, once the field is set.
            </p>
          </div>

          <div style={{ height: "clamp(50px,8vh,90px)" }} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
