#!/usr/bin/env node
/**
 * NO PINK. Fails the build when any colour in the source could paint the
 * Piston Powered Ranch, or anything else in this repo, pink.
 *
 * This exists because pink reached the live site three separate times, by
 * three different routes:
 *
 *   1. A pale text accent (#EF7A7D) used as a background and a border.
 *   2. A "third red" (#E5484D) that was never in the brand, used as a
 *      card border and an eyebrow.
 *   3. A coral error colour (#ef6d70) on validation messages.
 *
 * None of them looked wrong in isolation. A grep for one hex value cannot
 * catch the next one, so this does not grep for hex values. It reads every
 * colour literal in the source, works out what it is, and applies two rules.
 *
 * RULE 1, everywhere in the repo: no colour in the red family may be pink.
 *   Pink is a red with white in it. Measured as the smallest RGB channel:
 *   Jaramillo Red #E5141A has 20/255 of white in it, the pale accent had 122.
 *   Anything red-family with more than 20% white is pink, salmon, coral or
 *   rose, and the build stops. Tailwind pink/rose/fuchsia classes and the
 *   light red shades (red-50 to red-400) count too, as do the named CSS
 *   colours (pink, salmon, coral, crimson...).
 *
 * RULE 2, on ranch surfaces: the only reds are the brand's.
 *   JARAMILLO_RED  #E5141A  paints anything: fills, borders, rules, display.
 *   RANCH_RED_TEXT #FF1A21  the same hue and saturation lifted six points of
 *                           lightness so 11px mono eyebrows reach 4.74:1 on
 *                           the ink. It is a text colour. It never paints a
 *                           shape, and var(--accent) never does either.
 *   RANCH_RED_INK  #B3121A  the same red taken down for text on paper (email,
 *                           print), 7.1:1 on white. Text only, like the tint.
 *   Any other red-family colour on a ranch surface stops the build, pink or
 *   not, so a fourth red cannot appear.
 *
 * RULE 3, everywhere: dark type never sits on the brand red.
 *   A button painted #E5141A or var(--accent-strong) carries white
 *   (var(--on-accent) resolves to white on the ranch door and dark on ours,
 *   because the same token is amber there). "Count me in" shipped in near
 *   black on red once. It will not again.
 *
 * RULE 4, the share cards: pixels are checked as pixels.
 *   The og:image is a JPEG, so no colour literal in the source could catch
 *   the pale salmon it carried, and every iMessage preview shipped it. Every
 *   file in public/og is decoded and scanned; a red-family pixel with more
 *   than 20% white is pink, and more than 0.02% of them stops the build.
 *   The old card measured 0.2%.
 *
 * Runs before every build (`pnpm build`) and on demand (`pnpm check:brand`).
 * If it fires, the fix is the colour, never the rule.
 */

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const ROOT = process.cwd()

const JARAMILLO_RED = "#E5141A"
const RANCH_RED_TEXT = "#FF1A21"
const RANCH_RED_INK = "#B3121A"

/* Files that render on pistonpoweredranch.com, or carry its brand. */
const RANCH_SURFACES = [
  "app/events/pistonpoweredranch/",
  "components/rsvp-block.tsx",
  "components/ranch-gallery.tsx",
  "lib/email/ranch.ts",
  "emails/",
]

/* Type colours that vanish on the brand red. */
const DARK_TEXT = /\bcolor:\s*["'`](#(?:101010|04211d|0a1523|070d14|000000|000|111111|1a1a1a)|black)\b/i
const RED_FILL = /\b(background|backgroundColor)\b[^,;]*?(#E5141A|var\(--accent-strong\))/i

/* Properties that paint a shape rather than a glyph. */
const FILL_PROPS =
  /\b(background|backgroundColor|backgroundImage|borderTop|borderBottom|borderLeft|borderRight|borderColor|border|fill|boxShadow|outline|outlineColor|stroke|textDecorationColor|accentColor|caretColor)\b/

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", "out", "dist", "coverage"])
const SKIP_FILES = new Set(["scripts/check-brand.mjs"])
const EXT = /\.(tsx?|jsx?|mjs|cjs|css|scss|mdx|html|svg)$/

/**
 * Third party marks are not ours to recolour.
 *
 * Google's G is #4285F4, #34A853, #FBBC05 and #EA4335, and that last one is a
 * red carrying 21% white, so this check would otherwise call it pink and stop
 * the build. Their brand guidelines require those exact values, so the mark is
 * exempt where all four appear together, which is a whole G and not somebody
 * sneaking one pink through under cover.
 */
const GOOGLE_MARK = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"]
const isGoogleMark = (source) => GOOGLE_MARK.every((c) => source.toUpperCase().includes(c))

const NAMED_PINKS =
  /\b(pink|hotpink|lightpink|deeppink|palevioletred|mediumvioletred|salmon|lightsalmon|darksalmon|lightcoral|coral|tomato|crimson|indianred|mistyrose|lavenderblush|rosybrown|orchid|violet)\b/i
const TAILWIND_PINK =
  /(?:^|[\s"'`:/])(?:[a-z-]+:)*(?:text|bg|border|ring|from|to|via|fill|stroke|shadow|outline|decoration|accent|caret|divide|placeholder|ring-offset|border-[trblxy])-(?:pink|rose|fuchsia)-\d{2,3}\b/
const TAILWIND_LIGHT_RED =
  /(?:^|[\s"'`:/])(?:[a-z-]+:)*(?:text|bg|border|ring|from|to|via|fill|stroke|shadow|outline|decoration|accent|caret|divide|placeholder|ring-offset|border-[trblxy])-red-(?:50|100|200|300|400)\b/

const HEX = /#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi
const RGB = /rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/gi
const HSL = /hsla?\(\s*(-?\d+(?:\.\d+)?)(?:deg)?\s*[, ]\s*(\d+(?:\.\d+)?)%\s*[, ]\s*(\d+(?:\.\d+)?)%/gi

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (EXT.test(name)) out.push(p)
  }
  return out
}

function hexToRgb(h) {
  let s = h.replace("#", "")
  if (s.length === 3 || s.length === 4) s = [...s.slice(0, 3)].map((c) => c + c).join("")
  s = s.slice(0, 6)
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
}

function hslToRgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360
  s /= 100
  l /= 100
  if (s === 0) return [l * 255, l * 255, l * 255]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const f = (t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255]
}

/* Hue and saturation in HSL, plus "white": the smallest channel, 0..1. */
function describe([r, g, b]) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return { h, s, l, white: min }
}

function isRedFamily({ h, s, l }) {
  return (h >= 330 || h <= 20) && s >= 0.25 && l >= 0.08 && l <= 0.95
}

function isPink(d) {
  return isRedFamily(d) && d.white > 0.2
}

function canonRgb([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase()
}

function canon(hex) {
  return canonRgb(hexToRgb(hex))
}

function isComment(line) {
  const t = line.trim()
  return t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")
}

const problems = []
const push = (rel, n, line, why) => problems.push({ rel, n, line: line.trim().slice(0, 120), why })

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).split(sep).join("/")
  if (SKIP_FILES.has(rel)) continue
  const ranch = RANCH_SURFACES.some((s) => (s.endsWith("/") ? rel.startsWith(s) : rel === s))
  const source = readFileSync(file, "utf8")
  const exemptMark = isGoogleMark(source)
  const lines = source.split("\n")

  lines.forEach((raw, i) => {
    const n = i + 1
    if (isComment(raw)) return
    /* Drop trailing and inline comments so prose like "never a fill" is not read as a property. */
    const line = raw.replace(/\/\*.*?\*\//g, "").replace(/(^|\s)\/\/.*$/, "")
    const fills = FILL_PROPS.test(line)

    /* Every colour literal on the line, resolved to RGB. */
    const found = []
    for (const m of line.matchAll(HEX)) found.push({ raw: m[0], rgb: hexToRgb(m[0]), hex: canon(m[0]) })
    for (const m of line.matchAll(RGB)) found.push({ raw: m[0], rgb: [+m[1], +m[2], +m[3]], hex: canonRgb([+m[1], +m[2], +m[3]]) })
    for (const m of line.matchAll(HSL)) found.push({ raw: m[0], rgb: hslToRgb(+m[1], +m[2], +m[3]), hex: canonRgb(hslToRgb(+m[1], +m[2], +m[3])) })

    for (const c of found) {
      const d = describe(c.rgb)
      if (!isRedFamily(d)) continue
      if (exemptMark && GOOGLE_MARK.includes(c.hex)) continue

      if (isPink(d)) {
        push(rel, n, line, `${c.raw} is pink (${Math.round(d.white * 100)}% white in a red). Reds on this site are ${JARAMILLO_RED}, or ${RANCH_RED_TEXT} for small text.`)
        continue
      }

      if (ranch) {
        if (c.hex === JARAMILLO_RED) continue
        if (c.hex === RANCH_RED_TEXT || c.hex === RANCH_RED_INK) {
          if (fills) push(rel, n, line, `${c.hex} is a text red. It never paints a shape. Fills take ${JARAMILLO_RED}.`)
          continue
        }
        push(rel, n, line, `${c.raw} is a red that is not the brand's. On ranch surfaces the only reds are ${JARAMILLO_RED} and, for text, ${RANCH_RED_TEXT} on the ink or ${RANCH_RED_INK} on paper.`)
      }
    }

    /* Dark type on the brand red. */
    if (RED_FILL.test(line) && DARK_TEXT.test(line)) {
      push(rel, n, line, "dark type on the brand red is unreadable. A red fill carries var(--on-accent) (white on the ranch).")
    }

    /* The text token painting a shape. --accent-strong on the same line is fine. */
    if (fills && /var\(--accent\)/.test(line) && !/--accent-strong/.test(line)) {
      push(rel, n, line, "var(--accent) is a text colour. Fills take var(--accent-strong).")
    }

    if (NAMED_PINKS.test(line) && /(color|background|border|fill|stroke|shadow|outline)\s*[:=]/i.test(line)) {
      push(rel, n, line, "a named CSS pink/coral/rose colour.")
    }
    if (TAILWIND_PINK.test(line)) push(rel, n, line, "a Tailwind pink/rose/fuchsia class.")
    if (TAILWIND_LIGHT_RED.test(line)) push(rel, n, line, "a light Tailwind red (red-50 to red-400) is pink. Use red-600 or deeper, or the brand hex.")
  })
}

/* RULE 4. Share cards, decoded with sharp and read pixel by pixel. */
const IMAGE_DIRS = ["public/og"]
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i
/* Photographs, not cards. The Asks share card is a horse, and a horse's
   muzzle is pink. The card is right and the rule is right; they disagree
   about one animal. */
const PHOTOGRAPHS = new Set(["asks-og.jpg", "asks-og-1200.jpg"])
const INK = [10, 21, 35]
const PINK_LIMIT = 0.0002 // 0.02% of pixels. Anti-aliasing on a dark card sits an order of magnitude under this.

async function checkImages() {
  let sharp
  try {
    sharp = (await import("sharp")).default
  } catch {
    console.warn("brand check: sharp is not installed here, so the share cards were not scanned")
    return
  }
  for (const dir of IMAGE_DIRS) {
    let names = []
    try {
      names = readdirSync(join(ROOT, dir))
    } catch {
      continue
    }
    for (const name of names) {
      if (!IMAGE_EXT.test(name)) continue
      if (PHOTOGRAPHS.has(name)) continue
      const rel = `${dir}/${name}`
      const { data, info } = await sharp(join(ROOT, dir, name))
        .resize({ width: 600, withoutEnlargement: true })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      const total = info.width * info.height
      let pink = 0
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3] / 255
        if (a < 0.05) continue
        const rgb = [
          data[i] * a + INK[0] * (1 - a),
          data[i + 1] * a + INK[1] * (1 - a),
          data[i + 2] * a + INK[2] * (1 - a),
        ]
        if (isPink(describe(rgb))) pink++
      }
      const share = pink / total
      if (share > PINK_LIMIT && pink >= 20) {
        push(rel, 0, `${info.width}x${info.height} scanned, ${pink} pink pixels`, `${(share * 100).toFixed(3)}% of this share card is pink (limit ${(PINK_LIMIT * 100).toFixed(2)}%). Re-cut it with the brand reds; iMessage and Facebook will show whatever is here.`)
      }
    }
  }
}

await checkImages()

if (problems.length) {
  console.error("\n\x1b[41m\x1b[97m BRAND CHECK FAILED: PINK \x1b[0m\n")
  console.error(`The reds on this site are ${JARAMILLO_RED} (anything) and ${RANCH_RED_TEXT} (small text on the ink). Nothing else red-family.\n`)
  for (const p of problems) {
    console.error(`  \x1b[1m${p.rel}:${p.n}\x1b[0m`)
    console.error(`    ${p.line}`)
    console.error(`    \x1b[33m${p.why}\x1b[0m\n`)
  }
  console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"}. Build stopped.\n`)
  process.exit(1)
}

console.log(`brand check: no pink in the source or the share cards, no off-brand reds (${JARAMILLO_RED} paints, ${RANCH_RED_TEXT} writes)`)
