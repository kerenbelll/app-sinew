// src/pages/Perfil.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import FondoParticulas from "../components/FondoParticulas";

// Imágenes por curso (local)
import imgComunicacion from "../assets/cursos/arbol.jpg";
import imgPro from "../assets/cursos/tecnologia.jpg";
import imgMasterclass from "../assets/cursos/renovacion.jpg";

/* =========================================================
   Utils
   ========================================================= */
const IMAGE_BY_SLUG = {
  comunicacion: imgComunicacion,
  "pro-avanzado": imgPro,
  masterclass: imgMasterclass,
};

const readToken = () =>
  (typeof window !== "undefined" && (localStorage.getItem("auth_token") || localStorage.getItem("token"))) ||
  "";

/** Card con tilt suave 3D */
function Card3D({ children, className = "" }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" && window.matchMedia && matchMedia("(hover: none)").matches;

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
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={[
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
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

/* =========================================================
   Página
   ========================================================= */
export default function Perfil() {
  const { user } = useUser();

  // API base (coherente con el resto del front)
  const API = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");
  const token = useMemo(readToken, []);
  const headers = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  // Absolutiza thumbnails del backend, pero si hay imagen local por slug, prioriza la local
  const resolveThumb = (slug, backendThumb) => {
    if (IMAGE_BY_SLUG[slug]) return IMAGE_BY_SLUG[slug];
    if (!backendThumb) return "";
    try {
      const u = new URL(backendThumb, API);
      return u.href;
    } catch {
      return backendThumb;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (!user) {
          setCourses([]);
          return;
        }

        // Asegura headers cuando hydrate tarde
        if (!token) {
          await new Promise((r) => setTimeout(r, 120));
        }
        if (!readToken()) {
          setCourses([]);
          return;
        }

        // 1) Cursos del usuario (accesos explícitos)
        const my = await fetch(`${API}/api/users/me/courses`, { headers })
          .then((r) => r.json())
          .catch(() => null);

        const ownedRaw = Array.isArray(my?.courses) ? my.courses : [];
        const owned = ownedRaw.map((c) =>
          typeof c === "string"
            ? { slug: c }
            : {
                slug: c.slug,
                title: c.title,
                thumbnail: c.thumbnail,
              }
        );

        // 2) Catálogo completo (para completar info y detectar free)
        const catalog = await fetch(`${API}/api/courses`)
          .then((r) => r.json())
          .catch(() => []);

        const bySlugCatalog = new Map(
          (Array.isArray(catalog) ? catalog : []).map((c) => [c.slug, c])
        );

        // 3) Verificar acceso real (200 en /lessons) — free o comprado
        const checks = await Promise.all(
          [...bySlugCatalog.values()].map(async (c) => {
            try {
              const r = await fetch(`${API}/api/courses/${c.slug}/lessons`, { headers });
              return { slug: c.slug, status: r.status };
            } catch {
              return { slug: c.slug, status: 0 };
            }
          })
        );
        const access200 = new Set(checks.filter((x) => x.status === 200).map((x) => x.slug));

        // 4) Unificar: owned + lo que devuelva 200
        const mapBySlug = new Map();

        for (const o of owned) {
          const cat = bySlugCatalog.get(o.slug) || {};
          mapBySlug.set(o.slug, {
            slug: o.slug,
            title: o.title || cat.title || o.slug,
            thumbnail: resolveThumb(o.slug, o.thumbnail || cat.thumbnail || ""),
            level: (cat.level || "").toLowerCase(),
          });
        }

        for (const slug of access200) {
          if (!mapBySlug.has(slug)) {
            const cat = bySlugCatalog.get(slug) || { slug };
            mapBySlug.set(slug, {
              slug,
              title: cat.title || slug,
              thumbnail: resolveThumb(slug, cat.thumbnail || ""),
              level: (cat.level || "").toLowerCase(),
            });
          } else {
            const prev = mapBySlug.get(slug);
            const cat = bySlugCatalog.get(slug) || {};
            mapBySlug.set(slug, {
              slug,
              title: prev.title || cat.title || slug,
              thumbnail: prev.thumbnail || resolveThumb(slug, cat.thumbnail || ""),
              level: prev.level || (cat.level || "").toLowerCase(),
            });
          }
        }

        const merged = Array.from(mapBySlug.values());
        if (!mounted) return;

        // Orden simple: owned primero, luego free con acceso
        const ownedSlugs = new Set(owned.map((x) => x.slug));
        const sorted = merged.sort((a, b) => {
          const ao = ownedSlugs.has(a.slug) ? 0 : 1;
          const bo = ownedSlugs.has(b.slug) ? 0 : 1;
          if (ao !== bo) return ao - bo;
          return (a.title || "").localeCompare(b.title || "");
        });

        setCourses(sorted);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [API, headers, token, user]);

  // Si por alguna razón llega sin user (ProtectedRoute normalmente lo evita)
  if (!user) {
    return (
      <section className="min-h-[60vh] grid place-items-center bg-black text-white">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-semibold">Iniciá sesión</h1>
          <p className="text-white/70">Ingresá para ver tus cursos.</p>
          <Link to="/login" className="underline">
            Ir a login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Partículas */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <FondoParticulas />
      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full blur-3xl opacity-15 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-10 bg-white" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Encabezado */}
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
            Estos son tus <strong className="text-white">cursos con acceso</strong>. Elegí por dónde
            seguir y retomá cuando quieras.
          </p>
        </div>

        {/* Grid de cursos */}
        {loading ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/70">
              <span className="inline-block size-2 rounded-full bg-white/60 animate-pulse" />
              Cargando…
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_0_40px_rgba(152,245,225,0.08)]">
            <h3 className="text-lg font-semibold">Todavía no tenés cursos</h3>
            <p className="text-white/70 mt-1">
              Mirá el catálogo y elegí tu próximo paso.
            </p>
            <div className="mt-4">
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 rounded-lg bg-mint text-black font-medium px-4 py-2 text-sm hover:opacity-90 transition shadow-[0_0_18px_rgba(152,245,225,0.25)]"
              >
                Ver catálogo
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                  <path fill="currentColor" d="M13 5l7 7l-7 7v-4H4v-6h9V5z" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => (
              <Card3D key={c.slug} className="h-full">
                {/* Media */}
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
                      <div className="absolute inset-0 grid place-items-center bg黑/30">
                        <span className="text-white/50 text-xs">Sin imagen</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                    {/* Chips nivel */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      {c.level === "free" ? (
                        <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-mint text-black shadow-[0_0_18px_rgba(152,245,225,0.45)]">
                          Gratis
                        </span>
                      ) : (
                        <span className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-white/15 border border-white/15 text-white">
                          Pro
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h3 className="text-[18px] md:text-[20px] font-bold leading-tight drop-shadow">
                        {c.title || c.slug}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="mt-4 flex flex-col gap-3">
                  {/* Eliminado: el slug debajo de la tarjeta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                        <span className="inline-block size-[6px] rounded-full bg-mint/80" />
                        {c.level === "free" ? "Acceso libre" : "Acceso habilitado"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={`/cursos/${c.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-mint text-black font-medium px-3.5 py-2 text-sm hover:opacity-90 transition shadow-[0_0_20px_rgba(152,245,225,0.25)]"
                    >
                      Ir al curso
                      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                        <path fill="currentColor" d="M13 5l7 7l-7 7v-4H4v-6h9V5z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        )}

        {/* CTA secundaria */}
        {!loading && courses.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link
              to="/cursos"
              className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-white hover:bg-white/10 transition"
            >
              Explorar más cursos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}