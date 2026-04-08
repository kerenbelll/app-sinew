// src/components/FondoParticulas.jsx
import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function FondoParticulas({
  className = "",
  wrapperZ = 1,
  blend = "normal",
  color = "#a7ffeb",
  number = 65,
  speed = 0.5,
  linkDistance = 120,
  opacity = 0.16,
  sizeMin = 0.8,
  sizeMax = 2.1,
}) {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ zIndex: wrapperZ, mixBlendMode: blend }}
    >
      <Particles
        init={particlesInit}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", mixBlendMode: blend }}
        options={{
          fullScreen: { enable: false },
          detectRetina: true,
          fpsLimit: 60,
          background: { color: "transparent" },
          particles: {
            color: { value: color },
            links: {
              enable: true,
              color,
              distance: linkDistance,
              opacity: 0.08,
              width: 0.5,
            },
            move: {
              enable: true,
              speed,
            },
            number: {
              value: number,
              density: { enable: true, area: 900 },
            },
            opacity: {
              value: opacity,
            },
            size: {
              value: { min: sizeMin, max: sizeMax },
            },
          },
        }}
      />
    </div>
  );
}