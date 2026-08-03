"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el  = document.documentElement
      const top = el.scrollTop || document.body.scrollTop
      const max = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? Math.min(100, (top / max) * 100) : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: `${pct}%`,
        background: "linear-gradient(90deg,#EF4A18,#F2C94C)",
        zIndex: 9999,
        transition: "width .1s linear",
        pointerEvents: "none",
      }}
    />
  )
}
