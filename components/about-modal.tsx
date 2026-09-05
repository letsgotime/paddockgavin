"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-mobile"

const AboutContent = () => (
  <div
    style={{
      background: "var(--panel)",
      color: "#E6EAF0",
    }}
  >
    {/* Garage-door bar */}
    <div className="bars"><i /><i /><i /><i /></div>

    <div className="flex flex-col gap-6 p-8 md:p-10">
      {/* Driver plate */}
      <p className="driver-plate">
        <strong style={{ color: "#fff" }}>Gavin Brooks</strong>
        <span style={{ color: "var(--steel-deep)", margin: "0 6px" }}>·</span>
        Nashville, TN
      </p>

      {/* Sector tab */}
      <div className="sector-tab w-fit"><i>The Paddock</i></div>

      {/* Headline */}
      <h2
        className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02] text-balance"
        style={{ fontSize: "clamp(22px, 3.8vw, 32px)" }}
      >
        The person running the operation{" "}
        <span style={{ color: "var(--yellow)" }}>is building the software.</span>
      </h2>

      {/* Body */}
      <div
        className="flex flex-col gap-4 leading-relaxed"
        style={{ color: "var(--steel)", fontSize: 15 }}
      >
        <p>
          Agentic engineering studio out of Nashville. Built the ops tool running
          $125M+/month through an exotic dealership lot: production software,
          not a prototype. The tool handles what would otherwise fall through.
        </p>
        <p>
          Also: SupercarIQ, a tool that identifies any supercar from a photo and returns
          spec, heritage, and collector market data. Built because the question came up
          every day on the lot and the answer was always slower than it should be.
        </p>
        <p>
          The arc: Excel pivot tables before no-code existed, certified across Microsoft
          and Google enterprise stacks, then full-stack, then agentic. AI accelerates a
          person who already knows how to do the work.
        </p>
      </div>

      {/* Telemetry */}
      <div className="telemetry mt-2">
        <span>Base <b>Nashville, TN</b></span>
        <span>Revenue driven <b>$1.2B+</b></span>
        <span>Throughput <b>$125M+/mo</b></span>
        <span>Stack <b>Agentic</b></span>
      </div>

      {/* Kerb stripe */}
      <div className="kerb-green" />

      {/* CTA */}
      <a
        href="mailto:gavin@gotimemotorsports.com"
        className="notch-btn inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-[0.04em] w-full transition-colors"
        style={{
          fontSize: 15,
          padding: "15px 26px",
          background: "var(--yellow)",
          color: "#101010",
          textDecoration: "none",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "var(--yellow-hi)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "var(--yellow)")
        }
      >
        Send a message
      </a>
    </div>
  </div>
)

export const AboutModal = () => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const TriggerButton = () => (
    <button
      onClick={() => setOpen(true)}
      className="eyebrow"
      style={{
        background: "transparent",
        border: "none",
        color: "var(--steel)",
        cursor: "pointer",
        letterSpacing: "0.22em",
        borderBottom: "1px solid var(--line)",
        paddingBottom: 2,
        transition: "color 0.18s, border-color 0.18s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.color = "var(--white)"
        el.style.borderColor = "var(--steel)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.color = "var(--steel)"
        el.style.borderColor = "var(--line)"
      }}
    >
      About
    </button>
  )

  if (isDesktop) {
    return (
      <>
        <TriggerButton />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="max-w-[540px] p-0 border-0"
            style={{ background: "var(--panel)", overflow: "hidden" }}
          >
            <AboutContent />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <TriggerButton />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className="border-0"
          style={{ background: "var(--panel)", borderTop: "3px solid var(--yellow)" }}
        >
          <AboutContent />
        </DrawerContent>
      </Drawer>
    </>
  )
}
