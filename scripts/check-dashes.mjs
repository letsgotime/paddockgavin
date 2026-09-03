/**
 * Zero em dashes and zero en dashes in anything a reader sees.
 *
 * The rule is old and it kept being broken because nothing enforced it: the
 * sweep that cleared it once had to be run again months later, and the second
 * time there were a hundred and twenty four of them. A rule nobody checks is
 * a preference.
 *
 * Comments are exempt. They are notes between the people writing this, not
 * copy, and holding them to the house style buys nothing.
 */

import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOTS = ["app", "lib", "components"]
const EXT = /\.(ts|tsx|js|mjs|css)$/
const SKIP = new Set(["node_modules", ".next", ".git", "public"])
const DASH = /[–—]/

/** Blank out comment spans so only copy is left to judge. */
function withoutComments(src) {
  let out = src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => " ".repeat(m.length))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
  return out
    .split("\n")
    .map((line) => {
      const i = line.indexOf("//")
      if (i < 0) return line
      if (line.slice(Math.max(0, i - 3), i + 3).includes("://")) return line
      return line.slice(0, i) + " ".repeat(line.length - i)
    })
    .join("\n")
}

function walk(dir, hits) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { walk(p, hits); continue }
    if (!EXT.test(name)) continue
    const src = readFileSync(p, "utf8")
    if (!DASH.test(src)) continue
    const bare = withoutComments(src)
    bare.split("\n").forEach((line, i) => {
      if (DASH.test(line)) hits.push({ file: p, line: i + 1, text: src.split("\n")[i].trim().slice(0, 96) })
    })
  }
}

const hits = []
for (const r of ROOTS) walk(r, hits)

if (hits.length) {
  console.error(`\ndash check: ${hits.length} em or en dash${hits.length === 1 ? "" : "es"} in copy\n`)
  for (const h of hits) console.error(`  ${h.file}:${h.line}\n    ${h.text}`)
  console.error("\nUse a comma for an aside, a colon before a list, or a middot between names.\n")
  process.exit(1)
}
console.log("dash check: no em or en dashes in copy")
