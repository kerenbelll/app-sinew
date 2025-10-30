// src/pages/CursoDetalle.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import FondoParticulas from "../components/FondoParticulas";
import { useUser } from "../context/UserContext";
import BuyButtons from "../components/BuyButtons";

/** Normaliza URLs de YouTube a formato /embed */
function toYouTubeEmbed(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.") || u.hostname.includes("youtube-nocookie.")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    return url;
  } catch {
    return url;
  }
}

/** Mapeo rápido ARS (MP) si tu backend usa USD en el curso */
const MP_PRICE_ARS_BY_SLUG = {
  "pro-avanzado": 34900,
  "masterclass": 34900,
};

export default function CursoDetalle() {
  const { slug } = useParams();
  const [search] = useSearchParams();
  const API = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");

  const { token } = useUser();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [paywall, setPaywall] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  // Limpia ?buy=1 del URL para que no quede pegado post-login
  useEffect(() => {
    if (search.get("buy") === "1") {
      const u = new URL(window.location.href);
      u.searchParams.delete("buy");
      window.history.replaceState({}, "", u.pathname + u.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLessons = async () => {
    const opts = token ? { headers } : {};
    const res = await fetch(`${API}/api/courses/${slug}/lessons`, opts).catch(() => null);
    if (!res) return setLessons(null);
    if (res.status === 200) {
      setLessons(await res.json());
      setPaywall(false);
    } else if (res.status === 402 || res.status === 401) {
      setLessons(null);
      setPaywall(true);
    } else {
      setLessons(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const c = await fetch(`${API}/api/courses/${slug}`).then((r) => r.json());
        if (!mounted) return;
        if (!c || c?.error) {
          setCourse(null);
          setLoading(false);
          return;
        }
        setCourse(c);

        await fetchLessons();

        // Si vino con ?paid=1 (post-pago o retorno) reintenta traer lessons
        if (search.get("paid") === "1") {
          setTimeout(fetchLessons, 600);
        }
      } catch {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API, slug, token]);

  const showPaywall =
    paywall || (course?.level === "pro" && (!Array.isArray(lessons) || lessons.length === 0));

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-black text-white">
        Cargando…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-black text-white">
        Curso no encontrado
      </div>
    );
  }

  const mpPriceARS = MP_PRICE_ARS_BY_SLUG[slug] ?? 0;
  const ppPriceUSD = course.currency?.toUpperCase() === "USD" ? course.price ?? 0 : 0;

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Partículas */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <FondoParticulas />
      </div>

      {/* Soft glows */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full blur-3xl opacity-15 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-10 bg-white" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Header compacto */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14 7l-5 5l5 5V7z" />
            </svg>
            Volver
          </Link>

          {course?.level === "pro" ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs">
              Pro
              {ppPriceUSD > 0 && (
                <span className="text-white/70">· USD {ppPriceUSD}</span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-mint text-black px-3 py-1 text-xs font-semibold">
              Gratis
            </span>
          )}
        </div>

        {/* Título + subtítulo */}
        <header className="mt-6 mb-8">
          <h1 className="text-[clamp(26px,4.6vw,40px)] font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
              {course.title}
            </span>
          </h1>
          {(course.long || course.short) && (
            <p className="text-white/70 mt-3 max-w-3xl text-[15px] leading-relaxed">
              {course.long || course.short}
            </p>
          )}
        </header>

        {/* Paywall / CTA compra */}
        {showPaywall && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 md:p-5 shadow-[0_0_45px_rgba(152,245,225,0.08)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-white/85">
                  Este es un curso <strong>Pro</strong>. Para acceder al contenido, completá la compra.
                </p>
                <p className="text-white/50 text-[12px]">
                  Si estás logueado, el acceso queda vinculado automáticamente a tu cuenta.
                </p>
              </div>

              <BuyButtons
                type="course"
                slug={slug}
                title={course.title}
                mpPriceARS={mpPriceARS}
                ppPriceUSD={ppPriceUSD}
              />
            </div>
          </div>
        )}

        {/* Contenido del curso */}
        {!showPaywall && Array.isArray(lessons) && lessons.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {lessons.map((l, i) => (
              <article
                key={`${l.title}-${i}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base md:text-lg font-semibold">
                    {i + 1}. {l.title}
                  </h3>
                  <span className="text-[11px] text-white/50">Lección</span>
                </div>

                <div className="relative w-full aspect-video overflow-hidden rounded-xl mt-3">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={toYouTubeEmbed(l.videoUrl)}
                    title={l.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        {!showPaywall && (!lessons || lessons.length === 0) && (
          <p className="text-white/60 mt-6">Aún no hay lecciones disponibles.</p>
        )}
      </div>
    </section>
  );
}