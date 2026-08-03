import {
  Body,
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

export interface IntakeConfirmationProps {
  firstName: string
  make?: string
  model?: string
  year?: string
  budget?: string
  notes?: string
  refNumber: string   // e.g. "PG-2026-0047"
}

export default function IntakeConfirmation({
  firstName  = "Gavin",
  make       = "Porsche",
  model      = "GT3",
  year       = "2024",
  budget     = "$200,000–$220,000",
  notes      = "",
  refNumber  = "PG-2026-0001",
}: IntakeConfirmationProps) {
  const hasSpec = make || model || year || budget

  return (
    <Html lang="en">
      <Head />
      <Preview>Got it, {firstName}. Your request is in the paddock.</Preview>

      <Body style={{ background: NAVY, margin: 0, padding: 0, fontFamily: arch }}>

        {/* ── Header ── */}
        <Section style={{ background: PANEL, padding: "0 32px", borderBottom: `1px solid ${BORDER}` }}>
          <Container style={{ maxWidth: 600 }}>
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
                  PaddockGavin
                </Text>
                <Text style={{ margin: "4px 0 0", fontFamily: arch, fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", color: WHITE }}>
                  Find Me a Car
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ margin: 0, fontFamily: mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: STEEL }}>
                  Ref
                </Text>
                <Text style={{ margin: "4px 0 0", fontFamily: mono, fontSize: 13, letterSpacing: "0.1em", color: ORANGE }}>
                  {refNumber}
                </Text>
              </Column>
            </Row>
          </Container>
        </Section>

        {/* ── Hero ── */}
        <Section style={{ background: NAVY, padding: "44px 32px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Heading style={{ margin: "0 0 20px", fontFamily: arch, fontWeight: 900, fontSize: 32, letterSpacing: "-0.025em", lineHeight: 1.1, color: WHITE }}>
              Request received, {firstName}.
            </Heading>
            <Text style={{ margin: "0 0 16px", fontFamily: arch, fontSize: 16.5, lineHeight: 1.65, color: BODY }}>
              I&apos;ve got your spec. I work the duPont REGISTRY lot every day —
              that means I see what&apos;s actually here before it goes online, and I know
              the sellers worth talking to.
            </Text>
            <Text style={{ margin: 0, fontFamily: arch, fontSize: 16.5, lineHeight: 1.65, color: BODY }}>
              Expect a reply within <span style={{ color: GOLD, fontWeight: 700 }}>24–48 hours</span>.
              If something comes across the lot that matches exactly, you&apos;ll hear sooner.
            </Text>
          </Container>
        </Section>

        {/* ── Spec card ── */}
        {hasSpec && (
          <Section style={{ padding: "0 32px 40px" }}>
            <Container style={{ maxWidth: 600 }}>
              <div style={{ background: PANEL, border: `1px solid ${BORDER}`, padding: "24px 24px" }}>
                <Text style={{ margin: "0 0 18px", fontFamily: mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: STEEL }}>
                  Your request on file
                </Text>
                {[
                  { label: "Vehicle",  value: [year, make, model].filter(Boolean).join(" ") || "—" },
                  { label: "Budget",   value: budget || "—" },
                  { label: "Notes",    value: notes  || "None provided" },
                  { label: "Ref",      value: refNumber },
                ].map(({ label, value }) => (
                  <Row key={label} style={{ marginBottom: 12 }}>
                    <Column style={{ width: 80 }}>
                      <Text style={{ margin: 0, fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: STEEL }}>
                        {label}
                      </Text>
                    </Column>
                    <Column>
                      <Text style={{ margin: 0, fontFamily: arch, fontWeight: 700, fontSize: 15, color: WHITE }}>
                        {value}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* ── What happens next ── */}
        <Section style={{ background: PANEL, padding: "32px 32px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <Container style={{ maxWidth: 600 }}>
            <Text style={{ margin: "0 0 20px", fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: STEEL }}>
              What happens now
            </Text>
            {[
              { n: "01", c: ORANGE, text: "I review your spec against current inventory at duPont REGISTRY — Nashville and national." },
              { n: "02", c: GOLD,   text: "If there&apos;s a match or a lead, I reach back out directly. No middleman, no handoff." },
              { n: "03", c: TEAL,   text: "If the right car isn&apos;t there yet, I&apos;ll tell you that too. No invented urgency." },
            ].map(({ n, c, text }) => (
              <Row key={n} style={{ marginBottom: 18 }}>
                <Column style={{ width: 36, verticalAlign: "top" }}>
                  <Text style={{ margin: 0, fontFamily: mono, fontSize: 13, color: c, fontWeight: 700 }}>{n}</Text>
                </Column>
                <Column>
                  <Text style={{ margin: 0, fontFamily: arch, fontSize: 15, lineHeight: 1.6, color: BODY }}
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                </Column>
              </Row>
            ))}
          </Container>
        </Section>

        {/* ── Footer ── */}
        <Section style={{ background: NAVY, padding: "28px 32px" }}>
          <Container style={{ maxWidth: 600 }}>
            <Text style={{ margin: "0 0 6px", fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: STEEL }}>
              Digest. Develop. Deliver.
            </Text>
            <Text style={{ margin: "0 0 16px", fontFamily: arch, fontSize: 13, lineHeight: 1.6, color: STEEL }}>
              Nashville, TN &middot; <Link href="https://paddockgavin.com" style={{ color: STEEL }}>paddockgavin.com</Link>
              {" "}&middot; <Link href="https://gotimemotorsports.com" style={{ color: STEEL }}>GoTime Motorsports</Link>
            </Text>
            <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 16px" }} />
            <Text style={{ margin: 0, fontFamily: arch, fontSize: 12, color: "#4A5568" }}>
              You submitted a car request at paddockgavin.com.
              {" "}<Link href="https://paddockgavin.com/legal/privacy" style={{ color: "#4A5568" }}>Privacy policy</Link>.
            </Text>
          </Container>
        </Section>

      </Body>
    </Html>
  )
}
