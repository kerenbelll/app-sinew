import React, { useEffect, useState } from "react";

/**
 * ModalPublicidad – Página en construcción + CTA + QR
 * - Mismo contrato de props: { onClose, openInitially = true }
 * - Esc/Backdrop para cerrar
 * - Estética glass + acento #98f5e1 (mint)
 * - QR generado en runtime (sin instalar deps). Si falla, oculta el QR.
 */

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Generación de QR (carga dinámica sin dependencia local)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Si preferís dependencia local: npm i qrcode
        // y reemplazá la línea de import dinámico por: import QRCode from "qrcode";
        const { default: QRCode } = await import("https://esm.sh/qrcode@1.5.3");
        const url = await QRCode.toDataURL(STORE_URL, {
          margin: 1,
          width: 480,
          errorCorrectionLevel: "M", // balancea densidad/legibilidad
        });
        if (mounted) setQrDataUrl(url);
      } catch {
        // Si falla la carga del módulo (CSP, offline, etc.), no mostramos QR
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
    } catch {
      // no-op
    }
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
            relative w-full max-w-[620px]
            rounded-2xl border border-white/12
            bg-white/10 backdrop-blur-xl
            shadow-[0_20px_80px_rgba(0,0,0,0.55)]
            overflow-hidden text-white
          "
        >
          {/* Glow decorativo */}
          <div className="pointer-events-none absolute -z-10 -top-16 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />

          {/* Cerrar */}
          <button
            onClick={close}
            aria-label="Cerrar"
            className="absolute top-3.5 right-3.5 h-9 w-9 grid place-items-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 hover:text-white transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="-translate-y-[1px]">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Contenido */}
          <div className="px-6 pt-7 pb-6">
            <div className="text-center">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-[#98f5e1] text-[#0d1b2a] shadow-[0_0_24px_rgba(152,245,225,0.45)]">
                Aviso
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Página en construcción</h2>
              <p className="mt-2 text-white/80">
                Estamos trabajando para brindarte la mejor experiencia. Mientras tanto,{" "}
                <span className="text-white">para compras dirigite al siguiente enlace</span>.
              </p>
            </div>

            {/* Tarjeta link + copiar */}
            <div className="mt-5 rounded-xl border border-white/12 bg-white/5 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                    className="px-4 py-2 rounded-md font-medium bg-[#98f5e1] text-[#0d1b2a] hover:opacity-90 transition shadow-[0_0_20px_rgba(152,245,225,0.25)]"
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

            {/* QR */}
            <div className="mt-6 grid place-items-center">
              <div
                className="
                  relative rounded-xl p-3 bg-black/40 ring-1 ring-white/10
                  shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                "
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR hacia Linktree de compras"
                    className="w-[220px] h-[220px] object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="w-[220px] h-[220px] grid place-items-center text-white/60 text-sm">
                    Generando QR…
                  </div>
                )}
                <div className="pointer-events-none absolute -bottom-6 -right-6 size-20 rounded-full bg-[#98f5e1]/20 blur-2xl" />
              </div>
              <p className="mt-2 text-xs text-white/60">Escaneá para comprar desde tu móvil</p>
            </div>

            {/* Secundario */}
            <div className="mt-6 flex justify-center">
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