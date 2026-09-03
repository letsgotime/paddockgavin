import { NextResponse } from "next/server"

const BASE = "https://api.dataforseo.com/v3"

function auth() {
  const login = process.env.DATAFORSEO_LOGIN_KEY!
  const pass  = process.env.DATAFORSEO_SECRET_KEY!
  return "Basic " + Buffer.from(`${login}:${pass}`).toString("base64")
}

async function dfs(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { Authorization: auth(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`DataForSEO ${path} → ${res.status}`)
  return res.json()
}

export async function GET() {
  const target = "paddockgavin.com"
  const keywords = [
    "exotic car broker nashville",
    "exotic car lot operations Nashville",
    "sell my exotic car",
    "exotic car content creator Tennessee",
    "lot operations manager Nashville",
    "supercar photography Nashville",
    "exotic car events Nashville",
    "paddock gavin",
  ]

  try {
    const [onPage, rankings, backlinks, vitals] = await Promise.allSettled([

      // 1. On-page summary
      dfs("/on_page/summary", [{ target, max_crawl_pages: 30, load_resources: false }]),

      // 2. Keyword rank checker
      dfs("/serp/google/organic/live/advanced", keywords.map(k => ({
        keyword: k,
        location_code: 2840, // United States
        language_code: "en",
        depth: 10,
      }))),

      // 3. Backlink summary
      dfs("/backlinks/summary/live", [{ target, include_subdomains: true }]),

      // 4. Core Web Vitals (PageSpeed)
      dfs("/on_page/lighthouse/live/json", [{
        url: `https://${target}`,
        for_mobile: false,
        categories: ["performance", "seo", "best-practices", "accessibility"],
      }]),
    ])

    return NextResponse.json({
      onPage:   onPage.status   === "fulfilled" ? onPage.value   : { error: (onPage   as PromiseRejectedResult).reason?.message },
      rankings: rankings.status === "fulfilled" ? rankings.value : { error: (rankings as PromiseRejectedResult).reason?.message },
      backlinks:backlinks.status=== "fulfilled" ? backlinks.value: { error: (backlinks as PromiseRejectedResult).reason?.message },
      vitals:   vitals.status   === "fulfilled" ? vitals.value   : { error: (vitals   as PromiseRejectedResult).reason?.message },
      keywords,
      fetchedAt: new Date().toISOString(),
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
