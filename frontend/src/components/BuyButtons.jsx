// src/components/BuyButtons.jsx
import React, { useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPreference } from "../services/mercadopago"; // helper MP
// import { useUser } from "../context/UserContext";

export default function BuyButtons({
  type,                 // "course" | "book"
  slug,                 // course slug si type === "course"
  title,                // texto que verá el checkout
  mpPriceARS = 0,       // precio ARS para MP
  ppPriceUSD = 0,       // precio USD para PayPal
  buyerEmail = "",      // opcional: si no usás contexto
  buyerName = "",       // opcional: si no usás contexto
}) {
  const [isLoadingMP, setIsLoadingMP] = useState(false);

  const API = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

  // const { user } = useUser?.() || { user: null };
  // const email = user?.email || buyerEmail;
  // const name  = user?.name  || buyerName;

  const email = buyerEmail || "";
  const name  = buyerName  || "";

  /* ───────── MERCADO PAGO ───────── */
  const buyWithMercadoPago = async () => {
    try {
      setIsLoadingMP(true);
      const pref = await createPreference({
        price: mpPriceARS,
        currency: "ARS",
        title,
        buyer: { email, name },
        metadata: type === "course"
          ? { type, slug, courseSlug: slug }
          : { type: "book" },
      });

      // 🔹 Producción: priorizamos init_point
      const initPoint = pref?.init_point || pref?.sandbox_init_point;
      if (!initPoint) throw new Error("Sin enlace de pago");
      window.location.href = initPoint;
    } catch (err) {
      console.error("Mercado Pago error:", err);
      alert("No se pudo iniciar el pago con Mercado Pago.");
    } finally {
      setIsLoadingMP(false);
    }
  };

  /* ───────── PAYPAL ───────── */
  const paypalOptions = useMemo(
    () => ({
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture",
      components: "buttons",
    }),
    [PAYPAL_CLIENT_ID]
  );

  const createOrder = async () => {
    const res = await fetch(`${API}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: ppPriceUSD,
        currency: "USD",
        title,
        buyer: { email, name },
        // El backend usa metadata.courseSlug -> custom_id="course:<slug>"
        metadata: type === "course" ? { type, slug, courseSlug: slug } : { type: "book" },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.id) {
      throw new Error(data?.error || "No se pudo crear la orden de PayPal");
    }
    return data.id;
  };

  const onApprove = async ({ orderID }) => {
    try {
      const res = await fetch(`${API}/api/paypal/capture-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID,
          email,
          name,
          // Fallback por si PayPal no retorna custom_id
          courseSlug: type === "course" ? slug : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "No se pudo confirmar el pago");
      }

      // El backend devuelve siempre redirectTo (curso o libro)
      if (data.redirectTo) {
        window.location.replace(data.redirectTo);
        return;
      }

      // Compatibilidad con alguna respuesta antigua
      if (data.downloadLink) {
        window.location.replace(data.downloadLink);
        return;
      }

      window.location.replace("/gracias");
    } catch (err) {
      console.error("PayPal capture error:", err);
      alert("Ocurrió un problema al confirmar el pago en PayPal.");
    }
  };

  const showMP = mpPriceARS > 0;
  const showPP = ppPriceUSD > 0;
  const isFree = !showMP && !showPP;

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm md:text-[15px] font-semibold tracking-tight">
            Elegí tu medio de pago
          </h4>
          {!isFree && (
            <div className="flex items-center gap-2 text-[11px] text-white/60">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-mint/80" />
                Seguro
              </span>
              <span className="opacity-40">•</span>
              <span>Envío por email</span>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          {/* MERCADO PAGO */}
          {showMP && (
            <button
              onClick={buyWithMercadoPago}
              disabled={isLoadingMP}
              className={[
                "inline-flex items-center justify-center",
                "rounded-lg bg-mint text-black",
                "px-3.5 py-2 text-sm font-medium",
                "hover:opacity-90 transition",
                "shadow-[0_0_18px_rgba(152,245,225,0.20)]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
              aria-label="Comprar con Mercado Pago"
            >
              {isLoadingMP ? (
                <span className="inline-flex items-center gap-2">
                  <SpinnerDot />
                  Iniciando Mercado&nbsp;Pago…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
                    <path
                      fill="currentColor"
                      d="M3 7.5C3 5.57 4.57 4 6.5 4h11C19.43 4 21 5.57 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-11A2.5 2.5 0 0 1 5 16.5v-9ZM6.5 6A1.5 1.5 0 0 0 5 7.5v.75h14V7.5A1.5 1.5 0 0 0 17.5 6h-11Z"
                    />
                  </svg>
                  Comprar · ARS&nbsp;
                  <span className="tabular-nums">{mpPriceARS.toLocaleString("es-AR")}</span>
                </span>
              )}
            </button>
          )}

          {showMP && showPP && (
            <div className="relative my-1.5">
              <div className="h-px w-full bg-white/10" />
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-black px-2 text-[11px] text-white/50">
                o
              </span>
            </div>
          )}

          {/* PAYPAL */}
          {showPP && PAYPAL_CLIENT_ID && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-2">
              <PayPalScriptProvider options={paypalOptions} deferLoading={false}>
                <PayPalButtons
                  style={{ layout: "horizontal", shape: "rect", height: 40, tagline: false }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    console.error(err);
                    alert("Ocurrió un error con PayPal.");
                  }}
                />
              </PayPalScriptProvider>
              <div className="mt-1 text-[11px] text-white/60 text-center">
                Pagar · USD <span className="tabular-nums">{ppPriceUSD}</span>
              </div>
            </div>
          )}

          {isFree && (
            <p className="text-mint text-[13px]">
              Este curso es totalmente gratuito 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SpinnerDot() {
  return (
    <span
      className="inline-block size-3 rounded-full bg-black/50"
      style={{
        boxShadow:
          "0 0 0 2px rgba(0,0,0,0.2) inset, 0 0 0 2px rgba(255,255,255,0.25)",
        animation: "pulseDot 0.9s ease-in-out infinite",
      }}
    />
  );
}