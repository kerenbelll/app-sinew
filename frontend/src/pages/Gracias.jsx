// src/pages/Gracias.jsx
import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const PENDING_STATUSES = new Set(["pending", "in_process", "processing"]);
const FAILURE_STATUSES = new Set(["failure", "rejected", "cancelled", "not_approved", "error"]);

// Lee el backend base de env (igual que en Download.jsx)
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");

// Convierte el valor de ?download= en una URL de descarga absoluta.
// - Si viene un token: {API_BASE}/api/download/<token>
// - Si ya es una URL absoluta o relativa con http(s): se usa tal cual
function resolveDownloadUrl(downloadParam) {
  if (!downloadParam) return null;
  if (/^https?:\/\//i.test(downloadParam)) return downloadParam;      // ya es absoluta
  if (downloadParam.startsWith("/")) return `${API_BASE}${downloadParam}`; // relativa -> al backend
  // token crudo
  return `${API_BASE}/api/download/${encodeURIComponent(downloadParam)}`;
}

export default function Gracias() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const downloadFromQuery = search.get("download");
  const errorFromQuery = search.get("error");
  const statusFromQuery = (search.get("status") || "").toLowerCase();

  const stateDownload = location.state?.downloadLink || null;
  const payerName = location.state?.payerName || null;

  const downloadUrl = useMemo(() => {
    const primary = resolveDownloadUrl(downloadFromQuery);
    if (primary) return primary;
    return resolveDownloadUrl(stateDownload);
  }, [downloadFromQuery, stateDownload]);

  const [countdown, setCountdown] = useState(3);
  const [autoStarted, setAutoStarted] = useState(false);

  const showInfoPending = !errorFromQuery && PENDING_STATUSES.has(statusFromQuery);
  const showInfoFailure = !errorFromQuery && FAILURE_STATUSES.has(statusFromQuery);

  useEffect(() => {
    if (!downloadUrl || autoStarted) return;
    setAutoStarted(true);

    const int = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);

    const timer = setTimeout(() => {
      try {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.style.display = "none";
        a.setAttribute("download", "");
        a.rel = "noopener";
        a.target = "_self";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Fallback si el click programático se bloquea
        setTimeout(() => {
          window.location.assign(downloadUrl);
        }, 600);
      } catch {
        window.location.assign(downloadUrl);
      }
    }, 3000);

    return () => { clearInterval(int); clearTimeout(timer); };
  }, [downloadUrl, autoStarted]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] px-4 py-16 text-white">
      <div className="max-w-xl w-full border border-white/10 bg-[#0b1222]/70 backdrop-blur rounded-2xl shadow-2xl p-8 space-y-5">
        <h1 className="text-3xl font-bold">¡Gracias por tu compra!</h1>

        {payerName && (
          <p className="text-white/80">
            A nombre de: <strong className="text-white">{payerName}</strong>
          </p>
        )}

        {errorFromQuery && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 text-sm">
            Hubo un inconveniente con el pago ({errorFromQuery}). Si ya te debitaron,
            escribinos con el comprobante para ayudarte.
          </div>
        )}

        {!errorFromQuery && showInfoPending && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm">
            Estamos confirmando tu pago con el proveedor (<strong>{statusFromQuery}</strong>). Esto puede demorar unos segundos.
          </div>
        )}

        {!errorFromQuery && showInfoFailure && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm">
            Estado del pago: <strong>{statusFromQuery}</strong>. Si creés que es un error, revisá tu correo o reintentá con otro medio.
          </div>
        )}

        <p className="text-white/70">Te enviamos un email con el enlace de descarga o acceso.</p>

        {downloadUrl ? (
          <div className="p-4 bg-emerald-400/10 border border-emerald-300/30 rounded-xl space-y-2">
            <p className="mb-1">
              Tu descarga comenzará automáticamente en <strong>{countdown}</strong> segundo{countdown === 1 ? "" : "s"}…
            </p>

            {/* Anchor real al BACKEND para evitar el Router */}
            <a
              href={downloadUrl}
              target="_self"
              rel="noopener"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-mint text-black font-medium hover:opacity-90 transition"
              download
            >
              Descargar ahora
            </a>

            <p className="text-xs text-white/50">
              Si no comienza, usá “Descargar ahora”. El enlace es de un solo uso y vence en 24 horas.
            </p>
          </div>
        ) : (
          <p className="text-sm text-white/60">
            Si no ves el enlace, revisá tu correo (incluida la carpeta de spam).
          </p>
        )}

        <Link to="/" className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}