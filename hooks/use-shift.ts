"use client"

import { useEffect, useState } from "react"

export interface ShiftState {
  shift: "day" | "night"
  clock: string
  shiftLabel: string
  shiftColor: string
  golden: string
  goldenNote: string
}

function getShift(): { shift: "day" | "night"; clock: string } {
  const now = new Date()
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      hour12: false,
    }).format(now)
  )
  const shift: "day" | "night" = hour >= 8 && hour < 18 ? "day" : "night"
  const clock = now
    .toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/\s/g, "\u2009")
  return { shift, clock }
}

async function fetchGolden(): Promise<{ full: string; note: string }> {
  const fmt = (ms: number) =>
    new Date(ms)
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      .replace(/\s/g, "\u2009")
  const mins = (a: number, b: number) => Math.max(1, Math.round((b - a) / 60000))

  const loadDay = async (offset: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    const date =
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    const j = await (
      await fetch(
        `https://api.sunrise-sunset.org/json?lat=36.1627&lng=-86.7816&formatted=0&date=${date}`
      )
    ).json()
    if (!j.results || j.status !== "OK") throw new Error("no data")
    const r = j.results
    const t = (k: string) => new Date(r[k]).getTime()
    const mo = t("sunrise") - t("civil_twilight_begin")
    const eo = t("civil_twilight_end") - t("sunset")
    return [
      { name: "Sunrise", start: t("sunrise") - (mo * 2) / 3, end: t("sunrise") + mo },
      { name: "Sunset", start: t("sunset") - eo, end: t("sunset") + (eo * 2) / 3 },
    ]
  }

  const windows = await loadDay(0)
  const now = Date.now()
  const live = windows.find((w) => now >= w.start && now <= w.end)
  if (live) {
    return {
      full: "Happening now",
      note: `${live.name} golden hour, until ${fmt(live.end)}`,
    }
  }
  let next = windows.find((w) => w.start > now)
  let when = "today"
  if (!next) {
    const tomorrow = await loadDay(1)
    next = tomorrow[0]
    when = "tomorrow"
  }
  return {
    full: `${fmt(next.start)} – ${fmt(next.end)}`,
    note: `${next.name} golden hour ${when}, ${mins(next.start, next.end)} minutes of it`,
  }
}

export function useShift(): ShiftState {
  const initial = getShift()
  const [shift, setShift] = useState<"day" | "night">(initial.shift)
  const [clock, setClock] = useState(initial.clock)
  const [golden, setGolden] = useState("—")
  const [goldenNote, setGoldenNote] = useState("Working it out")

  useEffect(() => {
    const tick = () => {
      const s = getShift()
      setShift(s.shift)
      setClock(s.clock)
    }
    const interval = setInterval(tick, 20000)

    const loadGolden = () => {
      fetchGolden()
        .then(({ full, note }) => {
          setGolden(full)
          setGoldenNote(note)
        })
        .catch(() => {
          setGolden("—")
          setGoldenNote("Could not reach solar data")
        })
    }
    loadGolden()
    const goldenInterval = setInterval(loadGolden, 300000)

    return () => {
      clearInterval(interval)
      clearInterval(goldenInterval)
    }
  }, [])

  return {
    shift,
    clock,
    shiftLabel: shift === "day" ? "Day shift" : "Night shift",
    shiftColor: shift === "day" ? "#F8B800" : "#00D2BE",
    golden,
    goldenNote,
  }
}
