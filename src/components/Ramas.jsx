import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

import FondoParticulas from './FondoParticulas';
import TituloAnimado from './TituloAnimado';

import synergyLogo from '../assets/img/synergylogocolor.png';
import xtalentLogo from '../assets/img/xtalentcolor.png';
import corpLogo from '../assets/img/corplogocolor.png';

const Ramas = () => {
  useScrollReveal();

  return (
    <section
      id="ramas"
      className="relative bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white py-40 px-6 overflow-hidden"
      // aumenté py-32 a py-40 para más espacio vertical
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FondoParticulas />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        

        <div className="mt-20 grid md:grid-cols-3 gap-28">
          {/* aumenté gap-20 a gap-28 para más separación entre columnas */}

          {/* SYNERGY */}
          <div className="flex flex-col items-center space-y-8" data-aos="fade-up">
            {/* aumenté space-y-6 a space-y-8 para más espacio vertical entre elementos */}
            <Link to="/synergy">
              <img
                src={synergyLogo}
                alt="Synergy"
                className="h-28 hover:scale-105 transition-transform duration-300 hover:drop-shadow-[0_0_18px_rgba(167,255,235,0.65)]"
                // aumenté h-24 a h-28 para imagen más grande
              />
            </Link>
            <p className="text-white/80 text-base leading-relaxed max-w-xs">
              Formación espiritual y académica con perspectiva eterna. Conocé el plan de Dios y vivilo con intención.
            </p>
            <Link to="/synergy">
              <button className="border border-mint text-mint text-sm font-medium py-2 px-6 rounded-full hover:bg-mint hover:text-black transition z-20">
                Ver más
              </button>
            </Link>
          </div>

          {/* XTALENT */}
          <div className="flex flex-col items-center space-y-8" data-aos="fade-up" data-aos-delay="100">
            <Link to="/xtalent">
              <img
                src={xtalentLogo}
                alt="Xtalent"
                className="h-28 hover:scale-105 transition-transform duration-300 hover:drop-shadow-[0_0_18px_rgba(167,255,235,0.65)]"
              />
            </Link>
            <p className="text-white/80 text-base leading-relaxed max-w-xs">
              Descubrí tus talentos con visión de Reino. Potenciá tus dones y canalizalos con propósito.
            </p>
            <Link to="/xtalent">
              <button className="border border-mint text-mint text-sm font-medium py-2 px-6 rounded-full hover:bg-mint hover:text-black transition z-20">
                Ver más
              </button>
            </Link>
          </div>

          {/* CORP */}
          <div className="flex flex-col items-center space-y-8" data-aos="fade-up" data-aos-delay="200">
            <Link to="/corp">
              <img
                src={corpLogo}
                alt="Corp"
                className="h-28 hover:scale-105 transition-transform duration-300 hover:drop-shadow-[0_0_18px_rgba(167,255,235,0.65)]"
              />
            </Link>
            <p className="text-white/80 text-base leading-relaxed max-w-xs">
              Networking y soporte en gestión de proyectos con impacto eterno. Conectá con visión y propósito.
            </p>
            <Link to="/corp">
              <button className="border border-mint text-mint text-sm font-medium py-2 px-6 rounded-full hover:bg-mint hover:text-black transition z-20">
                Ver más
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ramas;