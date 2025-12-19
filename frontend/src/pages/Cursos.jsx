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

/* ===== Card 3D SUAVE ===== */
function Card3D({ children, className = "" }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const handleMove = (e) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.setProperty("--rx", `${(-y / 120).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 120).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={[
        "group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[0_0_28px_rgba(0,0,0,0.55)]",
        "transition-transform duration-150 hover:scale-[1.01]",
        className,
      ].join(" ")}
      style={{
        transform:
          "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
      }}
    >
      {children}
    </div>
  );
}

/* ===== CTA estilo Hero ===== */
function HeroLikeButton({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-white backdrop-blur
                 transition duration-300 hover:bg-white/10 hover:border-white/30"
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export default function Cursos() {
  return (
    <section className="relative min-h-screen bg-[#060b14] text-white overflow-hidden">
      {/* Partículas */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
        <FondoParticulas />
      </div>

      {/* Oscurecimiento global */}
      <div className="absolute inset-0 z-0 bg-black/65 pointer-events-none" />

      {/* Glows periféricos MUY suaves */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
        <div className="absolute -bottom-40 -right-40 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/70">
            <span className="h-[6px] w-[6px] rounded-full bg-mint/80" />
            Catálogo
          </span>

          <h1 className="mt-3 text-[clamp(28px,4.2vw,44px)] font-extrabold">
            Cursos de{" "}
            <span className="bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
              SINEW
            </span>
          </h1>

          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Elegí tu punto de partida y seguí tu propio ritmo.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cursos.map((c, idx) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * idx }}
            >
              <Card3D className="h-full">
                <div className="flex h-full flex-col p-4 md:p-5">
                  <div className="relative overflow-hidden rounded-xl border border-white/10">
                    <div className="relative aspect-[16/9]">
                      <img
                        src={c.img}
                        alt={c.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                      <div className="absolute top-2 left-2 text-[11px] font-semibold px-2 py-1 rounded-full bg-black/60">
                        {c.nivel}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 font-semibold">
                        {c.titulo}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-white/85 text-sm leading-relaxed">
                    {c.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {c.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/80"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <HeroLikeButton to={c.to}>{c.cta}</HeroLikeButton>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-white hover:bg-white/10 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}