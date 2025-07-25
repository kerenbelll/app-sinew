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
    const letras = texto.toUpperCase().split('');
    return (
      <h1
        className={`text-4xl sm:text-5xl md:text-5xl font-extralight tracking-widest mb-2 ${claseExtra}`}
      >
        {letras.map((letra, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              delay: baseDelay + i * 0.04,
              duration: 0.4,
              ease: 'easeOut',
            }}
            className="inline-block mx-[2px]"
          >
            {letra === ' ' ? '\u00A0' : letra}
          </motion.span>
        ))}
      </h1>
    );
  };

  return (
    <div ref={ref} className="mb-6 text-center uppercase leading-tight">
      {/* Línea 1: CONECTANDO */}
      {renderLinea(tituloPrincipal, 'text-white drop-shadow-md')}

      {/* Línea 2: EL CUERPO DE CRISTO */}
      {renderLinea(
        subtitulo,
        'text-transparent bg-gradient-to-r from-mint to-white bg-clip-text drop-shadow-xl',
        0.6
      )}
    </div>
  );
};

export default TituloAnimadoHero;