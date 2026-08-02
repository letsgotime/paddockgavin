import sharp from "sharp"

// Recolor the teal swoosh (#00D2BE-ish) to Speed Blue (#57C7F5).
// Gold letters (#F8B800) and navy background are left untouched.
const SPEED_BLUE = { r: 0x57, g: 0xc7, b: 0xf5 }

// Files to process: [source, dest]
const targets = [
  ["public/images/mark-on-dark-96.png", "public/images/mark-on-dark-96.png"],
  ["public/images/mark-on-dark.png", "public/images/mark-on-dark.png"],
  ["public/images/mark-on-light-96.png", "public/images/mark-on-light-96.png"],
  ["public/images/mark-on-light.png", "public/images/mark-on-light.png"],
]

// A pixel counts as "teal" when green & blue channels are both high
// and clearly exceed red. This matches teal/cyan but NOT gold or navy.
function isTeal(r, g, b) {
  return g > 120 && b > 120 && r < 140 && g - r > 40 && b - r > 40
}

for (const [src, dest] of targets) {
  const img = sharp(src).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let count = 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const a = channels === 4 ? data[i + 3] : 255
    if (a > 10 && isTeal(r, g, b)) {
      data[i] = SPEED_BLUE.r
      data[i + 1] = SPEED_BLUE.g
      data[i + 2] = SPEED_BLUE.b
      count++
    }
  }
  await sharp(data, { raw: { width, height, channels } }).png().toFile(dest + ".tmp")
  console.log(`[recolor] ${src}: ${count} teal px -> Speed Blue`)
}
console.log("[recolor] done")
