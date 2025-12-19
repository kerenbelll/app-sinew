// src/components/Hero.jsx
import React from "react";
import heroImage from "../assets/img/sinew6.jpg";
import useScrollReveal from "../hooks/useScrollReveal";
import Logo from "../assets/img/A1.png";

const Hero = () => {
  useScrollReveal();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white font-sans"
    >
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fondo hero"
          className="w-full h-full object-cover opacity-85 will-change-transform"
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
        {/* Logo */}
        <img
          src={Logo}
          alt="SINEW"
          className="w-[clamp(200px,42vw,560px)] h-auto mb-6 drop-shadow-[0_0_18px_rgba(152,245,225,0.35)] select-none"
          loading="eager"
          decoding="async"
          sizes="(min-width:1280px) 560px, (min-width:768px) 42vw, 80vw"
        />

        {/* Título */}
        <div className="w-full">
          <div className="text-center uppercase leading-tight">
            <h1 className="text-[clamp(22px,7vw,34px)] font-extralight tracking-[0.35em] text-white drop-shadow-md mb-1">
              Piezas distintas
            </h1>
            <h2 className="font-alt text-[clamp(16px,4.3vw,26px)] tracking-[0.18em] whitespace-nowrap text-transparent bg-gradient-to-r from-mint to-white bg-clip-text drop-shadow-xl">
              de un mismo cuerpo
            </h2>
          </div>
        </div>

        {/* Texto */}
        <div className="mt-5 sm:mt-7 max-w-3xl">
          <p className="text-base sm:text-lg text-white/85 leading-relaxed">
            SINEW es una red que <span className="text-white">impulsa</span>,{" "}
            <span className="text-white">conecta</span> y{" "}
            <span className="text-white">capacita</span> a personas y
            organizaciones para desarrollar su potencial y servir a la Iglesia
            con claridad, resiliencia y dirección.
          </p>

          <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
            Si tenés un talento, una vocación o un proyecto por activar, este
            espacio es para vos. A través de innovación con propósito,
            colaboramos con el plan de Dios para la restauración de todas las
            cosas.
          </p>

          <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* CTA */}
        <div className="mt-7 sm:mt-9 flex items-center">
          <a
            href="#ramas"
            aria-label="Explorar áreas"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm sm:text-base text-white/90 backdrop-blur
                       shadow-[0_0_25px_rgba(152,245,225,0.18)]
                       transition duration-300 hover:bg-white/10 hover:border-white/25 hover:shadow-[0_0_35px_rgba(152,245,225,0.35)]"
          >
            Explorar las 3 áreas
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        {/* Indicador scroll */}
        <a
          href="#ramas"
          aria-label="Ir a la sección Ramas"
          className="mt-10 sm:mt-12 text-mint text-2xl opacity-70 hover:opacity-100 transition duration-300"
        >
          <span aria-hidden="true">⌄</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;