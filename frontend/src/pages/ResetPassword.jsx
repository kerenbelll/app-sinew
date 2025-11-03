import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, ""),
    []
  );

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) { setChecking(false); setValid(false); return; }
      try {
        const r = await fetch(`${API_BASE}/api/users/reset-password/validate/${token}`);
        const j = await r.json();
        if (alive) setValid(Boolean(j?.ok));
      } catch { if (alive) setValid(false); }
      finally { if (alive) setChecking(false); }
    })();
    return () => { alive = false; };
  }, [API_BASE, token]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(""); setOkMsg("");
    if (!pwd || pwd.length < 8 || !/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) {
      setError("La contraseña debe tener al menos 8 caracteres e incluir letras y números.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pwd }),
      });
      const j = await r.json();
      if (!r.ok) setError(j?.error || j?.message || "No se pudo restablecer la contraseña.");
      else {
        setOkMsg(j?.message || "Contraseña actualizada correctamente.");
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch {
      setError("No se pudo restablecer la contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  // Loading
  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77]">
        <div className="text-white/80 text-sm">Verificando enlace…</div>
      </div>
    );
  }

  // Token inválido
  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] px-4">
        <div className="w-full max-w-md bg-[#0b1222]/70 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Enlace inválido o vencido</h1>
          <p className="text-white/70 text-sm">
            Pedí uno nuevo desde <Link to="/login" className="underline">“¿Olvidaste tu contraseña?”</Link>.
          </p>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white px-4 py-16">
      <div className="w-full max-w-md bg-[#0b1222]/70 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h2>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
            {error}
          </div>
        )}
        {okMsg && (
          <div className="mb-4 p-3 rounded border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 text-sm">
            {okMsg} Redirigiendo…
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="pwd" className="sr-only">Nueva contraseña</label>
            <input
              id="pwd"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Mínimo 8, incluye letras y números"
              className="block w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full px-4 py-2 rounded-xl text-black font-medium bg-mint hover:opacity-90 transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Guardando…' : 'Guardar contraseña'}
          </button>

          <p className="text-xs text-white/60 text-center">
            Si no pediste este cambio, ignorá este enlace.
          </p>
        </form>
      </div>
    </div>
  );
}