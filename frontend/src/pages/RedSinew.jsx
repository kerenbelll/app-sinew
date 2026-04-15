import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FondoParticulas from "../components/FondoParticulas";
import corpLogo from "../assets/img/corplogocolor.png";

function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-white/42 ${className}`}>
      {children}
    </p>
  );
}

function InfoBlock({ title, text, className = "" }) {
  return (
    <div
      className={`rounded-[24px] md:rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-5 md:px-7 md:py-7 h-full ${className}`}
    >
      <h3 className="text-[15px] md:text-[16px] font-semibold text-white">
        {title}
      </h3>
      <p className="mt-3 text-white/72 text-[14px] md:text-[15px] leading-6 md:leading-7">
        {text}
      </p>
    </div>
  );
}

export default function RedSinew() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1222] to-transparent z-0" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[18%] left-[10%] h-[24rem] w-[24rem] rounded-full bg-white opacity-[0.035] blur-3xl" />
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.08] blur-3xl" />
        <div className="absolute bottom-[8%] right-[8%] h-[26rem] w-[26rem] rounded-full bg-[#98f5e1] opacity-[0.06] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] opacity-15">
        <FondoParticulas opacity={0.1} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-12 md:pt-16 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto w-full max-w-[1920px] mb-16 md:mb-24"
        >
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(152,245,225,0.08),transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,transparent_70%,rgba(255,255,255,0.015))]" />

            <div className="relative z-10 flex items-center justify-center px-5 sm:px-8 md:px-10 xl:px-16 2xl:px-24 py-14 sm:py-16 md:py-20 xl:py-24 2xl:py-28">
              <div className="w-full max-w-[1200px] text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="mb-6 md:mb-7 flex justify-center"
                >
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm shadow-[0_0_24px_rgba(152,245,225,0.08)]">
                    Área Corp
                  </span>
                </motion.div>

              

                <SectionEyebrow className="mt-7 md:mt-8">Red SINEW</SectionEyebrow>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.28 }}
                  className="mt-4 md:mt-5 text-[clamp(24px,4.8vw,68px)] font-semibold tracking-tight leading-[0.96] text-white"
                >
                  Creemos en el valor
                  <span className="block bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
                    del cuerpo unido
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.38 }}
                  className="mt-5 md:mt-6 max-w-[980px] mx-auto text-[14px] sm:text-[15px] md:text-[18px] xl:text-[20px] leading-7 md:leading-8 xl:leading-9 text-white/70"
                >
                  Espacio para conectar con otros según rubro, talento o vocación,
                  generando oportunidades que edifiquen el Reino.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scaleX: 0.7 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mx-auto mt-8 md:mt-10 h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-white/28 to-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.56 }}
                  className="mt-8 md:mt-10"
                >
                  <Link
                    to="/unirme-red"
                    className="inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-6 md:px-7 py-3 text-sm md:text-base text-mint hover:bg-mint hover:text-black transition-all duration-300 shadow-[0_0_24px_rgba(152,245,225,0.16)]"
                  >
                    Unirme a la red
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mx-auto w-full max-w-[1920px]"
        >
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(340px,0.9fr)_minmax(900px,1.7fr)] gap-10 xl:gap-20 2xl:gap-28 items-start">
            <div className="xl:pt-2">
              <div className="xl:sticky xl:top-28 max-w-[560px]">
                <SectionEyebrow>Qué es la red</SectionEyebrow>

                <h2 className="mt-4 text-[clamp(22px,2.4vw,42px)] font-semibold leading-[1.06] tracking-tight text-white max-w-[15ch]">
                  Un espacio de conexión con propósito
                </h2>

                <div className="mt-6 h-px w-24 bg-gradient-to-r from-mint/70 to-transparent" />

                <div className="mt-6 space-y-5 text-white/72 text-[14px] md:text-[16px] xl:text-[17px] leading-7 md:leading-8">
                  <p>
                    La Red SINEW busca vincular personas, talentos y trayectorias que puedan fortalecerse mutuamente.
                  </p>
                  <p>
                    No se trata solo de networking, sino de generar vínculos, colaboración y oportunidades alineadas a una misma visión.
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 xl:gap-7">
                <InfoBlock
                  title="Conexión"
                  text="Espacio para conectar con otros según rubro, talento o vocación, generando oportunidades que edifiquen el Reino."
                />

                <InfoBlock
                  title="Durante el año"
                  text="Cafés, almuerzos y encuentros para conocernos, compartir experiencias y abrir conversaciones con propósito."
                />

                <div className="md:col-span-2">
                  <InfoBlock
                    title="Encuentro general"
                    text="Una vez al año realizamos un encuentro general de networking para reunir personas, proyectos e iniciativas dentro de la red."
                  />
                </div>
              </div>

              <div className="mt-8 md:mt-10 xl:mt-12">
                <Link
                  to="/unirme-red"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm md:text-base text-white hover:bg-white/10 transition"
                >
                  Unirme a la red
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}