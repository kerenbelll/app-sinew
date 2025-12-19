// src/components/Ramas.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";

import FondoParticulas from "./FondoParticulas";
import TituloAnimado from "./TituloAnimado";

import synergyLogo from "../assets/img/synergylogocolor.png";
import xtalentLogo from "../assets/img/xtalentcolor.png";
import corpLogo from "../assets/img/corplogocolor.png";

/** Card con tilt 3D MUY sutil, pero con layout controlado */
function Card3D({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty("--rx", `${(-y / 140).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 140).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={[
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[0_0_34px_rgba(152,245,225,0.08)]",
        "transition-transform duration-200 hover:scale-[1.01]",
        className,
      ].join(" ")}
      style={{
        transform:
          "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        willChange: "transform",
      }}
    >
      {/* Glows sutiles */}
      <div className="pointer-events-none absolute -top-6 -right-6 size-20 rounded-full bg-mint/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-mint/10 blur-3xl" />
      {children}
    </article>
  );
}

/** Bloque de contenido para mantener consistencia entre cards */
function RamaCard({ to, logo, logoAlt, title, subtitle, paragraphs, bullets, logoBoxClass = "" }) {
  return (
    <Card3D className="mx-auto w-full max-w-md">
      <div className="flex h-full flex-col p-6 md:p-7">
        {/* Logo */}
        <Link to={to} aria-label={`Ir a ${logoAlt}`} className="group">
          <div
            className={[
              "mx-auto flex items-center justify-center",
              "h-28 md:h-32 w-full",
              "rounded-xl border border-white/5 bg-white/[0.02]",
              "transition-colors duration-200 group-hover:bg-white/[0.04]",
              logoBoxClass,
            ].join(" ")}
          >
            <img
              src={logo}
              alt={logoAlt}
              className="max-h-20 md:max-h-24 max-w-[85%] object-contain select-none transition-transform duration-300 group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_22px_rgba(167,255,235,0.65)]"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>

        {/* Separador */}
        <div className="mt-5">
          <h3 className="text-base md:text-lg font-semibold tracking-wide text-white">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-xs md:text-sm text-white/70">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Texto */}
        <div className="mt-4 flex-1">
          <div className="space-y-3 text-sm md:text-[0.95rem] leading-relaxed text-white/75">
            {paragraphs?.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>

          {bullets?.length ? (
            <ul className="mt-4 space-y-2 text-sm md:text-[0.95rem] leading-relaxed text-white/75 list-disc pl-5">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* CTA sutil (opcional, pero suma orden visual) */}
        <div className="mt-6">
          <Link
            to={to}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs md:text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Ver más
            <span aria-hidden="true" className="opacity-80">→</span>
          </Link>
        </div>
      </div>
    </Card3D>
  );
}

const Ramas = () => {
  useScrollReveal();

  return (
    <section
      id="ramas"
      className="relative overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white py-32 md:py-40 px-6 md:px-10"
    >
      {/* Partículas: una sola capa, detrás del contenido */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-90">
        <FondoParticulas />
      </div>

      <div className="relative z-20 mx-auto max-w-6xl text-center">
        <TituloAnimado titulo="" className="mb-10 md:mb-14" />

        {/* Grid consistente */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-stretch">
          {/* SYNERGY */}
          <div data-aos="fade-up" className="flex">
            <RamaCard
              to="/synergy"
              logo={synergyLogo}
              logoAlt="Synergy"
              title="Formación Bíblica Integral"
              subtitle="Visión clara del Plan de Dios y comprensión global de la Biblia."
              paragraphs={[
                "Para descubrir tu propósito en Dios, primero necesitás conocer Su Plan Global.",
                "Ofrecemos una propuesta académica y dinámica para construir una base sólida antes de profundizar en áreas específicas.",
              ]}
              bullets={[
                "Cursos, masterclasses y talleres especializados.",
                "Formato ágil y liviano, ideal para agendas cargadas.",
                "Enfoque integral: comprensión, aplicación y continuidad.",
              ]}
              logoBoxClass="min-h-[8rem]"
            />
          </div>

          {/* XTALENT */}
          <div data-aos="fade-up" data-aos-delay="100" className="flex">
            <RamaCard
              to="/xtalent"
              logo={xtalentLogo}
              logoAlt="xTalent"
              title="Talento y Vocación"
              subtitle="Acompañamiento práctico con perspectiva de Reino."
              paragraphs={[
                "Te acompañamos en el descubrimiento y desarrollo del talento que Dios puso en vos.",
                "El sacerdocio en el trabajo es parte del llamado de cada creyente y la facción de Cristo que está en vos es única. Activarla es clave para tu propósito.",
              ]}
              bullets={[
                "Orientación vocacional.",
                "Armado de CV y perfil profesional.",
                "Ética laboral, empleabilidad y conexiones estratégicas.",
              ]}
              logoBoxClass="min-h-[8rem]"
            />
          </div>

          {/* CORP */}
          <div data-aos="fade-up" data-aos-delay="200" className="flex">
            <RamaCard
              to="/corp"
              logo={corpLogo}
              logoAlt="Corp"
              title="Networking y Proyectos"
              subtitle="Espacios, eventos e iniciativas de impacto."
              paragraphs={[
                "Generamos espacios de networking, eventos y proyectos para co-crear lo que Dios quiere manifestar en la tierra.",
                "Pensado para quienes desean desarrollar iniciativas, conectar con otros y expandir lo que Dios puso en sus manos.",
              ]}
              bullets={[
                "Universitarios, emprendedores, empresarios y líderes.",
                "Colaboración y comunidad con propósito.",
                "Proyectos de impacto y crecimiento sostenible.",
              ]}
              logoBoxClass="min-h-[8rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ramas;