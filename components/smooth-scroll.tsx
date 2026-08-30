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
    const domProgress = () => {
      const max = root.scrollHeight - root.clientHeight
      return max > 0 ? root.scrollTop / max : 0
    }
    const fromDom = () => publish(domProgress())

    /* Two independent paths write this, on purpose.
       
       The frame loop below is the good one: smooth, and correct whatever moved
       the page. But it only runs while the tab is visible, because browsers
       suspend requestAnimationFrame in a background tab, and it only exists at
       all once the Lenis import has resolved. This listener covers the gap at
       both ends, costs one property write per frame at most, and means the bar
       cannot be left stranded by whichever path happens not to fire. */
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        fromDom()
      })
      // rAF is asleep in a hidden tab, so write once directly as well.
      fromDom()
    }
    fromDom()
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", fromDom)

    const stopNative = () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", fromDom)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduced.matches) return stopNative

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
        // the page's own #look, #visit, #vip anchors
        anchors: true,
      })
      lenis = instance as unknown as typeof lenis
      fromDom()

      /* Published from the frame loop rather than from Lenis's scroll event.
         The event did not fire here at all, and even where it does it misses
         anything that moves the page without going through Lenis: an anchor
         jump, a browser scroll restore, a programmatic scrollTo. Reading the
         position once a frame is correct whatever moved it, and one property
         write per frame costs nothing the compositor notices. */
      let last = -1
      const loop = (time: number) => {
        instance.raf(time)
        const now = (instance as unknown as { progress?: number }).progress
        const value = typeof now === "number" && Number.isFinite(now) ? now : domProgress()
        if (Math.abs(value - last) > 0.0005) {
          last = value
          publish(value)
        }
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    })()

    return () => {
      cancelled = true
      stopNative()
      if (frame) cancelAnimationFrame(frame)
      lenis?.destroy()
    }
  }, [])

  return null
}
