// src/components/FondoParticulas.jsx
import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function FondoParticulas({
  className = "",
  wrapperZ = 1,           // <-- por defecto arriba del background/gradientes
  blend = "screen",       // <-- hace que “ilumine” sobre fondos oscuros/claros
  color = "#a7ffeb",
  number = 80,
  speed = 0.6,
  linkDistance = 130,
  opacity = 0.42,         // <-- +contraste
  sizeMin = 1.1,
  sizeMax = 2.8,
}) {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ zIndex: wrapperZ, mixBlendMode: blend }} // blend a nivel wrapper
    >
      <Particles
        init={particlesInit}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", mixBlendMode: blend }} // y también en el canvas
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
              opacity: 0.35, // +contraste en links
              width: 0.6,
            },
            move: { enable: true, speed },
            number: { value: number, density: { enable: true, area: 800 } },
            opacity: { value: opacity },
            size: { value: { min: sizeMin, max: sizeMax } },
          },
        }}
      />
    </div>
  );
}