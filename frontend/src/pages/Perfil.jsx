import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import FondoParticulas from "../components/FondoParticulas";

const readToken = () =>
  (typeof window !== "undefined" &&
    (localStorage.getItem("auth_token") || localStorage.getItem("token"))) ||
  "";

function Card3D({ children, className = "" }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(hover: none)").matches;

  const handleMove = (e) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty("--rx", `${(-y / 120).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 120).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={[
        "group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "p-4 md:p-5 shadow-[0_0_34px_rgba(152,245,225,0.08)]",
        "transition-transform duration-150 hover:scale-[1.01]",
        className,
      ].join(" ")}
      style={{
        transform:
          "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        willChange: "transform",
      }}
    >
      <div className="pointer-events-none absolute -top-4 -right-4 size-14 rounded-full bg-mint/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-mint/10 blur-3xl" />
      {children}
    </div>
  );
}

function ResourceBadge({ kind, isArchive, level }) {
  if (isArchive) {
    return (
      <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-white/15 border border-white/15 text-white">
        Archivo
      </span>
    );
  }

  if (kind === "masterclass") {
    return (
      <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-white/15 border border-white/15 text-white">
        Masterclass
      </span>
    );
  }

  if (level === "free") {
    return (
      <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-mint text-black shadow-[0_0_18px_rgba(152,245,225,0.45)]">
        Gratis
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-white/15 border border-white/15 text-white">
      Pro
    </span>
  );
}

export default function Perfil() {
  const { user } = useUser();

  const API = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(
    /\/$/,
    ""
  );

  const token = useMemo(readToken, []);
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);

  const resolveThumb = (thumb) => thumb || "";

  useEffect(() => {
    let mounted = true;

    async function loadOwnedResources() {
      try {
        setLoading(true);

        if (!user || !token) {
          if (mounted) setResources([]);
          return;
        }

        const response = await fetch(`${API}/api/users/me/courses`, { headers });
        const data = await response.json().catch(() => null);

        if (!mounted) return;

        const owned = Array.isArray(data?.courses) ? data.courses : [];

        const normalized = owned
          .filter((item) => item?.slug)
          .map((item) => ({
            slug: item.slug,
            title: item.title || item.slug,
            thumbnail: resolveThumb(item.thumbnail),
            level: String(item.level || "").toLowerCase(),
            kind: String(item.kind || "course").toLowerCase(),
            isArchive: Boolean(item.isArchive),
          }))
          .sort((a, b) => (a.title || "").localeCompare(b.title || ""));

        setResources(normalized);
      } catch {
        if (mounted) setResources([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOwnedResources();

    return () => {
      mounted = false;
    };
  }, [API, headers, token, user]);

  if (!user) {
    return (
      <section className="min-h-[60vh] grid place-items-center bg-black text-white">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-semibold">Iniciá sesión</h1>
          <p className="text-white/70">Ingresá para ver tus recursos.</p>
          <Link to="/login" className="underline">
            Ir a login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <FondoParticulas />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full blur-3xl opacity-15 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-10 bg-white" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/60">
            <span className="h-[6px] w-[6px] rounded-full bg-mint/80" />
            Mi cuenta
          </span>

          <h1 className="mt-3 text-[clamp(28px,4.2vw,44px)] font-extrabold tracking-tight leading-[1.05]">
            Hola{user?.name ? `, ${user.name}` : ""}{" "}
            <span className="bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
              👋
            </span>
          </h1>

          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Acá vas a encontrar únicamente los{" "}
            <strong className="text-white">recursos que adquiriste o tenés habilitados</strong>.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/70">
              <span className="inline-block size-2 rounded-full bg-white/60 animate-pulse" />
              Cargando…
            </div>
          </div>
        ) : resources.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_0_40px_rgba(152,245,225,0.08)]">
            <h3 className="text-lg font-semibold">Todavía no tenés recursos habilitados</h3>
            <p className="text-white/70 mt-1">
              Cuando adquieras un curso o una masterclass, vas a verla acá.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 rounded-lg bg-mint text-black font-medium px-4 py-2 text-sm hover:opacity-90 transition shadow-[0_0_18px_rgba(152,245,225,0.25)]"
              >
                Ver mis opciones
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                  <path fill="currentColor" d="M13 5l7 7l-7 7v-4H4v-6h9V5z" />
                </svg>
              </Link>

              <Link
                to="/cursos"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
              >
                Explorar gratuitos
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((c) => (
                <Card3D key={c.slug} className="h-full">
                  <div className="relative overflow-hidden rounded-xl border border-white/10">
                    <div className="relative w-full aspect-[16/9]">
                      {c.thumbnail ? (
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-black/30">
                          <span className="text-white/50 text-xs">Sin imagen</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                        <ResourceBadge
                          kind={c.kind}
                          isArchive={c.isArchive}
                          level={c.level}
                        />
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h3 className="text-[18px] md:text-[20px] font-bold leading-tight drop-shadow">
                          {c.title || c.slug}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                        <span className="inline-block size-[6px] rounded-full bg-mint/80" />
                        Acceso habilitado
                      </span>
                    </div>

                    <div>
                      <Link
                        to={`/cursos/${c.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-mint text-black font-medium px-3.5 py-2 text-sm hover:opacity-90 transition shadow-[0_0_20px_rgba(152,245,225,0.25)]"
                      >
                        Ir al recurso
                        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                          <path fill="currentColor" d="M13 5l7 7l-7 7v-4H4v-6h9V5z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                to="/cursos"
                className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-white hover:bg-white/10 transition"
              >
                Explorar catálogo
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}