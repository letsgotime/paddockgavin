"use client"

import Link from "next/link"
import { getNextProject } from "@/lib/project-data"
import { ContactForm } from "./contact-form"
import { CfImage } from "./cf-image"
import { CfStreamPlayer } from "./cf-stream-player"

interface ProjectStat {
  label: string
  value: string
}

interface ProjectData {
  id: string
  title: string
  tag?: string
  year: string
  services: string[]
  stats?: ProjectStat[]
  caption: string
  linkText: string
  linkUrl: string
  overview: { title: string; content: string }
  direction: { title: string; content: string }
  outcome: { title: string; content: string }
  heroImage: string
  galleryImages: string[]
  streamVideoId?: string
  nextProject: string
}

export function ProjectDetail({ project }: { project: ProjectData }) {
  const nextProject = getNextProject(project.id)

  return (
    <div style={{ background: "var(--navy)", minHeight: "100vh" }}>
      {/* Garage-door bar */}
      <div className="bars"><i /><i /><i /><i /></div>

      {/* Back nav */}
      <div
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          className="driver-plate transition-opacity hover:opacity-70"
          style={{ textDecoration: "none" }}
        >
          <strong style={{ color: "#fff" }}>Gavin Brooks</strong>
          <span style={{ color: "var(--steel-deep)", margin: "0 6px" }}>·</span>
          Back
        </Link>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: "var(--steel-deep)",
          }}
        >
          {project.tag ?? project.services.join(" · ")}
        </span>
      </div>

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 60px) clamp(20px, 4vw, 40px)",
        }}
      >
        {/* Header */}
        <header className="mb-12" style={{ animation: "fadeInUp 0.55s ease-out both" }}>
          <div className="sector-tab w-fit mb-4"><i>{project.tag ?? project.services.join(" · ")}</i></div>
          <h1
            className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02] text-balance"
            style={{ fontSize: "clamp(26px, 5vw, 46px)", marginBottom: 20 }}
          >
            {project.title}
          </h1>

          {project.stats ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: 1,
                background: "var(--line)",
                border: "1px solid var(--line)",
                marginTop: 20,
              }}
            >
              {project.stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--panel)",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      color: "var(--steel-deep)",
                      marginBottom: 4,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="font-display uppercase"
                    style={{ color: "var(--green)", fontSize: 13, letterSpacing: "0.06em", fontWeight: 700 }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
              <div style={{ background: "var(--panel)", padding: "12px 16px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    color: "var(--steel-deep)",
                    marginBottom: 4,
                  }}
                >
                  Link
                </div>
                <a
                  href={project.linkUrl}
                  className="font-display uppercase"
                  style={{ color: "var(--green)", fontSize: 13, letterSpacing: "0.06em", fontWeight: 700, textDecoration: "none" }}
                >
                  {project.linkText}
                </a>
              </div>
            </div>
          ) : (
            <div className="telemetry">
              <span>Year <b>{project.year}</b></span>
              {project.services.map((s) => (
                <span key={s}>{s}</span>
              ))}
              <span>
                <a
                  href={project.linkUrl}
                  style={{ color: "var(--green)", textDecoration: "none", fontWeight: 700 }}
                >
                  {project.linkText}
                </a>
              </span>
            </div>
          )}
        </header>

        {/* Hero image */}
        <figure
          className="notch-fig"
          style={{ margin: "0 0 40px", position: "relative", border: "1px solid var(--line)", animation: "fadeInUp 0.55s ease-out both" }}
        >
          <CfImage
            src={project.heroImage}
            alt={project.title}
            variant="hero"
            className="w-full"
            style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
          />
          <figcaption
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "28px 16px 14px",
              background: "linear-gradient(to top, rgba(10,21,35,.94), transparent)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "#DCE3EC",
            }}
          >
            {project.caption}
          </figcaption>
        </figure>

        {/* Optional Stream video */}
        {project.streamVideoId && (
          <CfStreamPlayer
            videoId={project.streamVideoId}
            caption={`${project.title} — video`}
          />
        )}

        {/* Overview */}
        <div
          className="notch-panel"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            padding: "clamp(20px, 3vw, 30px)",
            position: "relative",
            marginBottom: 4,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--yellow)" }} />
          <h2
            className="font-display uppercase tracking-[-0.02em]"
            style={{ color: "var(--yellow)", fontSize: 13, letterSpacing: "0.1em", marginBottom: 10 }}
          >
            {project.overview.title}
          </h2>
          <p style={{ color: "#C4CBD6", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            {project.overview.content}
          </p>
        </div>

        {/* Gallery */}
        <div
          style={{ display: "grid", gap: 2, background: "var(--line)", border: "1px solid var(--line)", margin: "2px 0" }}
        >
          {project.galleryImages.map((src, index) => (
            <figure key={index} style={{ margin: 0, position: "relative" }}>
              <CfImage
                src={src}
                alt={`${project.title} — frame ${index + 1}`}
                variant="wall"
                className="w-full"
                style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              />
            </figure>
          ))}
        </div>

        {/* Kerb */}
        <div className="kerb my-1" />

        {/* Direction */}
        <div
          className="notch-panel"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            padding: "clamp(20px, 3vw, 30px)",
            position: "relative",
            marginBottom: 4,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--green)" }} />
          <h2
            className="font-display uppercase tracking-[-0.02em]"
            style={{ color: "var(--green)", fontSize: 13, letterSpacing: "0.1em", marginBottom: 10 }}
          >
            {project.direction.title}
          </h2>
          <p style={{ color: "#C4CBD6", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            {project.direction.content}
          </p>
        </div>

        {/* Outcome */}
        <div
          style={{
            background: "var(--blue)",
            border: "1px solid #0A6BAA",
            padding: "clamp(20px, 3vw, 30px)",
            position: "relative",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)",
            marginBottom: 40,
          }}
        >
          <h2
            className="font-display uppercase tracking-[0.1em]"
            style={{ color: "#BEE0F7", fontSize: 13, marginBottom: 10 }}
          >
            {project.outcome.title}
          </h2>
          <p style={{ color: "var(--blue-pale)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            {project.outcome.content}
          </p>
        </div>

        {/* Next project */}
        <div className="flex justify-center mb-16">
          <Link
            href={`/work/${nextProject.id}`}
            className="notch-btn inline-flex items-center gap-3 font-sans font-bold uppercase tracking-[0.04em] transition-colors"
            style={{
              fontSize: 13,
              padding: "13px 28px",
              background: "transparent",
              color: "#fff",
              border: "1px solid var(--line)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = "var(--steel)"
              el.style.background = "rgba(255,255,255,0.04)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = "var(--line)"
              el.style.background = "transparent"
            }}
          >
            Next: {nextProject.title}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <ContactForm />

        {/* Footer watermark */}
        <div
          className="flex justify-end mt-16 mb-8 pointer-events-none"
          style={{ opacity: 0.14 }}
          aria-hidden="true"
        >
          <div className="racenum select-none">20</div>
        </div>
      </div>
    </div>
  )
}
