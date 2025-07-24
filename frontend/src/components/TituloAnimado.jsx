import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TituloAnimado = ({ titulo }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  const letras = titulo.toUpperCase().split('');

  return (
    <h2
      ref={ref}
      className="text-4xl md:text-6xl font-light tracking-widest text-white text-center mb-16 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
      {letras.map((letra, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            delay: i * 0.06,
            duration: 0.35,
            ease: 'easeOut',
          }}
          className="inline-block mx-[2px]"
        >
          {letra === ' ' ? '\u00A0' : letra}
        </motion.span>
      ))}
    </h2>
  );
};

export default TituloAnimado;