// src/pages/Comunidad.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import useScrollReveal from "../hooks/useScrollReveal";
import FondoParticulas from "../components/FondoParticulas";

// ------------------------------------------------------------------
// Reemplazá estas rutas por tus imágenes reales.
// Podés dejar algunas comentadas hasta tenerlas.
// ------------------------------------------------------------------
// Galería
import sinew1 from "../assets/img/sinew1.jpg";
import sinew2 from "../assets/img/sinew2.jpg";
import sinew3 from "../assets/img/sinew3.jpg";
import sinew4 from "../assets/img/sinew4.jpg";
import sinew5 from "../assets/img/sinew5.jpg";
import sinew6 from "../assets/img/sinew6.jpg";
import sinew61 from "../assets/img/sinew61.jpg";

// Equipo
import rociomartinez from "../assets/img/rociomartinez.jpg";
import germanpaez from "../assets/img/germanpaez.jpg";
import matiasmartinez from "../assets/img/matiasmartinez.jpg";
import florenciaecheveriaurbina from "../assets/img/florenciaecheverriaurbina.jpg";
import yaninamartinez from "../assets/img/yaninamartinez.jpg";
import kerenmartinez from "../assets/img/kerenmartinez.jpg";
import marymundarain from "../assets/img/marymundarain.jpg";
import julietasilva from "../assets/img/julietasilva.jpg";

const GALLERY_IMAGES = [
  { src: sinew1, ratio: "aspect-[1/1]" },
  { src: sinew2, ratio: "aspect-[16/9]" },
  { src: sinew3, ratio: "aspect-[4/3]" },
  { src: sinew4, ratio: "aspect-[3/4]" },
  { src: sinew5, ratio: "aspect-[16/10]" },
  { src: sinew6, ratio: "aspect-[1/1]" },
  { src: sinew61, ratio: "aspect-[4/3]" },
];

const TEAM = [

  { name: "Germán Páez", photo: germanpaez, role: "Lic • Relaciones Públicas e Institucionales" },
  { name: "Rocío Martínez", photo: rociomartinez, role: "Manager • Social Media" },
  { name: "Matias Martínez", photo: matiasmartinez, role: "Lic • Bio Imágenes" },
  { name: "Florencia Echeverría Urbina", photo: florenciaecheveriaurbina, role: "Lic • Ciencias Biológicas" },
  { name: "Yanina Martínez", photo: yaninamartinez, role: "Lic • Relaciones Públicas e Institucionales" },
  { name: "Keren Martinez", photo: kerenmartinez, role: "Developer • Full Stack" },
  { name: "Mary Mundarain", photo: marymundarain, role: "Lic • Marketing" },
  { name: "Julieta Silva", photo: julietasilva, role: "Lic • Comunicación Social" },
];

export { GALLERY_IMAGES, TEAM };

function Card3D({ children, className = "" }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" && matchMedia("(hover: none)").matches;

  const handleMove = (e) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.setProperty("--rx", `${(-y / 80).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 80).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8 shadow-[0_0_40px_rgba(152,245,225,0.10)] transition-transform duration-150 ${className}`}
      style={{
        transform:
          "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        willChange: "transform",
      }}
    >
      {/* glows sutiles */}
      <div className="pointer-events-none absolute -top-6 -right-6 size-20 rounded-full bg-mint/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full bg-mint/10 blur-3xl" />
      {children}
    </div>
  );
}

export default function Comunidad() {
  useScrollReveal();

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Partículas por encima del fondo pero debajo del contenido */}
      <FondoParticulas wrapperZ={1} blend="screen" className="opacity-80" />

      {/* Glows de fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-10 bg-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-12 md:mb-16"
        >
  
          <h1 className="mt-3 text-[clamp(28px,4.5vw,44px)] font-extrabold tracking-tight leading-[1.05]">
            Comunidad de{" "}
            <span
              className="bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent"
              style={{ WebkitTextStroke: "0.25px rgba(255,255,255,0.15)" }}
            >
              SINEW
            </span>
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            La sección está en construcción, pero te compartimos un vistazo y
            a nuestro equipo. Pronto, más novedades.
          </p>
        </motion.div>

        {/* Aviso en construcción */}
        <Card3D className="mb-12 md:mb-16 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80">
              <span className="h-2 w-2 rounded-full bg-mint" />
              En construcción
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold">
              Te estamos preparando algo especial ✨
            </h2>
            <p className="mt-3 text-white/70 max-w-xl">
              Comunidad, actividades, testimonios, espacios presenciales y
              más… Estamos puliendo detalles para que la experiencia sea
              clara, moderna y útil.
            </p>
            <div className="mt-6 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-2/3 animate-pulse bg-mint/80" />
            </div>
          </div>
        </Card3D>

        {/* Galería de imágenes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-12 md:mb-16"
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6">
            Vistazos de nuestra comunidad
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ${img.ratio}`}
              >
                <img
                  src={img.src}
                  alt={`Comunidad ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-500 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Equipo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6">
            Nuestro equipo (primeros integrantes)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {TEAM.map((m, idx) => (
              <div
                key={m.name + idx}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center text-center">
  {/* Avatar contenedor para NO deformar */}
  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border border-white/15 bg-white/10">
    <img
      src={m.photo}
      alt={m.name}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      decoding="async"
    />
  </div>
  <div className="mt-3">
    <p className="font-medium">{m.name}</p>
    <p className="text-xs text-white/60 mt-0.5">
      {m.role || "Miembro del equipo"}
    </p>
  </div>
</div>
              </div>
            ))}
          </div>

          {/* CTA suave */}
          <div className="flex justify-center mt-10">
            <Link
              to="/"
              className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-white hover:bg-white/10 transition"
            >
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}