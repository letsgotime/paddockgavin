import type { NextConfig } from "next"

/**
 * The team tools, served from the event's own domain.
 *
 * The tools deployment and this one each kept their own session, because the
 * auth client persists it in localStorage and localStorage is per origin. Two
 * origins, two sessions, and a team signing in twice to use one product.
 *
 * These rewrites put the tools on pistonpoweredranch.com, so there is one
 * origin and therefore one session. Nothing moves between deployments and no
 * page is rewritten: the tools keep running where they run, and this domain
 * stops being a second place to sign in.
 *
 * The list is explicit rather than a wildcard because the two sites disagree
 * about several prefixes. /brand and /og exist on both with different files,
 * and blanket forwarding either one would break the landing page. /show and
 * /events would bounce back here and loop. Everything below was checked
 * against both sides first.
 */
const TOOLS = "https://piston-powered-ranch.vercel.app"
const RANCH_HOST = [{ type: "host" as const, value: "(www\\.)?pistonpoweredranch\\.com" }]

/** Tool pages, and the directories they load their own assets from. */
const TOOL_PATHS = [
  "journeys", "board", "asks", "crew", "judging", "map", "site-plan", "rsvps",
  "chat", "console", "collateral", "clubs", "spectate", "status", "vote",
  "diag", "reset", "team", "vendor", "media", "tools",
]

/** The tools deployment's own functions. None of these names exist here. */
const TOOL_APIS = ["upload", "upload-session", "media", "planning", "config"]


const nextConfig: NextConfig = {
  async rewrites() {
    const proxy = (source: string, destination: string) => ({ source, destination, has: RANCH_HOST })
    return {
      beforeFiles: [
        ...TOOL_PATHS.flatMap((p) => [
          proxy(`/${p}`, `${TOOLS}/${p}/`),
          proxy(`/${p}/:path*`, `${TOOLS}/${p}/:path*`),
        ]),
        ...TOOL_APIS.map((a) => proxy(`/api/${a}`, `${TOOLS}/api/${a}`)),
        /* Two prefixes that exist on both sides with different files, so only
           the subpaths the tools own are forwarded. */
        proxy("/brand/rancho/:path*", `${TOOLS}/brand/rancho/:path*`),
        proxy("/brand/rancho", `${TOOLS}/brand/rancho/`),
        proxy("/brand/files/:path*", `${TOOLS}/brand/files/:path*`),
        proxy("/events/img/:path*", `${TOOLS}/events/img/:path*`),
        /* The singular reads better in a message and people type it. */
        proxy("/journey", `${TOOLS}/journeys/`),
      ],
    }
  },
  async headers() {
    return [
      // Static assets — long cache
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Images
      {
        source: "/images/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      // Favicon + icons
      {
        source: "/(favicon.ico|icon.png|apple-icon.png|icon-192.png|icon-512.png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      // OG image
      {
        source: "/opengraph-image",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      // Pages — short cache, revalidate in background
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=3600" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.cloudflare.com" },
      { protocol: "https", hostname: "**.r2.dev" },
    ],
  },
}

export default nextConfig
