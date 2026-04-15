import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08101f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#98f5e1]/10 blur-3xl" />
        <div className="absolute top-[24%] left-[8%] h-[18rem] w-[18rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-[20rem] w-[20rem] rounded-full bg-[#98f5e1]/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] items-center justify-center px-4 py-10 sm:px-6 md:px-8 md:py-14 xl:px-12">
        <div className="grid w-full max-w-[1180px] grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-10 xl:p-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">
                Acceso SINEW
              </p>
              <h1 className="mt-5 text-[clamp(32px,3vw,52px)] font-semibold leading-[0.96] tracking-tight text-white">
                {title}
              </h1>
              <p className="mt-5 max-w-[40ch] text-[15px] leading-7 text-white/66">
                {subtitle}
              </p>
            </div>

            
          </div>

          <div className="p-5 sm:p-6 md:p-8 xl:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-7 text-center lg:hidden">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">
                  Acceso SINEW
                </p>
                <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-white">
                  {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ children, error }) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [fpOpen, setFpOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, "");

  const safeDestAfterLogin = () => {
    const rawFrom = location.state?.from;

    try {
      const url = new URL(
        typeof rawFrom === "string"
          ? rawFrom
          : (rawFrom?.pathname || "/") + (rawFrom?.search || ""),
        window.location.origin
      );

      url.searchParams.delete("buy");
      return url.pathname + url.search || "/";
    } catch {
      return "/";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_BASE}/api/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("auth_token", data.token);
      }

      login({ token: data?.token, ...data.user });
      navigate(safeDestAfterLogin(), { replace: true });
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setErrMsg(serverMsg || "No pudimos iniciar sesión. Verificá tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const openForgot = () => {
    setFpEmail(email || "");
    setFpMsg("");
    setFpOpen(true);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setFpMsg("");

    if (!fpEmail.trim()) {
      setFpMsg("Ingresá tu correo para recuperar la contraseña.");
      return;
    }

    try {
      setFpLoading(true);
      const { data } = await axios.post(
        `${API_BASE}/api/users/forgot-password`,
        { email: fpEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      setFpMsg(
        data?.message ||
          "Si el correo está registrado, te enviaremos instrucciones para restablecer tu contraseña."
      );
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setFpMsg(serverMsg || "No pudimos procesar la solicitud. Probá más tarde.");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Ingresá para continuar con tus cursos, masterclasses y compras."
    >
      {errMsg ? (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field>
          <label htmlFor="email" className="mb-1.5 block text-sm text-white/68">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-mint/40"
            autoComplete="email"
            required
          />
        </Field>

        <Field>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="password" className="block text-sm text-white/68">
              Contraseña
            </label>
            <button
              type="button"
              onClick={openForgot}
              className="text-[13px] text-white/62 underline underline-offset-4 hover:text-white transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-24 text-white placeholder-white/35 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-mint/40"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/78 hover:bg-white/[0.12] transition"
            >
              {showPass ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl bg-mint px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {loading ? "Ingresando…" : "Entrar"}
        </button>

        <div className="pt-2 text-center text-sm text-white/72">
          ¿Todavía no tenés cuenta?{" "}
          <Link
            to="/register"
            className="underline underline-offset-4 hover:text-white transition"
          >
            Crear cuenta
          </Link>
        </div>
      </form>

      {fpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#0b1222] p-5 shadow-2xl sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">
                Recuperar contraseña
              </h3>
              <button
                type="button"
                onClick={() => setFpOpen(false)}
                className="text-white/60 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-sm leading-6 text-white/66">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleForgot} className="space-y-3">
              <input
                id="fp-email"
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="tu@email.com"
                className="block w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-mint/40"
                required
              />

              <button
                type="submit"
                disabled={fpLoading}
                className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-mint px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 ${
                  fpLoading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {fpLoading ? "Enviando…" : "Enviar instrucciones"}
              </button>
            </form>

            {fpMsg ? (
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/82">
                {fpMsg}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AuthShell>
  );
}