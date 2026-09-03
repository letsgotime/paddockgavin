import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{ minHeight: "100svh", background: "#0E1A2A", display: "flex", flexDirection: "column" }}>
      {/* Speed stripe bar */}
      <div aria-hidden="true" style={{ display: "flex", height: 5 }}>
        <i style={{ flex: "1 1 0", background: "#F2C94C" }} />
        <i style={{ flex: "1 1 0", background: "#00D2BE" }} />
        <i style={{ flex: "1 1 0", background: "#005185" }} />
        <i style={{ flex: "1 1 0", background: "#848482" }} />
      </div>

      <main style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px,5vw,40px)" }}>
        <div style={{ position: "relative", maxWidth: 640, width: "100%", background: "#152538", border: "1px solid #27384F", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(28px,5vw,48px)" }}>
          {/* Ghost 404 */}
          <span aria-hidden="true" style={{ position: "absolute", right: 18, top: 6, fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 900, fontSize: 110, lineHeight: 1, letterSpacing: "-.02em", color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,.16)", pointerEvents: "none" }}>404</span>

          <p style={{ margin: "0 0 14px", display: "inline-flex", alignItems: "center", gap: 12, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: "#B4B6B2" }}>
            <i aria-hidden="true" style={{ width: 26, height: 3, background: "#00D2BE", display: "block" }} />
            Off the map
          </p>

          <h1 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>
            <span style={{ display: "block" }}>Wrong turn.</span>
            <span style={{ display: "block", color: "#F2C94C" }}>Nothing parked here.</span>
          </h1>

          <p style={{ margin: "0 0 26px", fontSize: 17.5, lineHeight: 1.6, color: "#B4B6B2" }}>
            The page you wanted is not on the lot. The gate is back this way.
          </p>

          <Link href="/" style={{ display: "inline-flex", alignItems: "center", fontWeight: 800, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "14px 24px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
            Back to the paddock
          </Link>

          {/* Quick links */}
          <div style={{ margin: "28px 0 0", padding: "22px 0 0", borderTop: "1px solid #27384F", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,46%),1fr))", gap: 10 }}>
            {[
              { href: "/vlog", label: "The Vlog", icon: <i aria-hidden="true" style={{ flexShrink: 0, width: 0, height: 0, borderLeft: "13px solid #00D2BE", borderTop: "8px solid transparent", borderBottom: "8px solid transparent" }} />, accent: "#00D2BE" },
              { href: "/cars", label: "The garage", icon: <i aria-hidden="true" style={{ flexShrink: 0, width: 13, height: 13, background: "#F2C94C", transform: "rotate(45deg)", display: "block" }} />, accent: "#F2C94C" },
              { href: "/gallery", label: "The gallery", icon: <i aria-hidden="true" style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "6px 6px", gap: 2 }}><i style={{ width: 6, height: 6, background: "#B4B6B2", display: "block" }} /><i style={{ width: 6, height: 6, background: "#B4B6B2", display: "block" }} /><i style={{ width: 6, height: 6, background: "#B4B6B2", display: "block" }} /><i style={{ width: 6, height: 6, background: "#B4B6B2", display: "block" }} /></i>, accent: "#B4B6B2" },
              { href: "/donuts", label: "Donuts", icon: <i aria-hidden="true" style={{ flexShrink: 0, width: 14, height: 14, borderRadius: "50%", border: "4px solid #F2C94C", display: "block" }} />, accent: "#F2C94C" },
            ].map(({ href, label, icon, accent }) => (
              <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0E1A2A", border: "1px solid #27384F", padding: "13px 15px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", color: "#DDE3EB", textDecoration: "none" }}>
                {icon}
                <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
