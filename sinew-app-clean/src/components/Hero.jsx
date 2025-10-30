// src/components/Hero.jsx
import React from 'react';
import heroImage from '../assets/img/sinew6.jpg';
import sinewLogo from '../assets/img/B1.png';
import useScrollReveal from '../hooks/useScrollReveal';
import TituloAnimadoHero from './TituloAnimadoHero';

const Hero = () => {
  useScrollReveal();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white font-sans">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fondo hero"
          className="w-full h-full object-cover opacity-85"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>

      {/* Vignette + overlay para contraste */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Glows suaves en menta */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[10rem] h-[44rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[36rem] h-[10rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
      </div>

      {/* Contenido */}
      <div className="relative z-30 text-center px-6 max-w-3xl flex flex-col items-center">
        <img
          src={sinewLogo}
          alt="Logo SINEW"
          className="h-24 md:h-32 mb-6 drop-shadow-[0_0_18px_rgba(152,245,225,0.35)]"
          loading="lazy"
          decoding="async"
        />

        {/* Evita cortes raros en “de Cristo” */}
        <div className="w-full break-keep">
          <TituloAnimadoHero
            tituloPrincipal="Fortaleciendo"
            subtitulo={'el Cuerpo de\u00A0Cristo'}
          />
        </div>

        <p className="text-lg sm:text-xl text-white/85 mb-10 leading-relaxed">
          Somos un organismo que une, potencia y capacita personas, talentos y organizaciones para, a través de la innovación que está en Cristo, <strong>fortalecer a la iglesia</strong> en tiempos de presión y desafíos emergentes.
          
        </p>

        <a
          href="#ramas"
          aria-label="Conocer nuestras ramas"
          className="bg-mint text-[#0d1b2a] font-semibold py-3 px-10 rounded-full shadow-[0_0_25px_rgba(152,245,225,0.35)] transition duration-300 hover:opacity-90 hover:shadow-[0_0_35px_rgba(152,245,225,0.55)]"
        >
          CONOCÉ NUESTRAS RAMAS
        </a>

        <a
          href="#ramas"
          aria-label="Ir a la sección Ramas"
          className="mt-12 text-mint text-3xl opacity-80 hover:opacity-100 transition duration-300"
        >
          ↓
        </a>
      </div>
    </section>
  );
};

export default Hero;