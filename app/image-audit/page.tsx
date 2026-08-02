export default function ImageAudit() {
  const candidates = [
    "918-charging.webp",
    "donuts-overflow.webp",
    "ferrari-296.webp",
    "ford-gt-studio.webp",
    "creator-booth.jpg",
    "creator-booth-alt.jpg",
    "donuts-floor.webp",
    "donuts-tall.webp",
    "f458-front.webp",
  ]
  return (
    <div style={{ background: "#0A0E1A", padding: 16 }}>
      {candidates.map((f) => (
        <div key={f} style={{ marginBottom: 24, position: "relative" }}>
          <img src={`/images/${f}`} alt={f} style={{ width: "100%", height: 320, objectFit: "cover", objectPosition: "center 40%", display: "block" }} />
          <span style={{ position: "absolute", bottom: 0, left: 0, background: "rgba(0,0,0,.75)", color: "#fff", fontSize: 11, padding: "3px 8px" }}>{f}</span>
        </div>
      ))}
    </div>
  )
}
