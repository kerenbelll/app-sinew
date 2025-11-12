// src/components/Hero.jsx
import React, { useMemo } from "react";
import heroImage from "../assets/img/sinew6.jpg";
import useScrollReveal from "../hooks/useScrollReveal";
import TituloAnimadoHero from "./TituloAnimadoHero";
import Logo from "../assets/img/A1.png";

const Hero = () => {
  useScrollReveal();

  const isSmall = useMemo(() => {
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const w = typeof window !== "undefined" ? window.innerWidth : 800;
    return w < 640 || h <= 500;
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white font-sans"
    >
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fondo hero"
          className="w-full h-full object-cover opacity-85 gpu-smooth will-change-transform"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>

      {/* Viñeta + overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[10rem] h-[44rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[36rem] h-[10rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
      </div>

      {/* Contenido */}
      <div className="relative z-30 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
  <img
    src={Logo}
    alt="SINEW"
    className="w-[clamp(200px,42vw,560px)] h-auto mb-6 drop-shadow-[0_0_18px_rgba(152,245,225,0.35)] select-none"
    loading="eager"
    decoding="async"
    sizes="(min-width:1280px) 560px, (min-width:768px) 42vw, 80vw"
  />

        <div className="w-full">
          {isSmall ? (
            <div className="text-center uppercase leading-tight">
              <h1 className="text-[clamp(22px,7vw,34px)] font-extralight tracking-[0.35em] text-white drop-shadow-md mb-1">
                Fortaleciendo
              </h1>
              <h2 className="font-alt text-[clamp(16px,4.3vw,26px)] tracking-[0.18em] whitespace-nowrap text-transparent bg-gradient-to-r from-mint to-white bg-clip-text drop-shadow-xl">
                el cuerpo de Cristo
              </h2>
            </div>
          ) : (
            <TituloAnimadoHero
              tituloPrincipal="Fortaleciendo"
              subtitulo={"el cuerpo de\u00A0Cristo"}
            />
          )}
        </div>

        <p className="mt-4 sm:mt-6 text-base sm:text-xl text-white/85 mb-8 sm:mb-10 leading-relaxed">
          Somos un organismo que une, potencia y capacita personas, talentos y
          organizaciones para, a través de la innovación que está en Cristo,{" "}
          <strong>fortalecer a la iglesia</strong> en tiempos de presión y
          desafíos emergentes.
        </p>

        <a
          href="#ramas"
          aria-label="Conocer nuestras ramas"
          className="bg-mint text-[#0d1b2a] font-semibold py-3 px-8 sm:px-10 rounded-full shadow-[0_0_25px_rgba(152,245,225,0.35)] transition duration-300 hover:opacity-90 hover:shadow-[0_0_35px_rgba(152,245,225,0.55)]"
        >
          CONOCÉ NUESTRAS RAMAS
        </a>

        <a
          href="#ramas"
          aria-label="Ir a la sección Ramas"
          className="mt-10 sm:mt-12 text-mint text-3xl opacity-80 hover:opacity-100 transition duration-300"
        >
          ↓
        </a>
      </div>
    </section>
  );
};

export default Hero;