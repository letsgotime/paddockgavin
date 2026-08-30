"use client"

import { useEffect } from "react"

/**
 * Scroll progress, and nothing else.
 *
 * This used to run Lenis. It came out after going and looking at what Apple
 * actually does, which Gavin asked for: no smooth scroll library, no scroll
 * hijacking, scroll-behavior left on auto. Their pages feel good because
 * nothing expensive happens during a scroll, not because something is
 * smoothing it afterwards. A library on top of a page that is already
 * dropping frames just adds a transform layer to composite.
 *
 * So all that is left is publishing --pg-scroll for the progress bar, off a
 * passive listener, one property write per frame, and only when the value has
 * actually moved.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement
    let ticking = false
    let last = -1

    const publish = () => {
      ticking = false
      const max = root.scrollHeight - root.clientHeight
      const value = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0
      if (Math.abs(value - last) < 0.0005) return
      last = value
      root.style.setProperty("--pg-scroll", String(value))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(publish)
    }

    publish()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", publish, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", publish)
    }
  }, [])

  return null
}
