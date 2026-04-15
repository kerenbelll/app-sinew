import React, { useEffect, useMemo, useRef, useState } from "react";
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

function splitTitleAndTeacher(rawTitle = "") {
  const parts = String(rawTitle).split(" - ");
  if (parts.length >= 2) {
    return {
      title: parts[0].trim(),
      teacher: parts.slice(1).join(" - ").trim(),
    };
  }
  return {
    title: rawTitle,
    teacher: "",
  };
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
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

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

function IconPlay({ paused = false }) {
  return paused ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.55-6.86a1 1 0 0 0 0-1.68L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
    </svg>
  );
}

function IconVolume({ muted = false }) {
  return muted ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M14 5.23v2.06a4 4 0 0 1 0 9.42v2.06A6 6 0 0 0 14 5.23ZM3 10v4h4l5 4V6L7 10H3Zm14.59 2L20 9.59 18.59 8.17 16.17 10.6l-2.42-2.42-1.42 1.41L14.76 12l-2.43 2.41 1.42 1.42 2.42-2.42 2.42 2.42 1.41-1.42L17.59 12Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M3 10v4h4l5 4V6L7 10H3Zm11.5 2a3.5 3.5 0 0 0-2.5-3.35v6.7A3.5 3.5 0 0 0 14.5 12Zm0-7.77v2.06a6 6 0 0 1 0 11.42v2.06a8 8 0 0 0 0-15.54Z" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M7 3H3v4h2V5h2V3Zm14 0h-4v2h2v2h2V3ZM5 17H3v4h4v-2H5v-2Zm16 0h-2v2h-2v2h4v-4Z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M18.3 5.71 12 12l6.3 6.29-1.42 1.42L10.59 13.4 4.29 19.7 2.87 18.3 9.17 12l-6.3-6.29L4.29 4.3l6.3 6.3 6.29-6.3Z" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M15.5 6.5 9.5 12l6 5.5V6.5Zm-7 0L2.5 12l6 5.5V6.5Z" />
    </svg>
  );
}

function IconForward() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M8.5 6.5V17.5l6-5.5-6-5.5Zm7 0V17.5l6-5.5-6-5.5Z" />
    </svg>
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
        compact ? "h-10 w-10 text-[13px]" : "h-10 min-w-10 px-3.5 text-[12px] sm:text-sm",
        active
          ? "border border-mint/30 bg-mint/14 text-mint hover:bg-mint hover:text-black"
          : "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function VideoPlayer({
  lesson,
  poster,
  fullscreen = false,
  state,
  actions,
  playerRef,
}) {
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
    setMuted,
    seekRelative,
    openExpanded,
    closeExpanded,
  } = actions;

  const [chromeVisible, setChromeVisible] = useState(!fullscreen);
  const canPlay = Boolean(lesson?.videoUrl && ReactPlayer.canPlay(lesson.videoUrl));
  const progressPercent = duration > 0 ? Math.min((playedSeconds / duration) * 100, 100) : 0;
  const showPoster = !!poster && !playing && playedSeconds < 0.5;

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
          <>
            <div className="absolute inset-0 z-0">
              <ReactPlayer
                ref={playerRef}
                url={lesson.videoUrl}
                width="100%"
                height="100%"
                playing={playing}
                controls={false}
                volume={volume}
                muted={muted}
                playsinline
                onDuration={(d) => setDuration(d)}
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
              />
            </div>

            {showPoster && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 z-20 group"
                aria-label="Reproducir video"
              >
                <img
                  src={poster}
                  alt={lesson?.title || "Portada del video"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,20,0.18)_0%,rgba(6,11,20,0.30)_50%,rgba(6,11,20,0.68)_100%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-[0_0_30px_rgba(0,0,0,0.35)] transition duration-300 group-hover:scale-105 group-hover:bg-mint group-hover:text-black">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current translate-x-[1px]">
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.55-6.86a1 1 0 0 0 0-1.68L9.53 4.29A1 1 0 0 0 8 5.14Z" />
                    </svg>
                  </span>
                </div>
              </button>
            )}
          </>
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
                  Abrir en YouTube
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
                <IconClose />
              </ControlButton>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4 md:px-5 md:pb-5">
              <div className="pointer-events-auto">
                <div className="mb-3">
                  <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
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
                    <ControlButton onClick={() => seekRelative(-10)} label="Retroceder 10 segundos" compact>
                      <IconBack />
                    </ControlButton>

                    <ControlButton onClick={togglePlay} label={playing ? "Pausar" : "Reproducir"} active compact>
                      <IconPlay paused={!playing} />
                    </ControlButton>

                    <ControlButton onClick={() => seekRelative(10)} label="Avanzar 10 segundos" compact>
                      <IconForward />
                    </ControlButton>

                    <ControlButton
                      onClick={() => {
                        setMuted((v) => !v);
                        showChrome();
                      }}
                      label={muted ? "Activar audio" : "Silenciar"}
                      compact
                    >
                      <IconVolume muted={muted} />
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
                        className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-3 text-[12px] sm:text-sm font-medium text-white hover:bg-white/[0.10] transition"
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
            <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
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

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <ControlButton onClick={() => seekRelative(-10)} label="Retroceder 10 segundos" compact>
                <IconBack />
              </ControlButton>

              <ControlButton onClick={togglePlay} label={playing ? "Pausar" : "Reproducir"} active compact>
                <IconPlay paused={!playing} />
              </ControlButton>

              <ControlButton onClick={() => seekRelative(10)} label="Avanzar 10 segundos" compact>
                <IconForward />
              </ControlButton>

              <ControlButton
                onClick={() => setMuted((v) => !v)}
                label={muted ? "Activar audio" : "Silenciar"}
                compact
              >
                <IconVolume muted={muted} />
              </ControlButton>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
              <span className="text-[12px] sm:text-sm text-white/70 tabular-nums">
                {formatTime(playedSeconds)} / {formatTime(duration)}
              </span>

              <button
                type="button"
                onClick={openExpanded}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-3 py-2 text-[12px] sm:text-sm font-medium text-mint hover:bg-mint hover:text-black transition"
              >
                <IconExpand />
                Ver grande
              </button>

              {lesson?.videoUrl ? (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-3 py-2 text-[12px] sm:text-sm font-medium text-white hover:bg-white/[0.10] transition"
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

  const inlinePlayerRef = useRef(null);
  const fullscreenPlayerRef = useRef(null);

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
  const [volume] = useState(0.85);
  const [muted, setMuted] = useState(false);

  const paidSuccess =
    searchParams.get("paid") === "1" || searchParams.get("success") === "1";

  const isFree = String(course?.level || "").toLowerCase() === "free";
  const isMasterclass = String(course?.kind || "") === "masterclass";
  const canBuy = course && !isFree && !hasAccess;
  const selectedLesson = lessons[selectedLessonIndex] || null;
  const selectedPoster = selectedLesson?.thumbnail || course?.thumbnail || "";

  const { title: displayTitle, teacher: teacherName } = useMemo(
    () => splitTitleAndTeacher(course?.title || ""),
    [course?.title]
  );

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

  const seekPlayersTo = (seconds) => {
    const safe = Math.max(0, Math.min(duration || 0, seconds));

    [inlinePlayerRef.current, fullscreenPlayerRef.current].forEach((ref) => {
      if (ref?.seekTo) {
        try {
          ref.seekTo(safe, "seconds");
        } catch {
          // no-op
        }
      }
    });

    setPlayedSeconds(safe);
  };

  const seekRelative = (delta) => {
    seekPlayersTo(playedSeconds + delta);
  };

  const actions = {
    setPlaying,
    setPlayed,
    setPlayedSeconds,
    setLoadedSeconds,
    setDuration,
    setMuted,
    seekRelative,
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
        <div className="absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.08] blur-3xl" />
        <div className="absolute top-[18%] left-[4%] h-[22rem] w-[22rem] rounded-full bg-white opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-[8%] right-[6%] h-[24rem] w-[24rem] rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] opacity-15">
        <FondoParticulas opacity={0.1} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8 xl:px-10 py-5 md:py-8">
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
              className="rounded-[24px] md:rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
            >
              <div className="p-5 sm:p-6 md:p-7 xl:p-8">
                <div className="max-w-5xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                        isFree
                          ? "bg-mint text-black"
                          : "border border-white/14 bg-white/[0.06] text-white"
                      }`}
                    >
                      {isMasterclass ? "Masterclass" : "Curso"}
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

                  <h1 className="mt-4 text-[clamp(24px,3.2vw,40px)] font-semibold leading-[1.02] tracking-tight text-white">
                    {displayTitle}
                  </h1>

                  {teacherName ? (
                    <p className="mt-3 text-[12px] md:text-[13px] font-medium uppercase tracking-[0.12em] text-white/62">
                      Docente: {teacherName}
                    </p>
                  ) : null}

                  {course.short ? (
                    <p className="mt-4 max-w-3xl text-[14px] sm:text-[15px] md:text-[16px] leading-7 text-white/76">
                      {course.short}
                    </p>
                  ) : null}

                  <div className="mt-6 h-px w-full bg-gradient-to-r from-white/12 via-white/8 to-transparent" />

                  <div className="mt-6">
                    <SectionEyebrow>Descripción</SectionEyebrow>

                    {paidSuccess && (
                      <div className="mt-4 max-w-3xl rounded-2xl border border-mint/20 bg-mint/10 px-4 py-3 text-sm text-mint">
                        Pago registrado correctamente. Ya podés acceder al contenido.
                      </div>
                    )}

                    {course.long ? (
                      <p
                        className={`max-w-4xl text-[14px] sm:text-[15px] md:text-[16px] leading-7 text-white/68 ${
                          paidSuccess ? "mt-4" : "mt-3"
                        }`}
                      >
                        {course.long}
                      </p>
                    ) : (
                      <p className="mt-3 max-w-4xl text-[14px] sm:text-[15px] md:text-[16px] leading-7 text-white/68">
                        Este recurso ya está disponible para que puedas explorarlo y avanzar a tu ritmo.
                      </p>
                    )}

                    {!hasAccess && !isFree && (
                      <div className="mt-6">
                        {needsLogin ? (
                          <button
                            type="button"
                            onClick={handleLogin}
                            className="inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-5 py-3 text-sm md:text-[15px] font-medium text-mint hover:bg-mint hover:text-black transition"
                          >
                            Iniciar sesión para comprar
                          </button>
                        ) : canBuy || needsPayment ? (
                          <button
                            type="button"
                            onClick={handleBuy}
                            className="inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-5 py-3 text-sm md:text-[15px] font-medium text-mint hover:bg-mint hover:text-black transition"
                          >
                            {isMasterclass ? "Comprar acceso" : "Comprar curso"}
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="contenido-curso"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-6 md:mt-8"
            >
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6 xl:gap-8">
                <div className="xl:col-span-8 order-1">
                  <div className="rounded-[24px] md:rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
                    <div className="p-4 sm:p-5 md:p-7 xl:p-8 border-b border-white/10">
                      <SectionEyebrow>Reproducción</SectionEyebrow>
                      <h2 className="mt-3 md:mt-4 text-[clamp(20px,2.4vw,30px)] font-semibold leading-[1.02] tracking-tight text-white">
                        {selectedLesson?.title || "Contenido del recurso"}
                      </h2>
                    </div>

                    {hasAccess && selectedLesson ? (
                      <div className="p-3 sm:p-4 md:p-6 xl:p-8">
                        {!isExpandedPlayerOpen && (
                          <VideoPlayer
                            lesson={selectedLesson}
                            poster={selectedPoster}
                            fullscreen={false}
                            state={state}
                            actions={actions}
                            playerRef={inlinePlayerRef}
                          />
                        )}

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 md:px-5 py-4">
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
                        <h2 className="mt-3 md:mt-4 text-[clamp(20px,2.2vw,28px)] font-semibold leading-[1.02] tracking-tight text-white">
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
                      <h2 className="mt-3 md:mt-4 text-[clamp(20px,2vw,28px)] font-semibold leading-[1.02] tracking-tight text-white">
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
                        poster={selectedPoster}
                        fullscreen={true}
                        state={state}
                        actions={actions}
                        playerRef={fullscreenPlayerRef}
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