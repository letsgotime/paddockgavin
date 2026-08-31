import type { Metadata } from "next"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Booth reserved · The Piston Powered Ranch",
  robots: { index: false, follow: false },
}

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

/**
 * Where Stripe sends people after a successful payment.
 *
 * It deliberately does not read the session and does not claim the payment
 * cleared. A success_url is reached the moment Stripe redirects, which is
 * before the webhook has necessarily landed, and a page that says "paid" on the
 * strength of a query parameter says it to anyone who types the URL. The
 * webhook is what books it; this page just tells a human what happens next.
 */
export default function Page() {
  return (
    <>
      <SiteNav />
      <main style={{ background: "#0A1523", minHeight: "100vh", paddingTop: 96 }}>
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#EF7A7D",
              margin: 0,
              fontWeight: 600,
            }}
          >
            Thank you
          </p>
          <h1
            style={{
              font: `900 clamp(32px,5.4vw,50px)/1.03 ${ARCHIVO}`,
              letterSpacing: "-.034em",
              color: "#EDF1F6",
              margin: "12px 0 0",
            }}
          >
            Your space is held
          </h1>
          <p style={{ margin: "16px 0 0", font: `400 17.5px/1.65 ${ARCHIVO}`, color: "#a9b4c2" }}>
            Stripe has your payment and will email the receipt. We have the booking, and Bekah
            Stallard picks it up from here.
          </p>
          <p style={{ margin: "14px 0 0", font: `400 16px/1.65 ${ARCHIVO}`, color: "#a9b4c2" }}>
            Two things before the day: send proof of liability insurance, and tell us your final
            power draw if you asked for power. Reply to the receipt or write to
            vendors@pistonpoweredranch.com.
          </p>
          <p style={{ margin: "14px 0 0", font: `400 16px/1.65 ${ARCHIVO}`, color: "#a9b4c2" }}>
            The site plan with your pitch marked goes out in the last week of September, once the
            field is set and we know where the cars sit.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
            <Link
              href="/events/pistonpoweredranch"
              style={{
                font: `800 14.5px/1 ${ARCHIVO}`,
                color: "#0A1523",
                background: "#EF7A7D",
                borderRadius: 11,
                padding: "14px 24px",
                textDecoration: "none",
              }}
            >
              Back to the event
            </Link>
            <Link
              href="/shop"
              style={{
                font: `700 14.5px/1 ${ARCHIVO}`,
                color: "#EDF1F6",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: 11,
                padding: "14px 24px",
                textDecoration: "none",
              }}
            >
              The shop
            </Link>
          </div>

          <div style={{ height: "clamp(60px,10vh,110px)" }} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
