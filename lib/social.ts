/**
 * The follower count, from the account rather than from memory.
 *
 * It was hand typed in four places and had drifted to ~7,900 while the
 * account read 8,092. A number a person has to remember to update is a
 * number that is wrong most of the time, and it sits on the page a brand
 * reads before deciding whether to pay.
 *
 * Behold is already how this site talks to Instagram, and its payload
 * carries profile.followersCount next to the posts, so this needs no new
 * service and no Instagram token. The fetch runs on the server and Next
 * caches it for an hour, so the figure is in the delivered HTML: search
 * engines and the share card see the same number a visitor does.
 *
 * If the feed is not configured, or Behold is down, or the shape changes,
 * this returns the last figure that was actually measured, dated below.
 * It never returns zero and never throws: a brand page that renders "0
 * followers" is worse than one that is a fortnight stale.
 */

/** Measured from the account on 2026-09-06. The floor when nothing answers. */
const LAST_MEASURED = { followers: 8092, on: "2026-09-06" } as const

/** One hour. Instagram counts do not move fast enough to justify less. */
const REVALIDATE_SECONDS = 3600

export interface FollowerCount {
  /** Always a usable number. */
  followers: number
  /** "live" when Behold answered this hour, "fallback" when it did not. */
  source: "live" | "fallback"
  /** Set only on the fallback, so a caller can say how old the figure is. */
  measuredOn?: string
}

/**
 * Set NEXT_PUBLIC_BEHOLD_FEED_1, not BEHOLD_FEED_ID.
 *
 * Three things read this feed and two of them run in the browser: the wall on
 * the homepage and the gallery. A variable without the NEXT_PUBLIC prefix is
 * never sent to the client, so setting BEHOLD_FEED_ID alone turns the follower
 * count live and leaves the wall and the gallery on their seed images, which
 * looks like the feed half working rather than not being configured.
 *
 * BEHOLD_FEED_ID is still read first, so a server-only deployment can use it.
 */
function feedId(): string {
  return (
    process.env.BEHOLD_FEED_ID ||
    process.env.NEXT_PUBLIC_BEHOLD_FEED_1 ||
    ""
  ).trim()
}

export async function getFollowerCount(): Promise<FollowerCount> {
  const id = feedId()
  if (!id) return { ...LAST_MEASURED, source: "fallback", measuredOn: LAST_MEASURED.on }

  try {
    const res = await fetch(`https://feeds.behold.so/${id}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    /* Behold returns either a bare array of posts or an object carrying the
       profile alongside them. Only the second shape has the count. */
    const n = Number(data?.profile?.followersCount)
    if (!Number.isFinite(n) || n <= 0) throw new Error("no count in payload")
    return { followers: n, source: "live" }
  } catch {
    return { ...LAST_MEASURED, source: "fallback", measuredOn: LAST_MEASURED.on }
  }
}

/**
 * 8092 becomes "~8,100". The tilde and the rounding are the honest part:
 * the figure moves every day and a precise one would imply a precision the
 * page cannot keep. Rounds to the nearest hundred below ten thousand and to
 * the nearest thousand above it, so it stays readable as the account grows.
 */
export function formatFollowers(n: number): string {
  const step = n < 10_000 ? 100 : 1_000
  return "~" + (Math.round(n / step) * step).toLocaleString("en-US")
}
