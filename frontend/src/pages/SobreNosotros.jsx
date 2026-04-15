import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FondoParticulas from "../components/FondoParticulas";

import synergyLogo from "../assets/img/synergylogocolor.png";
import xtalentLogo from "../assets/img/xtalentcolor.png";
import corpLogo from "../assets/img/corplogocolor.png";
import logoA1 from "../assets/img/A1.png";
import heroBg from "../assets/img/sinew61.jpg";

const valores = [
  "Amor por Dios y por el prójimo",
  "Fe (confianza) en Dios y Su Plan",
  "Esperanza",
  "Relaciones sanas",
  "Esfuerzo",
  "Trabajo",
  "Corporativismo",
  "Colaboración",
  "Servicio",
  "Amor por la iglesia local",
  "Integridad",
  "Transparencia",
  "Verdad",
  "Innovación",
  "Creatividad",
  "Excelencia",
  "Profesionalismo",
];

function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-white/42 ${className}`}>
      {children}
    </p>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <h2
      className={`mt-4 text-[clamp(24px,2.6vw,40px)] font-semibold leading-[1.05] tracking-tight text-white ${className}`}
    >
      {children}
    </h2>
  );
}

function AreaLogoLink({ to, logo, alt, name, subtitle }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center text-center transition duration-300"
    >
      <div className="flex h-32 w-full items-center justify-center md:h-36 lg:h-40 xl:h-44">
        <img
          src={logo}
          alt={alt}
          className="max-h-full max-w-[88%] object-contain transition duration-300 group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_28px_rgba(152,245,225,0.35)]"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mt-5">
        <h3 className="text-xl md:text-[22px] font-semibold text-white">{name}</h3>
        <p className="mt-2 text-sm md:text-[15px] leading-6 text-white/58 max-w-[300px] mx-auto">
          {subtitle}
        </p>
      </div>

      <span className="mt-5 inline-flex items-center gap-2 text-sm text-mint/90">
        Ver área
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

function ValorPill({ text }) {
  return (
    <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-[15px] text-white/82 whitespace-nowrap backdrop-blur-sm">
      {text}
    </div>
  );
}

export default function SobreNosotros() {
  const valoresLoop = [...valores, ...valores];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1222] to-transparent z-0" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[32%] -left-20 h-[24rem] w-[24rem] rounded-full bg-white opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#98f5e1] opacity-[0.07] blur-3xl" />
        <div className="absolute top-[58%] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-25">
        <FondoParticulas />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-10 md:pt-14 pb-24 md:pb-32">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full mb-20 md:mb-24"
        >
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 min-h-[620px] md:min-h-[700px] xl:min-h-[760px]">
            <div className="absolute inset-0">
              <img
                src={heroBg}
                alt="Historia de SINEW"
                className="h-full w-full object-cover object-[58%_center] md:object-center"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(152,245,225,0.10),transparent_28%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060b14]/45 via-[#060b14]/70 to-[#060b14]/94" />
            <div className="absolute inset-0 bg-black/28" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,11,20,0.34)_0%,rgba(6,11,20,0.12)_35%,rgba(6,11,20,0.12)_65%,rgba(6,11,20,0.34)_100%)]" />

            <div className="pointer-events-none absolute top-12 left-1/2 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.10] blur-3xl" />

            <div className="relative z-10 flex min-h-[620px] md:min-h-[700px] xl:min-h-[760px] items-center justify-center px-6 sm:px-8 md:px-10 xl:px-14 py-16 md:py-20">
              <div className="w-full max-w-[1400px] text-center">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.16 }}
                  className="text-[11px] uppercase tracking-[0.24em] text-white/44"
                >
                  Origen · Proceso · Visión
                </motion.p>

                <motion.img
                  src={logoA1}
                  alt="SINEW"
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.28 }}
                  className="mx-auto mt-8 w-[clamp(190px,20vw,320px)] h-auto select-none drop-shadow-[0_0_30px_rgba(152,245,225,0.18)]"
                  loading="eager"
                  decoding="async"
                />

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-8 text-[clamp(28px,4.2vw,56px)] font-semibold tracking-tight leading-[0.98] text-white"
                >
                  Nuestra historia
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-6 max-w-[900px] mx-auto text-[15px] md:text-[19px] leading-8 md:leading-9 text-white/70"
                >
                  Una visión nacida en proceso, formada en obediencia y orientada a unir
                  personas, propósito, formación y servicio dentro del cuerpo de Cristo.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scaleX: 0.7 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mx-auto mt-10 h-px w-32 bg-gradient-to-r from-transparent via-white/28 to-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* HISTORIA */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-16 2xl:gap-20">
            <div className="xl:col-span-4">
              <div className="xl:sticky xl:top-28 max-w-[520px]">
                <SectionEyebrow>Identidad</SectionEyebrow>
                <SectionTitle>¿Qué significa SINEW?</SectionTitle>

                <div className="mt-6 h-px w-24 bg-gradient-to-r from-mint/70 to-transparent" />

                <div className="mt-6 space-y-5 text-white/72 text-[15px] md:text-[16px] leading-8">
                  <p>
                    SINEW significa “tendón” o “ligamento”.
                  </p>
                  <p>
                    Representa aquello que une diferentes partes del cuerpo para que
                    funcionen de forma coherente.
                  </p>
                  <p>
                    Así entendemos nuestra misión: unir dimensiones que hoy suelen
                    aparecer separadas.
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-8">
              <div className="max-w-[980px]">
                <SectionEyebrow>Cómo nació SINEW</SectionEyebrow>
                <SectionTitle className="mt-3">Cómo nació SINEW</SectionTitle>

                <div className="mt-6 space-y-7 text-white/84 text-[15px] md:text-[17px] leading-8 md:leading-9">
                  <p>
                    En 2019, durante una temporada de ayuno y proceso, nació Sinew; al menos como idea. Dios nos compartió una porción de Su corazón y nos habló de lo que Él iba a hacer y de cómo podíamos colaborar con eso.
                  </p>

                  <p>
                    Sí, de forma impresionante e inentendible, el Dios Eterno, Padre de las luces y Creador de todas las cosas visibles e invisibles, nos invitó a colaborar con Él.
                  </p>

                  <p>
                    Nos habló de un shift que venía. Un gran cambio. Algo que, de manera inminente, sacudiría nuestra forma de vivir, pensar, caminar, creer y funcionar.
                  </p>

                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-6 md:px-8 md:py-7">
                    <p>Jesús enfatizó:</p>
                    <p className="mt-3">—De esto no quedará piedra sobre piedra.</p>
                    <p className="mt-3">—¿De qué? —pregunté.</p>
                    <p className="mt-3">—De la forma de ser iglesia.</p>
                  </div>

                  <p>
                    Apenas entendimos, pero obedecimos y nos quedamos en la mesa para esa conversación.
                  </p>

                  <p>
                    Durante el frío invierno de aquel 2019 comimos de la mesa del ayuno y nos deleitamos con los sabores de Su Palabra. Su plan alegró nuestro vientre; nos transformó. Amamos más a Jesús, amamos más a la iglesia, amamos más aquello que Dios, de manera flagrante y estruendosa, ama.
                  </p>

                  <p>
                    Nos enrolamos en la aventura de aprender algo nuevo, de ser criticados, corregidos y formados por algo innovador.
                  </p>

                  <p>
                    “Cosa que ojo no vio, ni oído oyó”.
                  </p>

                  <p>
                    El Espíritu Santo nos mostró un tiempo crudo. Pensamos que sería dentro de muchos años, que había más tiempo del que realmente había. Pero entonces llegó COVID-19.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-white/82">
                      Encierro.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-white/82">
                      Pánico.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-white/82">
                      Colapso.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-white/82">
                      Cambio.
                    </div>
                  </div>

                  <p>
                    “Salgan de ella, oh pueblo mío, para que no participen de sus pecados ni reciban parte de sus plagas”, nos advierte Apocalipsis.
                  </p>

                  <p>
                    ¿Qué significa esto?
                    <br />
                    ¿Ascetismo extremo?
                    <br />
                    ¿Conspiracionismo?
                  </p>

                  <p>
                    Y la respuesta fue acción:
                    <br />
                    ¡Prepárense!
                  </p>

                  <p>
                    “Su novia se ha preparado”, nos revela la Biblia.
                  </p>

                  <p>
                    Así, al inicio de la pandemia, comenzamos.
                  </p>

                  <p>
                    Sinew nace de la convicción del Espíritu, de Su susurro en medio del desierto. “Tendones crecieron sobre los huesos”, vio Ezequiel. Antes de la estructura y del cuerpo sustentable vienen los buenos vínculos. Y eso, justamente eso, es lo que Sinew (tendón en inglés) busca concretar: que hueso con hueso se junte y que tendones se desarrollen sobre ellos.
                  </p>

                  <p>
                    Varios siendo uno es la revelación de Dios más grande que habrá antes del fin.
                  </p>

                  <p>
                    La infraestructura de la iglesia impactará a las naciones. La belleza y santidad de la Esposa, ataviada como ejércitos en orden de batalla, convencerá a millares.
                  </p>

                  <p>
                    Y entonces vendrá el fin.
                  </p>

                  <p className="text-mint font-medium text-[17px] md:text-[18px]">
                    ¡Maranatha!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ÁREAS */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full mt-24 md:mt-28"
        >
          <div className="border-t border-white/10 pt-16 md:pt-20 xl:pt-24">
            <div className="max-w-4xl mx-auto text-center">
              <SectionEyebrow>Áreas</SectionEyebrow>
              <SectionTitle className="text-center">Nuestras áreas</SectionTitle>
            </div>

            <div className="mt-16 md:mt-18 xl:mt-20 grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10 xl:gap-20 2xl:gap-24 items-start">
              <AreaLogoLink
                to="/cursos"
                logo={synergyLogo}
                alt="Synergy"
                name="Synergy"
                subtitle="Formación Bíblica Integral"
              />

              <AreaLogoLink
                to="/xtalent"
                logo={xtalentLogo}
                alt="xTalent"
                name="xTalent"
                subtitle="Talento y Vocación"
              />

              <AreaLogoLink
                to="/red-sinew"
                logo={corpLogo}
                alt="Corp"
                name="Corp"
                subtitle="Networking y Proyectos"
              />
            </div>
          </div>
        </motion.div>

        {/* VALORES */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="w-full mt-24 md:mt-28"
        >
          <div className="border-t border-white/10 pt-16 md:pt-20">
            <div className="max-w-4xl mx-auto text-center">
              <SectionEyebrow>Nuestros valores</SectionEyebrow>
            </div>

            <div className="mt-10 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-24 bg-gradient-to-r from-[#060b14] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24 bg-gradient-to-l from-[#060b14] to-transparent" />

              <motion.div
                className="flex gap-3 md:gap-4 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 38,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {valoresLoop.map((valor, index) => (
                  <ValorPill key={`${valor}-${index}`} text={valor} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}