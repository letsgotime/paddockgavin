import type { Metadata } from "next"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Settled · The Piston Powered Ranch",
  robots: { index: false, follow: false },
}

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const ACCENT = "#FF1A21" // Jaramillo Red lit for small text on the ink, 4.74:1. Text only, never a fill

/**
 * Where a paid invoice link sends a sponsor.
 *
 * Like the vendor page, it does not read the session and does not claim the
 * payment cleared: the webhook books it and sends the receipt. This tells a
 * person what happens next.
 */
export default function Page() {
  return (
    <>
      <SiteNav />
      <main className="pgClear" style={{ background: "#0A1523", minHeight: "100vh", paddingTop: 96 }}>
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
          <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: ACCENT, margin: 0, fontWeight: 600 }}>
            Thank you
          </p>
          <h1 style={{ font: `900 clamp(32px,5.4vw,50px)/1.03 ${ARCHIVO}`, letterSpacing: "-.034em", color: "#EDF1F6", margin: "12px 0 0" }}>
            That is settled
          </h1>
          <p style={{ margin: "16px 0 0", font: `400 17.5px/1.65 ${ARCHIVO}`, color: "#a9b4c2" }}>
            Stripe has your payment and a receipt from us follows the moment it clears. Everything from here
            runs through Bekah Stallard, so nothing falls between desks.
          </p>
          <p style={{ margin: "14px 0 0", font: `400 16px/1.65 ${ARCHIVO}`, color: "#a9b4c2" }}>
            One thing we need from you: your logo as vector, on a transparent background, plus your name
            exactly as it should read. Reply to the receipt with the file attached, or write to
            sponsors@pistonpoweredranch.com.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
            <Link href="/events/pistonpoweredranch" style={{ font: `800 14.5px/1 ${ARCHIVO}`, color: "#FFFFFF", background: "#E5141A", borderRadius: 11, padding: "14px 24px", textDecoration: "none" }}>
              Back to the event
            </Link>
          </div>
          <div style={{ height: "clamp(60px,10vh,110px)" }} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
