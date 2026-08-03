import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components"

// ─── Brand tokens ────────────────────────────────────────────────────────────
const NAVY    = "#0A0E1A"
const PANEL   = "#0E1A2A"
const BORDER  = "rgba(255,255,255,0.10)"
const ORANGE  = "#EF4A18"
const GOLD    = "#F2C94C"
const TEAL    = "#57C7F5"
const WHITE   = "#EDF1F6"
const MUTED   = "#8B93A7"
const arch    = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const mono    = "ui-monospace, 'Courier New', Courier, monospace"

interface SubscriberWelcomeProps {
  source?: string  // e.g. "juice-box", "gloss-game", "site"
}

export default function SubscriberWelcome({ source = "site" }: SubscriberWelcomeProps) {
  const sourceLabel: Record<string, string> = {
    "juice-box":  "The Juice Box",
    "gloss-game": "The Gloss Game",
    "site":       "PaddockGavin",
  }
  const label = sourceLabel[source] ?? "PaddockGavin"

  return (
    <Html lang="en">
      <Head />
      <Preview>You&apos;re in. Welcome to the paddock.</Preview>

      <Body style={{ background: NAVY, margin: 0, padding: 0, fontFamily: arch }}>

        {/* ── Header ── */}
        <Section style={{ background: PANEL, borderBottom: `1px solid ${BORDER}`, padding: "28px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Row>
              <Column>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
                  PaddockGavin
                </Text>
                <Text style={{ margin: "2px 0 0", fontFamily: arch, fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: WHITE }}>
                  Two shifts. One paddock.
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: ORANGE }}>
                  {label}
                </Text>
              </Column>
            </Row>
          </Container>
        </Section>

        {/* ── Orange accent stripe ── */}
        <Section style={{ background: ORANGE, padding: "3px 0", margin: 0 }} />

        {/* ── Hero copy ── */}
        <Section style={{ background: NAVY, padding: "48px 32px 36px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Heading style={{ margin: "0 0 20px", fontFamily: arch, fontWeight: 900, fontSize: 34, letterSpacing: "-0.025em", lineHeight: 1.08, color: WHITE }}>
              You&apos;re in the paddock.
            </Heading>
            <Text style={{ margin: "0 0 16px", fontFamily: arch, fontSize: 16.5, lineHeight: 1.65, color: "#C8D0DB" }}>
              Signed up via <span style={{ color: GOLD }}>{label}</span>. That&apos;s noted.
              You&apos;ll hear from me when there&apos;s something worth saying —
              builds, breakdowns, and a few things I probably shouldn&apos;t post anywhere else.
            </Text>
            <Text style={{ margin: 0, fontFamily: arch, fontSize: 16.5, lineHeight: 1.65, color: "#C8D0DB" }}>
              No cadence promises. No fluff. Just the signal.
            </Text>
          </Container>
        </Section>

        {/* ── Speed stripe divider ── */}
        <Section style={{ padding: "0 32px 36px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Row>
              {[ORANGE, GOLD, TEAL, MUTED].map((c, i) => (
                <Column key={i} style={{ width: "25%", padding: 0 }}>
                  <div style={{ height: 4, background: c }} />
                </Column>
              ))}
            </Row>
          </Container>
        </Section>

        {/* ── Quick links ── */}
        <Section style={{ background: PANEL, padding: "32px 32px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <Container style={{ maxWidth: 600 }}>
            <Text style={{ margin: "0 0 20px", fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>
              While you&apos;re here
            </Text>
            <Row style={{ marginBottom: 14 }}>
              <Column style={{ width: 28 }}>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 12, color: ORANGE }}>01</Text>
              </Column>
              <Column>
                <Link href="https://paddockgavin.com/cars" style={{ fontFamily: arch, fontWeight: 700, fontSize: 15, color: WHITE, textDecoration: "none" }}>
                  The Garage — 29 cars, every story
                </Link>
              </Column>
            </Row>
            <Row style={{ marginBottom: 14 }}>
              <Column style={{ width: 28 }}>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 12, color: ORANGE }}>02</Text>
              </Column>
              <Column>
                <Link href="https://paddockgavin.com/supercar-iq" style={{ fontFamily: arch, fontWeight: 700, fontSize: 15, color: WHITE, textDecoration: "none" }}>
                  Supercar IQ — launching soon
                </Link>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: 28 }}>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 12, color: ORANGE }}>03</Text>
              </Column>
              <Column>
                <Link href="https://paddockgavin.com/vlog" style={{ fontFamily: arch, fontWeight: 700, fontSize: 15, color: WHITE, textDecoration: "none" }}>
                  The Vlog — @PaddockGavin
                </Link>
              </Column>
            </Row>
          </Container>
        </Section>

        {/* ── Footer ── */}
        <Section style={{ background: NAVY, padding: "28px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Text style={{ margin: "0 0 8px", fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
              Digest. Develop. Deliver.
            </Text>
            <Text style={{ margin: "0 0 16px", fontFamily: arch, fontSize: 13, lineHeight: 1.6, color: MUTED }}>
              Nashville, TN &middot; A <Link href="https://gotimemotorsports.com" style={{ color: MUTED }}>GoTime Motorsports</Link> company
            </Text>
            <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 16px" }} />
            <Text style={{ margin: 0, fontFamily: arch, fontSize: 12, color: "#4A5568" }}>
              You signed up at paddockgavin.com. No spam, ever.
              {" "}<Link href="https://paddockgavin.com/legal/privacy" style={{ color: "#4A5568" }}>Privacy policy</Link>.
            </Text>
          </Container>
        </Section>

      </Body>
    </Html>
  )
}
