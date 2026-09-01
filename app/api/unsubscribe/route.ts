import { type NextRequest, NextResponse } from "next/server"
import { unsubscribe } from "@/lib/events/digest"

/**
 * The way out of the weekly letter.
 *
 * A token in the link, no sign in, no reply, one click. Answers the same way
 * whether the token was already used or never existed, because somebody
 * clicking twice should not be told it failed, and a stranger guessing tokens
 * should learn nothing from the difference.
 *
 * POST is here because Gmail and Apple Mail use List-Unsubscribe-Post to do it
 * for the reader without opening anything.
 */

export const dynamic = "force-dynamic"

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function page(title: string, line: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Archivo:wght@400;700&display=swap">
</head>
<body style="margin:0;background:#0A1523;color:#C9D1DB;font:400 17px/1.6 Archivo,Helvetica,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
<div style="max-width:34rem">
  <div style="height:3px;width:54px;background:#E5141A;margin-bottom:22px"></div>
  <h1 style="font:700 clamp(28px,5vw,40px)/1.1 Cinzel,Georgia,serif;color:#EDF1F6;margin:0 0 14px">${title}</h1>
  <p style="margin:0 0 22px">${line}</p>
  <a href="https://pistonpoweredranch.com" style="display:inline-block;font:700 14px/1 Archivo,Helvetica,Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#FFFFFF;background:#E5141A;border-radius:11px;padding:14px 22px;text-decoration:none">The Piston Powered Ranch</a>
</div>
</body></html>`
}

async function handle(req: NextRequest) {
  const token = (req.nextUrl.searchParams.get("t") || "").trim()
  const html = (title: string, line: string) =>
    new NextResponse(page(title, line), { headers: { "Content-Type": "text/html; charset=utf-8" } })

  if (!TOKEN.test(token)) {
    return html("That link is not one of ours", "Check the address, or reply to any of our emails and we will take you off by hand.")
  }

  const ok = await unsubscribe(token)
  if (!ok) {
    return html("We could not reach the list", "Nothing changed. Try again in a minute, or reply to any of our emails and we will do it by hand.")
  }
  return html(
    "Done. No more emails.",
    "You are off the weekly list. Your RSVP still stands, so come on the tenth if you want to; we simply will not write to you again.",
  )
}

export async function GET(req: NextRequest) {
  return handle(req)
}

/** One click, from the mail client's own button. */
export async function POST(req: NextRequest) {
  await handle(req)
  return new NextResponse(null, { status: 204 })
}
