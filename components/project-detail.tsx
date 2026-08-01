"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { getNextProject } from "@/lib/project-data"
import { ContactForm } from "./contact-form"

interface ProjectData {
  id: string
  title: string
  year: string
  services: string[]
  caption: string
  linkText: string
  linkUrl: string
  overview: { title: string; content: string }
  direction: { title: string; content: string }
  outcome: { title: string; content: string }
  heroImage: string
  galleryImages: string[]
  nextProject: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
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
          <strong style={{ color: "#fff" }}>Gavin Paddock</strong>
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
          {project.services.join(" · ")}
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
        <motion.header className="mb-12" {...fadeInUp}>
          <div className="sector-tab w-fit mb-4"><i>{project.services.join(" · ")}</i></div>
          <h1
            className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02] text-balance"
            style={{ fontSize: "clamp(26px, 5vw, 46px)", marginBottom: 20 }}
          >
            {project.title}
          </h1>

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
        </motion.header>

        {/* Hero image */}
        <motion.figure
          className="notch-fig"
          style={{ margin: "0 0 40px", position: "relative", border: "1px solid var(--line)" }}
          {...fadeInUp}
        >
          <img
            src={project.heroImage}
            alt={project.title}
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
        </motion.figure>

        {/* Overview */}
        <motion.div
          className="notch-panel"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            padding: "clamp(20px, 3vw, 30px)",
            position: "relative",
            marginBottom: 4,
          }}
          {...fadeInUp}
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
        </motion.div>

        {/* Gallery */}
        <div
          style={{ display: "grid", gap: 2, background: "var(--line)", border: "1px solid var(--line)", margin: "2px 0" }}
        >
          {project.galleryImages.map((src, index) => (
            <motion.figure
              key={index}
              style={{ margin: 0, position: "relative" }}
              {...fadeInUp}
            >
              <img
                src={src}
                alt={`${project.title} — frame ${index + 1}`}
                className="w-full"
                style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              />
            </motion.figure>
          ))}
        </div>

        {/* Kerb */}
        <div className="kerb my-1" />

        {/* Direction */}
        <motion.div
          className="notch-panel"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            padding: "clamp(20px, 3vw, 30px)",
            position: "relative",
            marginBottom: 4,
          }}
          {...fadeInUp}
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
        </motion.div>

        {/* Outcome */}
        <motion.div
          style={{
            background: "var(--blue)",
            border: "1px solid #0A6BAA",
            padding: "clamp(20px, 3vw, 30px)",
            position: "relative",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)",
            marginBottom: 40,
          }}
          {...fadeInUp}
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
        </motion.div>

        {/* Next project */}
        <motion.div
          className="flex justify-center mb-16"
          {...fadeInUp}
        >
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
        </motion.div>

        <ContactForm />

        {/* Footer watermark */}
        <motion.div
          className="flex justify-end mt-16 mb-8 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="racenum select-none" aria-hidden="true" style={{ opacity: 0.14 }}>
            20
          </div>
        </motion.div>
      </div>
    </div>
  )
}
