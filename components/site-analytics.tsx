"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

/**
 * Google Analytics 4 for the paddockgavin.com website stream.
 *
 * Stream 15736070958. The sibling of components/ranch-analytics.tsx, which
 * carries the ranch's own property, and the two are deliberately kept apart:
 * one host, one property, so a ranch visit never lands in the website's
 * numbers and the other way round.
 *
 * Host gated in an effect rather than by NODE_ENV, for the same reason the
 * ranch one is. Both domains are served by the same deployment, so the check
 * has to happen in the browser where the hostname is actually known. It also
 * keeps a preview deployment and localhost out of the property, because
 * neither answers to this name.
 *
 * The Script id must differ from the ranch component's, or React treats the
 * two as the same node and only one of them ever mounts.
 */

const MEASUREMENT_ID = "G-87XWZ12M6P"

export function SiteAnalytics() {
  const [onSite, setOnSite] = useState(false)

  useEffect(() => {
    setOnSite(/(^|\.)paddockgavin\.com$/.test(window.location.hostname))
  }, [])

  if (!onSite) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-site" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}
