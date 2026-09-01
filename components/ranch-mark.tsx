/**
 * The venue's mark, wherever its own door is being used.
 *
 * Defaults to Rancho Jaramillo because that is the only event with a door of
 * its own today. The event template passes its own from the brand row, so a
 * second venue does not need a second copy of this.
 *
 * Rendered on both brands and hidden by CSS on ours, rather than branched in
 * JavaScript. That keeps it a server component with no client cost, and means
 * the markup is genuinely identical between the two doors: the only difference
 * is a display rule, which is the whole idea.
 */
export function RanchMark({
  width = 96,
  opacity = 1,
  label,
  align = "center",
  src = "/brand/rj-mark-320.png",
  alt = "Rancho Jaramillo",
  ratio = 203 / 320,
}: {
  width?: number
  opacity?: number
  label?: string
  align?: "center" | "left"
  src?: string
  alt?: string
  /** height divided by width, so the box is right before the file arrives. */
  ratio?: number
}) {
  return (
    <div
      className="rjMark"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 8,
        opacity,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/rj-mark-320.png"
        alt="Rancho Jaramillo"
        width={width}
        height={Math.round((width * 203) / 320)}
        style={{ width, height: "auto", display: "block" }}
      />
      {label ? (
        <span
          style={{
            fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
            fontSize: 9,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "rgba(237,241,246,.52)",
            textAlign: align === "center" ? "center" : "left",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
