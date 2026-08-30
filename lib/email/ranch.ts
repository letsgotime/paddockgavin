/**
 * The Piston Powered Ranch email system.
 *
 * An invitation, not an app notification. Paper ground, engraved rules, Cinzel
 * over Georgia, Jaramillo Red used once per message. A concours field deserves
 * post rather than a dashboard toast.
 *
 * Everything here is shaped by what email clients actually do:
 *
 *   Tables, not flex or grid. Outlook renders through Word and has no support
 *   for either, and no amount of fallback CSS changes that.
 *
 *   Inline styles. Gmail strips <style> in several contexts, so the only rules
 *   left in the head are the media query, which Gmail keeps, and the dark mode
 *   guard. Nothing structural depends on them.
 *
 *   Cinzel will not load for most people. Gmail, Outlook and Yahoo all refuse
 *   web fonts, so the honest assumption is that the display line renders in
 *   Georgia. It is designed in Georgia and merely improves in Cinzel, rather
 *   than being designed in Cinzel and degrading.
 *
 *   No image carries meaning. Images are blocked by default in Outlook and in
 *   Gmail for unknown senders, so the identity is typographic. The mark is an
 *   enhancement, never the wordmark.
 *
 * Sizes stay well under Gmail's 102KB clipping threshold.
 */

const RED = "#B3121A" // Jaramillo Red, darkened for text weight on paper: 7.1:1
const RED_FILL = "#E5141A" // the brand red itself, for rules and fills
const INK = "#0A1523"
const BODY = "#3A4553"
const MUTE = "#6E7A8A"
const PAPER = "#FAF8F4"
const SURROUND = "#EDE9E1"
const HAIR = "#D9D3C8"

const DISPLAY = "Cinzel, 'Trajan Pro', Georgia, 'Times New Roman', serif"
const TEXT = "Georgia, 'Times New Roman', Times, serif"
const LABEL = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', Menlo, Consolas, 'Courier New', monospace"

export type Block =
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "facts"; rows: { label: string; value: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "button"; label: string; href: string }
  | { kind: "rule" }
  | { kind: "quiet"; text: string }
  | { kind: "links"; rows: { label: string; url: string; note?: string }[] }

export interface RanchEmail {
  preheader: string
  /** A photographic plate under the rule. Optional, and deliberately so: it is
      the one part of the message that can fail to arrive. Images are blocked by
      default in Outlook and in Gmail for unknown senders, so the cell carries a
      background colour and real alt text, and nothing the reader needs is only
      in the picture. */
  image?: { src: string; alt: string }
  eyebrow: string
  heading: string
  blocks: Block[]
  /** Sits under the rule at the foot, above the address line. */
  signoff?: string
  unsubscribe?: string
}

function esc(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string)
}

/** Word wraps preheader padding so the preview line is not padded with content. */
function preheaderPad(): string {
  return "&#847; &zwnj; &nbsp; ".repeat(30)
}

function paragraph(text: string, size = 16.5, color = BODY): string {
  return `<tr><td style="padding:0 0 18px;font-family:${TEXT};font-size:${size}px;line-height:1.68;color:${color};mso-line-height-rule:exactly">${text}</td></tr>`
}

function renderBlock(b: Block): string {
  switch (b.kind) {
    case "lead":
      return `<tr><td style="padding:0 0 20px;font-family:${TEXT};font-size:18.5px;line-height:1.6;color:${INK};mso-line-height-rule:exactly">${esc(b.text)}</td></tr>`

    case "p":
      return paragraph(esc(b.text))

    case "quiet":
      return `<tr><td style="padding:0 0 18px;font-family:${TEXT};font-size:15px;line-height:1.6;color:${MUTE};mso-line-height-rule:exactly">${esc(b.text)}</td></tr>`

    case "rule":
      return `<tr><td style="padding:6px 0 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;line-height:1px;font-size:0;background:${HAIR}">&nbsp;</td></tr></table></td></tr>`

    case "list":
      return `<tr><td style="padding:0 0 18px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${b.items
            .map(
              (i) => `<tr>
            <td width="18" valign="top" style="padding:0 0 9px;font-family:${TEXT};font-size:16.5px;line-height:1.6;color:${RED};mso-line-height-rule:exactly">&bull;</td>
            <td valign="top" style="padding:0 0 9px;font-family:${TEXT};font-size:16.5px;line-height:1.6;color:${BODY};mso-line-height-rule:exactly">${esc(i)}</td>
          </tr>`,
            )
            .join("")}
        </table></td></tr>`

    /* The engraved panel. Hairline above and below rather than a filled box,
       because a filled box reads as a UI card and this should read as a card
       of a different kind. */
    case "facts":
      return `<tr><td style="padding:4px 0 26px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${HAIR};border-bottom:1px solid ${HAIR}">
          ${b.rows
            .map(
              (r, i) => `<tr>
            <td style="padding:${i === 0 ? "16px" : "10px"} 0 ${i === b.rows.length - 1 ? "16px" : "10px"};font-family:${LABEL};font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:${MUTE};white-space:nowrap;vertical-align:top" valign="top">${esc(r.label)}</td>
            <td align="right" style="padding:${i === 0 ? "16px" : "10px"} 0 ${i === b.rows.length - 1 ? "16px" : "10px"};font-family:${TEXT};font-size:16px;line-height:1.45;color:${INK};mso-line-height-rule:exactly" valign="top">${esc(r.value)}</td>
          </tr>`,
            )
            .join("")}
        </table></td></tr>`

    /* Full URLs, laid out. A welcome email gets referred back to for months, and
       a link whose text says "here" is worthless the second time it is opened.
       The address is printed as well as linked, so it survives being forwarded,
       printed, or read in a client that strips anchors. */
    case "links":
      return `<tr><td style="padding:2px 0 24px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${HAIR}">
          ${b.rows
            .map(
              (r) => `<tr><td style="padding:14px 0;border-bottom:1px solid ${HAIR}">
            <div style="font-family:${LABEL};font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:${MUTE};padding-bottom:5px">${esc(r.label)}</div>
            <a href="${esc(r.url)}" style="font-family:${MONO};font-size:13.5px;line-height:1.5;color:${RED};text-decoration:none;word-break:break-all">${esc(r.url)}</a>
            ${r.note ? `<div style="font-family:${TEXT};font-size:14.5px;line-height:1.55;color:${BODY};padding-top:6px">${esc(r.note)}</div>` : ""}
          </td></tr>`,
            )
            .join("")}
        </table></td></tr>`

    /* Bulletproof button. The VML arm is what Outlook actually paints, because
       Word ignores padding on anchors and would otherwise render a bare link. */
    case "button":
      return `<tr><td style="padding:6px 0 28px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="${RED_FILL}" style="background:${RED_FILL}">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(b.href)}" style="height:46px;v-text-anchor:middle;width:250px" arcsize="0%" strokecolor="${RED_FILL}" fillcolor="${RED_FILL}">
          <w:anchorlock/><center style="color:#FFFFFF;font-family:${LABEL};font-size:12px;font-weight:bold;letter-spacing:1.6px">${esc(b.label.toUpperCase())}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <a href="${esc(b.href)}" style="display:inline-block;padding:15px 34px;font-family:${LABEL};font-size:12px;font-weight:bold;letter-spacing:.16em;text-transform:uppercase;color:#FFFFFF;text-decoration:none;background:${RED_FILL}">${esc(b.label)}</a>
        <!--<![endif]-->
        </td></tr></table></td></tr>`
  }
}

export function renderRanchEmail(e: RanchEmail): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>The Piston Powered Ranch</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->
<style type="text/css">
  /* Gmail keeps media queries even when it strips other embedded rules, so the
     mobile pass is safe to put here. Nothing structural depends on it. */
  @media only screen and (max-width:620px){
    .shell{width:100% !important}
    .pad{padding-left:24px !important;padding-right:24px !important}
    .h1{font-size:30px !important;line-height:1.14 !important}
  }
  /* Apple Mail and Outlook.com invert light emails. Holding the ground and the
     ink explicitly stops the paper turning grey and the red turning pink. */
  @media (prefers-color-scheme:dark){
    .ground{background:${SURROUND} !important}
    .sheet{background:${PAPER} !important}
    .ink{color:${INK} !important}
    .body{color:${BODY} !important}
    .mute{color:${MUTE} !important}
  }
  a{color:${RED}}
</style>
</head>
<body class="ground" style="margin:0;padding:0;background:${SURROUND};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">

<div style="display:none;font-size:1px;color:${SURROUND};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${esc(e.preheader)}${preheaderPad()}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ground" style="background:${SURROUND}">
<tr><td align="center" style="padding:34px 12px">

  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" class="shell sheet" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${PAPER}">

    <!-- The red rule. One brand gesture, at the top, and then restraint. -->
    <tr><td height="3" style="height:3px;line-height:3px;font-size:0;background:${RED_FILL}">&nbsp;</td></tr>
${
      e.image
        ? `<tr><td bgcolor="${INK}" style="background:${INK};font-size:0;line-height:0">
      <img src="${esc(e.image.src)}" width="600" height="300" alt="${esc(e.image.alt)}"
        style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;font-family:${LABEL};font-size:12px;line-height:1.5;color:#FAF8F4" />
    </td></tr>`
        : ""
    }

    <tr><td class="pad" style="padding:34px 46px 0">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center" style="font-family:${DISPLAY};font-size:15px;letter-spacing:.34em;text-transform:uppercase;color:${INK};padding:0 0 4px" class="ink">The Piston Powered Ranch</td></tr>
        <tr><td align="center" style="font-family:${LABEL};font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:${MUTE};padding:0 0 30px" class="mute">Rancho Jaramillo &middot; Unionville, Tennessee</td></tr>
      </table>
    </td></tr>

    <tr><td class="pad" style="padding:0 46px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family:${LABEL};font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:${RED};padding:0 0 12px">${esc(e.eyebrow)}</td></tr>
        <tr><td class="h1 ink" style="font-family:${DISPLAY};font-size:36px;line-height:1.1;letter-spacing:-.005em;color:${INK};padding:0 0 22px;mso-line-height-rule:exactly">${esc(e.heading)}</td></tr>
        ${e.blocks.map(renderBlock).join("")}
      </table>
    </td></tr>

    ${
      e.signoff
        ? `<tr><td class="pad" style="padding:0 46px 6px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td height="1" style="height:1px;line-height:1px;font-size:0;background:${HAIR}">&nbsp;</td></tr>
        <tr><td style="padding:18px 0 0;font-family:${TEXT};font-size:15px;line-height:1.6;color:${MUTE};mso-line-height-rule:exactly" class="mute">${esc(e.signoff)}</td></tr>
      </table></td></tr>`
        : ""
    }

    <tr><td class="pad" style="padding:30px 46px 38px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center" style="font-family:${LABEL};font-size:11px;line-height:1.7;color:${MUTE}" class="mute">
          Saturday 10 October 2026 &middot; 9am to 3pm<br />
          Rancho Jaramillo, Unionville, Tennessee<br />
          <span style="color:${HAIR};letter-spacing:.3em">&middot;&nbsp;&middot;&nbsp;&middot;</span><br />
          A PaddockGavin event, benefiting Community Elementary School
          ${e.unsubscribe ? `<br /><a href="${esc(e.unsubscribe)}" style="color:${MUTE};text-decoration:underline">Unsubscribe</a>` : ""}
        </td></tr>
      </table>
    </td></tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->

</td></tr>
</table>
</body>
</html>`
}

/** Plain text alternative. Sent alongside every message: some clients prefer it,
 *  some people insist on it, and a message with no text part looks like spam. */
export function renderRanchText(e: RanchEmail): string {
  const lines: string[] = ["THE PISTON POWERED RANCH", "Rancho Jaramillo, Unionville, Tennessee", "", e.heading.toUpperCase(), ""]
  for (const b of e.blocks) {
    if (b.kind === "p" || b.kind === "lead" || b.kind === "quiet") lines.push(b.text, "")
    else if (b.kind === "list") lines.push(...b.items.map((i) => `  - ${i}`), "")
    else if (b.kind === "facts") lines.push(...b.rows.map((r) => `  ${r.label}: ${r.value}`), "")
    else if (b.kind === "button") lines.push(`${b.label}: ${b.href}`, "")
    else if (b.kind === "links") {
      for (const r of b.rows) {
        lines.push(`${r.label.toUpperCase()}`, `  ${r.url}`)
        if (r.note) lines.push(`  ${r.note}`)
        lines.push("")
      }
    }
  }
  if (e.signoff) lines.push(e.signoff, "")
  lines.push("Saturday 10 October 2026, 9am to 3pm", "Rancho Jaramillo, Unionville, Tennessee", "A PaddockGavin event, benefiting Community Elementary School")
  if (e.unsubscribe) lines.push("", `Unsubscribe: ${e.unsubscribe}`)
  return lines.join("\n")
}
