"use client"

import Link from "next/link"
import { PROJECTS } from "@/lib/project-data"
import { ContactForm } from "./contact-form"

const ACCENTS = ["var(--yellow)", "var(--green)", "var(--yellow)", "var(--green)"]

export const PortfolioLayout = () => {
  return (
    <div
      id="work"
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--navy)" }}
    >
      {/* ── INDEX HEADER — floats above the stack ── */}
      <div
        style={{
          padding: "clamp(32px, 5vw, 56px) clamp(24px, 4vw, 48px) 0",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "clamp(24px, 3vw, 36px)",
        }}
      >
        <p className="eyebrow mb-4">Selected work</p>
        <h2
          className="font-display uppercase text-white leading-[0.96] tracking-[-0.02em] text-balance"
          style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
        >
          The builds.
        </h2>
      </div>

      {/* ── PROJECT LIST — no borders, photography bleeds ── */}
      <div>
        {PROJECTS.map((project, index) => (
          <Link
            key={project.id}
            href={`/work/${project.id}`}
            className="group block relative"
            style={{
              borderBottom: "1px solid var(--line)",
            }}
          >
            {/* Full-bleed hero image */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "clamp(240px, 42vw, 480px)" }}
            >
              <img
                src={project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ display: "block" }}
              />

              {/* Dark scrim — bottom 60% — so text floats readable */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,12,22,0.96) 0%, rgba(8,12,22,0.5) 45%, transparent 75%)",
                }}
              />

              {/* Floating top-left: accent + tag */}
              <div
                className="absolute top-0 left-0 flex items-center gap-3"
                style={{ padding: "clamp(14px, 2vw, 22px)" }}
              >
                <div
                  style={{
                    width: 3,
                    height: 16,
                    background: ACCENTS[index],
                    flexShrink: 0,
                  }}
                />
                <span
                  className="eyebrow"
                  style={{ color: "rgba(244,246,250,0.82)", fontSize: 10 }}
                >
                  {"tag" in project
                    ? (project as any).tag
                    : "services" in project
                      ? (project as any).services.join(" · ")
                      : ""}
                </span>
              </div>

              {/* Floating top-right: year */}
              <div
                className="absolute top-0 right-0"
                style={{ padding: "clamp(14px, 2vw, 22px)" }}
              >
                <span
                  className="eyebrow"
                  style={{ color: "rgba(244,246,250,0.82)", fontSize: 10 }}
                >
                  {project.year}
                </span>
              </div>

              {/* Ghost index numeral */}
              <div
                className="absolute bottom-0 right-0 pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(80px, 18vw, 180px)",
                  color: "rgba(244,246,250,0.82)",
                  lineHeight: 0.8,
                  letterSpacing: "-0.04em",
                  paddingRight: "clamp(12px, 2vw, 24px)",
                }}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Floating bottom: title + excerpt */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ padding: "clamp(20px, 3vw, 36px)" }}
              >
                <h3
                  className="font-display uppercase text-white leading-[0.96] tracking-[-0.02em] text-balance"
                  style={{
                    fontSize: "clamp(20px, 3.2vw, 36px)",
                    marginBottom: 10,
                  }}
                >
                  {project.title}
                </h3>
                <p
                  className="leading-snug"
                  style={{
                    color: "rgba(244,246,250,0.82)",
                    fontSize: 13,
                    maxWidth: "52ch",
                  }}
                >
                  {project.overview.content.slice(0, 110)}
                  {project.overview.content.length > 110 ? "…" : ""}
                </p>

                {/* View arrow — appears on hover */}
                <div
                  className="flex items-center gap-2 mt-3 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  style={{ color: ACCENTS[index] }}
                >
                  <span
                    className="eyebrow"
                    style={{ color: ACCENTS[index], fontSize: 10 }}
                  >
                    View project
                  </span>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path
                      d="M1 5h12M9 1l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── KERB STRIPE ── */}
      <div className="kerb" style={{ marginTop: 0 }} />

      {/* ── CONTACT ── */}
      <div style={{ padding: "clamp(48px, 7vw, 80px) clamp(24px, 4vw, 48px)" }}>
        <ContactForm />
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          borderTop: "1px solid var(--line)",
          padding: "20px clamp(24px, 4vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="eyebrow" style={{ fontSize: 10 }}>
          Paddock20™ · Nashville, TN
        </p>
        <p className="eyebrow" style={{ fontSize: 10, color: "var(--line)" }}>
          Digest. Develop. Deliver.™
        </p>
      </div>
    </div>
  )
}
