import { NextResponse, type NextRequest } from "next/server"

/**
 * One page, two front doors.
 *
 * paddockgavin.com/events/pistonpoweredranch is the event inside our hub, in
 * our brand. pistonpoweredranch.com is the same page, same template, same
 * database, wearing Rancho Jaramillo's. Nothing is cloned: a clone is two
 * things to keep in step and one of them always rots. The host picks the
 * tokens and the markup is identical.
 *
 * Entries, RSVPs and submissions all land in the same Neon tables whichever
 * door they came through, because the form does not know or care what the
 * address bar says.
 */

const EVENT_HOSTS: Record<string, string> = {
  "pistonpoweredranch.com": "pistonpoweredranch",
  "www.pistonpoweredranch.com": "pistonpoweredranch",
}

/**
 * Short paths on the event's own domain.
 *
 * pistonpoweredranch.com/entry rather than
 * pistonpoweredranch.com/events/pistonpoweredranch/entry, which is the hub's
 * filing system leaking onto somebody else's address. The page is the same
 * one either way; only the address bar is shorter.
 */
/* Every event gets these at its own door. The store and the portal are not
   ranch pages that happen to be reachable elsewhere: they belong to whichever
   event the host resolves to, which is what makes a second event a row rather
   than a second codebase. */
const SHORT_PATHS = new Set([
  "/entry", "/vendor", "/sponsor", "/targets", "/store", "/portal",
  /* Under /vendor, because the tools proxy claims /vendor/:path* for its
     shared scripts and would otherwise answer these with a 404. Both are
     links people share: one is printed in every stall enquiry email and the
     other is where Stripe sends a paid vendor. */
  "/vendor/booth", "/vendor/paid", "/sponsor/paid",
  /* The field. One letter from /entry and a different job: that one is the
     form asking to come, this one is the answer about who is. Both are short
     paths because both are links somebody sends to somebody else. */
  "/entries",
])

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0]
  const slug = EVENT_HOSTS[host]
  if (!slug) return NextResponse.next()

  const url = req.nextUrl.clone()
  const path = url.pathname.replace(/\/+$/, "") || "/"

  /* The tools used to be redirected to their own deployment from here. They
     are now served on this domain by the rewrites in next.config.ts, which is
     what gives the team one session instead of two, so redirecting away would
     undo the point of it. */

  // The bare domain is the event's landing page.
  if (url.pathname === "/") {
    url.pathname = `/events/${slug}`
  } else if (path === "/status") {
    /* The status link in every confirmation email. It used to open a tool
       page that asked the database for the row on a token the public no
       longer has, and answered "could not check right now" to everyone.
       This page reads the row on the server and needs nothing from the
       visitor but the link. */
    url.pathname = `/events/${slug}/entry-status`
  } else if (SHORT_PATHS.has(path)) {
    url.pathname = `/events/${slug}${path}`
  }

  const res = NextResponse.rewrite(url)
  // Read by the layout to pick the brand server side, so the page arrives in
  // the right colours rather than repainting once JavaScript works out where
  // it is.
  res.headers.set("x-pg-brand", slug)
  return res
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
