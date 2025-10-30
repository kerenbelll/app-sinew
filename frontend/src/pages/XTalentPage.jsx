import React, { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";
import FondoParticulas from "../components/FondoParticulas";
import xtalentLogo from "../assets/img/xtalentcolor.png";

export default function XTalentPage() {
  useScrollReveal();
  const cardRef = useRef(null);
  const isTouch = typeof window !== "undefined" && matchMedia("(hover: none)").matches;

  const handleMove = (e) => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.setProperty("--rx", `${(-y / 40).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${(x / 40).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
  };

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <FondoParticulas />
      </div>

      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -bottom-24 right-1/2 translate-x-1/2 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 md:py-36">
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="group relative mx-auto w-full md:w-[48rem] rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 md:p-12 shadow-[0_0_60px_rgba(152,245,225,0.08)]"
          style={{
            transform: "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
            transition: "transform 120ms ease",
          }}
        >
          {/* Contenedor de logo (NO se deforma) */}
          <div className="h-24 sm:h-28 md:h-32 lg:h-36 w-full flex items-center justify-center">
            <img
              src={xtalentLogo}
              alt="xTalent"
              className="h-full w-auto object-contain select-none pointer-events-none drop-shadow-[0_0_8px_rgba(152,245,225,0.25)]"
              draggable="false"
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="mt-6 text-center text-white/80 text-base md:text-lg">
            Página en construcción. ¡Estamos trabajando para colaborar con vos!
          </p>

          <div className="mt-10 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/2 animate-pulse bg-mint/80" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["Vocación", "Mentorías", "CV", "Ética laboral"].map((t) => (
              <span
                key={t}
                className="select-none rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 hover:bg-mint/10 hover:text-white transition"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/"
              className="rounded-xl bg-mint text-black font-medium px-5 py-2.5 hover:opacity-90 transition shadow-[0_0_30px_rgba(152,245,225,0.25)]"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="pointer-events-none absolute -top-10 left-1/3 size-24 rounded-full bg-mint/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 right-8 size-36 rounded-full bg-mint/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}