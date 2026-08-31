import { NextResponse } from "next/server"
import crypto from "node:crypto"

/**
 * Auth emails, sent by us instead of by Neon.
 *
 * Neon Auth fires send.magic_link and send.otp when it needs to reach a user.
 * Subscribing to those events makes it skip its own email and call this
 * instead, handing over the link or the code. So the password reset arrives
 * from an address on our own domain, in our own type, rather than from
 * auth@mail.myneon.app with Neon's branding.
 *
 * That matters more than it looks. An unbranded email from a domain nobody
 * recognises, asking you to click a link and set a password, is
 * indistinguishable from a phishing attempt. Oscar should not have to make
 * that judgement.
 *
 * Branded to PaddockGavin rather than to the ranch on purpose. The account is a
 * CRM account that will outlive this event and serve the next one, so an email
 * about the account itself carries the house that owns it.
 *
 * Signature verification is Ed25519 over a detached JWS, per Neon's spec. An
 * unverified request is refused: this endpoint sends mail to addresses named in
 * its own payload, so an open one would be a spam relay.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const AUTH_BASE =
  process.env.NEON_AUTH_BASE_URL ||
  "https://ep-broad-truth-auz9r4ir.neonauth.c-10.us-east-1.aws.neon.tech/neondb/auth"

const FROM = "PaddockGavin <noreply@paddockgavin.com>"
const REPLY = "gavin@paddockgavin.com"
const MAX_AGE_MS = 5 * 60 * 1000

interface Payload {
  event_type?: string
  context?: { project_name?: string }
  user?: { email?: string; name?: string }
  event_data?: {
    link_url?: string
    link_type?: string
    otp_code?: string
    otp_type?: string
    expires_at?: string
  }
}

/** Ed25519 over a detached JWS. Follows Neon's documented signing input. */
async function verify(raw: string, h: Headers): Promise<Payload> {
  const signature = h.get("x-neon-signature")
  const kid = h.get("x-neon-signature-kid")
  const timestamp = h.get("x-neon-timestamp")
  if (!signature || !kid || !timestamp) throw new Error("missing signature headers")

  const res = await fetch(`${AUTH_BASE}/.well-known/jwks.json`)
  if (!res.ok) throw new Error("jwks unreachable")
  const jwks = (await res.json()) as { keys: { kid: string }[] }
  const jwk = jwks.keys.find((k) => k.kid === kid)
  if (!jwk) throw new Error("signing key not in jwks")

  const publicKey = crypto.createPublicKey({ key: jwk as crypto.JsonWebKey, format: "jwk" })

  const [headerB64, emptyPayload, signatureB64] = signature.split(".")
  if (emptyPayload !== "") throw new Error("expected detached jws")

  const payloadB64 = Buffer.from(raw, "utf8").toString("base64url")
  const signingInput = `${headerB64}.${Buffer.from(`${timestamp}.${payloadB64}`, "utf8").toString("base64url")}`

  const ok = crypto.verify(
    null,
    Buffer.from(signingInput),
    publicKey,
    Buffer.from(signatureB64, "base64url"),
  )
  if (!ok) throw new Error("bad signature")

  /* Without this a captured request stays replayable forever. */
  if (Date.now() - Number(timestamp) > MAX_AGE_MS) throw new Error("stale timestamp")

  return JSON.parse(raw) as Payload
}

const AMBER = "#F2C94C"
const INK = "#0A1523"
const PAPER = "#EDF1F6"
const MUTE = "#8b95a3"
const LINE = "#22303f"
const SANS = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', Menlo, Consolas, monospace"

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] as string)
}

/**
 * A dark PaddockGavin sheet, in the same table based, inline styled shape as
 * the ranch set: Outlook renders through Word, Gmail strips embedded CSS, and
 * a bulletproof button needs a VML arm or it comes out as a bare link.
 */
function shell(opts: { eyebrow: string; heading: string; body: string; cta?: { label: string; href: string }; foot: string }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="dark" /><meta name="supported-color-schemes" content="dark" />
<title>PaddockGavin</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style type="text/css">
  @media only screen and (max-width:620px){.shell{width:100% !important}.pad{padding-left:24px !important;padding-right:24px !important}.h1{font-size:29px !important}}
  a{color:${AMBER}}
</style></head>
<body style="margin:0;padding:0;background:#060c14;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060c14">
<tr><td align="center" style="padding:34px 12px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${INK};border:1px solid ${LINE}">
  <tr><td style="font-size:0;line-height:0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td height="4" width="25%" style="height:4px;background:${AMBER};font-size:0;line-height:0">&nbsp;</td>
      <td height="4" width="25%" style="height:4px;background:#00D2BE;font-size:0;line-height:0">&nbsp;</td>
      <td height="4" width="25%" style="height:4px;background:#005185;font-size:0;line-height:0">&nbsp;</td>
      <td height="4" width="25%" style="height:4px;background:#848482;font-size:0;line-height:0">&nbsp;</td>
    </tr></table>
  </td></tr>
  <tr><td class="pad" style="padding:32px 46px 0">
    <p style="margin:0;font-family:${SANS};font-size:20px;font-weight:900;letter-spacing:-.02em;color:#FFFFFF">
      PADDOCK<span style="color:#57C7F5">GAVIN</span></p>
    <p style="margin:22px 0 0;font-family:${MONO};font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:${AMBER}">${esc(opts.eyebrow)}</p>
    <h1 class="h1" style="margin:11px 0 0;font-family:${SANS};font-size:33px;font-weight:900;line-height:1.06;letter-spacing:-.032em;color:#FFFFFF;mso-line-height-rule:exactly">${esc(opts.heading)}</h1>
    <div style="margin:16px 0 0;font-family:${SANS};font-size:16.5px;line-height:1.65;color:#a9b4c2">${opts.body}</div>
  </td></tr>
  ${
    opts.cta
      ? `<tr><td class="pad" style="padding:26px 46px 0">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="${AMBER}" style="background:${AMBER}">
    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(opts.cta.href)}" style="height:48px;v-text-anchor:middle;width:260px" arcsize="0%" strokecolor="${AMBER}" fillcolor="${AMBER}"><w:anchorlock/><center style="color:#151000;font-family:${SANS};font-size:14px;font-weight:bold">${esc(opts.cta.label)}</center></v:roundrect><![endif]-->
    <!--[if !mso]><!-- --><a href="${esc(opts.cta.href)}" style="display:inline-block;padding:16px 34px;font-family:${SANS};font-size:14px;font-weight:900;letter-spacing:.03em;color:#151000;text-decoration:none;background:${AMBER}">${esc(opts.cta.label)}</a><!--<![endif]-->
    </td></tr></table></td></tr>`
      : ""
  }
  <tr><td class="pad" style="padding:28px 46px 34px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td height="1" style="height:1px;background:${LINE};font-size:0;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:16px 0 0;font-family:${SANS};font-size:13px;line-height:1.65;color:${MUTE}">${opts.foot}</td></tr>
    </table>
  </td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`
}

export async function POST(req: Request) {
  const raw = await req.text()

  let p: Payload
  try {
    p = await verify(raw, req.headers)
  } catch (err) {
    console.error("[auth-email] refused:", (err as Error).message)
    return NextResponse.json({ error: "unverified" }, { status: 400 })
  }

  const key = process.env.RESEND_API_KEY
  const to = p.user?.email
  if (!key || !to) {
    /* Answering non 2xx makes Neon retry, which is right: better a late email
       than a silently dropped one, since its own email is already skipped. */
    console.error("[auth-email] cannot send", { hasKey: !!key, hasTo: !!to })
    return NextResponse.json({ error: "not_ready" }, { status: 503 })
  }

  const d = p.event_data || {}
  const type = d.link_type || d.otp_type || ""
  const reset = type === "forget-password"

  let subject: string
  let html: string
  let text: string

  if (p.event_type === "send.magic_link" && d.link_url) {
    subject = reset ? "Set a new password" : "Your sign in link"
    html = shell({
      eyebrow: reset ? "Account access" : "Sign in",
      heading: reset ? "Set a new password" : "Your way in",
      body: reset
        ? `<p style="margin:0">Somebody asked to reset the password for this address. If that was you, the button below sets a new one and signs you straight into the console.</p>
           <p style="margin:14px 0 0">The link works once and expires shortly.</p>`
        : `<p style="margin:0">Here is your sign in link. It works once and expires shortly.</p>`,
      cta: { label: reset ? "Set a new password" : "Sign in", href: d.link_url },
      foot: `If you did not ask for this, ignore it and nothing changes. Nobody can use this link without the email it was sent to.<br /><br />
             Trouble with the button? Paste this into your browser:<br />
             <span style="font-family:${MONO};font-size:11.5px;color:${MUTE};word-break:break-all">${esc(d.link_url)}</span>`,
    })
    text = `${reset ? "Set a new password" : "Your sign in link"}\n\n${d.link_url}\n\nThe link works once and expires shortly. If you did not ask for this, ignore it.\n\nPaddockGavin`
  } else if (p.event_type === "send.otp" && d.otp_code) {
    subject = `${d.otp_code} is your code`
    html = shell({
      eyebrow: "Verification",
      heading: "Your code",
      body: `<p style="margin:0">Type this back into the page that asked for it.</p>
             <p style="margin:20px 0 0;font-family:${MONO};font-size:34px;letter-spacing:.22em;color:${PAPER};font-weight:600">${esc(d.otp_code)}</p>`,
      foot: "It expires shortly and works once. If you did not ask for it, ignore it.",
    })
    text = `Your code: ${d.otp_code}\n\nIt expires shortly and works once.\n\nPaddockGavin`
  } else {
    /* An event we do not render is still an event we accepted. 200 so Neon does
       not retry something we will never handle. */
    return NextResponse.json({ received: true, handled: false })
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY, subject, html, text }),
  })

  if (!res.ok) {
    console.error("[auth-email] resend refused:", (await res.text()).slice(0, 200))
    return NextResponse.json({ error: "send_failed" }, { status: 502 })
  }

  return NextResponse.json({ received: true, handled: true })
}
