import type React from "react"
import type { Metadata } from "next"

/**
 * Who does what, for the five people running the tenth of October.
 *
 * Behind the staff allowlist, so it is never indexed and never shared by
 * accident. The page below reads the roles from the database rather than
 * carrying a copy of them, because a second copy of a role is a second thing
 * to keep in step and one of them always rots.
 *
 * Cinzel is loaded here rather than globally: it is the ranch's display face
 * and nothing else on paddockgavin.com uses it.
 */

export const metadata: Metadata = {
  title: "Who does what",
  description: "The team behind The Piston Powered Ranch.",
  robots: { index: false, follow: false, nocache: true },
}

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap"
      />
      {children}
    </>
  )
}
