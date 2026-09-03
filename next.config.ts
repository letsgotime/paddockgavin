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
  /* Pages. */
  "journeys", "board", "asks", "crew", "judging", "map", "site-plan", "rsvps",
  "chat", "console", "collateral", "clubs", "spectate", "status", "vote",
  "diag", "reset",
  /* Not pages: shared scripts the pages above import. ranch-db.js is the one
     database client and rail.js the one navigation, and nineteen and fifteen
     pages import them respectively, so these two forward until those pages do
     not exist any more. */
  "team", "vendor",
  /* Share cards belonging to the tools. Local files win, so this only catches
     the ones that live over there: asks-og is a photograph of a horse, and a
     horse's muzzle is pink, which trips this app's share card check. The card
     is fine and the check is right; the file simply belongs in the repo whose
     page it belongs to. */
  "og",
]

/** The tools deployment's own functions. None of these names exist here. */
const TOOL_APIS = ["upload", "upload-session", "media", "planning", "config"]


const nextConfig: NextConfig = {
  async rewrites() {
    /* Every proxied fetch carries via=proxy. The tools deployment redirects
       anything arriving without it back to this domain, so the raw
       piston-powered-ranch.vercel.app address stops being somewhere a person
       can browse, while these server side fetches still get through. It marks
       our own traffic; it is not a secret and it is not access control. */
    const proxy = (source: string, destination: string) => ({
      source,
      destination: destination + (destination.includes("?") ? "&" : "?") + "via=proxy",
      has: RANCH_HOST,
    })
    return {
      /* Before the filesystem, because /events/[event] would otherwise claim
         /events/img and answer with "no such event" instead of a photograph. */
      beforeFiles: [proxy("/events/img/:path*", `${TOOLS}/events/img/:path*`)],

      /* After it, so anything this app actually serves wins. That matters for
         /brand, where five files exist only here and the rest only there, and
         it means porting a tool into the CRM takes the route over by itself. */
      afterFiles: [
        ...TOOL_PATHS.flatMap((p) => [
          proxy(`/${p}`, `${TOOLS}/${p}/`),
          proxy(`/${p}/:path*`, `${TOOLS}/${p}/:path*`),
        ]),
        ...TOOL_APIS.map((a) => proxy(`/api/${a}`, `${TOOLS}/api/${a}`)),

        /* The sign in server itself.

           Better Auth is self hosted in the tools repo at /api/auth, and its
           AUTH_ORIGIN is pinned to https://pistonpoweredranch.com, which is
           also where it issues and verifies tokens. So the moment this domain
           is served by this app instead of that deployment, /api/auth stops
           resolving and nobody can sign in.

           A whole subtree rather than a single path, because Better Auth is
           /sign-in/email, /sign-up/email, /magic-link, /email-otp/*, /callback/*,
           /session, /token and /jwks. Routing only the first segment is exactly
           the fault that made the tools deployment answer /api/auth/ok while
           404ing every endpoint that mattered. */
        proxy("/api/auth", `${TOOLS}/api/auth`),
        proxy("/api/auth/:path*", `${TOOLS}/api/auth/:path*`),
        proxy("/brand/:path*", `${TOOLS}/brand/:path*`),
        /* The tools' own photography. Five of them open on a picture from
           /img/, and on this domain every one of those was a 404, so rsvps,
           crew, judging, chat and vote all loaded onto a blank ground. The
           directory was never forwarded; only the pages were. */
        proxy("/img/:path*", `${TOOLS}/img/:path*`),
        proxy("/team-sw.js", `${TOOLS}/team-sw.js`),
        proxy("/team.webmanifest", `${TOOLS}/team.webmanifest`),
        /* The singular reads better in a message and people type it. */
        proxy("/journey", `${TOOLS}/journeys/`),
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
      {
        source: "/vendor/:path*",
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
        source: "/((?!_next/static|_next/image|favicon.ico|vendor/|team/|team-sw|img/).*)",
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
