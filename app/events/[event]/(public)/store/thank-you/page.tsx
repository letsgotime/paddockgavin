import type { Metadata } from "next"

/**
 * Where Stripe returns somebody after they give.
 *
 * It thanks them and says nothing it cannot know. The session id is in the
 * address, but this page does not read it back or claim an amount: the receipt
 * comes from Stripe, and a page that repeats a figure it has not verified is a
 * page that will eventually repeat the wrong one.
 */

export const metadata: Metadata = {
  title: "Thank you · The Piston Powered Ranch",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
}

const BODY = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"

export default function ThankYou() {
  return (
    <main
      style={{
        background: "#0A1523",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px,6vw,56px)",
        fontFamily: BODY,
      }}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Archivo:wght@400;700&display=swap" />
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div style={{ height: 3, width: 48, background: "#E5141A", borderRadius: 2, marginBottom: 24 }} />
        <h1 style={{ margin: "0 0 14px", fontFamily: "Cinzel, Georgia, serif", fontWeight: 700, color: "#EDF1F6", fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.08 }}>
          Thank you
        </h1>
        <p style={{ margin: "0 0 22px", color: "#C9D1DB", fontSize: 17, lineHeight: 1.6 }}>
          That goes to Community Elementary School. Stripe has emailed you the receipt.
        </p>
        <p style={{ margin: "0 0 26px", color: "#9FAAB8", fontSize: 15.5, lineHeight: 1.6 }}>
          Saturday, October 10, 2026 at Rancho Jaramillo. Spectating is free, so come and look
          whether or not you bring a car.
        </p>
        <a
          href="/"
          style={{ display: "inline-block", font: `700 14px/1 ${BODY}`, letterSpacing: ".04em", textTransform: "uppercase", color: "#FFFFFF", background: "#E5141A", borderRadius: 11, padding: "14px 22px", textDecoration: "none" }}
        >
          The Piston Powered Ranch
        </a>
      </div>
    </main>
  )
}
