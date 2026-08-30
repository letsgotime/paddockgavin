"use client"

import { useEffect } from "react"

/**
 * Weight and flick.
 *
 * Native wheel scrolling is a step function: the page jumps by whatever the
 * mouse reports and stops dead. That reads as light and abrupt on a page built
 * out of full height photographic bands. This gives the scroll mass, so a
 * gesture carries on and settles instead of stopping the instant your fingers
 * leave the trackpad.
 *
 * Two rules it obeys:
 *
 *   Touch is left alone. Phones already have excellent inertia, and hijacking
 *   it is how smooth scrolling earns its bad reputation.
 *
 *   prefers-reduced-motion turns the whole thing off. Somebody who has asked
 *   the operating system to stop moving things has not asked for a heavier
 *   version of the thing they turned off.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduced.matches) return

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let frame = 0
    let cancelled = false

    void (async () => {
      const { default: Lenis } = await import("lenis")
      if (cancelled) return

      const instance = new Lenis({
        // Time to settle. Higher is heavier; this is the weight of a door
        // rather than a screen door.
        duration: 1.15,
        // Expo out: fast off the mark, long tail. That is the flick.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.95,
        touchMultiplier: 1.6,
        // Native on touch. Phones do this better than any library.
        syncTouch: false,
        autoRaf: false,
      })
      lenis = instance as unknown as typeof lenis

      const loop = (time: number) => {
        instance.raf(time)
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    })()

    return () => {
      cancelled = true
      if (frame) cancelAnimationFrame(frame)
      lenis?.destroy()
    }
  }, [])

  return null
}
