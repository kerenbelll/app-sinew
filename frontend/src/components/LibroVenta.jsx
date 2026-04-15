// src/components/LibroVenta.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import FondoParticulas from "./FondoParticulas";
import portada2 from "../assets/img/portada.jpg";

function GlassButton({ to, children, className = "", ariaLabel }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={[
        "group inline-flex w-full items-center justify-center gap-2",
        "rounded-full border border-white/12 bg-white/[0.04] px-6 py-3",
        "text-sm sm:text-base text-white/90 backdrop-blur-md",
        "transition duration-300",
        "hover:bg-white/[0.08] hover:border-white/20",
        "focus:outline-none focus:ring-2 focus:ring-mint/40",
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

function GlassPrimaryButton({ to, children, ariaLabel }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={[
        "group inline-flex w-full items-center justify-center gap-2",
        "rounded-full border border-mint/25 bg-mint/10 px-6 py-3",
        "text-sm sm:text-base text-white backdrop-blur-md",
        "transition duration-300",
        "hover:bg-mint/16 hover:border-mint/40",
        "focus:outline-none focus:ring-2 focus:ring-mint/40",
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
      className="relative overflow-hidden bg-[#0b1222] text-white px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-20 md:py-24 xl:py-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.8 }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[10%] h-[22rem] w-[22rem] rounded-full bg-[#98f5e1]/[0.05] blur-3xl" />
      </div>

      <FondoParticulas className="pointer-events-none z-10 opacity-28" />

      <div className="relative z-20 mx-auto w-full max-w-[1800px]">
        <motion.div
          whileHover={{ scale: 1.003 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_25%,transparent_75%,rgba(255,255,255,0.015))]" />
            <div className="absolute top-0 left-[12%] h-[16rem] w-[16rem] rounded-full bg-white/[0.03] blur-3xl" />
            <div className="absolute bottom-0 right-[8%] h-[14rem] w-[14rem] rounded-full bg-[#98f5e1]/[0.04] blur-3xl" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
            {/* Cover digital */}
            <motion.div
              className="xl:col-span-4 border-b xl:border-b-0 xl:border-r border-white/10 p-6 sm:p-8 md:p-10 xl:p-12 flex items-center justify-center"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div className="w-full max-w-[320px] sm:max-w-[360px] xl:max-w-[390px]">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-3 md:p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                  <div className="relative rounded-[22px] overflow-hidden bg-[#0f1728]">
                    <img
                      src={portada2}
                      alt="Portada e-book Hábitos Integrativos"
                      className="w-full h-auto object-contain select-none"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-white/8 rounded-[22px]" />
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/68">
                    <span className="h-2 w-2 rounded-full bg-mint/80" />
                    E-book digital
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contenido */}
            <motion.div
              className="xl:col-span-8 p-6 sm:p-8 md:p-10 xl:p-12 2xl:p-14"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="max-w-4xl">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                  E-book
                </p>

                <h2 className="mt-4 text-[clamp(30px,4vw,58px)] font-semibold tracking-tight leading-[0.95] text-white">
                  Hábitos Integrativos
                </h2>

                <p className="mt-4 text-white/72 text-[16px] md:text-[20px] leading-7 md:leading-8">
                  Pequeña guía para unificar espíritu, alma y cuerpo
                </p>

                <div className="mt-6 h-px w-24 bg-gradient-to-r from-white/35 to-transparent" />
              </div>

              <div className="mt-8 grid grid-cols-1 2xl:grid-cols-12 gap-8 xl:gap-10">
                <div className="2xl:col-span-8 space-y-5 text-white/88 text-[15px] md:text-[16px] leading-7 md:leading-8">
                  <p>
                    <strong className="text-white font-semibold tracking-wide">
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

                  <blockquote className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-5 md:px-6 md:py-6 text-white/90 italic shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    “Y el mismo Dios de paz os santifique por completo; y todo
                    vuestro ser, espíritu, alma y cuerpo, sea guardado irreprensible
                    PARA LA VENIDA DE NUESTRO SEÑOR JESUCRISTO.”
                    <span className="block mt-3 text-sm text-white/60 not-italic">
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
                </div>

                <div className="2xl:col-span-4">
                  <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5 md:p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                   Disponible ahora
                  </p>

                  <p className="mt-3 text-[20px] md:text-[24px] font-semibold text-white">
                   ARS 12.900
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3">
  <GlassPrimaryButton
    to="/checkout"
    ariaLabel="Continuar a la compra"
  >
    Continuar a la compra
  </GlassPrimaryButton>

  <p className="text-[12px] leading-5 text-white/50 text-center">
  Podrás ingresar o crear tu cuenta en el siguiente paso.
</p>
</div>

                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-2/3 animate-pulse bg-mint/70" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}