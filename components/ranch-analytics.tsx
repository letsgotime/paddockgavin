"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

/**
 * The ranch's Google Analytics stream.
 *
 * The property is "PPR Website" and it measures pistonpoweredranch.com, so it
 * must not fire on paddockgavin.com or the two doors land in one report.
 *
 * The door is decided in the browser from the hostname rather than on the
 * server from x-pg-brand, and that is deliberate: reading a request header in
 * the shared shell is what made every page in this application dynamic and
 * uncacheable. An analytics tag is not worth giving that back, and the same
 * trick is already used by the navigation and the 404.
 */
const MEASUREMENT_ID = "G-1S42NYR4QZ"

export function RanchAnalytics() {
  const [onRanch, setOnRanch] = useState(false)

  useEffect(() => {
    setOnRanch(/(^|\.)pistonpoweredranch\.com$/.test(window.location.hostname))
  }, [])

  if (!onRanch) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}
