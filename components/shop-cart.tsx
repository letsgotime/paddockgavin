"use client"

import { useCallback, useEffect, useState } from "react"
import { SHOP_MISSION } from "@/lib/shop/catalogue"
import { money } from "@/lib/shop/store"
import { add, clear, count, remove, resolve, setQty, subtotal, subscribe, type ResolvedLine } from "@/lib/shop/cart"

/**
 * The basket, as a drawer.
 *
 * A shop that sends you to Stripe one garment at a time charges postage twice
 * for a tee and a hat, which is the kind of thing a buyer notices once and
 * does not come back from. This holds the basket on the page, in the site's
 * own colours, and hands the whole thing to checkout in one go.
 *
 * It reads prices from the catalogue on every draw rather than trusting what
 * is in storage, so a basket left open overnight shows this morning's price
 * and the server charges the same figure it displays.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const INK = "#0A1523"
const PAPER = "#EDF1F6"
const MUTED = "#9FAAB8"
const LINE = "rgba(255,255,255,.14)"
const RED = "#E5141A"

const REASON: Record<string, string> = {
  price_not_set: "Something in the basket lost its price. Remove it and try again.",
  unknown_variant: "A size in the basket is gone. Remove that line and try again.",
  unknown_item: "A product in the basket is gone. Remove that line and try again.",
  cart_too_large: "Twenty lines is the limit.",
  not_configured: "Payments are not switched on for this deployment yet.",
  stripe: "Stripe would not open a checkout. Nothing was charged.",
}

export function ShopCart() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<ResolvedLine[]>([])
  const [n, setN] = useState(0)
  const [total, setTotal] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setLines(resolve())
    setN(count())
    setTotal(subtotal())
  }, [])

  useEffect(() => {
    refresh()
    const off = subscribe(refresh)
    /* Another tab changing the basket should change this one too. */
    window.addEventListener("storage", refresh)
    return () => {
      off()
      window.removeEventListener("storage", refresh)
    }
  }, [refresh])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  async function checkout() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "shop",
          item: "shop",
          cart: lines.map((l) => ({ slug: l.slug, variant: l.variant, quantity: l.qty })),
        }),
      })
      const json = (await res.json()) as { url?: string; error?: string; detail?: string }
      if (res.ok && json.url) {
        window.location.href = json.url
        return
      }
      setError(REASON[json.error || ""] || json.detail || "That did not open. Nothing was charged.")
    } catch {
      setError("The connection dropped before checkout opened. Nothing was charged.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={n ? `Basket, ${n} item${n === 1 ? "" : "s"}` : "Basket, empty"}
        style={{
          position: "fixed", right: 18, bottom: 18, zIndex: 60,
          display: "inline-flex", alignItems: "center", gap: 10,
          minHeight: 48, padding: "0 18px", cursor: "pointer",
          borderRadius: 999, border: `1px solid ${LINE}`,
          background: "rgba(10,21,35,.92)", backdropFilter: "blur(14px)",
          color: PAPER, font: `700 13px/1 ${ARCHIVO}`, letterSpacing: ".06em", textTransform: "uppercase",
          boxShadow: "0 10px 34px rgba(0,0,0,.45)",
        }}
      >
        Basket
        <span
          style={{
            minWidth: 22, height: 22, padding: "0 6px", borderRadius: 999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: n ? RED : "rgba(255,255,255,.14)", color: "#FFFFFF",
            font: `700 12px/1 ${MONO}`,
          }}
        >
          {n}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Basket"
          style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            aria-label="Close basket"
            onClick={() => setOpen(false)}
            style={{ position: "absolute", inset: 0, border: "none", background: "rgba(4,9,16,.62)", cursor: "pointer" }}
          />
          <aside
            style={{
              position: "relative", width: "min(420px, 100%)", height: "100%",
              background: INK, borderLeft: `1px solid ${LINE}`,
              display: "flex", flexDirection: "column",
              boxShadow: "-24px 0 60px rgba(0,0,0,.5)",
            }}
          >
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 14px", borderBottom: `1px solid ${LINE}` }}>
              <span style={{ font: `700 12px/1 ${MONO}`, letterSpacing: ".2em", textTransform: "uppercase", color: "#FF1A21" }}>
                Your basket
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ minHeight: 44, minWidth: 44, background: "transparent", border: "none", color: PAPER, cursor: "pointer", font: `400 20px/1 ${ARCHIVO}` }}
                aria-label="Close basket"
              >
                ×
              </button>
            </header>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {lines.length === 0 ? (
                <p style={{ margin: "24px 0 0", font: `400 15.5px/1.6 ${ARCHIVO}`, color: MUTED }}>
                  Nothing in it yet.
                </p>
              ) : (
                lines.map((l) => (
                  <div
                    key={`${l.slug}:${l.variant}`}
                    style={{ display: "grid", gap: 8, padding: "14px 0", borderBottom: `1px solid ${LINE}` }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ font: `700 15px/1.35 ${ARCHIVO}`, color: PAPER }}>{l.product.name}</span>
                      <span style={{ font: `700 15px/1.35 ${MONO}`, color: PAPER, whiteSpace: "nowrap" }}>{money(l.lineTotal)}</span>
                    </div>
                    <span style={{ font: `400 13.5px/1.4 ${ARCHIVO}`, color: MUTED }}>
                      {l.variant}
                      {l.qty > 1 ? ` · ${money(l.cents)} each` : ""}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setQty(l.slug, l.variant, l.qty - 1)}
                        disabled={l.qty <= 1}
                        aria-label={`One fewer ${l.product.name}`}
                        style={stepper(l.qty <= 1)}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 28, textAlign: "center", font: `700 14px/1 ${MONO}`, color: PAPER }}>{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(l.slug, l.variant, l.qty + 1)}
                        disabled={l.qty >= 10}
                        aria-label={`One more ${l.product.name}`}
                        style={stepper(l.qty >= 10)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(l.slug, l.variant)}
                        style={{ marginLeft: "auto", minHeight: 44, background: "transparent", border: "none", cursor: "pointer", font: `600 13px/1 ${ARCHIVO}`, color: MUTED, textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer style={{ padding: "16px 20px 22px", borderTop: `1px solid ${LINE}`, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ font: `600 14px/1 ${ARCHIVO}`, color: MUTED }}>Subtotal</span>
                <span style={{ font: `700 18px/1 ${MONO}`, color: PAPER }}>{money(total)}</span>
              </div>
              <p style={{ margin: 0, font: `400 12.5px/1.5 ${ARCHIVO}`, color: MUTED }}>
                Postage and any tax are worked out at checkout.
              </p>
              <button
                type="button"
                onClick={checkout}
                disabled={busy || lines.length === 0}
                style={{
                  minHeight: 52, width: "100%", cursor: busy || !lines.length ? "default" : "pointer",
                  border: "none", borderRadius: 12, background: lines.length ? RED : "rgba(255,255,255,.14)",
                  color: "#FFFFFF", font: `700 15px/1 ${ARCHIVO}`, letterSpacing: ".05em", textTransform: "uppercase",
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy ? "One moment" : "Checkout"}
              </button>
              {error && (
                <p style={{ margin: 0, font: `400 14px/1.5 ${ARCHIVO}`, color: PAPER }}>{error}</p>
              )}
              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  style={{ minHeight: 44, background: "transparent", border: "none", cursor: "pointer", font: `600 13px/1 ${ARCHIVO}`, color: MUTED, textDecoration: "underline", justifySelf: "start" }}
                >
                  Empty the basket
                </button>
              )}
              <p style={{ margin: "4px 0 0", paddingTop: 12, borderTop: `1px solid ${LINE}`, font: `400 12.5px/1.6 ${ARCHIVO}`, color: MUTED }}>
                {SHOP_MISSION}
              </p>
            </footer>
          </aside>
        </div>
      )}
    </>
  )
}

function stepper(disabled: boolean): React.CSSProperties {
  return {
    minHeight: 44, minWidth: 44, cursor: disabled ? "default" : "pointer",
    borderRadius: 10, border: `1px solid ${LINE}`, background: "rgba(255,255,255,.05)",
    color: PAPER, font: `700 16px/1 ${ARCHIVO}`, opacity: disabled ? 0.4 : 1,
  }
}

/** Used by the product page, so the basket and the buy button share one path. */
export { add as addToCart }
