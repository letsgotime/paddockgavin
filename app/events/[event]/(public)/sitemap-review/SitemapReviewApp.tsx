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

const ROTATE_ICON =
  '<svg viewBox="0 0 24 24" width="15" height="15">' +
  '<path d="M4 12a8 8 0 1 1 2.6 5.9" fill="none" stroke="#14181d" stroke-width="2.6" stroke-linecap="round"/>' +
  '<path d="M2.6 16.3 4 12l4.1 1.3" fill="none" stroke="#14181d" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>"

function centroidOf(pts: [number, number][]): [number, number] {
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]
}

// Percent position of a lat/lng within the fixed satellite crop's own
// bounds. The print view draws on that static image directly, not the
// live Leaflet map, so this is a plain linear map, no projection needed.
function pctIn(lat: number, lng: number): [number, number] {
  const [[south, west], [north, east]] = IMG_BOUNDS
  return [((lng - west) / (east - west)) * 100, ((north - lat) / (north - south)) * 100]
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
  const primaryRef = useRef<Map<string, any>>(new Map())
  const coordElRef = useRef<HTMLDivElement | null>(null)

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
      const map = L.map(mapElRef.current, {
        minZoom: 13,
        maxZoom: 20,
        zoomSnap: 0,
        zoomDelta: 0.5,
        attributionControl: false,
      })

      const satellite = L.imageOverlay(
        "/images/sitemap/ranch-sat.jpg",
        IMG_BOUNDS as unknown as [[number, number], [number, number]],
        { attribution: "Imagery Esri, Maxar, Earthstar Geographics" },
      )
      const grayscale = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      })
      const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        subdomains: "abc",
        maxZoom: 17,
        attribution: "Map data: &copy; OpenStreetMap contributors, SRTM. Map style: &copy; OpenTopoMap (CC-BY-SA)",
      })
      const dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      })
      satellite.addTo(map)
      L.control
        .layers(
          { Satellite: satellite, "Roads (grayscale)": grayscale, Topo: topo, Dark: dark },
          undefined,
          { position: "topright", collapsed: true },
        )
        .addTo(map)
      // Leaflet's default attribution names Leaflet itself; the free tile
      // providers above require their own credit to stay usable, so keep
      // that and drop the rest, tucked small in the corner.
      L.control.attribution({ prefix: false, position: "bottomright" }).addTo(map)

      map.setMaxBounds(L.latLngBounds(IMG_BOUNDS).pad(1.2))
      map.setView(CENTRE, 17)
      L.control.scale({ imperial: true, metric: true, position: "bottomleft" }).addTo(map)
      map.on("mousemove", (e: any) => {
        if (coordElRef.current) coordElRef.current.textContent = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
      })
      mapRef.current = map
      // Popups are recreated on every render, so the copy-coordinates button
      // inside them is wired once here by delegation rather than per-popup.
      mapElRef.current?.addEventListener("click", (e) => {
        const btn = (e.target as HTMLElement)?.closest(".mfCopyLL") as HTMLButtonElement | null
        if (!btn) return
        const ll = btn.getAttribute("data-ll") || ""
        navigator.clipboard
          ?.writeText(ll)
          .then(() => {
            btn.textContent = "Copied"
            setTimeout(() => {
              btn.textContent = "Copy"
            }, 1200)
          })
          .catch(() => {})
      })
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
    primaryRef.current.clear()

    for (const f of features) {
      const color = colorFor(f)
      const group = L.layerGroup().addTo(map)

      if (f.geometry.type === "polygon") {
        let pts: [number, number][] = f.geometry.coords.map((p) => [p[0], p[1]])

        const baseStyle = { color, weight: 2, fillColor: color, fillOpacity: 0.15 }
        const hiStyle = { color, weight: 4, fillColor: color, fillOpacity: 0.35 }
        const poly = L.polygon(pts, baseStyle).addTo(group)
        poly._smrBase = baseStyle
        poly._smrHi = hiStyle
        poly.bindTooltip(esc(f.name), { direction: "center", className: "mfTip", permanent: true, interactive: false })
        poly.bindPopup(popupHtml(f))
        primaryRef.current.set(f.id, poly)

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
          icon: L.divIcon({ className: "mfRotateHandle", html: ROTATE_ICON, iconSize: [22, 22] }),
        }).addTo(group)
        rotateMarker.bindTooltip("+0°", { direction: "right", offset: [14, 0], className: "mfAngleTip", sticky: true })

        let startPts: [number, number][] = []
        let startAngle = 0
        rotateMarker.on("dragstart", () => {
          startPts = pts.map((p) => [p[0], p[1]])
          const c = map.latLngToContainerPoint(centroidOf(startPts))
          const h = map.latLngToContainerPoint(rotateMarker.getLatLng())
          startAngle = Math.atan2(h.x - c.x, h.y - c.y)
          rotateMarker.setTooltipContent("+0°")
          rotateMarker.openTooltip()
        })
        rotateMarker.on("drag", (e: any) => {
          const c = map.latLngToContainerPoint(centroidOf(startPts))
          const h = map.latLngToContainerPoint(e.target.getLatLng())
          const rawDeg = ((Math.atan2(h.x - c.x, h.y - c.y) - startAngle) * 180) / Math.PI
          // Snapped to 5 degree steps: freehand rotation was too fiddly to
          // land on a clean angle against a fence line by eye.
          const snapDeg = Math.round(rawDeg / 5) * 5
          const delta = (snapDeg * Math.PI) / 180
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
          rotateMarker.setTooltipContent(`${snapDeg >= 0 ? "+" : ""}${snapDeg}°`)
        })
        rotateMarker.on("dragend", () => {
          rotateMarker.setLatLng(rotateHandleFor(pts))
          guide.setLatLngs([centroidOf(pts), rotateHandleFor(pts)])
          rotateMarker.closeTooltip()
          saveGeometryLocal(f, { type: "polygon", coords: pts.map((p) => [p[0], p[1]]) })
        })
      } else if (f.geometry.type === "point") {
        const pos = f.geometry.coords
        const marker = L.marker(pos, {
          draggable: true,
          icon: L.divIcon({ className: "mfPoint", html: `<span style="background:${color}"></span>`, iconSize: [14, 14] }),
        }).addTo(group)
        marker.bindTooltip(esc(f.name), { direction: "top", offset: [0, -8], className: "mfTip", permanent: true, interactive: false })
        marker.on("dragend", (e: any) => {
          const p = e.target.getLatLng()
          saveGeometryLocal(f, { type: "point", coords: [p.lat, p.lng] })
        })
        marker.bindPopup(popupHtml(f))
        primaryRef.current.set(f.id, marker)
      } else if (f.geometry.type === "path") {
        let pts: [number, number][] = f.geometry.coords.map((p) => [p[0], p[1]])
        const baseStyle = { color, weight: 4, dashArray: "7 7", opacity: 0.9 }
        const hiStyle = { color, weight: 6, dashArray: "7 7", opacity: 1 }
        const line = L.polyline(pts, baseStyle).addTo(group)
        line._smrBase = baseStyle
        line._smrHi = hiStyle
        line.bindTooltip(esc(f.name), { direction: "top", className: "mfTip", permanent: true, interactive: false })
        line.bindPopup(popupHtml(f))
        primaryRef.current.set(f.id, line)

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

  // Legend click: pan/zoom to the feature and surface its popup, so a
  // crowded map can be navigated by name instead of by eye.
  function focusFeature(f: Feature) {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return
    // On a short mobile viewport the map can sit lower than the fold; bring
    // the whole map into view first so Leaflet has room to keep the popup
    // it is about to open on-screen too, instead of autopanning it above the fold.
    mapElRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    if (f.geometry.type === "point") {
      map.flyTo(f.geometry.coords, 19, { duration: 0.6 })
    } else {
      map.flyToBounds(L.latLngBounds(f.geometry.coords), { padding: [50, 50], maxZoom: 19, duration: 0.6 })
    }
    const layer = primaryRef.current.get(f.id)
    if (layer) setTimeout(() => layer.openPopup(), 650)
  }

  function highlightFeature(id: string, on: boolean) {
    const layer = primaryRef.current.get(id)
    if (!layer) return
    if (layer._smrBase) {
      layer.setStyle(on ? layer._smrHi : layer._smrBase)
    } else if (layer.getElement) {
      const el = layer.getElement()
      if (el) el.classList.toggle("mfPulse", on)
    }
  }

  function popupHtml(f: Feature) {
    const c: [number, number] =
      f.geometry.type === "point" ? f.geometry.coords : centroidOf(f.geometry.coords as [number, number][])
    const ll = `${c[0].toFixed(5)}, ${c[1].toFixed(5)}`
    const detail = f.detail as Record<string, unknown> | null
    const image = detail && typeof detail.image === "string" ? (detail.image as string) : null
    return `
      ${image ? `<img class="mfPopupImg" src="${esc(image)}" alt="">` : ""}
      <b>${esc(f.name)}</b>
      ${f.blurb ? `<p class="mfPopupBlurb">${esc(f.blurb)}</p>` : ""}
      <div class="mfPopupLL"><span>${ll}</span><button type="button" class="mfCopyLL" data-ll="${ll}">Copy</button></div>
      ${f.status === "hidden" ? '<p class="mfPopupHidden">Hidden from the public page</p>' : ""}
    `
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
        <div className="titleRow">
          <h1>Site Plan Review</h1>
          <button type="button" className="printBtn" onClick={() => window.print()}>
            Print
          </button>
        </div>
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
        <div ref={coordElRef} className="coordReadout">35.63175, -86.58083</div>
      </div>
      <div className="legend">
        {(
          [
            ["zone", "Zones"],
            ["poi", "Points"],
            ["route", "Route"],
          ] as const
        ).map(([kind, label]) => {
          const items = features.filter((f) => f.kind === kind)
          if (!items.length) return null
          return (
            <div className="legendGroup" key={kind}>
              <h3>{label}</h3>
              <div className="legendItems">
                {items.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="legendItem"
                    onClick={() => focusFeature(f)}
                    onMouseEnter={() => highlightFeature(f.id, true)}
                    onMouseLeave={() => highlightFeature(f.id, false)}
                  >
                    <i style={{ background: colorFor(f) }} />
                    <span>{f.name}</span>
                    {f.status === "hidden" && <em className="tag tagHidden">hidden</em>}
                    {f.status === "draft" && <em className="tag">draft</em>}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <PrintView features={features} />
    </div>
  )
}

function PrintView({ features }: { features: Feature[] }) {
  const zones = features.filter((f): f is Feature & { geometry: { type: "polygon"; coords: [number, number][] } } =>
    f.kind === "zone" && f.geometry.type === "polygon",
  )
  const routes = features.filter((f): f is Feature & { geometry: { type: "path"; coords: [number, number][] } } =>
    f.kind === "route" && f.geometry.type === "path",
  )
  const pois = features.filter((f): f is Feature & { geometry: { type: "point"; coords: [number, number] } } =>
    f.kind === "poi" && f.geometry.type === "point",
  )
  // Ranch Gate sits off Highway 41-A, outside the satellite crop's own
  // bounds (that crop is the property itself, not the public road). Drawn
  // off the edge it would just clip out of the SVG viewBox, so it is left
  // off the drawing and kept in the legend text instead.
  const onMap = pois.filter((f) => {
    const [x, y] = pctIn(...f.geometry.coords)
    return x >= 0 && x <= 100 && y >= 0 && y <= 100
  })

  return (
    <div className="printView">
      <div className="printHead">
        <div className="printLivery">
          <i style={{ background: "#E5141A" }} />
          <i style={{ background: "#14181D" }} />
          <i style={{ background: "#1424A1" }} />
        </div>
        <h1>The Piston Powered Ranch</h1>
        <p>Site plan &middot; Saturday, October 10, 2026 &middot; Rancho Jaramillo, Unionville TN</p>
      </div>
      <div className="printMapBox">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="printSvg">
          <image href="/images/sitemap/ranch-sat.jpg" x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
          {zones.map((f) => {
            const pts = f.geometry.coords.map(([lat, lng]) => pctIn(lat, lng).join(",")).join(" ")
            const [cx, cy] = pctIn(...centroidOf(f.geometry.coords))
            return (
              <g key={f.id}>
                <polygon
                  points={pts}
                  fill={colorFor(f)}
                  fillOpacity="0.22"
                  stroke={colorFor(f)}
                  strokeWidth="0.35"
                  vectorEffect="non-scaling-stroke"
                />
                <text x={cx} y={cy} className="printLabel">
                  {f.name}
                </text>
              </g>
            )
          })}
          {routes.map((f) => (
            <polyline
              key={f.id}
              points={f.geometry.coords.map(([lat, lng]) => pctIn(lat, lng).join(",")).join(" ")}
              fill="none"
              stroke={colorFor(f)}
              strokeWidth="0.5"
              strokeDasharray="1.4 1.1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {onMap.map((f) => {
            const [x, y] = pctIn(...f.geometry.coords)
            return (
              <g key={f.id}>
                <circle cx={x} cy={y} r="0.9" fill={colorFor(f)} stroke="#14181d" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
                <text x={x} y={y - 1.7} className="printLabel printLabelSm">
                  {f.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="printLegend">
        {[...zones, ...routes, ...pois].map((f) => (
          <span key={f.id}>
            <i style={{ background: colorFor(f) }} />
            {f.name}
            {f.status === "hidden" ? " (not on the public page)" : ""}
            {f.kind === "poi" && !onMap.some((m) => m.id === f.id) ? " (off this crop, near the highway)" : ""}
          </span>
        ))}
      </div>
      <div className="printFoot">
        <span>Piston Powered Ranch, site plan for internal reference</span>
        <span>pistonpoweredranch.com</span>
      </div>
    </div>
  )
}

function esc(s: string) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string))
}
