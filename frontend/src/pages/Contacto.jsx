// src/pages/Contacto.jsx
import React from "react";
import FondoParticulas from "../components/FondoParticulas";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER_E164 = "5491141932894"; // +54 9 11 4193-2894 sin símbolos
const WHATSAPP_DISPLAY = "+54 9 11 4193-2894";
const WHATSAPP_MSG = encodeURIComponent("Hola SINEW, quiero hacer una consulta");
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${WHATSAPP_MSG}`;

// QR público (ligero y estable)
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
  WA_LINK
)}`;

export default function Contacto() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Partículas */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
        <FondoParticulas />
      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full blur-3xl opacity-20 bg-[#98f5e1]" />
        <div className="absolute -bottom-24 right-1/3 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-10 bg-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Contacto <span className="text-mint">SINEW</span>
          </h1>
          <p className="mt-4 text-white/70 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            Escribinos para lo que necesites. Respondemos dentro de 24–48h hábiles.
          </p>
        </motion.div>

        {/* Dos columnas (info + WhatsApp) */}
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 items-start">
          {/* Tarjeta info */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 lg:p-10 shadow-[0_0_60px_rgba(152,245,225,0.08)]"
          >
            <div className="pointer-events-none absolute -top-6 -right-6 size-20 rounded-full bg-mint/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full bg-mint/10 blur-3xl" />

            <h2 className="text-2xl md:text-3xl font-semibold">¿En qué podemos ayudarte?</h2>
            <p className="text-white/70 mt-4 leading-relaxed">
              Si tu consulta es sobre pago/descarga, incluí el email de compra y el número de orden para agilizar todo.
            </p>

            <ul className="mt-6 space-y-3 text-sm md:text-base">
              {[
                "Soporte técnico de cursos",
                "Consultas de facturación y descargas",
                "Propuestas y colaboraciones",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="inline-block size-2 rounded-full bg-mint" />
                  <span className="text-white/85">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Respuesta 24–48h", "Envío de factura"].map((chip) => (
                <span
                  key={chip}
                  className="select-none rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm text-white/80"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="mailto:info@sineworg.com"
                className="inline-flex items-center gap-2 rounded-xl bg-mint text-black font-medium px-5 py-3 hover:opacity-90 transition shadow-[0_0_30px_rgba(152,245,225,0.25)]"
              >
                Escribir a info@sineworg.com
              </a>
            </div>
          </motion.aside>

          {/* Tarjeta WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 lg:p-10 shadow-[0_0_60px_rgba(152,245,225,0.08)]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

            <h2 className="text-2xl md:text-3xl font-semibold">WhatsApp</h2>
            <p className="text-white/70 mt-2 mb-6">
              Escribinos directo por WhatsApp. Escaneá el QR o tocá el botón para abrir el chat.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <img
                  src={QR_SRC}
                  alt="QR de WhatsApp SINEW"
                  className="block w-[180px] h-[180px] md:w-[200px] md:h-[200px] object-contain"
                  width={200}
                  height={200}
                  loading="lazy"
                />
              </div>

              <div className="flex-1 w-full">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-full rounded-xl bg-mint text-black font-medium px-5 py-3 hover:opacity-90 transition shadow-[0_0_24px_rgba(152,245,225,0.25)]"
                >
                  Abrir chat de WhatsApp
                </a>

                <div className="mt-3 text-white/80">
                  <div className="text-sm">Número</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <span className="font-mono tracking-wide">{WHATSAPP_DISPLAY}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(WHATSAPP_DISPLAY)}
                      className="text-xs text-mint hover:opacity-90 transition"
                      aria-label="Copiar número"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/55 mt-3">
                  Atención de lunes a viernes · 9–18&nbsp;hs (ARG)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}