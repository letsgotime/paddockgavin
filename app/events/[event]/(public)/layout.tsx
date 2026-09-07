import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { loadEvent } from "@/lib/events/load"
import { RANCH_DEFAULTS, RANCH_ICONS } from "@/app/layout"

/**
 * The public wrapper for one event.
 *
 * Its only job is the typeface. The palette and the font stacks come through
 * as CSS variables on the page itself, but a stack naming Cinzel does nothing
 * unless Cinzel has been fetched, and the first fallback in that stack is a
 * serif with real lowercase, so the page silently renders in the wrong face
 * and looks almost right. That is the worst kind of wrong.
 *
 * So the brand row names the families it needs and this loads them. A second
 * event with a different face is a different value in that column.
 */
/* The landing page renders under this layout, not the ranch's own, so the
   manifest a phone reads for Add to Home Screen is decided here, by the
   event, which also holds under a cached render where no header is read. */
export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params
  if (event !== "pistonpoweredranch") return {}
  /* Everything the ranch door says about itself. This used to be decided in
     the root layout from the request header, which made every page in the
     application dynamic; it is decided here from the path instead, so the
     landing, the store and the field can be cached again. */
  return {
    ...RANCH_DEFAULTS,
    icons: RANCH_ICONS,
    manifest: "/brand/ranch.webmanifest",
    appleWebApp: { capable: true, title: "Piston Powered Ranch", statusBarStyle: "black-translucent" },
  }
}

/* The browser chrome around the page on a phone, the ranch's ink rather than
   ours, and again from the path so it costs no dynamic render. */
export async function generateViewport({ params }: { params: Promise<{ event: string }> }): Promise<Viewport> {
  const { event } = await params
  return { themeColor: event === "pistonpoweredranch" ? "#0A1523" : "#0A0E1A", width: "device-width", initialScale: 1 }
}

export default async function EventPublicLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ event: string }>
}) {
  const { event } = await params
  const e = await loadEvent(event)
  const fonts = (e?.brand?.fonts ?? []).filter((f) => /^[\w %:;@,.+-]+$/.test(f))

  return (
    <>
      {event === "pistonpoweredranch" && (
        <style>{`
          /* No floor under the ranch: every ranch page paints its own ground,
             and the paddock's 199 KB fallback plate was downloaded under it.
             Store and the field name their own plates later in the document
             and keep them. The body face resolves to the Archivo this site
             already serves, so the paddock's second Archivo is never fetched. */
          :root { --pg-backdrop: none; --pg-backdrop-opacity: 0 }
          body[class] { --font-sans: Archivo, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif }
        `}</style>
      )}
      {fonts.length > 0 && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?${fonts
              .map((f) => `family=${f}`)
              .join("&")}&display=swap`}
          />
        </>
      )}
      {children}
    </>
  )
}
