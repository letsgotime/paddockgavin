"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { isStaff, whoAmI, ensureProfile } from "@/lib/crm/client"

/**
 * The staff door, top right, on the public event pages.
 *
 * Quiet on purpose. Twelve thousand people are being pointed at /events and
 * five of them work here, so this reads as a small "Staff" until it knows
 * otherwise, then becomes the way back into HQ with your initials on it.
 *
 * It asks the database once per mount and caches nothing, which is fine: the
 * answer is two small round trips and it only runs on public pages.
 */
export function CrmLogin({ event = "pistonpoweredranch" }: { event?: string }) {
  const [state, setState] = useState<"checking" | "out" | "in">("checking")
  const [initials, setInitials] = useState("")

  useEffect(() => {
    let alive = true
    void (async () => {
      const ok = await isStaff()
      if (!alive) return
      if (!ok) {
        setState("out")
        return
      }
      const profile = await ensureProfile()
      const name = profile?.full_name || (await whoAmI())
      if (!alive) return
      setInitials(
        String(name || "?")
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
      )
      setState("in")
    })()
    return () => {
      alive = false
    }
  }, [])

  // Nothing at all until the answer is known, so the corner does not flicker
  // from "Sign in" to a signed in badge on every page load.
  if (state === "checking") return null

  /* The console, not /events/<slug>/hq. That route was a placeholder: eight
     hardcoded cards describing tools, none of them a link, with a badge on
     each reading "still on the ranch domain". It was the front of a port that
     never finished, and it was where the Staff pill sent the team.

     HQ is the name and the look we are keeping. The console is the thing that
     works. Sending people to the console under that name is the whole fix. */
  const href = "/console"
  const signedIn = state === "in"

  return (
    <Link
      href={href}
      aria-label={signedIn ? "Open HQ" : "Staff sign in"}
      style={{
        position: "fixed",
        top: "calc(14px + env(safe-area-inset-top))",
        right: 16,
        zIndex: 90,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 34,
        padding: signedIn ? "0 6px 0 12px" : "0 14px",
        borderRadius: 999,
        textDecoration: "none",
        color: "#EDF1F6",
        font: "700 12px/1 Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
        letterSpacing: ".01em",
        background: "rgba(11,18,27,.62)",
        border: "1px solid rgba(255,255,255,.18)",
        backdropFilter: "blur(18px) saturate(1.5)",
        WebkitBackdropFilter: "blur(18px) saturate(1.5)",
      }}
    >
      {signedIn ? "HQ" : "Staff"}
      {signedIn ? (
        <span
          aria-hidden="true"
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#00D2BE",
            color: "#04211d",
            font: "900 9.5px/22px Archivo, sans-serif",
            textAlign: "center",
          }}
        >
          {initials}
        </span>
      ) : null}
    </Link>
  )
}
