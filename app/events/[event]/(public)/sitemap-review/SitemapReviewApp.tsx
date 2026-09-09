"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import "./sitemap-review.css"

/**
 * Drag anything that is wrong. That is the entire design brief: every
 * previous attempt at this site plan failed because a description, in words
 * or in a photo, had to survive a translation into coordinates with no way
 * to correct it except starting over. This tool removes the translation
 * step for corrections. A zone is two draggable corner pins; a point is one
 * draggable pin. Every drop writes straight back to the database, no save
 * button, so what is on the screen is always what the database holds.
 */

type Geometry =
  | { type: "polygon"; coords: [number, number][] }
  | { type: "point"; coords: [number, number] }
  | { type: "path"; coords: [number, number][] }

interface Feature {
  id: string
  kind: "zone" | "poi" | "route"
  slug: string
  name: string
  category: string | null
  status: string
  blurb: string | null
  geometry: Geometry
  detail: Record<string, unknown> | null
}

// Real, verified centre of 179 Enon Church Rd, from the address's own geocode.
const CENTRE: [number, number] = [35.6317451, -86.5808272]
const IMG_BOUNDS: [[number, number], [number, number]] = [
  [35.6243789, -86.5897796],
  [35.6392011, -86.574083],
]

const COLORS: Record<string, string> = {
  vip: "#F2C94C",
  vendor: "#57C7F5",
  show: "#E5141A",
  parking: "#8A97A8",
  ops: "#4ED08A",
  food: "#C9A3FF",
  entry: "#FFB020",
  charity: "#4ED08A",
  facility: "#57C7F5",
}
function colorFor(f: Feature) {
  return COLORS[f.category || ""] || "#9AA4B2"
}

export default function SitemapReviewApp({ eventSlug }: { eventSlug: string }) {
  const [phase, setPhase] = useState<"loading" | "locked" | "ready" | "error">("loading")
  const [features, setFeatures] = useState<Feature[]>([])
  const [password, setPassword] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState("")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const mapElRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const layersRef = useRef<Map<string, any>>(new Map())

  const load = useCallback(async () => {
    const res = await fetch(`/api/map-features?event=${eventSlug}`)
    if (res.status === 401) {
      setPhase("locked")
      return
    }
    if (!res.ok) {
      setPhase("error")
      return
    }
    const data = await res.json()
    setFeatures(data.features || [])
    setPhase("ready")
  }, [eventSlug])

  useEffect(() => {
    load()
  }, [load])

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    setAuthBusy(true)
    setAuthError("")
    try {
      const res = await fetch("/api/map-features", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.status === 401) {
        setAuthError("Wrong password.")
        setAuthBusy(false)
        return
      }
      if (!res.ok) {
        setAuthError("Could not reach the server.")
        setAuthBusy(false)
        return
      }
      await load()
    } catch {
      setAuthError("Could not reach the server.")
    }
    setAuthBusy(false)
  }

  async function saveGeometry(id: string, geometry: Geometry) {
    setSaveState("saving")
    try {
      const res = await fetch("/api/map-features", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, geometry }),
      })
      if (!res.ok) throw new Error("failed")
      setSaveState("saved")
      setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 1500)
    } catch {
      setSaveState("error")
    }
  }

  // Build the map once, after Leaflet loads and the container exists.
  useEffect(() => {
    if (phase !== "ready" || !mapElRef.current || mapRef.current) return
    let cancelled = false
    ;(async () => {
      // @ts-expect-error self hosted ESM build, no types published for it
      const L = await import(/* webpackIgnore: true */ "/vendor/leaflet.js")
      if (cancelled || !mapElRef.current) return
      LRef.current = L
      const map = L.map(mapElRef.current, { minZoom: 15, maxZoom: 20, zoomSnap: 0, zoomDelta: 0.5 })
      L.imageOverlay(
        "/images/sitemap/ranch-sat.jpg",
        IMG_BOUNDS as unknown as [[number, number], [number, number]],
        { attribution: "Imagery Esri, Maxar, Earthstar Geographics" },
      ).addTo(map)
      map.setMaxBounds(L.latLngBounds(IMG_BOUNDS).pad(0.25))
      map.setView(CENTRE, 17)
      L.control.scale({ imperial: true, metric: true, position: "bottomleft" }).addTo(map)
      mapRef.current = map
      renderFeatures()
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Redraw whenever the feature list changes (after load, and after a save).
  useEffect(() => {
    if (mapRef.current) renderFeatures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features])

  function renderFeatures() {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return
    for (const g of layersRef.current.values()) map.removeLayer(g)
    layersRef.current.clear()

    for (const f of features) {
      const color = colorFor(f)
      const group = L.layerGroup().addTo(map)

      if (f.geometry.type === "polygon") {
        const pts = f.geometry.coords
        const lats = pts.map((p) => p[0])
        const lngs = pts.map((p) => p[1])
        let sw: [number, number] = [Math.min(...lats), Math.min(...lngs)]
        let ne: [number, number] = [Math.max(...lats), Math.max(...lngs)]

        const rect = L.rectangle([sw, ne], { color, weight: 2, fillColor: color, fillOpacity: 0.15 }).addTo(group)
        const label = L.marker([(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2], {
          interactive: false,
          icon: L.divIcon({ className: "mfLbl", html: esc(f.name), iconSize: [0, 0] }),
        }).addTo(group)

        const corner = (pos: [number, number], which: "sw" | "ne") =>
          L.marker(pos, {
            draggable: true,
            icon: L.divIcon({ className: "mfHandle", html: "", iconSize: [16, 16] }),
          })
            .addTo(group)
            .on("drag", (e: any) => {
              const p = e.target.getLatLng()
              if (which === "sw") sw = [p.lat, p.lng]
              else ne = [p.lat, p.lng]
              rect.setBounds([sw, ne])
              label.setLatLng([(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2])
            })
            .on("dragend", () => {
              const newCoords: [number, number][] = [
                [sw[0], sw[1]],
                [sw[0], ne[1]],
                [ne[0], ne[1]],
                [ne[0], sw[1]],
              ]
              saveGeometryLocal(f, { type: "polygon", coords: newCoords })
            })

        corner(sw, "sw")
        corner(ne, "ne")
        rect.bindPopup(popupHtml(f))
      } else if (f.geometry.type === "point") {
        const pos = f.geometry.coords
        const marker = L.marker(pos, {
          draggable: true,
          icon: L.divIcon({ className: "mfPoint", html: `<span style="background:${color}"></span>`, iconSize: [14, 14] }),
        }).addTo(group)
        L.marker(pos, { interactive: false, icon: L.divIcon({ className: "mfLbl", html: esc(f.name), iconSize: [0, 0] }) }).addTo(group)
        marker.on("dragend", (e: any) => {
          const p = e.target.getLatLng()
          saveGeometryLocal(f, { type: "point", coords: [p.lat, p.lng] })
        })
        marker.bindPopup(popupHtml(f))
      } else if (f.geometry.type === "path") {
        L.polyline(f.geometry.coords, { color, weight: 3, dashArray: "6 6", opacity: 0.85 }).addTo(group).bindPopup(popupHtml(f))
      }

      layersRef.current.set(f.id, group)
    }
  }

  function saveGeometryLocal(f: Feature, geometry: Geometry) {
    setFeatures((prev) => prev.map((x) => (x.id === f.id ? { ...x, geometry } : x)))
    saveGeometry(f.id, geometry)
  }

  function popupHtml(f: Feature) {
    return `<b>${esc(f.name)}</b>${f.blurb ? "<br>" + esc(f.blurb) : ""}${f.status === "hidden" ? "<br><i>Hidden from the public page</i>" : ""}`
  }

  if (phase === "loading") {
    return (
      <div className="smrApp">
        <div className="smrCard">
          <p className="smrLoading">Loading</p>
        </div>
      </div>
    )
  }

  if (phase === "error") {
    return (
      <div className="smrApp">
        <div className="smrCard">
          <p className="smrLoading">Could not reach the server. Reload to try again.</p>
        </div>
      </div>
    )
  }

  if (phase === "locked") {
    return (
      <div className="smrApp">
        <div className="smrCard">
          <div className="livery">
            <i style={{ background: "#E5141A" }} />
            <i style={{ background: "#FAF8F4" }} />
            <i style={{ background: "#1424A1" }} />
          </div>
          <h1>Site Plan Review</h1>
          <p className="sub">The Piston Powered Ranch, drag anything that is wrong.</p>
          <form onSubmit={submitPassword}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={authBusy || !password}>
              Enter
            </button>
          </form>
          {authError && <p className="err">{authError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="smrApp smrReady">
      <header>
        <div className="livery">
          <i style={{ background: "#E5141A" }} />
          <i style={{ background: "#FAF8F4" }} />
          <i style={{ background: "#1424A1" }} />
        </div>
        <h1>Site Plan Review</h1>
        <p className="sub">
          Drag either corner pin to move or resize a zone. Drag a point to move it. Every drop saves by itself.
        </p>
      </header>
      <div className="mapWrap">
        <div ref={mapElRef} className="mapEl" />
        <div className={`saveTag ${saveState}`}>
          {saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : saveState === "error" ? "Not saved, try again" : ""}
        </div>
      </div>
      <div className="legend">
        {features.map((f) => (
          <span key={f.id} className={f.status === "hidden" ? "dim" : ""}>
            <i style={{ background: colorFor(f) }} />
            {f.name}
            {f.status === "hidden" ? " (hidden)" : ""}
          </span>
        ))}
      </div>
    </div>
  )
}

function esc(s: string) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string))
}
