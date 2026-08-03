import Image from "next/image"
import Link from "next/link"

export function HomeStory() {
  return (
    <section id="story" style={{ display: "flex", flexDirection: "column", gap: "clamp(40px,6vw,72px)" }}>
      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>
        Who&apos;s filming this
      </span>

      <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(44px,8vw,96px)", lineHeight: .97, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "12ch" }}>
        Cars were the reward.{" "}<span style={{ color: "#F2C94C" }}>Now they&apos;re the work.</span>
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(40px,6vw,80px)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(18px,1.9vw,22px)", lineHeight: 1.65, color: "#C4CBD6" }}>
            Gavin Brooks. Lot Operations and Events Manager at duPont REGISTRY, Lebanon, Tennessee — the largest exotic and luxury car marketplace in the country. Every car on the lot has been through his hands before it reaches a buyer.
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.65, color: "#8B93A7" }}>
            Former national sales leader. D1 athlete. Twenty-six years in technology before the lot. Now the camera comes to work too — original footage from duPont REGISTRY events, lot walkarounds, and the cars that move through Lebanon, Tennessee.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 8 }}>
            <Link href="/why-a-paddock" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              Why a Paddock
            </Link>
            <Link href="/scoreboard" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              The scoreboard
            </Link>
          </div>
        </div>

        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "rgba(21,37,56,.4)" }}>
          <Image src="/images/gavin-gwagen.webp" alt="Gavin on the lot" fill style={{ objectFit: "cover" }} loading="lazy" />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 18px 16px", background: "linear-gradient(to top,rgba(10,21,35,.92),transparent)" }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#8B93A7" }}>
              Lot Operations · duPont REGISTRY
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
