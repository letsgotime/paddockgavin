// Nashville shift logic — shared across SiteNav, SiteFooter, Homepage
// Day shift: 08:00–18:00 America/Chicago. Night shift: everything else.

export function getNashvilleShift(): { shift: "day" | "night"; clock: string } {
  const now = new Date()
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      hour12: false,
    }).format(now)
  )
  const shift: "day" | "night" = hour >= 8 && hour < 18 ? "day" : "night"
  const clock = now
    .toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/\s/g, "\u2009")
  return { shift, clock }
}

export const SHIFT_COLORS = {
  day: "#F8B800",
  night: "#00D2BE",
} as const

export const SHIFT_LABELS = {
  day: "Day shift",
  night: "Night shift",
} as const
