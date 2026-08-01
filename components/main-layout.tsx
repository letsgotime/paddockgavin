import type React from "react"
import { DesignSidebar } from "@/components/design-sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen" style={{ background: "var(--navy)" }}>
      {/* Left panel — fixed sidebar on md+, stacked on mobile */}
      <aside
        className="w-full md:fixed md:left-0 md:top-0 md:w-[40%] md:h-screen lg:w-[32%]"
        style={{ zIndex: 10 }}
      >
        <DesignSidebar />
      </aside>

      {/* Divider line — the 1px line the grid panels sit on */}
      <div
        className="hidden md:block fixed top-0 bottom-0"
        style={{
          left: "40%",
          width: 1,
          background: "var(--line)",
          zIndex: 9,
        }}
      />
      <div
        className="hidden lg:block fixed top-0 bottom-0"
        style={{
          left: "32%",
          width: 1,
          background: "var(--line)",
          zIndex: 9,
        }}
      />

      {/* Main content — offset by sidebar width */}
      <main
        className="w-full md:ml-[40%] md:w-[60%] lg:ml-[32%] lg:w-[68%] min-h-screen overflow-y-auto"
        style={{ background: "var(--navy)" }}
      >
        {children}
      </main>
    </div>
  )
}
