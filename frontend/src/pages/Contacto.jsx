// src/pages/Contacto.jsx
import React from "react";
import FondoParticulas from "../components/FondoParticulas";
import { motion } from "framer-motion";
import logoA1 from "../assets/img/A1.png";

const WHATSAPP_NUMBER_E164 = "5491141932894";
const WHATSAPP_DISPLAY = "+54 9 11 4193-2894";
const WHATSAPP_MSG = encodeURIComponent("Hola SINEW, quiero hacer una consulta");
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${WHATSAPP_MSG}`;

const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
  WA_LINK
)}`;

function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-white/42 ${className}`}>
      {children}
    </p>
  );
}

function InfoRow({ title, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-2 inline-block h-2 w-2 rounded-full bg-mint/85 shrink-0" />
      <div>
        <p className="text-white font-medium text-[14px] md:text-[15px]">{title}</p>
        <p className="mt-1 text-white/66 text-[14px] md:text-[15px] leading-6">{text}</p>
      </div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] md:text-sm text-white/78">
      {children}
    </span>
  );
}

export default function Contacto() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1222] to-transparent z-0" />

      {/* Fondo suave */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.08] blur-3xl" />
        <div className="absolute top-[28%] left-[8%] h-[22rem] w-[22rem] rounded-full bg-white opacity-[0.035] blur-3xl" />
        <div className="absolute bottom-[8%] right-[10%] h-[24rem] w-[24rem] rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      {/* Partículas discretas solo abajo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] opacity-15">
        <FondoParticulas opacity={0.1} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-8 md:pt-12 pb-20 md:pb-28">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto w-full max-w-[1920px] mb-14 md:mb-20"
        >
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(152,245,225,0.08),transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%,transparent_72%,rgba(255,255,255,0.015))]" />

            <div className="relative z-10 flex items-center justify-center px-5 sm:px-8 md:px-10 xl:px-16 2xl:px-24 py-12 sm:py-14 md:py-18 xl:py-22">
              <div className="w-full max-w-[1280px] text-center">
                <motion.img
                  src={logoA1}
                  alt="SINEW"
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.16 }}
                  className="mx-auto w-[clamp(130px,13vw,220px)] h-auto select-none drop-shadow-[0_0_24px_rgba(152,245,225,0.14)]"
                  loading="eager"
                  decoding="async"
                />

                <SectionEyebrow className="mt-6 md:mt-8">Contacto</SectionEyebrow>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.28 }}
                  className="mt-4 md:mt-5 text-[clamp(26px,4.8vw,64px)] font-semibold tracking-tight leading-[0.96] text-white"
                >
                  Estamos para
                  <span className="block bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
                    ayudarte
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.38 }}
                  className="mt-5 md:mt-6 max-w-[920px] mx-auto text-[14px] sm:text-[15px] md:text-[18px] xl:text-[19px] leading-7 md:leading-8 xl:leading-9 text-white/70"
                >
                  Escribinos para lo que necesites. Respondemos dentro de 24–48h hábiles.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scaleX: 0.7 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mx-auto mt-8 md:mt-10 h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-white/28 to-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONTENIDO */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mx-auto w-full max-w-[1920px]"
        >
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,0.95fr)_minmax(720px,1.35fr)] gap-6 md:gap-8 xl:gap-10 2xl:gap-14 items-stretch">
            {/* Columna izquierda */}
            <div className="rounded-[28px] md:rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-6 sm:px-6 md:px-8 md:py-8 xl:px-9 xl:py-9 shadow-[0_16px_50px_rgba(0,0,0,0.20)]">
              <SectionEyebrow>Canales</SectionEyebrow>

              <h2 className="mt-4 text-[clamp(22px,2.2vw,38px)] font-semibold leading-[1.06] tracking-tight text-white max-w-[15ch]">
                ¿En qué podemos ayudarte?
              </h2>

              <div className="mt-6 h-px w-24 bg-gradient-to-r from-mint/70 to-transparent" />

              <div className="mt-6 space-y-5">
                <InfoRow
                  title="Soporte técnico de cursos"
                  text="Asistencia con accesos, visualización de contenido y consultas técnicas."
                />
                <InfoRow
                  title="Facturación y descargas"
                  text="Si tu consulta es sobre pago o descarga, incluí el email de compra y el número de orden."
                />
                <InfoRow
                  title="Propuestas y colaboraciones"
                  text="También podés escribirnos si querés acercar una propuesta, iniciativa o alianza."
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Chip>Respuesta 24–48h</Chip>
                <Chip>Envío de factura</Chip>
                <Chip>Atención personalizada</Chip>
              </div>

              <div className="mt-8 md:mt-10">
                <a
                  href="mailto:info@sineworg.com"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm md:text-base text-white hover:bg-white/10 transition"
                >
                  Escribir a info@sineworg.com
                </a>
              </div>
            </div>

            {/* Columna derecha / WhatsApp */}
            <div className="rounded-[28px] md:rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-6 sm:px-6 md:px-8 md:py-8 xl:px-9 xl:py-9 shadow-[0_16px_50px_rgba(0,0,0,0.20)] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(152,245,225,0.08),transparent_30%)]" />
              <div className="absolute inset-0 pointer-events-none ring-1 ring-white/6 rounded-[32px]" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] gap-6 md:gap-8 items-center">
                {/* QR */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="rounded-[24px] border border-white/10 bg-[#0b111c] p-3 md:p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                    <img
                      src={QR_SRC}
                      alt="QR de WhatsApp SINEW"
                      className="block w-[170px] h-[170px] sm:w-[190px] sm:h-[190px] md:w-[220px] md:h-[220px] xl:w-[250px] xl:h-[250px] object-contain"
                      width={250}
                      height={250}
                      loading="lazy"
                    />
                  </div>

                  <p className="mt-4 text-white/52 text-xs md:text-sm text-center lg:text-left">
                    Escaneá el QR para abrir el chat.
                  </p>
                </div>

                {/* Texto y CTA */}
                <div className="min-w-0">
                  <SectionEyebrow>WhatsApp</SectionEyebrow>

                  <h2 className="mt-4 text-[clamp(22px,2.4vw,40px)] font-semibold leading-[1.06] tracking-tight text-white">
                    Contacto directo
                  </h2>

                  <p className="mt-4 text-white/70 text-[14px] md:text-[16px] xl:text-[17px] leading-7 md:leading-8 max-w-[42rem]">
                    Escribinos directo por WhatsApp. Podés abrir el chat desde el botón o escanear el código QR.
                  </p>

                  <div className="mt-6">
                    <a
                      href={WA_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-6 py-3 text-sm md:text-base text-mint hover:bg-mint hover:text-black transition-all duration-300 shadow-[0_0_24px_rgba(152,245,225,0.16)]"
                    >
                      Abrir chat de WhatsApp
                    </a>
                  </div>

                  <div className="mt-6 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 md:px-5">
                    <p className="text-white/50 text-[12px] md:text-sm">Número</p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="font-mono tracking-wide text-white text-[14px] md:text-[16px]">
                        {WHATSAPP_DISPLAY}
                      </span>

                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(WHATSAPP_DISPLAY)}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] md:text-sm text-mint hover:bg-white/10 transition"
                        aria-label="Copiar número"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-xs md:text-sm text-white/52">
                    Atención de lunes a viernes · 9–18 hs (ARG)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}