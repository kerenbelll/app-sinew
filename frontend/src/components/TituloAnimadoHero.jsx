import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TituloAnimadoHero = ({ tituloPrincipal, subtitulo }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  const renderLinea = (texto, claseExtra = '', baseDelay = 0) => {
    const letras = ('' + texto).toUpperCase().split('');
    return (
      <h1
        className={`leading-tight mb-2 ${claseExtra}`}
      >
        {letras.map((letra, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            variants={{ visible: { opacity: 1, y: 0 } }}
            transition={{ delay: baseDelay + i * 0.04, duration: 0.4, ease: 'easeOut' }}
            className="inline-block mx-[1px] sm:mx-[2px]"
          >
            {letra === ' ' ? '\u00A0' : letra}
          </motion.span>
        ))}
      </h1>
    );
  };

  return (
    <div ref={ref} className="mb-6 text-center uppercase leading-tight">
      {/* Línea 1 */}
      {renderLinea(
        tituloPrincipal,
        // Tamaño fluido y tracking cómodo
        'text-white drop-shadow-md text-[clamp(22px,7vw,40px)] tracking-[0.08em] sm:text-[clamp(28px,4.5vw,44px)] sm:tracking-[0.16em]'
      )}

      {/* Línea 2: SIEMPRE UNA SOLA LÍNEA EN MÓVIL */}
      {renderLinea(
        subtitulo,
        [
          'font-alt',                            // tipografía alternativa moderna
          'text-transparent bg-gradient-to-r from-mint to-white bg-clip-text drop-shadow-xl',
          'whitespace-nowrap no-hyphens',        // <- clave para que no se corte
          'text-[clamp(14px,6.8vw,28px)]',       // tamaño fluido: se achica en tel. si hace falta
          'tracking-[0.06em]',                   // tracking más cerrado en móvil
          'sm:text-[clamp(20px,4.2vw,36px)]',    // en desktop sube cómodo
          'sm:tracking-[0.14em]'
        ].join(' '),
        0.6
      )}
    </div>
  );
};

export default TituloAnimadoHero;