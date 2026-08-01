"use client"

import { cfImageUrl } from "@/lib/cloudflare"

interface CfImageProps {
  /** Cloudflare Images UUID or a full fallback URL (Unsplash etc.) */
  src: string
  alt: string
  variant?: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

/**
 * CfImage — renders a Cloudflare Images URL if `src` looks like a CF image ID
 * (no slashes, no "http"), otherwise renders `src` as-is (Unsplash fallback,
 * local path, etc.).  This lets project-data.ts transition from Unsplash URLs
 * to CF image IDs one project at a time with zero breakage.
 */
export function CfImage({ src, alt, variant = "public", className, style, width, height }: CfImageProps) {
  const isCfId = src && !src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")
  const url = isCfId ? cfImageUrl(src, variant) : src

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  )
}
