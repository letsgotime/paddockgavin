/**
 * The page's photograph, handed to the site backdrop.
 *
 * Every page used to carry its own fixed background: a div, an <Image>, a
 * wash gradient, each a slightly different recipe. The backdrop now lives once
 * in the root layout (see .pg-backdrop in globals.css) and a page only says
 * which picture from the library it wants under the glass, and where to crop
 * it. Nothing here renders a pixel; it sets two custom properties on :root,
 * and it unmounts with the page so the next route starts from the default.
 *
 * Server component. No JavaScript reaches the browser for this.
 */
export function PageBackdrop({ src, pos = "center", opacity }: { src: string; pos?: string; opacity?: number }) {
  const rules = [
    `--pg-backdrop:url("${src}")`,
    `--pg-backdrop-pos:${pos}`,
    opacity !== undefined ? `--pg-backdrop-opacity:${opacity}` : "",
  ].filter(Boolean).join(";")
  return <style>{`:root{${rules}}`}</style>
}

/** The fixed layer itself. Rendered once, in app/layout.tsx. */
export function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="pg-backdrop">
      <div className="pg-backdrop-img" />
      <div className="pg-backdrop-wash" />
    </div>
  )
}
