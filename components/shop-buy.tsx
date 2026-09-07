"use client"

import { useState } from "react"
import { buyable, type Product, type Variant } from "@/lib/shop/catalogue"

/**
 * The buy control on a product page.
 *
 * Every size used to need its own Stripe payment link, which is why the whole
 * shop sat at Soon: nobody was going to hand-make thirty of them. This posts
 * to /api/stripe/checkout instead, which prices the line from the catalogue on
 * the server and hands back a Stripe session to redirect to.
 *
 * A variant with a buyUrl still uses it, so a one off link keeps working.
 *
 * The control says what went wrong rather than failing quietly. A price that
 * is not set, a card Stripe refused, a key that is missing on the deployment:
 * each comes back with its own message, because a dead button teaches the
 * buyer nothing.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"

const REASON: Record<string, string> = {
  price_not_set: "That one does not have a price yet.",
  unknown_variant: "That size is not in the list any more. Reload and try again.",
  unknown_item: "That product is not in the shop any more.",
  not_configured: "Payments are not switched on for this deployment yet.",
  stripe: "Stripe would not open a checkout for that. Nothing was charged.",
}

export function ShopBuy({ product, accent }: { product: Product; accent: string }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function go(v: Variant) {
    if (v.buyUrl) {
      window.location.href = v.buyUrl
      return
    }
    setBusy(v.label)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "shop", item: "shop", slug: product.slug, variant: v.label, quantity: 1 }),
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
      setBusy(null)
    }
  }

  const sellable = product.variants.filter(buyable)

  return (
    <div style={{ margin: "18px 0 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
        {product.variants.map((v) => {
          const ok = buyable(v)
          return (
            <button
              key={v.label}
              type="button"
              disabled={!ok || busy !== null}
              onClick={() => go(v)}
              className="pg-tap"
              style={{
                font: `800 14px/1 ${ARCHIVO}`,
                letterSpacing: ".04em",
                color: ok ? "#04211d" : "#8C949E",
                background: ok ? accent : "transparent",
                border: ok ? "none" : "1px solid rgba(255,255,255,.22)",
                padding: "13px 20px",
                borderRadius: 10,
                cursor: ok ? "pointer" : "not-allowed",
                opacity: busy && busy !== v.label ? 0.55 : 1,
              }}
            >
              {busy === v.label ? "Opening" : v.label}
            </button>
          )
        })}
      </div>

      {sellable.length > 0 && (
        <p style={{ margin: "12px 0 0", font: `400 13.5px/1.5 ${ARCHIVO}`, color: "#9AA4B2" }}>
          Checkout is Stripe. You put the address in there, and it comes to me to pack and post.
        </p>
      )}

      {error && (
        <p role="alert" style={{ margin: "10px 0 0", font: `600 14px/1.5 ${ARCHIVO}`, color: "#FF1A21" }}>
          {error}
        </p>
      )}
    </div>
  )
}
