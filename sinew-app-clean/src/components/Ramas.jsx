// src/components/Ramas.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

import FondoParticulas from './FondoParticulas';
import TituloAnimado from './TituloAnimado';

import synergyLogo from '../assets/img/synergylogocolor.png';
import xtalentLogo from '../assets/img/xtalentcolor.png';
import corpLogo from '../assets/img/corplogocolor.png';

/** Tarjeta con efecto tilt 3D sutil y tamaño contenido */
function Card3D({ children, className = '' }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // rotación MUY suave para evitar mareo
    el.style.setProperty('--rx', `${(-y / 120).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x / 120).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', `0deg`);
    el.style.setProperty('--ry', `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`
        relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur
        p-6 md:p-7 shadow-[0_0_34px_rgba(152,245,225,0.08)]
        transition-transform duration-150 hover:scale-[1.01]
        ${className}
      `}
      style={{
        transform:
          'perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
        willChange: 'transform',
      }}
    >
      {/* glows sutiles por tarjeta */}
      <div className="pointer-events-none absolute -top-5 -right-5 size-16 rounded-full bg-mint/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-mint/10 blur-3xl" />
      {children}
    </div>
  );
}

const Ramas = () => {
  useScrollReveal();

  return (
    <section
      id="ramas"
      className="relative bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white py-32 md:py-40 px-6 md:px-10 overflow-hidden">
        
    {/* Partículas: bajo el contenido pero visibles */}
     <FondoParticulas className="z-10 opacity-90" />
     {/* Partículas: bajo el contenido pero visibles */}
      <div className="absolute inset-0 z-10 opacity-90 pointer-events-none">
        <FondoParticulas />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto text-center">
        <TituloAnimado titulo="" className="mb-10 md:mb-14" />

        {/* Grilla más compacta y ordenada */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* SYNERGY */}
          <Card3D className="flex flex-col items-center max-w-sm mx-auto" data-aos="fade-up">
            {/* Contenedor fijo para NO deformar logos */}
            <Link to="/synergy" aria-label="Ir a Synergy" className="group">
              <div className="h-24 md:h-28 w-64 md:w-80 mx-auto flex items-center justify-center">
                <img
                  src={synergyLogo}
                  alt="Synergy"
                  className="max-h-full max-w-full object-contain select-none transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_22px_rgba(167,255,235,0.7)]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>

            <p className="mt-5 max-w-xs mx-auto text-sm md:text-[0.95rem] leading-relaxed text-white/75">
            Para conocer tu propósito personal en Dios, primero necesitamos conocer Su Plan Global. Elaboramos una propuesta académica dinámica y ágil para todo aquel que busque tener un panorama del Plan de Dios para luego ir más profundo. También desarrollamos diversas masterclasses y talleres especializados. 

            </p>
          </Card3D>

          {/* XTALENT */}
          <Card3D className="flex flex-col items-center max-w-sm mx-auto" data-aos="fade-up" data-aos-delay="100">
            <Link to="/xtalent" aria-label="Ir a xTalent" className="group">
              <div className="h-24 md:h-28 w-52 md:w-60 mx-auto flex items-center justify-center">
                <img
                  src={xtalentLogo}
                  alt="xTalent"
                  className="max-h-full max-w-full object-contain select-none transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_22px_rgba(167,255,235,0.7)]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>

            <p className="mt-5 max-w-xs mx-auto text-sm md:text-[0.95rem] leading-relaxed text-white/75">
            Te ayudamos a descubrir y potenciar tu talento. Desde orientación vocacional con perspectiva de Reino hasta armados de currículums, ética laboral y bolsa de trabajo. La facción de Cristo que está en vos es ÚNICA, ¡hay que potenciarla!

            </p>
          </Card3D>

          {/* CORP */}
          <Card3D className="flex flex-col items-center max-w-sm mx-auto" data-aos="fade-up" data-aos-delay="200">
            <Link to="/corp" aria-label="Ir a Corp" className="group">
              <div className="h-24 md:h-28 w-52 md:w-52 mx-auto flex items-center justify-center">
                <img
                  src={corpLogo}
                  alt="Corp"
                  className="max-h-full max-w-full object-contain select-none transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_22px_rgba(167,255,235,0.7)]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>

            <p className="mt-5 max-w-xs mx-auto text-sm md:text-[0.95rem] leading-relaxed text-white/75">
            Impulsamos eventos y diferentes espacios de networking y gestión de proyectos para co-crear juntos. Hay mucho en el cielo para la tierra en estos tiempos, sin embargo, sólo JUNTOS podremos materializarlos.

            </p>
          </Card3D>
        </div>
      </div>
    </section>
  );
};

export default Ramas;