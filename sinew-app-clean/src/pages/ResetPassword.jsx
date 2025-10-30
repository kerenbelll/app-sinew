// src/pages/ResetPassword.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, ""),
    []
  );

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // 1) Validar token antes de mostrar el form (opcional pero recomendado)
  useEffect(() => {
    let alive = true;
    async function run() {
      if (!token) {
        setChecking(false);
        setValid(false);
        return;
      }
      try {
        const r = await fetch(`${API_BASE}/api/users/reset-password/validate/${token}`);
        const j = await r.json();
        if (!alive) return;
        setValid(Boolean(j?.ok));
      } catch {
        if (!alive) return;
        setValid(false);
      } finally {
        if (alive) setChecking(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [API_BASE, token]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (!pwd || pwd.length < 8 || !/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) {
      setError("La contraseña debe tener al menos 8 caracteres e incluir letras y números.");
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pwd }), // <-- IMPORTANTE: token + password
        credentials: "include",
      });
      const j = await r.json();

      if (!r.ok) {
        setError(j?.error || j?.message || "No se pudo restablecer la contraseña.");
      } else {
        setOkMsg(j?.message || "Contraseña actualizada correctamente.");
        // Redirigir a login en 2s
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch {
      setError("No se pudo restablecer la contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <div className="text-sm text-black/70">Verificando enlace…</div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full border border-black/10 rounded-2xl p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Enlace inválido o vencido</h1>
          <p className="text-black/70 text-sm">
            Pedí uno nuevo desde{" "}
            <Link to="/login" className="underline">“¿Olvidaste tu contraseña?”</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full border border-black/10 rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Restablecer contraseña</h1>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        {okMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            {okMsg} Redirigiendo al inicio de sesión…
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nueva contraseña</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Mínimo 8 caracteres, con letras y números"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg py-2 bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>

        <div className="text-xs text-black/60">
          Si no pediste este cambio, ignorá este enlace.
        </div>
      </div>
    </div>
  );
}