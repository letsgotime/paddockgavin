/**
 * Brand tokens, and the rule about where they apply.
 *
 * The design system never changes between events. Floating glass, the type
 * scale, the spacing, the motion, the clipped corners: that is PaddockGavin's
 * spec and every event page is built from it. What swaps is a short list of
 * token values, so an event page reads as the client's world while still
 * obviously being made by us.
 *
 * Where each set applies:
 *
 *   /events                     PaddockGavin.  Our hub, our shop window.
 *   /events/{slug}              the event's brand. Their logo leads, ours
 *                               signs the bottom. Their colours and display
 *                               face. Still our glass.
 *   /events/{slug}/{surface}    PaddockGavin. The CRM is our product, and it
 *                               looks like ours whichever event is loaded.
 *                               The event's accent appears as an identifier
 *                               on the rail and nowhere else.
 *
 * That last line is the one worth arguing about, so it is written down rather
 * than assumed: a tool that repaints itself per client stops feeling like a
 * tool you bought and starts feeling like a fork somebody made.
 */

export type Brand = {
  name: string
  logo: string
  logoOnDark?: string
  wordmark?: string
  icon?: string
  accent: string
  accentName?: string
  second?: string
  secondName?: string
  ink: string
  paper: string
  display: string
  body: string
  tone?: string
  host?: string
}

/** Ours. The hub and every CRM surface wear this, always. */
export const PADDOCKGAVIN: Brand = {
  name: "PaddockGavin",
  logo: "/images/pg-mark.png",
  accent: "#F2C94C",
  accentName: "Paddock Amber",
  second: "#00D2BE",
  secondName: "Paddock Teal",
  ink: "#070D14",
  paper: "#EDF1F6",
  display: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  body: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
}

/** Used when an event row has no brand yet, so a new event still looks finished. */
export function brandOf(raw: unknown): Brand {
  const b = (raw ?? {}) as Partial<Brand>
  return {
    ...PADDOCKGAVIN,
    ...b,
    name: b.name ?? PADDOCKGAVIN.name,
    logo: b.logo ?? PADDOCKGAVIN.logo,
    accent: b.accent ?? PADDOCKGAVIN.accent,
    ink: b.ink ?? PADDOCKGAVIN.ink,
    paper: b.paper ?? PADDOCKGAVIN.paper,
    display: b.display ?? PADDOCKGAVIN.display,
    body: b.body ?? PADDOCKGAVIN.body,
  }
}

/**
 * The tokens as CSS custom properties.
 *
 * Components read var(--accent) and never a literal, which is the whole
 * mechanism: one stylesheet, two brands, no forked components.
 */
export function tokens(b: Brand): Record<string, string> {
  return {
    "--accent": b.accent,
    "--second": b.second ?? PADDOCKGAVIN.second!,
    "--ink": b.ink,
    "--paper": b.paper,
    "--display": b.display,
    "--body": b.body,
    "--mono": "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
    /* the glass, identical in both worlds */
    "--glass": "rgba(17,27,40,.58)",
    "--gline": "rgba(255,255,255,.11)",
    "--blur": "blur(20px) saturate(1.5)",
    "--clip": "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
    "--ease": "cubic-bezier(.16,.84,.32,1)",
  }
}

/** Fonts an event brand needs that the base page does not already load. */
export function webfontHref(b: Brand): string | null {
  if (/Cinzel/i.test(b.display)) {
    return "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&display=swap"
  }
  return null
}
