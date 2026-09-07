import { Section } from "@/components/home-sections"
import { getFollowerCount, formatFollowers } from "@/lib/social"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

/** The audience numbers, under the audience heading. The car numbers live in the proof strip. */
export async function HomeMediaKit() {
  const { followers } = await getFollowerCount()
  return (
    <Section id="mediakit" eyebrow="For brands" tone="#F2C94C" title="An audience that owns the cars you make things for" cta={{ href: "#contact", label: "Pitch a brand deal" }} link={{ href: "/connect", label: "Every link" }}>
      <p style={{ margin: 0 }}>
        The people who watch this already own the cars, or are working out which one to buy next. The figures below come from Instagram Insights, and I will show you the screens.</p>
      <dl className="pg-proof" style={{ margin: "6px 0 0" }}>
        {[
          { v: "~1M",   k: "views a month" },
          { v: formatFollowers(followers), k: "followers" },
          { v: "Owners", k: "and collectors" },
          { v: "200+",  k: "events run" },
        ].map((s) => (
          <div key={s.k} className="pg-e0" style={{ padding: "14px 16px 12px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)" }}>
            <dt style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1, letterSpacing: "-.03em", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{s.v}</dt>
            <dd style={{ margin: "6px 0 0", fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".16em", textTransform: "uppercase", color: "#B4B6B2" }}>{s.k}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
