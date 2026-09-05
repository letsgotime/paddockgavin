"use client"

import { useEffect, useRef, useState } from "react"
import { upload as blobUpload } from "@vercel/blob/client"

/**
 * Adds photographs and video to an existing entry, from its status page.
 *
 * The token in the page address is the whole key, the same one the desk
 * email carries. Files go from the browser straight to the private store
 * through the same route and path rules the entry form uses, and each
 * finished file is appended to the entry by /api/entry-media. Appends only:
 * nothing here can remove or replace a file, and the entry itself never
 * moves. This is how a car entered before the form took photographs
 * catches up without anybody resubmitting.
 */

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const TURNSTILE_SITEKEY = "0x4AAAAAAEkdaaU0WCZzdgGE"
const MIN_PHOTOS = 5
const MAX_PHOTOS = 50
const MAX_VIDEOS = 3
const MAX_VIDEO_SEC = 300

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

type UpRow = { id: string; name: string; pct: number; done: boolean; label: string }

function mintDraft(): string {
  const k = "ppr_draft_id"
  const gen = "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  try {
    const v = sessionStorage.getItem(k)
    if (v) return v
    sessionStorage.setItem(k, gen)
    return gen
  } catch {
    return gen
  }
}

function clipSeconds(file: File): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement("video")
    const url = URL.createObjectURL(file)
    const done = (d: number) => {
      URL.revokeObjectURL(url)
      resolve(d)
    }
    el.preload = "metadata"
    el.onloadedmetadata = () => done(isFinite(el.duration) ? el.duration : 0)
    el.onerror = () => done(0)
    el.src = url
  })
}

function fmtSecs(s: number): string {
  const m = Math.floor(s / 60)
  const r = Math.round(s % 60)
  return m + ":" + (r < 10 ? "0" : "") + r
}

export function AddMedia({ token, photoCt, videoCt }: { token: string; photoCt: number; videoCt: number }) {
  const [counts, setCounts] = useState({ photo: photoCt, video: videoCt })
  const [rows, setRows] = useState<UpRow[]>([])
  const [note, setNote] = useState("")
  const tsRef = useRef<HTMLDivElement>(null)
  const tsTok = useRef("")
  const widget = useRef<string | null>(null)
  const sessionRef = useRef<{ value: string | null; exp: number } | null>(null)
  const draftRef = useRef("")
  const photoIn = useRef<HTMLInputElement>(null)
  const videoIn = useRef<HTMLInputElement>(null)

  useEffect(() => {
    draftRef.current = mintDraft()
    let gone = false
    const draw = () => {
      if (gone || !tsRef.current || !window.turnstile || widget.current !== null) return
      try {
        widget.current = window.turnstile.render(tsRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          theme: "dark",
          size: "flexible",
          action: "submit-media",
          callback: (t: string) => {
            tsTok.current = t
          },
          "expired-callback": () => {
            tsTok.current = ""
          },
          "error-callback": () => {
            tsTok.current = ""
          },
        })
      } catch {
        /* uploads still try; the server decides */
      }
    }
    if (window.turnstile) draw()
    else {
      const s = document.createElement("script")
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      s.async = true
      s.onload = draw
      document.head.appendChild(s)
    }
    return () => {
      gone = true
    }
  }, [])

  /* One human check buys a window of uploads. Sent even with no token yet:
     a deployment with the gate off answers enforced:false before it looks
     at the token, and one with the gate on refuses, which is honest. */
  const ensureSession = async (): Promise<string | null> => {
    const held = sessionRef.current
    if (held && held.exp > Date.now()) return held.value
    const tok = tsTok.current
    const res = await fetch("/api/upload-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tok || null, draftId: draftRef.current, submissionType: "vehicle" }),
    })
    const j = (await res.json().catch(() => ({}))) as { enforced?: boolean; session?: string; expiresIn?: number; error?: string }
    if (!res.ok) {
      if (!tok) throw new Error("Finish the human check below first, then add your files.")
      tsTok.current = ""
      try {
        window.turnstile?.reset(widget.current || undefined)
      } catch {
        /* it re-renders on its own */
      }
      throw new Error(j.error || "The human check did not pass. Tick the box and try again.")
    }
    if (!j.enforced) {
      sessionRef.current = { value: null, exp: Date.now() + 25 * 60 * 1000 }
      return null
    }
    sessionRef.current = { value: j.session || null, exp: Date.now() + (j.expiresIn || 0) - 60000 }
    tsTok.current = ""
    try {
      window.turnstile?.reset(widget.current || undefined)
    } catch {
      /* it re-renders on its own */
    }
    return sessionRef.current.value
  }

  const saveShot = async (shot: Record<string, unknown>) => {
    const res = await fetch("/api/entry-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, items: [shot] }),
    })
    const j = (await res.json().catch(() => ({}))) as { photoCt?: number; videoCt?: number; added?: number; dropped?: number; error?: string }
    if (!res.ok) throw new Error(j.error || "The file went up but did not save to your entry. Add it again.")
    setCounts({ photo: j.photoCt ?? 0, video: j.videoCt ?? 0 })
    if (!j.added) throw new Error(j.dropped ? "That one is already on your entry, or past the limit." : "That file did not save.")
  }

  const addFiles = async (kind: "photo" | "video", chosen: FileList | null) => {
    const files = Array.from(chosen || [])
    if (!files.length) return
    setNote("")
    for (const file of files) {
      const id = Math.random().toString(36).slice(2)
      setRows((r) => [...r, { id, name: file.name, pct: 0, done: false, label: "0%" }])
      const paint = (label: string, done = false) =>
        setRows((r) => r.map((x) => (x.id === id ? { ...x, label, done } : x)))
      try {
        let seconds = 0
        if (kind === "video") {
          seconds = await clipSeconds(file)
          if (seconds > MAX_VIDEO_SEC + 2) {
            setRows((r) => r.filter((x) => x.id !== id))
            setNote(`${file.name} runs long. Five minutes is the limit for one clip, so trim it and try again.`)
            continue
          }
        }
        const session = await ensureSession()
        const safe = String(file.name || "file")
          .replace(/[^\w.\-]+/g, "_")
          .slice(-80)
        const done = await blobUpload(`submissions/vehicle/${draftRef.current}/${kind}/${safe}`, file, {
          access: "private",
          handleUploadUrl: "/api/upload",
          multipart: file.size > 20 * 1024 * 1024,
          clientPayload: JSON.stringify({ kind, submissionType: "vehicle", draftId: draftRef.current, session }),
          onUploadProgress: (p) => paint(Math.round(p.percentage || 0) + "%"),
        })
        const shot: Record<string, unknown> = {
          kind,
          url: done.url,
          pathname: done.pathname,
          name: file.name,
          size: file.size,
          type: file.type || "",
        }
        if (kind === "video" && seconds) shot.seconds = Math.round(seconds)
        await saveShot(shot)
        paint(kind === "video" ? "Saved, " + fmtSecs(seconds) : "Saved", true)
      } catch (err) {
        setRows((r) => r.filter((x) => x.id !== id))
        setNote(file.name + ": " + (err instanceof Error ? err.message : "did not go up. Try it again."))
      }
    }
  }

  const lede =
    counts.photo === 0
      ? "Your entry has no photographs yet, and the selection team judges from them. Add at least five: exterior from both sides, the front, the interior, and the engine."
      : counts.photo < MIN_PHOTOS
        ? `Your entry has ${counts.photo} photograph${counts.photo === 1 ? "" : "s"} so far, and five is the floor for review. Add the rest here, straight off your phone.`
        : "Add more photographs or a video any time before the field is set. They go straight to the selection team."

  return (
    <section style={{ marginTop: 30, border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "20px 18px", background: "#0A1523" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#7E8B99" }}>Photographs</span>
        <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".08em", color: counts.photo >= MIN_PHOTOS ? "#00D2BE" : "#7E8B99" }}>
          {counts.photo} of {MAX_PHOTOS}
          {counts.video ? `, ${counts.video} video` : ""}
        </span>
      </div>
      <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#C9D1DB" }}>{lede}</p>

      {rows.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5, color: "#C9D1DB", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "9px 12px" }}>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, whiteSpace: "nowrap", color: r.done ? "#00D2BE" : "#7E8B99" }}>{r.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => {
            if (counts.photo >= MAX_PHOTOS) return setNote("Fifty photographs is the ceiling, and you are there.")
            photoIn.current?.click()
          }}
          style={{ font: "700 13.5px/1 inherit", letterSpacing: ".04em", textTransform: "uppercase", color: "#101010", background: "#00D2BE", border: 0, borderRadius: 11, padding: "13px 20px", cursor: "pointer" }}
        >
          Add photographs
        </button>
        <button
          type="button"
          onClick={() => {
            if (counts.video >= MAX_VIDEOS) return setNote("Three clips is the ceiling, and you are there.")
            videoIn.current?.click()
          }}
          style={{ font: "700 13.5px/1 inherit", letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", background: "transparent", border: "1px solid rgba(255,255,255,.3)", borderRadius: 11, padding: "13px 20px", cursor: "pointer" }}
        >
          Add video
        </button>
      </div>

      <div ref={tsRef} style={{ marginTop: 12 }} />
      {note && (
        <p role="status" style={{ margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#F2994A" }}>
          {note}
        </p>
      )}
      <input ref={photoIn} type="file" accept="image/*" multiple hidden onChange={(e) => { void addFiles("photo", e.target.files); e.target.value = "" }} />
      <input ref={videoIn} type="file" accept="video/*" multiple hidden onChange={(e) => { void addFiles("video", e.target.files); e.target.value = "" }} />
    </section>
  )
}
