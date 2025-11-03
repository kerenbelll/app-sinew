// src/components/ModalPublicidad.jsx
import React, { useEffect, useState } from "react";

const STORE_URL =
  "https://linktr.ee/gerpaez?fbclid=PAT01DUAM1Ae9leHRuA2FlbQIxMAABp_cv7EVNHrX6RzRnI--B6fkcTrYPmZZpOawz23MONDUXgQf8OvBGgd6sCEfb_aem_C_uNjZ7PzWLO8-wsQ1na0w";

export default function ModalPublicidad({ onClose, openInitially = true }) {
  const [open, setOpen] = useState(openInitially);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  // ESC para cerrar
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Generación de QR (dinámico; si falla, lo oculta)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { default: QRCode } = await import("https://esm.sh/qrcode@1.5.3");
        const url = await QRCode.toDataURL(STORE_URL, {
          margin: 1,
          width: 360, // base más chica (antes 480)
          errorCorrectionLevel: "M",
        });
        if (mounted) setQrDataUrl(url);
      } catch {
        if (mounted) setQrDataUrl(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(STORE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} className="fixed inset-0 z-[90] cursor-pointer" aria-label="Cerrar">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Card */}
      <div className="fixed inset-0 z-[95] flex items-center justify-center px-3">
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          className="
            relative w-full max-w-[440px] sm:max-w-[500px]
            rounded-2xl border border-white/12
            bg-white/10 backdrop-blur-xl
            shadow-[0_16px_70px_rgba(0,0,0,0.55)]
            overflow-hidden text-white
          "
        >
          {/* Glow sutil */}
          <div className="pointer-events-none absolute -z-10 -top-20 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />

          {/* Cerrar */}
          <button
            onClick={close}
            aria-label="Cerrar"
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-black/45 text-white/90 hover:bg-black/60 hover:text-white transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="-translate-y-[1px]">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Contenido */}
          <div className="px-4 pt-5 pb-4 sm:px-5 sm:pt-6 sm:pb-5">
            {/* Encabezado */}
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#98f5e1] text-[#0d1b2a] shadow-[0_0_16px_rgba(152,245,225,0.4)]">
                Aviso
              </span>

              <h2 className="mt-2 text-[1.3rem] md:text-[1.55rem] font-semibold tracking-tight leading-snug">
                COMPRAS DISPONIBLES EN ESTE ENLACE
              </h2>

              <p className="mt-1.5 text-[0.95rem] text-white/80 leading-relaxed max-w-[85%] mx-auto">
                Si querés comprar ahora, usá el link o el QR. El resto del sitio sigue navegable.
              </p>
            </div>

            {/* Tarjeta link + copiar */}
            <div className="mt-4 rounded-xl border border-white/12 bg-white/5 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[#98f5e1] hover:opacity-90 underline underline-offset-4"
                  title={STORE_URL}
                >
                  {STORE_URL}
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-md font-medium bg-[#98f5e1] text-[#0d1b2a] hover:opacity-90 transition shadow-[0_0_20px_rgba(152,245,225,0.25)]"
                  >
                    Ir a compras
                  </a>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 rounded-md border border-white/15 text-white/90 hover:bg-white/10 transition"
                  >
                    {copied ? "¡Copiado!" : "Copiar enlace"}
                  </button>
                </div>
              </div>
            </div>

            {/* QR más chico y responsive */}
            <div className="mt-5 grid place-items-center">
              <div className="relative rounded-xl p-2.5 bg-black/40 ring-1 ring-white/10 shadow-[0_10px_36px_rgba(0,0,0,0.45)]">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR hacia Link de compras"
                    className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] grid place-items-center text-white/60 text-sm">
                    Generando QR…
                  </div>
                )}
                <div className="pointer-events-none absolute -bottom-5 -right-5 size-16 rounded-full bg-[#98f5e1]/20 blur-2xl" />
              </div>
              <p className="mt-1.5 text-[11px] text-white/60">Escaneá para comprar desde tu móvil</p>
            </div>

            {/* Cerrar / Seguir */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={close}
                className="px-4 py-2 rounded-md border border-white/15 text-white/90 hover:bg-white/10 transition"
              >
                Seguir navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}