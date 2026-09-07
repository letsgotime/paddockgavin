"use client"

import { useEffect, useRef } from "react"
import { PageBackdrop } from "@/components/page-backdrop"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export default function WhyAPaddockPage() {
  const mainRef = useRef<HTMLDivElement>(null)

  // Scroll reveal — arm elements below fold, then fire on IntersectionObserver
  useEffect(() => {
    const els = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))

    const fire = (el: HTMLElement) => el.classList.add("reveal-on")

    let obs: IntersectionObserver | null = null
    const arm = () => {
      els().forEach((el) => {
        if (el.dataset.armed) return
        const { top } = el.getBoundingClientRect()
        if (top <= window.innerHeight * 1.02) return
        el.dataset.armed = "1"
        el.classList.add("reveal-ready")
        if (!obs) {
          obs = new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (en.isIntersecting) {
                  fire(en.target as HTMLElement)
                  obs!.unobserve(en.target)
                }
              })
            },
            { rootMargin: "0px 0px -6% 0px", threshold: 0.03 }
          )
        }
        obs.observe(el)
      })
    }

    window.addEventListener("scroll", arm, { once: true, passive: true })
    arm()
    return () => {
      obs?.disconnect()
      window.removeEventListener("scroll", arm)
    }
  }, [])

  return (
    <>
      <style>{`
        .reveal-ready { opacity: 0; transform: translateY(18px); }
        .reveal-on { animation: pgIn .62s cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes pgIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
      `}</style>

      <SiteNav active="why" />

      <PageBackdrop src="/images/cage-rig.webp" opacity={0.16} />

      <main
        ref={mainRef}
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 920,
          margin: "0 auto",
          padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(14px,2.4vw,22px)",
        }}
      >
        {/* Hero */}
        <section
          style={{
            position: "relative",
            minHeight: "clamp(380px,52vh,540px)",
            border: "1px solid rgba(255,255,255,.14)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Image
            src="/images/cullinan-doors.webp"
            alt="Murcielago with a door up, waiting on the transporter behind it"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top,rgba(10,21,35,.96) 12%,rgba(10,21,35,.5) 58%,rgba(10,21,35,.32) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              padding: "clamp(22px,3.6vw,42px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 680,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <i aria-hidden="true" style={{ width: 26, height: 3, background: "#00D2BE", flexShrink: 0, display: "block" }} />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6",
                }}
              >
                One meaning, lived twice
              </span>
            </span>
            <h1
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 800,
                fontSize: "var(--t-h1)",
                lineHeight: 1.05,
                letterSpacing: "-.025em",
                color: "#FFFFFF",
              }}
            >
              Why a<br /><span style={{ color: "#F2C94C" }}>paddock</span>
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: "clamp(17px,1.9vw,20px)",
                lineHeight: 1.56,
                color: "#EDF1F6",
                maxWidth: "50ch",
                textShadow: "0 1px 10px rgba(10,21,35,.85)",
              }}
            >
              I wasn&rsquo;t looking for a name. I was trying to explain what I do with my time, and I kept coming back to the same word.
            </p>
          </div>
        </section>

        {/* 01 — The word */}
        <section
          data-reveal
          className="pg-e1" style={{
            position: "relative",
            isolation: "isolate",
            borderLeft: "3px solid #00D2BE",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "hidden"
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute", right: 16, top: 12,
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: 110, lineHeight: 1, letterSpacing: "-.04em",
              color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,.16)", pointerEvents: "none",
            }}
          >01</span>
          <Image
            src="/images/918-p1.webp"
            alt=""
            aria-hidden
            fill
            loading="lazy"
            style={{ objectFit: "cover", objectPosition: "center 42%", opacity: 0.34, zIndex: -1 }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: -1,
              background: "linear-gradient(160deg,rgba(14,26,42,.96) 0%,rgba(14,26,42,.86) 50%,rgba(14,26,42,.52) 100%)",
            }}
          />
          <span
            style={{
              display: "inline-block", transform: "skewX(-12deg)",
              background: "#00D2BE", padding: "6px 16px", alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-block", transform: "skewX(12deg)",
                fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em",
                textTransform: "uppercase", color: "#00302B",
              }}
            >
              The word
            </span>
          </span>
          <h2
            style={{
              margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800,
              fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF",
            }}
          >
            What a paddock is, and why it fits lot operations
          </h2>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.62, color: "#C4CBD6", maxWidth: "60ch" }}>
            It&rsquo;s the part of a racetrack most people never see. Behind pit lane, where the transporters park and the teams work.
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.62, color: "#B4B6B2", maxWidth: "60ch" }}>
            Nobody in a paddock is showing off. Everybody has something apart, and everybody is happy to tell you why. You learn more standing around one for an afternoon than you do reading for a year.
          </p>
        </section>

        {/* 02 — The lot (full-bleed image card) */}
        <section
          data-reveal
          style={{
            position: "relative",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
            minHeight: "clamp(340px,46vh,480px)",
          }}
        >
          <Image
            src="/images/ferrari-upperdeck.webp"
            alt="Off the transporter"
            fill
            loading="lazy"
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top,rgba(10,21,35,.96) 14%,rgba(10,21,35,.52) 58%,rgba(10,21,35,.34) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              padding: "clamp(22px,3.2vw,34px)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 680,
            }}
          >
            <span
              style={{
                display: "inline-block", transform: "skewX(-12deg)",
                background: "#F2C94C", padding: "6px 16px", alignSelf: "flex-start",
              }}
            >
              <span
                style={{
                  display: "inline-block", transform: "skewX(12deg)",
                  fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em",
                  textTransform: "uppercase", color: "#101010",
                }}
              >
                The lot
              </span>
            </span>
            <h2
              style={{
                margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800,
                fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF",
              }}
            >
              On the lot, Lebanon, Tennessee
            </h2>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.6, color: "#EDF1F6", maxWidth: "56ch", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
              The bay door went up and there was a transporter already waiting. Some mornings it was one car. Some mornings you could not walk through the place.
            </p>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.6, color: "#C4CBD6", maxWidth: "56ch" }}>
              Everything that came off a truck got looked over before it went anywhere. Checked, cleaned, photographed, written up, put somewhere safe. Everything leaving got verified first. There&rsquo;s real fraud in this business, and somebody trusted us with a car they love.{" "}
              <Link href="/lot-ops" style={{ color: "#00D2BE", textDecoration: "none" }}>The mornings have their own page.</Link>
            </p>
          </div>
        </section>

        {/* 03 — What a car is (blue panel) */}
        <section
          data-reveal
          className="pg-e1" style={{
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
            background: "linear-gradient(150deg,rgba(0,81,133,.92),rgba(0,81,133,.68))",
            border: "1px solid #0A6BAA",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <Image
            src="/images/918-pipes.webp"
            alt=""
            aria-hidden
            fill
            loading="lazy"
            style={{ objectFit: "cover", objectPosition: "center 38%", opacity: 0.3, zIndex: -1 }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: -1,
              background: "linear-gradient(150deg,rgba(0,81,133,.9) 0%,rgba(0,81,133,.72) 52%,rgba(0,81,133,.5) 100%)",
            }}
          />
          <h2
            style={{
              margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800,
              fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF",
            }}
          >
            What exotic car ownership actually means
          </h2>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.62, color: "#CFE4F4", maxWidth: "60ch" }}>
            A car is one of the few things you buy with your whole personality. Nobody agonizes over a refrigerator. You pick one and you&rsquo;ve told everybody what you think is beautiful, what you&rsquo;ll put up with, and what you&rsquo;d rather not admit you can afford.
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.62, color: "#CFE4F4", maxWidth: "60ch" }}>
            Then you live with it. It picks up a smell. It develops a rattle you stop hearing. You learn where it&rsquo;s slow and you forgive it.
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.62, color: "#FFFFFF", maxWidth: "60ch" }}>
            None of that is in a listing.
          </p>
        </section>

        {/* 04 — The flip */}
        <section
          data-reveal
          className="pg-e1" style={{
            position: "relative",
            isolation: "isolate",
            borderLeft: "3px solid #00D2BE",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "hidden"
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute", right: 16, top: 12,
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: 110, lineHeight: 1, letterSpacing: "-.04em",
              color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,.16)", pointerEvents: "none",
            }}
          >04</span>
          <Image
            src="/images/g993-ramp.webp"
            alt=""
            aria-hidden
            fill
            loading="lazy"
            style={{ objectFit: "cover", objectPosition: "center 58%", opacity: 0.34, zIndex: -1 }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: -1,
              background: "linear-gradient(160deg,rgba(14,26,42,.96) 0%,rgba(14,26,42,.86) 50%,rgba(14,26,42,.52) 100%)",
            }}
          />
          <span
            style={{
              display: "inline-block", transform: "skewX(-12deg)",
              background: "#00D2BE", padding: "6px 16px", alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-block", transform: "skewX(12deg)",
                fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em",
                textTransform: "uppercase", color: "#00302B",
              }}
            >
              The flip
            </span>
          </span>
          <h2
            style={{
              margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800,
              fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF",
            }}
          >
            Why one person does all of it
          </h2>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(17px,1.9vw,19px)", lineHeight: 1.62, color: "#C4CBD6", maxWidth: "60ch" }}>
            People meet the two halves separately and assume there are two of me. There is a day of events and client work, and a night of code, and from outside they look like different jobs done by the same surname.
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(17px,1.9vw,19px)", lineHeight: 1.62, color: "#EDF1F6", maxWidth: "60ch" }}>
            They are the same job. Supercar IQ reads a car the moment it arrives and pulls its spec, its recalls and what it is worth. The lot was a gate opening at eight on a transporter of cars that all had to be checked, photographed and written up before anybody saw them. That is one problem, and I have solved it twice, once with people and once with software.
          </p>
          <p style={{ margin: "0 0 22px", fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "54ch" }}>
            Every photo and every clip on this site came from somebody standing somewhere holding
            something, usually early, usually in bad light, usually while I was busy. That is the
            whole of it, and it is why there is only one of me.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <Link
              href="/lot-ops"
              style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase",
                background: "#F2C94C", color: "#101010",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              The mornings now
            </Link>
            <Link
              href="/garage"
              style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase",
                color: "#EDF1F6",
                border: "1px solid rgba(255,255,255,.3)",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              The garage, in full
            </Link>
          </div>
        </section>
      </main>

      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteFooter />
      </div>
    </>
  )
}
