import React from "react";
import { motion } from "framer-motion";
import FondoParticulas from "../components/FondoParticulas";

export default function UnirmeRed() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1222] to-transparent z-0" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[18%] left-[10%] h-[24rem] w-[24rem] rounded-full bg-white opacity-[0.03] blur-3xl" />
        <div className="absolute -top-20 right-[12%] h-[26rem] w-[26rem] rounded-full bg-[#98f5e1] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-[8%] left-[12%] h-[22rem] w-[22rem] rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] opacity-18">
        <FondoParticulas opacity={0.12} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-12 md:pt-16 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full"
        >
          <div className="mx-auto max-w-[980px]">
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">
                Red SINEW
              </p>

              <h1 className="mt-4 text-[clamp(28px,4vw,52px)] font-semibold tracking-tight leading-[0.98] text-white">
                Unirme a la red
              </h1>

              <p className="mt-4 max-w-2xl mx-auto text-white/68 text-[15px] md:text-[17px] leading-7 md:leading-8">
                Completá tus datos para comenzar a conectar con otros según tu rubro, vocación o interés.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 md:p-10 xl:p-12">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/72 mb-2">Nombre</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-mint/40"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/72 mb-2">Profesión / Rubro</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-mint/40"
                    placeholder="Ej: Diseño, salud, educación"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/72 mb-2">Ciudad</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-mint/40"
                    placeholder="Tu ciudad"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/72 mb-2">Iglesia</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-mint/40"
                    placeholder="Tu iglesia"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/72 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-mint/40"
                    placeholder="Tu número"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/72 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-mint/40"
                    placeholder="Tu email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/72 mb-2">Qué buscás</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-white/80">
                    {[
                      "Contactos",
                      "Colaborador",
                      "Oportunidades",
                      "Aprender",
                      "Ofrecer",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <input type="checkbox" className="accent-[#98f5e1]" />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-7 py-3 text-sm md:text-base text-mint hover:bg-mint hover:text-black transition-all duration-300 shadow-[0_0_24px_rgba(152,245,225,0.14)]"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}