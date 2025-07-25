import React from 'react';
import heroImage from '../assets/img/sinew6.jpg';
import sinewLogo from '../assets/img/B1.png';
import useScrollReveal from '../hooks/useScrollReveal';
import TituloAnimadoHero from './TituloAnimadoHero';

const Hero = () => {
  useScrollReveal();

  return (
    <section className="relative bg-primary text-white min-h-screen flex items-center justify-center font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fondo hero"
          className="w-full h-full object-cover opacity-80 animate-slow-zoom"
        />
      </div>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 text-center px-6 max-w-3xl flex flex-col items-center">
        <img
          src={sinewLogo}
          alt="Logo SINEW"
          className="h-24 md:h-32 mb-6 animate-glow drop-shadow-lg"
        />

        <TituloAnimadoHero
          tituloPrincipal="Conectando"
          subtitulo="el Cuerpo de Cristo"
        />

        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed animate-fade-in-up delay-200">
          Somos una organización que une personas, talentos y empresas con un propósito eterno: <strong>fortalecer la infraestructura de la iglesia</strong> en los últimos tiempos.
        </p>

        <a
          href="#ramas"
          className="bg-mint text-primary font-bold py-3 px-10 rounded-full shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-white hover:text-black animate-fade-in-up delay-300 tracking-wide"
        >
CONOCE NUESTRAS RAMAS        </a>

        <a
          href="#ramas"
          className="mt-12 text-mint animate-bounce text-3xl opacity-80 hover:opacity-100 transition duration-300"
        >
          ↓
        </a>
      </div>
    </section>
  );
};

export default Hero;