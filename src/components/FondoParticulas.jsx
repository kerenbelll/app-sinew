import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const FondoParticulas = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        particles: {
          color: { value: '#a7ffeb' },
          links: {
            enable: true,
            color: '#a7ffeb',
            distance: 130,
            opacity: 0.2,
            width: 0.5,
          },
          move: { enable: true, speed: 0.6 },
          number: { value: 40 },
          opacity: { value: 0.3 },
          size: { value: 2 },
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
};

export default FondoParticulas;