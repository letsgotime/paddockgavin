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
    const root = document.documentElement

    /* Progress is published as a custom property rather than an event, because
       Lenis swallows the native scroll event and anything listening for one
       goes quiet. Whoever wants it reads var(--pg-scroll); nothing has to know
       this component exists. */
    const publish = (value: number) => {
      root.style.setProperty("--pg-scroll", String(Math.max(0, Math.min(1, value))))
    }
    const fromDom = () => {
      const max = root.scrollHeight - root.clientHeight
      publish(max > 0 ? root.scrollTop / max : 0)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduced.matches) {
      // No inertia, but the bar still has to move.
      let ticking = false
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
          ticking = false
          fromDom()
        })
      }
      fromDom()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    let lenis: { raf: (t: number) => void; destroy: () => void; on: (e: string, cb: (a: { scroll: number; limit: number }) => void) => void } | null = null
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
      instance.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
        publish(limit > 0 ? scroll / limit : 0)
      })
      fromDom()

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
