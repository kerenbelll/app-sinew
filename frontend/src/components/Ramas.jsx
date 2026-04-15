// src/components/Ramas.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";

import FondoParticulas from "./FondoParticulas";
import TituloAnimado from "./TituloAnimado";

import synergyLogo from "../assets/img/synergylogocolor.png";
import xtalentLogo from "../assets/img/xtalentcolor.png";
import corpLogo from "../assets/img/corplogocolor.png";

/** Card con tilt 3D muy sutil */
function Card3D({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.setProperty("--rx", `${(-y / 160).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 160).toFixed(2)}deg`);
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
        "relative overflow-hidden rounded-[28px] border border-white/10",
        "bg-[#0f1a2c]/88 backdrop-blur-2xl",
        "shadow-[0_0_34px_rgba(152,245,225,0.06)]",
        "transition-transform duration-200 hover:scale-[1.01]",
        "h-full isolate",
        className,
      ].join(" ")}
      style={{
        transform:
          "perspective(1100px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        willChange: "transform",
      }}
    >
      <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-mint/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-full bg-mint/8 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_28%,transparent_72%,rgba(255,255,255,0.015))]" />
      {children}
    </article>
  );
}

function RamaCard({
  to,
  logo,
  logoAlt,
  title,
  subtitle,
  paragraphs,
  bullets,
}) {
  return (
    <Card3D className="w-full">
      <div className="relative z-10 flex h-full flex-col p-7 md:p-8 xl:p-9 text-left">
        <Link to={to} aria-label={`Ir a ${logoAlt}`} className="group">
          <div className="mx-auto flex items-center justify-center h-28 md:h-32 xl:h-36 w-full">
            <img
              src={logo}
              alt={logoAlt}
              className="max-h-24 md:max-h-28 xl:max-h-32 max-w-[84%] object-contain select-none transition-transform duration-300 group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_24px_rgba(167,255,235,0.45)]"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>

        <div className="mt-5">
          <h3 className="text-lg md:text-xl xl:text-[22px] font-semibold tracking-tight text-white">
            {title}
          </h3>

          {subtitle ? (
            <p className="mt-2 text-sm md:text-[15px] leading-6 text-white/68">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />
        </div>

        <div className="mt-5 flex-1">
          <div className="space-y-4 text-sm md:text-[15px] xl:text-[15.5px] leading-7 text-white/78">
            {paragraphs?.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>

          {bullets?.length ? (
            <ul className="mt-4 space-y-2 text-sm md:text-[15px] leading-7 text-white/78 list-disc pl-5">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-7">
          <Link
            to={to}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/82 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            Ver más
            <span aria-hidden="true" className="opacity-80">
              →
            </span>
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
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-20 md:py-24 xl:py-28 flex items-center"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-28">
        <FondoParticulas />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-mint/8 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[8%] h-[22rem] w-[22rem] rounded-full bg-white/4 blur-3xl" />
        <div className="absolute bottom-[10%] left-[6%] h-[18rem] w-[18rem] rounded-full bg-mint/8 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10" />

      <div className="relative z-20 w-full max-w-[1800px] mx-auto">
        <div className="text-center mb-12 md:mb-14 xl:mb-16">
          <TituloAnimado titulo="" className="mb-0" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-10 2xl:gap-12 items-stretch">
          <div data-aos="fade-up" className="flex">
            <RamaCard
              to="/cursos"
              logo={synergyLogo}
              logoAlt="Synergy"
              title="Formación Bíblica Integral"
              subtitle="Para descubrir tu propósito en Dios, primero necesitás comprender Su Plan en la historia."
              paragraphs={[
                "Ofrecemos una formación bíblica, integral y accesible para quienes desean entender la Biblia como un todo antes de profundizar en áreas específicas.",
                "Desarrollamos cursos, masterclasses y talleres dinámicos, pensados para personas con agendas exigentes que desean formarse con solidez doctrinal sin descuidar otras responsabilidades.",
              ]}
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="flex">
            <RamaCard
              to="/xtalent"
              logo={xtalentLogo}
              logoAlt="xTalent"
              title="Talento y Vocación"
              subtitle="Te acompañamos en el descubrimiento y desarrollo de los dones, talentos y capacidades que Dios puso en vos."
              paragraphs={[
                "Ofrecemos orientación vocacional con perspectiva bíblica, recursos y herramientas prácticas como armado de CV, manuales, capacitaciones, bolsa de trabajo y conexiones estratégicas, entre otros.",
                "Creemos que el trabajo es parte esencial del llamado del creyente y que cada miembro cumple una función única dentro del cuerpo de Cristo. Activar esa responsabilidad es clave para vivir tu vocación con propósito.",
              ]}
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="200" className="flex">
            <RamaCard
              to="/red-sinew"
              logo={corpLogo}
              logoAlt="Corp"
              title="Networking y Proyectos"
              subtitle="Generamos espacios de encuentro, colaboración y desarrollo de proyectos para profesionales que desean aplicar su vocación al servicio del cuerpo de Cristo."
              paragraphs={[
                "Pensado para universitarios, emprendedores, empresarios y líderes que buscan conectar estratégicamente, desarrollar iniciativas y fortalecer aquello que Dios puso bajo su responsabilidad.",
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ramas;