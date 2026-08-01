"use client"

import Link from "next/link"
import { PROJECTS } from "@/lib/project-data"
import { ContactForm } from "./contact-form"

// Accent colours cycle: yellow, green, blue, yellow, green
const ACCENT_COLORS = [
  "var(--yellow)",
  "var(--green)",
  "var(--blue)",
  "var(--yellow)",
  "var(--green)",
]

export const PortfolioLayout = () => {
  return (
    <div
      id="work"
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--navy)" }}
    >
      {/* Section header */}
      <div
        className="px-8 pt-10 pb-6"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div className="sector-tab sector-tab-yellow">
          <i>The Garage</i>
        </div>
        <h2
          className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02]"
          style={{ fontSize: "clamp(24px, 3.6vw, 38px)", marginBottom: 0 }}
        >
          Cars, builds,{" "}
          <span style={{ color: "var(--yellow)" }}>and software.</span>
        </h2>
      </div>

      {/* Grid: 2px gap — panels sit on a hairline */}
      <div
        style={{
          display: "grid",
          gap: 2,
          background: "var(--line)",
          border: "1px solid var(--line)",
        }}
      >
        {PROJECTS.map((project, index) => (
          <Link
            key={project.id}
            href={`/work/${project.id}`}
            className="group block relative overflow-hidden"
            style={{
              background: "var(--panel)",
            }}
          >
            {/* Left accent rule */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] z-10"
              style={{ background: ACCENT_COLORS[index] }}
            />

            <div className="flex gap-0" style={{ minHeight: 220 }}>
              {/* Photo */}
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ width: "42%", minWidth: 180 }}
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ display: "block" }}
                />
                {/* Notch fade overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 70%, var(--panel) 100%)",
                  }}
                />
                {/* Caption bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,21,35,.94), transparent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: "#DCE3EC",
                  }}
                >
                  {project.caption}
                </div>
              </div>

              {/* Content */}
              <div
                className="flex flex-col justify-between flex-1 py-5 pr-5"
                style={{ paddingLeft: "calc(3px + 20px)" }}
              >
                <div>
                  {/* Tag */}
                  <span
                    className="block font-sans font-bold uppercase tracking-[0.2em] mb-2"
                    style={{
                      fontSize: 11.5,
                      color: ACCENT_COLORS[index],
                    }}
                  >
                    {"tag" in project ? (project as any).tag : project.services.join(" · ")}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02] text-balance"
                    style={{ fontSize: "clamp(16px, 2.2vw, 22px)", marginBottom: 8 }}
                  >
                    {project.title}
                  </h3>

                  {/* Overview excerpt */}
                  <p
                    className="leading-relaxed"
                    style={{
                      color: "#C4CBD6",
                      fontSize: 14,
                      maxWidth: "44ch",
                    }}
                  >
                    {project.overview.content.slice(0, 120)}
                    {project.overview.content.length > 120 ? "…" : ""}
                  </p>
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-4">
                  <div
                    className="telemetry"
                    style={{ fontSize: 10, border: "none", background: "transparent" }}
                  >
                    <span style={{ paddingLeft: 0 }}>
                      {project.year}
                    </span>
                  </div>

                  <span
                    className="notch-btn inline-flex items-center gap-1.5 font-sans font-bold uppercase tracking-[0.04em] transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{
                      fontSize: 11,
                      padding: "7px 14px",
                      background: "var(--yellow)",
                      color: "#101010",
                    }}
                  >
                    View
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Kerb stripe separator */}
      <div className="kerb-green mt-px" />

      {/* Contact section */}
      <div className="px-8 py-14">
        <ContactForm />
      </div>

      {/* Footer race number watermark */}
      <div
        className="w-full pb-12 flex justify-end px-8 items-center pointer-events-none"
      >
        <div
          className="racenum select-none"
          aria-hidden="true"
          style={{ opacity: 0.18 }}
        >
          20
        </div>
      </div>
    </div>
  )
}
