import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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

function Field({ children, error, helper }) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-300">{error}</p> : null}
      {!error && helper ? (
        <p className="mt-1.5 text-xs text-white/46">{helper}</p>
      ) : null}
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const navigate = useNavigate();
  const API_BASE = (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, "");

  const validate = () => {
    const e = {};

    if (!name.trim()) e.name = "Ingresá tu nombre y apellido";
    else if (name.trim().length < 3) e.name = "Completá tu nombre y apellido";

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) e.email = "Ingresá tu correo electrónico";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) e.email = "Correo electrónico inválido";

    if (!password) e.password = "Ingresá una contraseña";
    else {
      if (password.length < 8) e.password = "Mínimo 8 caracteres";
      if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        e.password = (e.password ? `${e.password} • ` : "") + "Debe incluir letras y números";
      }
    }

    if (!password2) e.password2 = "Repetí la contraseña";
    else if (password !== password2) e.password2 = "Las contraseñas no coinciden";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrMsg("");
    setOkMsg("");

    if (!validate()) return;

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setSubmitting(true);

      await axios.post(`${API_BASE}/api/users/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setOkMsg("Cuenta creada correctamente. Te redirigimos para iniciar sesión…");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "";

      if (status === 409 || /11000|duplicate/i.test(serverMsg)) {
        setErrMsg("Ese correo ya está registrado. Probá iniciar sesión.");
      } else if (status === 400) {
        setErrMsg(serverMsg || "Datos inválidos. Revisá el formulario.");
      } else if (status === 422) {
        setErrMsg(serverMsg || "Validación fallida. Revisá los campos.");
      } else {
        setErrMsg(serverMsg || "No pudimos crear tu cuenta. Intentá nuevamente en unos minutos.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Completá tus datos para comprar, acceder a tus recursos y continuar tu recorrido."
    >
      {errMsg ? (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errMsg}
        </div>
      ) : null}

      {okMsg ? (
        <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {okMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} action="javascript:void(0)" className="space-y-4" noValidate>
        <Field error={errors.name}>
          <label htmlFor="reg-name" className="mb-1.5 block text-sm text-white/68">
            Nombre y apellido
          </label>
          <input
            id="reg-name"
            name="name"
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`block w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 outline-none transition focus:ring-2 focus:ring-mint/40 ${
              errors.name ? "border border-red-500/60" : "border border-white/10 focus:border-white/20"
            }`}
            autoComplete="name"
            required
          />
        </Field>

        <Field error={errors.email}>
          <label htmlFor="reg-email" className="mb-1.5 block text-sm text-white/68">
            Correo electrónico
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 outline-none transition focus:ring-2 focus:ring-mint/40 ${
              errors.email ? "border border-red-500/60" : "border border-white/10 focus:border-white/20"
            }`}
            autoComplete="email"
            required
          />
        </Field>

        <Field
          error={errors.password}
          helper="Usá al menos 8 caracteres, con letras y números."
        >
          <label htmlFor="reg-password" className="mb-1.5 block text-sm text-white/68">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="reg-password"
              name="password"
              type={showPass1 ? "text" : "password"}
              placeholder="Creá una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full rounded-2xl bg-white/[0.04] px-4 py-3 pr-24 text-white placeholder-white/35 outline-none transition focus:ring-2 focus:ring-mint/40 ${
                errors.password ? "border border-red-500/60" : "border border-white/10 focus:border-white/20"
              }`}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass1((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/78 hover:bg-white/[0.12] transition"
            >
              {showPass1 ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>

        <Field error={errors.password2}>
          <label htmlFor="reg-password2" className="mb-1.5 block text-sm text-white/68">
            Repetir contraseña
          </label>
          <div className="relative">
            <input
              id="reg-password2"
              name="password2"
              type={showPass2 ? "text" : "password"}
              placeholder="Repetí tu contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className={`block w-full rounded-2xl bg-white/[0.04] px-4 py-3 pr-24 text-white placeholder-white/35 outline-none transition focus:ring-2 focus:ring-mint/40 ${
                errors.password2 ? "border border-red-500/60" : "border border-white/10 focus:border-white/20"
              }`}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass2((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/78 hover:bg-white/[0.12] transition"
            >
              {showPass2 ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className={`mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl bg-mint px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 ${
            submitting ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {submitting ? "Creando cuenta…" : "Crear cuenta"}
        </button>

        <div className="pt-2 text-center text-sm text-white/72">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-white transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}