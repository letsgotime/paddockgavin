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

/** One tile on the wall. Shared so the server and the client agree on shape. */
export interface WallItem {
  key: string
  src: string
  large: string
  caption: string
  isVideo: boolean
  videoSrc?: string
  permalink: string
  wide: boolean
}

interface BeholdPost {
  id: string
  sizes?: { medium?: { mediaUrl?: string; width?: number; height?: number }; large?: { mediaUrl?: string }; full?: { mediaUrl?: string } }
  thumbnailUrl?: string
  mediaUrl?: string
  mediaType?: string
  prunedCaption?: string
  caption?: string
  permalink?: string
}

/** First line of a caption, hashtags stripped, trimmed to fit a tile. */
function firstLine(text: string): string {
  const line = String(text || "").split(/\r?\n/).find((l) => l.trim()) || ""
  const clean = line.replace(/#[\w]+/g, "").replace(/\s+/g, " ").trim()
  return clean.length > 78 ? clean.slice(0, 76).trim() + "\u2026" : clean
}

/**
 * The wall, fetched on the server.
 *
 * It used to fetch in the browser, which cost two things: the captions were
 * never in the delivered HTML, so a search engine saw a wall of nothing, and
 * every visitor watched the seed photographs get replaced a moment after the
 * page settled. Fetching here puts the real captions in the markup and the
 * real pictures in the first frame.
 *
 * Returns an empty array when no feed is configured or Behold does not answer,
 * and the component falls back to its seed tiles, which is what ships today.
 */
export async function getWallPosts(limit = 12): Promise<WallItem[]> {
  const id = feedId()
  if (!id) return []
  try {
    const res = await fetch(`https://feeds.behold.so/${id}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    const posts: BeholdPost[] = Array.isArray(data) ? data : data?.posts || []
    return posts.slice(0, limit).map((p) => {
      const sizes = p.sizes || {}
      const med = sizes.medium || sizes.large || sizes.full || {}
      const w = (med as { width?: number }).width || 1080
      const h = (med as { height?: number }).height || 1350
      return {
        key: "bh-" + p.id,
        src: (med as { mediaUrl?: string }).mediaUrl || p.thumbnailUrl || p.mediaUrl || "",
        large: ((sizes.large || sizes.full || med) as { mediaUrl?: string }).mediaUrl || p.mediaUrl || "",
        caption: firstLine(p.prunedCaption || p.caption || ""),
        isVideo: p.mediaType === "VIDEO",
        videoSrc: p.mediaType === "VIDEO" ? p.mediaUrl : undefined,
        permalink: p.permalink || "",
        wide: w > h,
      }
    }).filter((i) => i.src)
  } catch {
    return []
  }
}

/* ---------------------------------------------------------------------------
   The gallery, fetched on the server.

   The gallery used to do all of this in the browser: three fetches, the tag
   routing, the aspect maths. That cost the same two things the wall used to
   cost. Search engines saw an empty page, because the markup contained no
   photographs and no captions, and a shared link previewed as nothing. The
   logic is unchanged, it just runs before the HTML is sent.

   Feeds are read in order and merged. Behold filters a feed by hashtag, so
   configuring FEED_1/2/3 as three tagged streams is what turns an Instagram
   account into this site's picture library, and the routing below is what
   decides where each post lands once it arrives.
--------------------------------------------------------------------------- */

/** Hashtag to chapter. A post with none of these lands in "the-room". */
export const GALLERY_TAG_MAP: Record<string, string> = {
  donuts: "the-room", bts: "nobody-films",
  nobodyfilms: "nobody-films", stuffnobodyfilms: "nobody-films", trunkrelease: "nobody-films",
  detail: "nobody-films", interior: "nobody-films",
  whatidputonit: "what-id-put-on-it", glossgame: "what-id-put-on-it", theglossgame: "what-id-put-on-it",
  detailing: "what-id-put-on-it", paintcorrection: "what-id-put-on-it", ceramic: "what-id-put-on-it",
  theroom: "the-room", monthlyshowcase: "the-room", tiresandtimepieces: "the-room",
  /* legacy inbound slug, kept so existing links keep resolving */
  donutswithdupont: "the-room",
  tirestimepieces: "the-room", carsandcoffee: "the-room", showroom: "the-room", event: "the-room",
}

export function chapterFromCaption(caption: string): string {
  const tags = (caption || "").toLowerCase().replace(/\s/g, "").match(/#([a-z0-9]+)/g) || []
  for (const t of tags) {
    const key = t.replace("#", "")
    if (GALLERY_TAG_MAP[key]) return GALLERY_TAG_MAP[key]
  }
  return "the-room"
}

export interface GalleryItem {
  key: string
  src: string
  large: string
  caption: string
  isVideo: boolean
  chapter: string
  permalink: string
  aspect: string
  span: string
}

export interface FeedProfile {
  username?: string
  followersCount?: number
}

/** Every configured feed, in order. Empty when none are set. */
function feedIds(): string[] {
  return [
    process.env.BEHOLD_FEED_ID,
    process.env.NEXT_PUBLIC_BEHOLD_FEED_1,
    process.env.NEXT_PUBLIC_BEHOLD_FEED_2,
    process.env.NEXT_PUBLIC_BEHOLD_FEED_3,
  ]
    .map((v) => (v || "").trim())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
}

/**
 * Returns an empty list when nothing is configured or Behold does not answer,
 * and the gallery falls back to its seed tiles, which is what ships today.
 */
export async function getGalleryItems(perFeed = 18): Promise<{ items: GalleryItem[]; profile: FeedProfile | null }> {
  const ids = feedIds()
  if (!ids.length) return { items: [], profile: null }

  const results = await Promise.all(
    ids.map((id) =>
      fetch(`https://feeds.behold.so/${id}`, { next: { revalidate: REVALIDATE_SECONDS } })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  )

  const items: GalleryItem[] = []
  let profile: FeedProfile | null = null
  const seen = new Set<string>()

  for (const data of results) {
    if (!data) continue
    if (data.profile && !profile) profile = data.profile as FeedProfile
    const posts: BeholdPost[] = Array.isArray(data) ? data : data.posts || []
    for (const p of posts.slice(0, perFeed)) {
      /* The same post can appear in two tagged feeds. Keep the first. */
      if (seen.has(p.id)) continue
      seen.add(p.id)

      const sizes = p.sizes || {}
      const med = (sizes.medium || sizes.large || sizes.full || {}) as { mediaUrl?: string; width?: number; height?: number }
      const w = med.width || 1080
      const h = med.height || 1350
      const src = med.mediaUrl || p.thumbnailUrl || p.mediaUrl || ""
      if (!src) continue
      items.push({
        key: "bh-" + p.id,
        src,
        large: (sizes.full as { mediaUrl?: string } | undefined)?.mediaUrl || src,
        caption: firstLine(p.prunedCaption || p.caption || ""),
        isVideo: (p.mediaType || "").toLowerCase().includes("video"),
        chapter: chapterFromCaption(p.caption || ""),
        permalink: p.permalink || "",
        aspect: w >= h * 1.3 ? "16/9" : w >= h * 0.85 ? "1/1" : "4/5",
        span: "auto",
      })
    }
  }
  return { items, profile }
}
