export default function ImageAudit() {
  const candidates = [
    "918-charging.webp", "918-grey.webp", "918-p1.webp", "918-pipes.webp",
    "carrera-traffic.jpg", "donuts-inside.webp", "donuts-lot.webp",
    "donuts-z06.webp", "f458-front.webp", "f458-wide.webp",
    "ferrari-296.webp", "ferrari-upperdeck.webp", "ford-gt-studio.webp",
    "g993-fire.webp", "g993-out.webp", "g993-ramp.webp",
    "gavin-gwagen.webp", "gavin-bar.webp", "creator-hero.jpg",
  ]
  return (
    <div style={{ background: "#0A0E1A", padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {candidates.map(f => (
          <div key={f} style={{ position: "relative" }}>
            <img src={`/images/${f}`} style={{ width: "100%", height: 200, objectFit: "cover", objectPosition: "center 40%", display: "block" }} />
            <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.75)", color: "#fff", fontSize: 10, padding: "3px 5px" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
