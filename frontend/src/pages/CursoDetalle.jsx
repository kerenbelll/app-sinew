import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import FondoParticulas from "../components/FondoParticulas";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");

function readToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
}

function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-white/45 ${className}`}>
      {children}
    </p>
  );
}

function formatPrice(course) {
  const price = Number(course?.price || 0);
  const currency = String(course?.currency || "USD").toUpperCase();
  return price ? `${currency} ${price.toFixed(0)}` : "Gratis";
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function isInteractiveTarget(target) {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable ||
    target.closest?.("button,a,[role='button']")
  );
}

function ControlButton({ onClick, label, active = false, children, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "inline-flex items-center justify-center rounded-full transition",
        compact ? "h-10 w-10 text-[13px]" : "h-9 min-w-9 px-3 text-[12px] sm:text-sm",
        active
          ? "border border-mint/30 bg-mint/14 text-mint hover:bg-mint hover:text-black"
          : "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function VideoPlayer({ lesson, fullscreen = false, state, actions }) {
  const {
    playing,
    playedSeconds,
    loadedSeconds,
    duration,
    volume,
    muted,
  } = state;

  const {
    setPlaying,
    setPlayed,
    setPlayedSeconds,
    setLoadedSeconds,
    setDuration,
    setVolume,
    setMuted,
    openExpanded,
    closeExpanded,
  } = actions;

  const [chromeVisible, setChromeVisible] = useState(!fullscreen);
  const canPlay = Boolean(lesson?.videoUrl && ReactPlayer.canPlay(lesson.videoUrl));
  const progressPercent = duration > 0 ? Math.min((playedSeconds / duration) * 100, 100) : 0;

  useEffect(() => {
    let timer;
    if (fullscreen) {
      setChromeVisible(true);
      if (playing) {
        timer = setTimeout(() => setChromeVisible(false), 2200);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [fullscreen, playing, lesson?.videoUrl]);

  const showChrome = () => {
    if (!fullscreen) return;
    setChromeVisible(true);
  };

  const togglePlay = () => {
    setPlaying((v) => !v);
    showChrome();
  };

  const handleCloseFromBackdrop = (e) => {
    if (!fullscreen) return;
    if (e.target !== e.currentTarget) return;
    closeExpanded();
  };

  return (
    <div
      className={`overflow-hidden rounded-[18px] md:rounded-[24px] border border-white/10 bg-[#050810] ${
        fullscreen ? "h-full flex flex-col" : ""
      }`}
    >
      <div
        className={`relative bg-black ${fullscreen ? "flex-1 min-h-0" : "aspect-video"}`}
        onMouseMove={showChrome}
        onTouchStart={showChrome}
      >
        {canPlay ? (
          <ReactPlayer
            src={lesson.videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            controls={false}
            volume={volume}
            muted={muted}
            playsInline
            onDurationChange={(d) => setDuration(d)}
            onProgress={({ played, playedSeconds, loadedSeconds }) => {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
              setLoadedSeconds(loadedSeconds || 0);
            }}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  playsinline: 1,
                },
              },
            }}
            style={{ position: "absolute", inset: 0 }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-black/30 p-5 text-center">
            <div>
              <p className="text-sm text-white/70">No se pudo cargar el reproductor de este video.</p>
              {lesson?.videoUrl ? (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-4 py-2.5 text-sm font-medium text-mint hover:bg-mint hover:text-black transition"
                >
                  Abrir en YouTube →
                </a>
              ) : null}
            </div>
          </div>
        )}

        {fullscreen && canPlay && (
          <div
            className={[
              "absolute inset-0 transition-opacity duration-200",
              chromeVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onClick={handleCloseFromBackdrop}
          >
            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute top-3 right-3 z-30">
              <ControlButton onClick={closeExpanded} label="Cerrar" compact>
                ✕
              </ControlButton>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4 md:px-5 md:pb-5">
              <div className="pointer-events-auto">
                <div className="mb-3">
                  <div className="relative h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-white/20"
                      style={{
                        width: duration > 0 ? `${Math.min((loadedSeconds / duration) * 100, 100)}%` : "0%",
                      }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full bg-mint"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ControlButton onClick={togglePlay} label={playing ? "Pausar" : "Reproducir"} active compact>
                      {playing ? "❚❚" : "▶"}
                    </ControlButton>

                    <ControlButton
                      onClick={() => {
                        setMuted((v) => !v);
                        showChrome();
                      }}
                      label={muted ? "Activar audio" : "Silenciar"}
                      compact
                    >
                      {muted ? "🔇" : "🔊"}
                    </ControlButton>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <span className="text-[12px] sm:text-sm text-white/75 tabular-nums">
                      {formatTime(playedSeconds)} / {formatTime(duration)}
                    </span>

                    {lesson?.videoUrl ? (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-3 text-[12px] sm:text-sm font-medium text-white hover:bg-white/[0.10] transition"
                      >
                        YouTube
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!fullscreen && canPlay && (
        <div className="border-t border-white/10 bg-[#08101f] px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
          <div className="mb-3">
            <div className="relative h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-white/20"
                style={{
                  width: duration > 0 ? `${Math.min((loadedSeconds / duration) * 100, 100)}%` : "0%",
                }}
              />
              <div
                className="absolute left-0 top-0 h-full bg-mint"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <ControlButton onClick={togglePlay} label={playing ? "Pausar" : "Reproducir"} active compact>
                {playing ? "❚❚" : "▶"}
              </ControlButton>

              <ControlButton
                onClick={() => setMuted((v) => !v)}
                label={muted ? "Activar audio" : "Silenciar"}
                compact
              >
                {muted ? "🔇" : "🔊"}
              </ControlButton>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-[12px] sm:text-sm text-white/70 tabular-nums">
                {formatTime(playedSeconds)} / {formatTime(duration)}
              </span>

              <button
                type="button"
                onClick={openExpanded}
                className="inline-flex min-h-9 items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-3 py-2 text-[12px] sm:text-sm font-medium text-mint hover:bg-mint hover:text-black transition"
              >
                Ver grande
              </button>

              {lesson?.videoUrl ? (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-3 py-2 text-[12px] sm:text-sm font-medium text-white hover:bg-white/[0.10] transition"
                >
                  YouTube
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MaterialCard({ item }) {
  return (
    <a
      href={item.fileUrl}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:bg-white/[0.07] transition"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
        {item.type || "material"}
      </p>
      <h3 className="mt-1 text-[15px] md:text-[16px] font-medium text-white leading-6">
        {item.title}
      </h3>
      <span className="mt-3 inline-flex items-center gap-2 text-sm text-mint">
        Abrir material →
      </span>
    </a>
  );
}

export default function CursoDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = readToken();
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [error, setError] = useState("");
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [loadedSeconds, setLoadedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);

  const paidSuccess =
    searchParams.get("paid") === "1" || searchParams.get("success") === "1";

  const isFree = String(course?.level || "").toLowerCase() === "free";
  const isMasterclass = String(course?.kind || "") === "masterclass";
  const canBuy = course && !isFree && !hasAccess;
  const selectedLesson = lessons[selectedLessonIndex] || null;

  useEffect(() => {
    let mounted = true;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");
        setNeedsLogin(false);
        setNeedsPayment(false);
        setSelectedLessonIndex(0);
        setIsExpandedPlayerOpen(false);

        const detailRes = await fetch(`${API_BASE}/api/courses/${slug}`);
        if (!detailRes.ok) {
          if (detailRes.status === 404) throw new Error("Recurso no encontrado");
          throw new Error("No se pudo cargar el recurso");
        }

        const detail = await detailRes.json();
        if (!mounted) return;
        setCourse(detail);

        const isFreeResource = String(detail?.level || "").toLowerCase() === "free";

        const [lessonsRes, materialsRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses/${slug}/lessons`, { headers }),
          fetch(`${API_BASE}/api/courses/${slug}/materials`, { headers }),
        ]);

        if (!mounted) return;

        let hasLessonsAccess = false;
        let hasMaterialsAccess = false;

        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json();
          setLessons(Array.isArray(lessonsData) ? lessonsData : []);
          hasLessonsAccess = true;
        } else if (lessonsRes.status === 401) {
          setNeedsLogin(!isFreeResource);
        } else if (lessonsRes.status === 402) {
          setNeedsPayment(true);
        } else if (isFreeResource) {
          setError("No se pudieron cargar las lecciones.");
        }

        if (materialsRes.ok) {
          const materialsData = await materialsRes.json();
          setMaterials(Array.isArray(materialsData) ? materialsData : []);
          hasMaterialsAccess = true;
        } else if (materialsRes.status === 401) {
          if (!isFreeResource) setNeedsLogin(true);
        } else if (materialsRes.status === 402) {
          setNeedsPayment(true);
        }

        setHasAccess(isFreeResource || hasLessonsAccess || hasMaterialsAccess);
      } catch (err) {
        if (mounted) setError(err?.message || "Ocurrió un error al cargar el recurso.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCourse();
    return () => {
      mounted = false;
    };
  }, [headers, slug]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (isExpandedPlayerOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isExpandedPlayerOpen]);

  useEffect(() => {
    setPlaying(false);
    setPlayed(0);
    setPlayedSeconds(0);
    setLoadedSeconds(0);
    setDuration(0);
  }, [selectedLessonIndex, slug]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space") return;
      if (isInteractiveTarget(e.target)) return;
      if (!hasAccess || !selectedLesson) return;
      e.preventDefault();
      setPlaying((v) => !v);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasAccess, selectedLesson]);

  const actions = {
    setPlaying,
    setPlayed,
    setPlayedSeconds,
    setLoadedSeconds,
    setDuration,
    setVolume,
    setMuted,
    openExpanded: () => setIsExpandedPlayerOpen(true),
    closeExpanded: () => setIsExpandedPlayerOpen(false),
  };

  const state = {
    playing,
    played,
    playedSeconds,
    loadedSeconds,
    duration,
    volume,
    muted,
  };

  const handleBuy = () => {
    navigate(`/checkout?type=course&course=${encodeURIComponent(slug)}`, {
      state: {
        productType: isMasterclass ? "masterclass" : "course",
        courseSlug: slug,
      },
    });
  };

  const handleLogin = () => {
    navigate("/login", { state: { from: `/cursos/${slug}` } });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.08] blur-3xl" />
        <div className="absolute top-[18%] left-[4%] h-[22rem] w-[22rem] rounded-full bg-white opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-[8%] right-[6%] h-[24rem] w-[24rem] rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] opacity-15">
        <FondoParticulas opacity={0.1} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-5 md:py-8">
        <div className="mb-4 md:mb-6">
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/82 hover:bg-white/[0.08] transition"
          >
            ← Volver a recursos
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[24px] md:rounded-[28px] border border-white/10 bg-white/[0.04] p-6 md:p-8 text-white/65">
            Cargando recurso...
          </div>
        ) : error ? (
          <div className="rounded-[24px] md:rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 md:p-8 text-red-100">
            {error}
          </div>
        ) : course ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 2xl:grid-cols-12">
                <div className="2xl:col-span-8">
                  <div className="relative overflow-hidden">
                    <div className="relative h-[200px] sm:h-[260px] md:h-[360px] xl:h-[460px] 2xl:h-[520px]">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="eager"
                          decoding="async"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-black/30" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,20,0.12)_0%,rgba(6,11,20,0.18)_46%,rgba(6,11,20,0.58)_100%)]" />
                    </div>

                    <div className="border-t border-white/10 bg-[#060b14]/88 backdrop-blur-md p-4 sm:p-5 md:p-7 xl:p-8 2xl:p-10">
                      <SectionEyebrow>
                        {isMasterclass ? "Masterclass" : "Curso"}
                      </SectionEyebrow>

                      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="max-w-4xl">
                          <h1 className="text-[clamp(24px,5vw,58px)] font-semibold leading-[0.96] tracking-tight text-white">
                            {course.title}
                          </h1>

                          {course.short ? (
                            <p className="mt-4 max-w-3xl text-[15px] sm:text-[16px] md:text-[18px] leading-7 md:leading-9 text-white/76">
                              {course.short}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                              isFree
                                ? "bg-mint text-black"
                                : "border border-white/14 bg-white/[0.06] text-white"
                            }`}
                          >
                            {isFree ? "Gratis" : "Pro"}
                          </span>

                          <span className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[12px] text-white/76">
                            {formatPrice(course)}
                          </span>

                          {course.isArchive && (
                            <span className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[12px] text-white/76">
                              Archivo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="2xl:col-span-4 border-t 2xl:border-t-0 2xl:border-l border-white/10">
                  <div className="flex h-full flex-col p-4 sm:p-5 md:p-7 xl:p-8 2xl:p-10">
                    {paidSuccess && (
                      <div className="rounded-2xl border border-mint/20 bg-mint/10 px-4 py-3 text-sm text-mint">
                        Pago registrado correctamente. Ya podés acceder al contenido.
                      </div>
                    )}

                    {course.long ? (
                      <p
                        className={`text-[14px] sm:text-[15px] md:text-[16px] leading-7 md:leading-8 text-white/68 ${
                          paidSuccess ? "mt-5" : ""
                        }`}
                      >
                        {course.long}
                      </p>
                    ) : null}

                    <div className="mt-6 2xl:mt-auto 2xl:pt-7 flex flex-col gap-3">
                      {hasAccess ? (
                        <a
                          href="#contenido-curso"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-5 py-3 text-sm md:text-[15px] font-medium text-mint hover:bg-mint hover:text-black transition"
                        >
                          Ir al contenido →
                        </a>
                      ) : isFree ? (
                        <a
                          href="#contenido-curso"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-5 py-3 text-sm md:text-[15px] font-medium text-mint hover:bg-mint hover:text-black transition"
                        >
                          Ver gratis →
                        </a>
                      ) : needsLogin ? (
                        <button
                          type="button"
                          onClick={handleLogin}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-5 py-3 text-sm md:text-[15px] font-medium text-mint hover:bg-mint hover:text-black transition"
                        >
                          Iniciar sesión para comprar →
                        </button>
                      ) : canBuy || needsPayment ? (
                        <button
                          type="button"
                          onClick={handleBuy}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-5 py-3 text-sm md:text-[15px] font-medium text-mint hover:bg-mint hover:text-black transition"
                        >
                          {isMasterclass ? "Comprar acceso" : "Comprar curso"} →
                        </button>
                      ) : null}

                      <Link
                        to="/cursos"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm md:text-[15px] font-medium text-white hover:bg-white/[0.10] transition"
                      >
                        Explorar más
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="contenido-curso"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-6 md:mt-10"
            >
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6 xl:gap-8">
                <div className="xl:col-span-8 order-1">
                  <div className="rounded-[24px] md:rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
                    <div className="p-4 sm:p-5 md:p-7 xl:p-8 border-b border-white/10">
                      <SectionEyebrow>Reproducción</SectionEyebrow>
                      <h2 className="mt-3 md:mt-4 text-[clamp(20px,2.8vw,38px)] font-semibold leading-[1.02] tracking-tight text-white">
                        {selectedLesson?.title || "Contenido del recurso"}
                      </h2>
                    </div>

                    {hasAccess && selectedLesson ? (
                      <div className="p-3 sm:p-4 md:p-6 xl:p-8">
                        {!isExpandedPlayerOpen && (
                          <VideoPlayer
                            lesson={selectedLesson}
                            fullscreen={false}
                            state={state}
                            actions={actions}
                          />
                        )}

                        <div className="mt-4 md:mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 md:px-5 py-4">
                          <p className="text-[12px] uppercase tracking-[0.18em] text-white/40">
                            Ahora viendo
                          </p>
                          <h3 className="mt-1 text-[16px] md:text-[20px] font-medium text-white leading-7">
                            {selectedLesson.title}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 md:p-8 text-white/65">
                        {needsLogin
                          ? "Iniciá sesión para acceder al contenido."
                          : needsPayment
                          ? "Este recurso es Pro. Compralo para desbloquear el reproductor y los materiales."
                          : "Todavía no hay una clase disponible para reproducir."}
                      </div>
                    )}
                  </div>

                  {hasAccess && materials.length > 0 && (
                    <div className="mt-5 md:mt-6 rounded-[24px] md:rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
                      <div className="p-4 sm:p-5 md:p-7 xl:p-8 border-b border-white/10">
                        <SectionEyebrow>Materiales</SectionEyebrow>
                        <h2 className="mt-3 md:mt-4 text-[clamp(20px,2.4vw,32px)] font-semibold leading-[1.02] tracking-tight text-white">
                          Recursos complementarios
                        </h2>
                      </div>

                      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materials.map((item, index) => (
                          <MaterialCard key={`${item.title}-${index}`} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="xl:col-span-4 order-2">
                  <div className="xl:sticky xl:top-8 rounded-[24px] md:rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
                    <div className="p-4 sm:p-5 md:p-7 xl:p-8 border-b border-white/10">
                      <SectionEyebrow>Lecciones</SectionEyebrow>
                      <h2 className="mt-3 md:mt-4 text-[clamp(20px,2.2vw,32px)] font-semibold leading-[1.02] tracking-tight text-white">
                        Contenido
                      </h2>
                    </div>

                    {hasAccess && lessons.length > 0 ? (
                      <div className="p-3 md:p-4 space-y-3 max-h-[65vh] overflow-auto">
                        {lessons.map((lesson, index) => {
                          const active = index === selectedLessonIndex;

                          return (
                            <button
                              key={`${lesson.title}-${index}`}
                              type="button"
                              onClick={() => setSelectedLessonIndex(index)}
                              className={`w-full text-left rounded-2xl border px-4 py-4 transition ${
                                active
                                  ? "border-mint/30 bg-mint/10"
                                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                              }`}
                            >
                              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                                Lección {index + 1}
                              </p>
                              <h3 className="mt-1 text-[15px] md:text-[16px] font-medium text-white leading-6">
                                {lesson.title}
                              </h3>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-5 md:p-8 text-white/60">
                        {needsLogin
                          ? "Iniciá sesión para ver las lecciones."
                          : needsPayment
                          ? "Comprá el recurso para desbloquear las lecciones."
                          : "Todavía no hay lecciones disponibles."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {isExpandedPlayerOpen &&
              hasAccess &&
              selectedLesson &&
              typeof document !== "undefined" &&
              createPortal(
                <div className="fixed inset-0 z-[2147483647] bg-black">
                  <div className="h-full w-full p-0 sm:p-2 md:p-4">
                    <div className="mx-auto h-full w-full max-w-[1800px]">
                      <VideoPlayer
                        lesson={selectedLesson}
                        fullscreen={true}
                        state={state}
                        actions={actions}
                      />
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </>
        ) : null}
      </div>
    </section>
  );
}