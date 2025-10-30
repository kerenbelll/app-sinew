// src/pages/Download.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function Download() {
  const { token } = useParams();
  const API_ENV = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");
  const backendBase = useMemo(() => API_ENV.replace(/\/$/, ""), [API_ENV]);
  const downloadURL = `${backendBase}/api/download/${token ?? ""}`;

  const [seconds, setSeconds] = useState(3);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    const tick = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    const go = setTimeout(() => (window.location.href = downloadURL), 3000);
    return () => { clearInterval(tick); clearTimeout(go); };
  }, [token, downloadURL]);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(downloadURL); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white px-4">
        <div className="w-full max-w-xl bg-[#0b1222]/70 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8 text-center space-y-4">
          <h1 className="text-3xl font-bold">Enlace inválido</h1>
          <p className="text-white/70">No encontramos un token de descarga. Verificá el enlace del correo.</p>
          <Link to="/" className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-mint text-black font-medium hover:opacity-90 transition">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white px-4 py-16">
      <div className="w-full max-w-xl bg-[#0b1222]/70 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8 text-center space-y-5">
        <h1 className="text-3xl font-bold">Preparando tu descarga…</h1>
        <p className="text-white/70">
          Comenzará automáticamente en <span className="font-semibold text-white">{seconds}</span> segundo{seconds === 1 ? "" : "s"}.
        </p>
        <div className="space-x-3">
          <a href={downloadURL} className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-mint text-black font-medium hover:opacity-90 transition">Descargar ahora</a>
          <button onClick={copyLink} className="inline-flex items-center justify-center px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition">
            {copied ? "¡Copiado!" : "Copiar enlace"}
          </button>
        </div>
        <p className="text-xs text-white/60 break-all">{downloadURL}</p>
        <p className="text-xs text-white/50">Si el enlace venció o ya fue usado, volvé a la página de compra o revisá tu email.</p>
        <Link to="/" className="inline-block text-sm text-mint underline underline-offset-4 hover:text-white transition mt-2">Volver al inicio</Link>
      </div>
    </div>
  );
}