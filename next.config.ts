import type { NextConfig } from "next"

/**
 * The team tools, on this deployment.
 *
 * They were static pages on a second Vercel project, proxied onto
 * pistonpoweredranch.com by a list of rewrites so the team had one origin and
 * one session. On 3 September 2026 the pages and their assets moved into
 * public/ here, so the domain serves them itself and the proxy shrinks to the
 * handful of functions not yet ported: the uploads, the media signer, the
 * planning document, the public config, and the sign in server. Each of
 * those comes across in turn; when the list below is empty the second
 * deployment can be retired.
 *
 * public/ has no directory index, so /console has to be told it means
 * /console/index.html. Only on the event's own host, as before: on
 * paddockgavin.com these paths were never pages.
 */
const TOOLS = "https://piston-powered-ranch.vercel.app"
const RANCH_HOST = [{ type: "host" as const, value: "(www\\.)?pistonpoweredranch\\.com" }]

/** Tool pages under public/, each a directory with an index.html. */
const TOOL_PAGES = [
  "journeys", "board", "asks", "crew", "judging", "map", "site-plan", "rsvps",
  "chat", "console", "collateral", "clubs", "spectate", "status", "vote",
  "diag", "reset", "brand",
]

/** The tools deployment's functions, still served over there until each is ported. */
const TOOL_APIS = ["upload", "upload-session", "media", "planning", "config"]


const nextConfig: NextConfig = {
  async rewrites() {
    /* Every proxied fetch carries via=proxy. It marks our own traffic; it is
       not a secret and it is not access control. */
    const proxy = (source: string, destination: string) => ({
      source,
      destination: destination + (destination.includes("?") ? "&" : "?") + "via=proxy",
      has: RANCH_HOST,
    })
    /* A tool root, and any page beneath it that is not a file. The lookahead
       keeps assets out of it: /collateral/files/x.pdf has a dot and is served
       as itself, /console/planning has none and means its index.html. */
    const page = (p: string) => [
      { source: `/${p}`, destination: `/${p}/index.html`, has: RANCH_HOST },
      { source: `/${p}/:rest((?!.*\\.).*)`, destination: `/${p}/:rest/index.html`, has: RANCH_HOST },
    ]
    return {
      afterFiles: [
        ...TOOL_PAGES.flatMap(page),
        /* The singular reads better in a message and people type it. */
        { source: "/journey", destination: "/journeys/index.html", has: RANCH_HOST },

        ...TOOL_APIS.map((a) => proxy(`/api/${a}`, `${TOOLS}/api/${a}`)),

        /* The sign in server, until it is ported. A whole subtree, because
           Better Auth is /sign-in/email, /token, /jwks and thirty others, and
           routing only the first segment is exactly the fault that once
           answered /api/auth/ok while 404ing every endpoint that mattered. */
        proxy("/api/auth", `${TOOLS}/api/auth`),
        proxy("/api/auth/:path*", `${TOOLS}/api/auth/:path*`),
      ],
    }
  },
  async headers() {
    return [
      /* Static assets, long cache. Production only: the dev server's chunk
         names are stable, so a year of "immutable" pins the first CSS and JS
         a browser ever saw and every edit after it hydrates against stale
         code. That is the fault behind "the menu did not change" locally. */
      ...(process.env.NODE_ENV === "production"
        ? [{
            source: "/_next/static/(.*)",
            headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
          }]
        : []),
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
      /* Shared scripts the tools import, which arrive through the proxy. The
         page rule below hands out stale-while-revalidate for an hour and was
         catching these too, so a browser could run an hour old copy of the one
         database and auth client. That is not a stale page, it is a fix that
         silently never arrives. They revalidate now. */
      /* Only the scripts. /vendor itself and /vendor/booth are pages, and
         with :path* this rule caught them too, so the booth page carried two
         Cache-Control values and none of the security headers below. */
      {
        source: "/vendor/:file(.*\\.js)",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/team/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/team-sw.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      /* Print files on the collateral sheet: an hour, then a real check. */
      {
        source: "/collateral/files/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
      /* The tool pages themselves. The page rule below hands out an hour of
         stale-while-revalidate, which is right for a landing page and wrong
         for a tool that just shipped a fix: HQ kept serving the previous
         build for up to an hour after the deploy that fixed it. Sixty
         seconds at the edge, then a real revalidation. */
      {
        source: "/(journeys|journey|board|asks|crew|judging|map|site-plan|rsvps|chat|console|collateral|clubs|spectate|status|vote|diag|reset)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=60, must-revalidate" }],
      },
      {
        source: "/(journeys|journey|board|asks|crew|judging|map|site-plan|rsvps|chat|console|collateral|clubs|spectate|status|vote|diag|reset)",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=60, must-revalidate" }],
      },
      /* The tools' photography, proxied from the other deployment. Before
         /img/ was forwarded, every one of these was a 404, and a browser that
         fetched one then kept the 404 under the page rule's hour of
         stale-while-revalidate: the file was fixed on the server and the phone
         still showed a broken picture. Same rule as /vendor, so a miss can
         never be pinned. */
      {
        source: "/img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      // Pages — short cache, revalidate in background
      {
        source: "/((?!_next/static|_next/image|favicon.ico|vendor/.*\\.js|team/|team-sw|img/|(?:journeys|journey|board|asks|crew|judging|map|site-plan|rsvps|chat|console|collateral|clubs|spectate|status|vote|diag|reset)(?:/|$)).*)",
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
