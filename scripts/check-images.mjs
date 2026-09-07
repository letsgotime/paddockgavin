/**
 * Every /images/ path written in the source must exist on disk.
 *
 * Five photographs on /cars were referenced but never committed, so that
 * section shipped to production as five broken boxes with the alt text
 * showing. Nothing caught it: the build succeeds, the types are fine, and a
 * missing file only becomes visible when somebody looks at the page.
 *
 * This is the cheapest possible check and it runs before every build.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const SKIP = new Set(["node_modules", ".next", ".git", ".claude", "public", "out", "dist", "coverage"])
const REF = /["'`](\/images\/[A-Za-z0-9._/-]+\.(?:webp|jpg|jpeg|png|avif|svg))["'`]/g

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|jsx?|mjs)$/.test(name)) out.push(p)
  }
  return out
}

const missing = []
let checked = 0
for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8")
  for (const m of src.matchAll(REF)) {
    checked++
    if (!existsSync(join(ROOT, "public", m[1]))) {
      missing.push({ file: relative(ROOT, file), img: m[1] })
    }
  }
}

if (missing.length) {
  console.error("\n\x1b[41m\x1b[97m IMAGE CHECK FAILED \x1b[0m\n")
  for (const { file, img } of missing) {
    console.error(`  \x1b[1m${file}\x1b[0m`)
    console.error(`    \x1b[33m${img} is referenced but not in public/\x1b[0m\n`)
  }
  console.error(`${missing.length} missing of ${checked} referenced. Build stopped.\n`)
  process.exit(1)
}
console.log(`image check: ${checked} image references, all present on disk`)
