import Image from "next/image"
import Link from "next/link"

export function HomeStory() {
  return (
    <>
      {/* Story section */}
      <section
        data-screen-label="Who is filming this"
        id="story"
        style={{
          maxWidth: 1180,
          width: "100%",
          margin: "0 auto",
          padding: "0 clamp(12px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(16px,2.4vw,24px)",
        }}
      >
        {/* Photo side */}
        <div
          style={{
            flex: "4 1 240px",
            minWidth: 0,
            position: "relative",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            background: "rgba(21,37,56,.5)",
            minHeight: 320,
          }}
        >
          <Image
            src="/images/gavin-work.webp"
            alt="Gavin on the lot"
            fill
            style={{ objectFit: "cover" }}
          />
          <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "34px 16px 14px",
              background: "linear-gradient(to top,rgba(10,21,35,.95),rgba(10,21,35,0))",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <i
              aria-hidden="true"
              style={{ width: 26, height: 3, background: "#00D2BE", flex: "0 0 auto", marginTop: 6 }}
            />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".15em",
                lineHeight: 1.55,
                textTransform: "uppercase",
                color: "#EDF1F6",
              }}
            >
              Lot Operations and Events Manager, duPont REGISTRY
            </span>
          </span>
        </div>

        {/* Text side */}
        <div
          style={{
            flex: "7 1 320px",
            minWidth: 0,
            background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(26px,4vw,44px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: "skewX(-12deg)",
              background: "#F8B800",
              padding: "6px 16px",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: "skewX(12deg)",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#101010",
              }}
            >
              Who&apos;s filming this
            </span>
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(28px,4.4vw,46px)",
              lineHeight: 1.02,
              letterSpacing: "-.024em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              maxWidth: "15ch",
              textWrap: "pretty" as never,
            }}
          >
            Cars used to be{" "}
            <span style={{ color: "#F8B800" }}>the reward</span>
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: "clamp(17px,1.7vw,19px)",
              lineHeight: 1.58,
              color: "#C4CBD6",
              maxWidth: "58ch",
            }}
          >
            I led technology teams for a long time, and a car I enjoyed was what I worked extra hard to drive home in. Last October I took a job at duPont REGISTRY running lot operations and events, so now they&apos;re what I get up for.
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: 17,
              lineHeight: 1.62,
              color: "#B4B6B2",
              maxWidth: "58ch",
            }}
          >
            A few dozen of my own over the years, and a lot more found for other people. The technology work moved to nights.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/garage"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                background: "#F8B800",
                color: "#101010",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              Why a paddock
            </Link>
          </div>
        </div>
      </section>

      {/* Full-bleed photo — donuts overflow */}
      <section
        data-screen-label="The lot"
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(340px,58vh,620px)",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/donuts-overflow.webp"
          alt="The overflow. It fills up early and keeps filling"
          fill
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,.12) 42%,rgba(10,21,35,.3) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "0 clamp(12px,4vw,40px)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <i aria-hidden="true" style={{ width: 26, height: 3, background: "#4BA3DE", flex: "0 0 auto" }} />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".16em",
                lineHeight: 1.5,
                textTransform: "uppercase",
                color: "#EDF1F6",
                textShadow: "0 1px 10px rgba(10,21,35,.9)",
              }}
            >
              The overflow. It fills up early and keeps filling
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
