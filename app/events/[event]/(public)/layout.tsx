import type { ReactNode } from "react"
import { loadEvent } from "@/lib/events/load"

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
