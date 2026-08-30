"use client"

import { useEffect, useRef } from "react"

/**
 * The site-wide reading bar.
 *
 * It used to do three expensive things at once on every scroll tick: set React
 * state, which re-rendered the tree; write a percentage width, which is
 * layout; and run transition: width, which animates layout continuously while
 * you scroll. On a page of full height photographic bands that is felt.
 *
 * Now it writes a transform to one element through a ref. No state, no layout,
 * no transition. The compositor moves it and React never hears about it.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = document.documentElement
    let last = -1
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0
      if (Math.abs(p - last) < 0.0005) return
      last = p
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: "left center",
        transform: "scaleX(0)",
        willChange: "transform",
        background: "linear-gradient(90deg,var(--accent-strong,#F2C94C),var(--second-strong,#57C7F5))",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  )
}
