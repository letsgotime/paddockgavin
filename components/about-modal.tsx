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
        <strong style={{ color: "#fff" }}>Gavin Paddock</strong>
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
          Lot operations manager at duPont REGISTRY. The 70,000-square-foot facility
          where the cars that show up in the videos go first. If something&apos;s moving,
          it comes through lot ops.
        </p>
        <p>
          On the other shift: SupercarIQ, a tool that identifies any supercar from a
          photo and returns spec, heritage, and what the collector market has been doing
          with it. Built because the question came up every day on the lot and the
          answer was always slower than it should be.
        </p>
        <p>
          The arc matters: started solving problems with Excel before there were better
          tools. That&apos;s the IP. Human judgment and AI speed — production software,
          not prototypes.
        </p>
      </div>

      {/* Telemetry */}
      <div className="telemetry mt-2">
        <span>Brokered <b>78</b></span>
        <span>Your fee <b>$0</b></span>
        <span>Cars owned <b>29</b></span>
        <span>Years <b>30+</b></span>
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
      className="notch-btn inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-[0.04em] w-full transition-all"
      style={{
        fontSize: 15,
        padding: "15px 26px",
        background: "transparent",
        color: "#fff",
        border: "1px solid var(--line)",
        cursor: "pointer",
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
