import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/garage/"],
      },
      // AI crawlers — allow for citation
      { userAgent: "GPTBot",            allow: "/" },
      { userAgent: "ClaudeBot",         allow: "/" },
      { userAgent: "PerplexityBot",     allow: "/" },
      { userAgent: "Google-Extended",   allow: "/" },
      { userAgent: "Gemini-User",       allow: "/" },
      { userAgent: "Cohere-ai",         allow: "/" },
      { userAgent: "Meta-ExternalAgent",allow: "/" },
    ],
    sitemap: "https://paddockgavin.com/sitemap.xml",
  }
}
