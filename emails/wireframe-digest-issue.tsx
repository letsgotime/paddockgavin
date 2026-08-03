import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components"

// ─── Brand tokens ────────────────────────────────────────────────────────────
const NAVY   = "#0A0E1A"
const PANEL  = "#0E1A2A"
const BORDER = "rgba(255,255,255,0.10)"
const ORANGE = "#EF4A18"
const GOLD   = "#F2C94C"
const TEAL   = "#57C7F5"
const STEEL  = "#8B93A7"
const WHITE  = "#EDF1F6"
const BODY   = "#C8D0DB"
const arch   = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const mono   = "ui-monospace, 'Courier New', Courier, monospace"

export interface WireframeDigestIssueProps {
  issueNumber: string           // "012"
  issueDate: string             // "August 2026"
  title: string                 // "Why Your AI-Built Site Is Invisible to Google"
  kicker: string                // "SEO · Cluster 2.5"
  slug: string                  // "ai-built-website-not-showing-in-google"
  lede: string                  // 2–3 sentence hook
  body: string                  // Full article text (plain, no HTML)
  ctaLabel?: string             // "Read the full post"
  linkedInPost?: string         // optional LinkedIn teaser copy
  instagramCaption?: string     // optional IG caption
}

export default function WireframeDigestIssue({
  issueNumber    = "012",
  issueDate      = "August 2026",
  title          = "What Agentic Engineering Actually Looks Like on a $25K Build",
  kicker         = "Agentic Engineering · Cluster 1.1",
  slug           = "what-is-agentic-engineering",
  lede           = "Everyone is calling their intern an AI engineer. Here is what the term actually means when real production software is involved.",
  body           = "Lorem ipsum — paste article body here.",
  ctaLabel       = "Read the full post",
  linkedInPost,
  instagramCaption,
}: WireframeDigestIssueProps) {
  const postUrl = `https://paddockgavin.com/blog/${slug}`

  return (
    <Html lang="en">
      <Head />
      <Preview>Wireframe Digest #{issueNumber} — {title}</Preview>

      <Body style={{ background: NAVY, margin: 0, padding: 0, fontFamily: arch }}>

        {/* ── Masthead ── */}
        <Section style={{ background: PANEL, padding: "0 32px", borderBottom: `1px solid ${BORDER}` }}>
          <Container style={{ maxWidth: 600 }}>
            {/* Speed stripes */}
            <Row style={{ marginBottom: 0 }}>
              {[ORANGE, GOLD, TEAL, STEEL].map((c, i) => (
                <Column key={i} style={{ width: "25%", padding: 0 }}>
                  <div style={{ height: 3, background: c }} />
                </Column>
              ))}
            </Row>
            <Row style={{ padding: "22px 0 20px" }}>
              <Column>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: STEEL }}>
                  Wireframe Digest
                </Text>
                <Text style={{ margin: "4px 0 0", fontFamily: arch, fontWeight: 900, fontSize: 26, letterSpacing: "-0.025em", lineHeight: 1, color: WHITE }}>
                  Issue #{issueNumber}
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: STEEL }}>
                  {issueDate}
                </Text>
                <Text style={{ margin: "4px 0 0", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE }}>
                  {kicker}
                </Text>
              </Column>
            </Row>
          </Container>
        </Section>

        {/* ── Article headline ── */}
        <Section style={{ background: NAVY, padding: "44px 32px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Heading style={{ margin: "0 0 18px", fontFamily: arch, fontWeight: 900, fontSize: 32, letterSpacing: "-0.025em", lineHeight: 1.1, color: WHITE }}>
              {title}
            </Heading>
            <Text style={{ margin: 0, fontFamily: arch, fontSize: 18, lineHeight: 1.6, color: GOLD, fontWeight: 600 }}>
              {lede}
            </Text>
          </Container>
        </Section>

        {/* ── Gold rule ── */}
        <Section style={{ padding: "0 32px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <div style={{ height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </Container>
        </Section>

        {/* ── Article body ── */}
        <Section style={{ padding: "0 32px 36px" }}>
          <Container style={{ maxWidth: 600 }}>
            {body.split("\n\n").map((para, i) => (
              <Text key={i} style={{ margin: "0 0 18px", fontFamily: arch, fontSize: 16, lineHeight: 1.72, color: BODY }}>
                {para}
              </Text>
            ))}
          </Container>
        </Section>

        {/* ── CTA button ── */}
        <Section style={{ padding: "0 32px 48px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Button
              href={postUrl}
              style={{
                background: ORANGE,
                color: WHITE,
                fontFamily: arch,
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "15px 32px",
                border: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {ctaLabel}
            </Button>
            <Text style={{ margin: "14px 0 0", fontFamily: mono, fontSize: 11, color: STEEL }}>
              {postUrl}
            </Text>
          </Container>
        </Section>

        {/* ── Social copy block (optional) ── */}
        {(linkedInPost || instagramCaption) && (
          <Section style={{ background: PANEL, padding: "32px 32px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <Container style={{ maxWidth: 600 }}>
              <Text style={{ margin: "0 0 20px", fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: STEEL }}>
                Social copy — ready to paste
              </Text>
              {linkedInPost && (
                <>
                  <Text style={{ margin: "0 0 6px", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL }}>
                    LinkedIn
                  </Text>
                  <Text style={{ margin: "0 0 24px", fontFamily: arch, fontSize: 14, lineHeight: 1.6, color: BODY, borderLeft: `2px solid ${TEAL}`, paddingLeft: 14 }}>
                    {linkedInPost}
                  </Text>
                </>
              )}
              {instagramCaption && (
                <>
                  <Text style={{ margin: "0 0 6px", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: ORANGE }}>
                    Instagram
                  </Text>
                  <Text style={{ margin: 0, fontFamily: arch, fontSize: 14, lineHeight: 1.6, color: BODY, borderLeft: `2px solid ${ORANGE}`, paddingLeft: 14 }}>
                    {instagramCaption}
                  </Text>
                </>
              )}
            </Container>
          </Section>
        )}

        {/* ── Footer ── */}
        <Section style={{ background: NAVY, padding: "28px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Text style={{ margin: "0 0 6px", fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: STEEL }}>
              Wireframe Digest &middot; Real AI builds from Nashville
            </Text>
            <Text style={{ margin: "0 0 16px", fontFamily: arch, fontSize: 13, lineHeight: 1.6, color: STEEL }}>
              <Link href="https://paddockgavin.com/blog" style={{ color: STEEL }}>paddockgavin.com/blog</Link>
              {" "}&middot;{" "}
              <Link href="https://gotimemotorsports.com" style={{ color: STEEL }}>A GoTime Motorsports company</Link>
            </Text>
            <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 16px" }} />
            <Text style={{ margin: 0, fontFamily: arch, fontSize: 12, color: "#4A5568" }}>
              You&apos;re receiving this because you subscribed at paddockgavin.com.
              {" "}<Link href="https://paddockgavin.com/legal/privacy" style={{ color: "#4A5568" }}>Privacy</Link>
              {" "}&middot;{" "}
              <Link href="https://paddockgavin.com/unsubscribe" style={{ color: "#4A5568" }}>Unsubscribe</Link>
            </Text>
          </Container>
        </Section>

      </Body>
    </Html>
  )
}
