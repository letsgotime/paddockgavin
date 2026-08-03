import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const RECIPIENTS = [
  { email: "bekah@gotimemotorsports.com", name: "Bekah" },
  { email: "gavinbrooks20@gmail.com",      name: "Gavin" },
]

const SITE = "https://paddockgavin.com"

export async function POST() {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 })
  }

  const results = await Promise.allSettled(
    RECIPIENTS.map(({ email, name }) =>
      resend.emails.send({
        from:    "PaddockGavin <noreply@paddockgavin.com>",
        to:      email,
        subject: "PaddockGavin — Official Logo Files",
        html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Helvetica,Arial,sans-serif;color:#EDF1F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <tr><td>
      <p style="font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#8B93A7;margin:0 0 24px;">PaddockGavin · Brand Assets</p>
      <h1 style="font-size:28px;font-weight:900;letter-spacing:-.02em;color:#EDF1F6;margin:0 0 8px;">Hey ${name},</h1>
      <p style="font-size:16px;line-height:1.6;color:#8B93A7;margin:0 0 32px;">Here are the official PaddockGavin logo files. Three formats — monogram, wordmark on dark, wordmark on light. SVG is the master; use it anywhere you need to resize.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
        <tr>
          <td style="padding:16px;background:#0E1A2A;border:1px solid rgba(255,255,255,.1);">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#57C7F5;">Monogram · PG mark</p>
            <a href="${SITE}/brand/pg-monogram.svg" style="color:#F2C94C;font-size:14px;text-decoration:none;">Download SVG →</a>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:16px;background:#0E1A2A;border:1px solid rgba(255,255,255,.1);">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#57C7F5;">Wordmark · Dark background</p>
            <a href="${SITE}/brand/pg-wordmark-dark.svg" style="color:#F2C94C;font-size:14px;text-decoration:none;">Download SVG →</a>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:16px;background:#F5F5F0;border:1px solid rgba(0,0,0,.08);">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#0A0E1A;">Wordmark · Light background</p>
            <a href="${SITE}/brand/pg-wordmark-light.svg" style="color:#F2C94C;font-size:14px;text-decoration:none;">Download SVG →</a>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:16px;background:#0E1A2A;border:1px solid rgba(255,255,255,.1);">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#57C7F5;">PNG files (existing)</p>
            <a href="${SITE}/images/logo-on-dark.png" style="color:#F2C94C;font-size:14px;text-decoration:none;">logo-on-dark.png →</a><br>
            <a href="${SITE}/images/logo-on-light.png" style="color:#F2C94C;font-size:14px;text-decoration:none;">logo-on-light.png →</a><br>
            <a href="${SITE}/images/mark-on-dark.png" style="color:#F2C94C;font-size:14px;text-decoration:none;">mark-on-dark.png →</a>
          </td>
        </tr>
      </table>

      <p style="font-size:13px;color:#8B93A7;margin:0;">Questions — reply to this email.<br><span style="color:#EDF1F6;">PaddockGavin</span> · Nashville</p>
    </td></tr>
  </table>
</body>
</html>`,
      })
    )
  )

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason?.message ?? "unknown error")

  if (errors.length) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sent: RECIPIENTS.map((r) => r.email) })
}
