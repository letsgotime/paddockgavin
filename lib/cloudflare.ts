/**
 * Cloudflare Images + Stream utilities
 *
 * Env vars (set in Vercel project settings):
 *   NEXT_PUBLIC_CF_IMAGES_HASH   — account hash from CF Images dashboard
 *   NEXT_PUBLIC_CF_STREAM_SUBDOMAIN — customer subdomain from Stream embed URL
 *                                     (the part between "customer-" and ".cloudflarestream.com")
 */

const CF_IMAGES_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_HASH ?? ""
const CF_STREAM_SUBDOMAIN = process.env.NEXT_PUBLIC_CF_STREAM_SUBDOMAIN ?? ""

/**
 * Build a Cloudflare Images delivery URL.
 *
 * @param imageId   The image ID (UUID) from the CF Images dashboard
 * @param variant   Named variant defined in CF Images settings (default: "public")
 *
 * Fallback: if the env var is not set, returns a safe placeholder so the
 * app still renders during local dev before keys are added.
 */
export function cfImageUrl(imageId: string, variant = "public"): string {
  if (!CF_IMAGES_HASH || !imageId) {
    return `https://placehold.co/1200x900/0A1523/4A5568?text=${encodeURIComponent(imageId || "image")}`
  }
  return `https://imagedelivery.net/${CF_IMAGES_HASH}/${imageId}/${variant}`
}

/**
 * Build a Cloudflare Stream iframe src URL.
 *
 * @param videoId   The video UID from the Stream dashboard
 */
export function cfStreamUrl(videoId: string): string {
  if (!CF_STREAM_SUBDOMAIN || !videoId) return ""
  return `https://customer-${CF_STREAM_SUBDOMAIN}.cloudflarestream.com/${videoId}/iframe`
}

/**
 * Build a Cloudflare Stream HLS manifest URL (for native <video> with HLS.js).
 */
export function cfStreamHlsUrl(videoId: string): string {
  if (!CF_STREAM_SUBDOMAIN || !videoId) return ""
  return `https://customer-${CF_STREAM_SUBDOMAIN}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
}

/**
 * Build a Cloudflare Stream thumbnail URL.
 *
 * @param videoId   Stream video UID
 * @param time      Timestamp in seconds to pull the thumbnail from (default: 0)
 */
export function cfStreamThumbnail(videoId: string, time = 0): string {
  if (!CF_STREAM_SUBDOMAIN || !videoId) return ""
  return `https://customer-${CF_STREAM_SUBDOMAIN}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=${time}s`
}
