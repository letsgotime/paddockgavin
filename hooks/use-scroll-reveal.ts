"use client"

import { useEffect } from "react"

export function useScrollReveal() {
  useEffect(() => {
    let live = false
    let obs: IntersectionObserver | null = null
    let sweepFn: (() => void) | null = null

    const reveal = (el: Element) => {
      el.classList.add("on")
      obs?.unobserve(el)
    }

    const arm = () => {
      document.querySelectorAll("[data-r]:not([data-armed]):not(.on)").forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= window.innerHeight * 1.05) return
        el.setAttribute("data-armed", "1")
        if (!("IntersectionObserver" in window)) { reveal(el); return }
        if (!obs) {
          obs = new IntersectionObserver(
            (entries) => entries.forEach((en) => { if (en.isIntersecting) reveal(en.target) }),
            { rootMargin: "0px 0px -6% 0px", threshold: 0.03 }
          )
        }
        obs.observe(el)
      })
      if (!sweepFn) {
        sweepFn = () => {
          document.querySelectorAll("[data-r][data-armed]:not(.on)").forEach((el) => {
            const r = el.getBoundingClientRect()
            if (r.top < window.innerHeight - 30 && r.bottom > 0) reveal(el)
          })
        }
        window.addEventListener("scroll", sweepFn, { passive: true })
      }
    }

    const onScroll = () => { live = true; arm() }
    window.addEventListener("scroll", onScroll, { once: true, passive: true })
    // arm items already in view on mount
    setTimeout(arm, 80)

    return () => {
      obs?.disconnect()
      if (sweepFn) window.removeEventListener("scroll", sweepFn)
    }
  }, [])
}
