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

function centroidOf(pts: [number, number][]): [number, number] {
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]
}

// The rotate handle sits beyond the midpoint of the NE-NW edge (points 2,3
// in the stored SW,SE,NE,NW winding), pushed out from the centroid so it
// clears the shape and reads as a separate control.
function rotateHandleFor(pts: [number, number][]): [number, number] {
  const c = centroidOf(pts)
  const mid: [number, number] = [(pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2]
  return [c[0] + (mid[0] - c[0]) * 1.5, c[1] + (mid[1] - c[1]) * 1.5]
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
        let pts: [number, number][] = f.geometry.coords.map((p) => [p[0], p[1]])

        const poly = L.polygon(pts, { color, weight: 2, fillColor: color, fillOpacity: 0.15 }).addTo(group)
        poly.bindTooltip(esc(f.name), { direction: "center", className: "mfTip", sticky: false })
        poly.bindPopup(popupHtml(f))

        const guide = L.polyline([centroidOf(pts), rotateHandleFor(pts)], {
          color, weight: 1, dashArray: "2 5", opacity: 0.6, interactive: false,
        }).addTo(group)

        const cornerMarkers = pts.map((pt, i) =>
          L.marker(pt, {
            draggable: true,
            icon: L.divIcon({ className: "mfHandle", html: "", iconSize: [16, 16] }),
          })
            .addTo(group)
            .on("drag", (e: any) => {
              const p = e.target.getLatLng()
              pts[i] = [p.lat, p.lng]
              poly.setLatLngs(pts)
              guide.setLatLngs([centroidOf(pts), rotateMarker.getLatLng()])
            })
            .on("dragend", () => {
              rotateMarker.setLatLng(rotateHandleFor(pts))
              guide.setLatLngs([centroidOf(pts), rotateHandleFor(pts)])
              saveGeometryLocal(f, { type: "polygon", coords: pts.map((p) => [p[0], p[1]]) })
            }),
        )

        const rotateMarker = L.marker(rotateHandleFor(pts), {
          draggable: true,
          icon: L.divIcon({ className: "mfRotateHandle", html: "", iconSize: [14, 14] }),
        }).addTo(group)

        let startPts: [number, number][] = []
        let startAngle = 0
        rotateMarker.on("dragstart", () => {
          startPts = pts.map((p) => [p[0], p[1]])
          const c = map.latLngToContainerPoint(centroidOf(startPts))
          const h = map.latLngToContainerPoint(rotateMarker.getLatLng())
          startAngle = Math.atan2(h.x - c.x, h.y - c.y)
        })
        rotateMarker.on("drag", (e: any) => {
          const c = map.latLngToContainerPoint(centroidOf(startPts))
          const h = map.latLngToContainerPoint(e.target.getLatLng())
          const delta = Math.atan2(h.x - c.x, h.y - c.y) - startAngle
          const cos = Math.cos(delta)
          const sin = Math.sin(delta)
          pts = startPts.map((p) => {
            const pp = map.latLngToContainerPoint(p)
            const dx = pp.x - c.x
            const dy = pp.y - c.y
            const rotated = map.containerPointToLatLng([c.x + dx * cos + dy * sin, c.y + dy * cos - dx * sin])
            return [rotated.lat, rotated.lng] as [number, number]
          })
          poly.setLatLngs(pts)
          cornerMarkers.forEach((m, i) => m.setLatLng(pts[i]))
          guide.setLatLngs([centroidOf(pts), e.target.getLatLng()])
        })
        rotateMarker.on("dragend", () => {
          saveGeometryLocal(f, { type: "polygon", coords: pts.map((p) => [p[0], p[1]]) })
        })
      } else if (f.geometry.type === "point") {
        const pos = f.geometry.coords
        const marker = L.marker(pos, {
          draggable: true,
          icon: L.divIcon({ className: "mfPoint", html: `<span style="background:${color}"></span>`, iconSize: [14, 14] }),
        }).addTo(group)
        marker.bindTooltip(esc(f.name), { direction: "top", offset: [0, -8], className: "mfTip", sticky: false })
        marker.on("dragend", (e: any) => {
          const p = e.target.getLatLng()
          saveGeometryLocal(f, { type: "point", coords: [p.lat, p.lng] })
        })
        marker.bindPopup(popupHtml(f))
      } else if (f.geometry.type === "path") {
        let pts: [number, number][] = f.geometry.coords.map((p) => [p[0], p[1]])
        const line = L.polyline(pts, { color, weight: 4, dashArray: "7 7", opacity: 0.9 }).addTo(group)
        line.bindTooltip(esc(f.name), { direction: "top", className: "mfTip", sticky: false })
        line.bindPopup(popupHtml(f))

        pts.forEach((pt, i) => {
          L.marker(pt, {
            draggable: true,
            icon: L.divIcon({ className: "mfHandle mfHandleSmall", html: "", iconSize: [12, 12] }),
          })
            .addTo(group)
            .on("drag", (e: any) => {
              const p = e.target.getLatLng()
              pts[i] = [p.lat, p.lng]
              line.setLatLngs(pts)
            })
            .on("dragend", () => {
              saveGeometryLocal(f, { type: "path", coords: pts.map((p) => [p[0], p[1]]) })
            })
        })
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
          Drag a corner pin to move or resize a zone, the gold pin to rotate it. Drag a point or a road pin to move
          it. Every drop saves by itself.
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
