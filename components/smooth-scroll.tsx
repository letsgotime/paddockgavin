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
    let last = -1

    /* Written straight from the scroll event rather than through
       requestAnimationFrame. Browsers already coalesce passive scroll events
       to about frame rate, and one custom property write is far too cheap to
       need throttling. It also removes a real dependency: rAF does not run in
       a background tab, and a progress bar that only works while you are
       looking at it is a progress bar with a bug in it. */
    const publish = () => {
      const max = root.scrollHeight - root.clientHeight
      const value = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0
      if (Math.abs(value - last) < 0.0005) return
      last = value
      root.style.setProperty("--pg-scroll", String(value))
    }

    publish()
    window.addEventListener("scroll", publish, { passive: true })
    window.addEventListener("resize", publish, { passive: true })
    return () => {
      window.removeEventListener("scroll", publish)
      window.removeEventListener("resize", publish)
    }
  }, [])

  return null
}
