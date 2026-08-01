"use client"

import { cfStreamUrl, cfStreamThumbnail } from "@/lib/cloudflare"

interface CfStreamPlayerProps {
  /** Cloudflare Stream video UID */
  videoId: string
  /** Figcaption text shown below the player */
  caption?: string
  /** Seconds into the video to pull the poster thumbnail from */
  posterTime?: number
  className?: string
}

/**
 * CfStreamPlayer — embeds a Cloudflare Stream video via the official
 * <iframe> SDK. Falls back gracefully if NEXT_PUBLIC_CF_STREAM_SUBDOMAIN
 * is not set.
 */
export function CfStreamPlayer({ videoId, caption, posterTime = 0, className }: CfStreamPlayerProps) {
  const src = cfStreamUrl(videoId)
  const poster = cfStreamThumbnail(videoId, posterTime)

  if (!src) {
    return (
      <div
        style={{
          aspectRatio: "16/9",
          background: "var(--panel)",
          border: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "var(--steel)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          STREAM · ENV VAR NOT SET
        </span>
      </div>
    )
  }

  return (
    <figure
      className={className}
      style={{
        margin: "0 0 40px",
        position: "relative",
        border: "1px solid var(--line)",
        background: "#000",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        <iframe
          src={`${src}?autoplay=false&loop=false&controls=true&muted=false&preload=metadata${poster ? `&poster=${encodeURIComponent(poster)}` : ""}`}
          title={caption ?? "Video"}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            padding: "10px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "var(--steel)",
            borderTop: "1px solid var(--line)",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
