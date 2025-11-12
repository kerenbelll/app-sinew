import React, { useEffect, useState, useMemo } from "react";
import API from "../api/api";
import { useUser } from "../context/UserContext";
import FondoParticulas from "../components/FondoParticulas";
import { Link } from "react-router-dom";

export default function Ajustes() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  // Perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // UI
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const token = useMemo(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem("auth_token") || localStorage.getItem("token"))) ||
      "",
    []
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data } = await API.get("/users/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!mounted) return;
        setName(data?.name || "");
        setEmail(data?.email || "");
      } catch {
        setMsg({ type: "error", text: "No se pudo obtener el perfil." });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  function showTempMessage(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  }

  async function onSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setMsg({ type: "", text: "" });
    try {
      const { data } = await API.patch(
        "/users/profile",
        { name: String(name || "").trim(), email: String(email || "").trim().toLowerCase() },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setUser((prev) => ({ ...prev, name: data?.user?.name, email: data?.user?.email }));
      showTempMessage("ok", "Perfil actualizado correctamente.");
    } catch (err) {
      const m = err?.response?.data?.message || "No se pudo actualizar el perfil.";
      showTempMessage("error", m);
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSavePassword(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!newPassword || newPassword.length < 8) {
      showTempMessage("error", "La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== repeatPassword) {
      showTempMessage("error", "Las contraseñas no coinciden.");
      return;
    }

    setSavingPass(true);
    try {
      await API.patch(
        "/users/password",
        { currentPassword, newPassword },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
        showTempMessage("ok", "Contraseña actualizada.");
    } catch (err) {
      const m = err?.response?.data?.message || err?.response?.data?.error || "No se pudo actualizar la contraseña.";
      showTempMessage("error", m);
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <section
      className="
        relative min-h-screen overflow-hidden
        text-white
        bg-[#0b1222]  /* respaldo sólido para evitar flashes blancos */
      "
    >
      {/* Fondo con tonos azulados */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0e1a2d] via-[#152a46] to-[#2c4a74]" />

      {/* Partículas detrás del contenido */}
      <FondoParticulas className="-z-10 opacity-70" />

      {/* Glows sutiles azules */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full blur-[80px] opacity-15 bg-[#6bb1ff]" />
        <div className="absolute -bottom-24 right-1/4 w-[32rem] h-[32rem] rounded-full blur-[80px] opacity-10 bg-[#98f5e1]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 md:py-20">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/70">
            <span className="h-[6px] w-[6px] rounded-full bg-[#6bb1ff]" />
            Ajustes de cuenta
          </div>
          <h1 className="mt-2 text-[clamp(26px,4.5vw,40px)] font-extrabold leading-tight tracking-tight">
            {user?.name ? `Hola, ${user.name}` : "Tu cuenta"}
          </h1>
          <p className="mt-2 text-white/75 max-w-2xl">
            Actualizá tu nombre y correo, o cambiá tu contraseña. Tus datos se guardarán de forma segura.
          </p>
        </header>

        {msg.text ? (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              msg.type === "ok"
                ? "bg-white/10 border-white/15 text-white"
                : "bg-[#2a2030]/70 border-[#ff7aa2]/30 text-[#ffd9e6]"
            }`}
          >
            {msg.text}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            Cargando…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* --------- Perfil --------- */}
            <form
              onSubmit={onSaveProfile}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6 shadow-[0_0_28px_rgba(25,121,255,0.10)]"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="inline-block h-[8px] w-[8px] rounded-full bg-[#6bb1ff]" />
                Información básica
              </h2>

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm text-white/80">Nombre</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#6bb1ff]/40 focus:border-white/20"
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-white/80">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#6bb1ff]/40 focus:border-white/20"
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="
                    inline-flex items-center gap-2 rounded-lg
                    bg-[#6bb1ff] text-[#0d1b2a] font-semibold
                    px-4 py-2.5 hover:opacity-95 disabled:opacity-60 transition
                    shadow-[0_6px_18px_rgba(107,177,255,0.25)]
                    ring-1 ring-[#6bb1ff]/30
                  "
                >
                  {savingProfile ? "Guardando…" : "Guardar cambios"}
                </button>
                <Link
                  to="/perfil"
                  className="text-sm text-white/70 hover:text-white underline underline-offset-4"
                >
                  Volver a mis cursos
                </Link>
              </div>
            </form>

            {/* --------- Contraseña --------- */}
            <form
              onSubmit={onSavePassword}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6 shadow-[0_0_28px_rgba(25,121,255,0.10)]"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="inline-block h-[8px] w-[8px] rounded-full bg-[#6bb1ff]" />
                Seguridad
              </h2>

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm text-white/80">Contraseña actual</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#6bb1ff]/40 focus:border-white/20"
                    placeholder="********"
                    autoComplete="current-password"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-white/80">Nueva contraseña</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#6bb1ff]/40 focus:border-white/20"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-white/80">Repetir contraseña</span>
                  <input
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#6bb1ff]/40 focus:border-white/20"
                    placeholder="Repetir nueva contraseña"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <div className="mt-5">
                <button
                  type="submit"
                  disabled={savingPass}
                  className="
                    inline-flex items-center gap-2 rounded-lg
                    bg-white/10 text-white font-semibold
                    px-4 py-2.5 hover:bg-white/15 disabled:opacity-60 transition
                    border border-white/15 ring-1 ring-white/10
                  "
                >
                  {savingPass ? "Guardando…" : "Actualizar contraseña"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}