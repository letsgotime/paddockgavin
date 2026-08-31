#!/usr/bin/env node
/**
 * Fails the build when a text colour is used as a fill.
 *
 * This exists because of a real failure that reached a live site twice. The
 * ranch has two reds:
 *
 *   --accent         #EF7A7D   pale, chosen for 7.2:1 as small text on dark
 *   --accent-strong  #E5141A   Jaramillo Red, the actual brand colour
 *
 * The pale one is not a lighter brand red. It is a contrast device for small
 * text, and using it as a background renders the brand pink. The mistake is
 * easy because both are "the accent" in conversation and neither looks wrong
 * in isolation: you only see it next to the real red.
 *
 * The rule this enforces: a background, border or fill takes the brand red.
 * Only a foreground colour may take the pale one.
 *
 * Runs before every build. If it fires, the fix is never to widen the rule.
 */

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const PALE = "#EF7A7D"
const PALE_TOKEN = /var\(--accent\)/
const STRONG_TOKEN = /--accent-strong/

/* Where the pale value is allowed to be defined at all. */
const TOKEN_FILES = new Set(["app/events/pistonpoweredranch/layout.tsx"])

/* Properties that paint a shape rather than a glyph. */
const FILL_PROPS = /\b(background|backgroundColor|borderTop|borderBottom|borderLeft|borderRight|border|fill|boxShadow|outline)\b/

const SKIP = new Set(["node_modules", ".next", ".git", "public", "scripts"])
const EXT = /\.(tsx?|jsx?|css)$/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (EXT.test(name)) out.push(p)
  }
  return out
}

const problems = []

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file)
  const lines = readFileSync(file, "utf8").split("\n")

  lines.forEach((line, i) => {
    const n = i + 1

    /* A fill property on the same line as the pale colour or the pale token. */
    const paleHere = line.includes(PALE) || (PALE_TOKEN.test(line) && !STRONG_TOKEN.test(line))
    if (paleHere && FILL_PROPS.test(line)) {
      problems.push({
        rel,
        n,
        line: line.trim().slice(0, 110),
        why: "the pale accent is painting a shape. Fills take --accent-strong (#E5141A).",
      })
      return
    }

    /* The raw value loose in a file that is not the token definition. Not fatal
       on its own, but it is how the value spreads out of reach of the tokens. */
    if (line.includes(PALE) && !TOKEN_FILES.has(rel) && !/\/\/|\/\*|\*/.test(line)) {
      const named = /const\s+[A-Z_]+\s*=/.test(line)
      if (!named) {
        problems.push({
          rel,
          n,
          line: line.trim().slice(0, 110),
          why: "raw pale accent inline. Name it once at the top of the file, or use var(--accent).",
        })
      }
    }
  })
}

if (problems.length) {
  console.error("\n\x1b[41m\x1b[97m BRAND CHECK FAILED \x1b[0m\n")
  console.error("The pale accent is a contrast device for small text, not a lighter brand red.")
  console.error("Painting with it is what turns the Piston Powered Ranch pink.\n")
  for (const p of problems) {
    console.error(`  \x1b[1m${p.rel}:${p.n}\x1b[0m`)
    console.error(`    ${p.line}`)
    console.error(`    \x1b[33m${p.why}\x1b[0m\n`)
  }
  console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"}. Build stopped.\n`)
  process.exit(1)
}

console.log("brand check: no text colours used as fills")
