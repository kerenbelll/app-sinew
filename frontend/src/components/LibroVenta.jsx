// src/components/LibroVenta.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import FondoParticulas from "./FondoParticulas";
import portada2 from "../assets/img/portada.jpg";

/* ===== CTA estilo Hero (glass + flecha) ===== */
function GlassButton({ to, children, className = "", ariaLabel }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={[
        "group inline-flex w-full items-center justify-center gap-2",
        "rounded-full border border-white/15 bg-white/5 px-6 py-3",
        "text-sm sm:text-base text-white/90 backdrop-blur",
        "shadow-[0_0_25px_rgba(152,245,225,0.18)]",
        "transition duration-300",
        "hover:bg-white/10 hover:border-white/25 hover:shadow-[0_0_35px_rgba(152,245,225,0.35)]",
        "focus:outline-none focus:ring-2 focus:ring-mint/50",
        className,
      ].join(" ")}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

/* ===== Variante primaria sutil (más “acción”) pero sin romper estética ===== */
function GlassPrimaryButton({ to, children, ariaLabel }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={[
        "group inline-flex w-full items-center justify-center gap-2",
        "rounded-full border border-mint/40 bg-mint/15 px-6 py-3",
        "text-sm sm:text-base text-white backdrop-blur",
        "shadow-[0_0_28px_rgba(152,245,225,0.22)]",
        "transition duration-300",
        "hover:bg-mint/20 hover:border-mint/55 hover:shadow-[0_0_40px_rgba(152,245,225,0.35)]",
        "focus:outline-none focus:ring-2 focus:ring-mint/50",
      ].join(" ")}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

export default function LibroVenta() {
  return (
    <motion.section
      id="libroventa"
      className="relative min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white overflow-hidden px-6 py-28 md:py-36"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
    >
      {/* Glows (fondo) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
        <div className="absolute -bottom-32 right-1/3 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
      </div>

      {/* Partículas encima de glows */}
      <FondoParticulas className="z-10" />

      {/* Contenido */}
      <div className="relative z-20 max-w-6xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative mx-auto w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-10 shadow-[0_0_60px_rgba(152,245,225,0.08)]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide font-grotesk text-mint drop-shadow-[0_0_14px_rgba(167,255,235,0.9)]">
              Hábitos Integrativos
            </h2>
            <span className="block mx-auto mt-4 h-1 w-28 rounded-full bg-mint/80" />
            <p className="text-white/80 text-lg md:text-xl font-sans mt-6">
              Pequeña guía para unificar espíritu, alma y cuerpo
            </p>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
            {/* Portada */}
            <motion.div
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={portada2}
                alt="Portada libro Hábitos Integrativos"
                className="w-full max-w-[320px] object-cover rounded-2xl select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                draggable={false}
                loading="lazy"
              />
            </motion.div>

            {/* Texto */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-left text-white/90 font-sans text-base leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p>
                <strong className="text-mint font-semibold tracking-wide">
                  HÁBITOS INTEGRATIVOS
                </strong>{" "}
                es una invitación práctica y bíblica a restaurar la unidad e
                integridad interior mediante disciplinas espirituales simples
                pero poderosas.
              </p>
              <p>
                En un mundo que fragmenta nuestra atención y separa lo
                espiritual de lo cotidiano, este libro propone volver a una vida
                integral, alineada con el diseño de Dios que nos alista mientras
                nos acercamos al fin de la era. Nos brinda herramientas para
                cultivar aceite y estar atentos al tiempo.
              </p>

              <blockquote className="border-l-4 border-mint pl-6 italic text-mint bg-white/10 py-5 rounded-xl shadow-[inset_0_0_12px_rgba(167,255,235,0.2)]">
                “Y el mismo Dios de paz os santifique por completo; y todo
                vuestro ser, espíritu, alma y cuerpo, sea guardado irreprensible
                PARA LA VENIDA DE NUESTRO SEÑOR JESUCRISTO.”
                <span className="text-sm block mt-2 text-mint/80">
                  (1 Tesalonicenses 5:23 - énfasis del autor)
                </span>
              </blockquote>

              <p>
                Cada capítulo explora una disciplina —como la meditación bíblica,
                la escritura de la Palabra o el ayuno— con fundamentos bíblicos
                claros y respaldo científico. No se trata de rituales vacíos,
                sino de herramientas concretas para renovar nuestra mente y
                entrenarnos como discípulos en esta generación.
              </p>
              <p>
                El objetivo no es imponer cargas, sino ofrecer caminos claros
                para que la Mente de Cristo se forme en nosotros. Al unificar
                pensamientos, emociones, cuerpo y espíritu, el carácter de Jesús
                crece con mayor plenitud, y nuestra vida entera se convierte en
                una ofrenda viva.
              </p>
            </motion.div>
          </div>

          {/* Footer CTA (botones modernizados) */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-5 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-2xl font-bold text-mint drop-shadow-[0_0_14px_rgba(167,255,235,0.9)]">
              Precio: 12900 AR
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary sutil (no sólido) */}
              <GlassPrimaryButton to="/checkout" ariaLabel="Comprar ahora">
                Comprar ahora
              </GlassPrimaryButton>

              {/* Secondary glass */}
              <GlassButton to="/login" ariaLabel="Iniciar sesión">
                Iniciar sesión
              </GlassButton>
            </div>

            <div className="w-full mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-2/3 animate-pulse bg-mint/80" />
            </div>
          </motion.div>

          {/* Glows decorativos suaves */}
          <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-mint/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-mint/10 blur-3xl" />
        </motion.div>
      </div>
    </motion.section>
  );
}