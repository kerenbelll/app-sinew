// src/pages/Cursos.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FondoParticulas from "../components/FondoParticulas";

import imgComunicacion from "../assets/cursos/arbol.jpg";
import imgPro from "../assets/cursos/tecnologia.jpg";
import imgMasterclass from "../assets/cursos/renovacion.jpg";

/* ===== data (SIN CAMBIOS DE CONTENIDO) ===== */
const cursos = [
  {
    slug: "comunicacion",
    titulo: "El Padre, el Árbol y el Maestro",
    nivel: "Gratis",
    img: imgComunicacion,
    descripcion:
      "¿Peleas con el pecado y ciclos que se repiten en el tiempo? ¿Sentís que estás atrapado y no podés salir? ¡El primer paso es ser hijos! Pero para ser hijos debemos ser estudiantes primero. El Padre busca un corazón dispuesto a aprender. Tanto un Padre, como un árbol y un maestro tienen en común que se reproducen y trascienden. Se replican en otros. Así es como El Padre quiere restaurar Su Imagen en nosotros nuevamente; enseñándonos. Aprende los fundamentos para desarrollar una relación sana con Dios y dar frutos en abundancia.",
    cta: "Ver gratis",
    to: "/cursos/comunicacion",
    chips: ["Restauración", "Fundamentos", "Relación"],
  },
  {
    slug: "pro-avanzado",
    titulo: "Comunicación, tecnología y el plan de Dios",
    nivel: "Pro",
    img: imgPro,
    descripcion:
      "¿Te abruma el avance vertiginoso de la tecnología? ¿Te sentís confundido por los medios, las noticias y las ideologías? ¿Será que el antisemitisimo y el avance del Islam están ajenos a la agenda de Dios? ¿Qué hacemos con la IA? ¿Y la computación cuántica? Encontrá el lugar de la tecnología y las ideologías dentro del Plan de Dios, a Él no se le escapa nada y todo tiene un propósito dentro de Su voluntad. Aprende a entender los tiempos y a convertirte en una señal que apunte a Cristo en medio de la oscuridad. Isacar observaba estrellas para entender las temporadas ¿Qué observamos nosotros?",
    cta: "Ver detalles",
    to: "/cursos/pro-avanzado",
    chips: ["Tecnología", "Ideologías", "Tiempo"],
  },
  {
    slug: "masterclass",
    titulo: "Renovación de la Mente",
    nivel: "Pro",
    img: imgMasterclass,
    descripcion:
      "¿Te sentís dividido internamente? ¿Te cuesta conciliar tu llamado con tu trabajo o estudios? O incluso, ¿Tenés dificultades para entender qué es lo que Dios espera de vos? En este curso recibirás herramientas bíblicas practicas para renovar tu mente y, así, entender la buena, agradable y perfecta voluntad de Dios. Tenemos que salir del viejo paradigma caído y renovarnos a lo nuevo. Tenemos la mente de Cristo, ¡Desarrollémosla!",
    cta: "Ver detalles",
    to: "/cursos/masterclass",
    chips: ["Llamado", "Mentalidad", "Herramientas bíblicas"],
  },
];

/* ===== Card 3D con tilt SUAVE (coherente con Ramas) ===== */
function Card3D({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty("--rx", `${(-y / 120).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 120).toFixed(2)}deg`);
  };
  const handleLeave = () => {
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
      className={[
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "p-4 md:p-5 shadow-[0_0_34px_rgba(152,245,225,0.08)]",
        "transition-transform duration-150 hover:scale-[1.01]",
        className,
      ].join(" ")}
      style={{
        transform:
          "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        willChange: "transform",
      }}
    >
      <div className="pointer-events-none absolute -top-4 -right-4 size-14 rounded-full bg-mint/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-mint/10 blur-3xl" />
      {children}
    </div>
  );
}

export default function Cursos() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Partículas */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <FondoParticulas />
      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full blur-3xl opacity-15 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-10 bg-white" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/60">
            <span className="h-[6px] w-[6px] rounded-full bg-mint/80" />
            Catálogo
          </span>

          <h1 className="mt-3 text-[clamp(28px,4.2vw,44px)] font-extrabold tracking-tight leading-[1.05]">
            Cursos de{" "}
            <span className="bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
              SINEW
            </span>
          </h1>

          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Elegí tu punto de partida y seguí tu propio ritmo.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {cursos.map((c, idx) => {
            const to = c.to; // 👈 sin ?buy=1
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 * idx }}
              >
                <Card3D className="h-full">
                  {/* Media */}
                  <div className="relative overflow-hidden rounded-xl border border-white/10">
                    <div className="relative w-full aspect-[16/9]">
                      <img
                        src={c.img}
                        alt={c.titulo}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide
                          ${c.nivel === "Gratis"
                              ? "bg-mint text-black shadow-[0_0_18px_rgba(152,245,225,0.45)]"
                              : "bg-white/15 border border-white/15 text-white"}`}
                        >
                          {c.nivel}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h3 className="text-[18px] md:text-[20px] font-bold leading-tight drop-shadow">
                          {c.titulo}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-4 flex flex-col gap-3">
                    <p className="text-white/75 text-[13.5px] leading-relaxed">
                      {c.descripcion}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {c.chips.map((chip) => (
                        <span
                          key={chip}
                          className="select-none rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/80 hover:bg-mint/10 hover:text-white transition"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1">
                      <Link
                        to={to}
                        className="inline-flex items-center gap-2 rounded-lg bg-mint text-black font-medium px-3.5 py-2 text-sm hover:opacity-90 transition shadow-[0_0_20px_rgba(152,245,225,0.25)]"
                      >
                        {c.cta}
                        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                          <path fill="currentColor" d="M13 5l7 7l-7 7v-4H4v-6h9V5z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>

        {/* Volver */}
        <div className="flex justify-center mt-12">
          <Link
            to="/"
            className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-white hover:bg-white/10 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}