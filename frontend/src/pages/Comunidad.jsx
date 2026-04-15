import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import useScrollReveal from "../hooks/useScrollReveal";
import FondoParticulas from "../components/FondoParticulas";
import { useUser } from "../context/UserContext";

// Galería
import sinew1 from "../assets/img/sinew1.jpg";
import sinew2 from "../assets/img/sinew2.jpg";
import sinew3 from "../assets/img/sinew3.jpg";
import sinew4 from "../assets/img/sinew4.jpg";
import sinew5 from "../assets/img/sinew5.jpg";
import sinew6 from "../assets/img/sinew6.jpg";
import sinew61 from "../assets/img/sinew61.jpg";
import sinew62 from "../assets/img/sinew62.jpg";
import sinewa from "../assets/img/sinewa.jpg";
import sinewaa from "../assets/img/sinewaa.jpg";

// Capturas seleccionadas como respaldo visual
import testimonio1 from "../assets/img/res11.jpg";
import testimonio2 from "../assets/img/res16.jpg";
import testimonio5 from "../assets/img/res5.jpg";
import testimonio8 from "../assets/img/res8.jpg";

const GALLERY_IMAGES = [
  { src: sinew1, alt: "Encuentro SINEW 1" },
  { src: sinew2, alt: "Encuentro SINEW 2" },
  { src: sinew3, alt: "Encuentro SINEW 3" },
  { src: sinew4, alt: "Encuentro SINEW 4" },
  { src: sinew5, alt: "Encuentro SINEW 5" },
  { src: sinew6, alt: "Encuentro SINEW 6" },
  { src: sinew61, alt: "Encuentro SINEW 7" },
  { src: sinew62, alt: "Encuentro SINEW 8" },
  { src: sinewa, alt: "Encuentro SINEW 9" },
  { src: sinewaa, alt: "Encuentro SINEW 10" },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Dios habló a mi vida en cada clase. El curso me ayudó a entender cómo operan ciertas cadenas mentales y cómo romperlas por medio de la Palabra. Fue un proceso profundo, claro y transformador.",
    name: "Victoria Agostina",
  },
  {
    id: 2,
    quote:
      "El nivel 1 sacude lo más profundo del ser. Más allá de las técnicas, va a la raíz y eso hace mucho más fácil comprender por qué somos como somos y cómo avanzar en un proceso real de transformación.",
    name: "Daniela Russo",
  },
  {
    id: 3,
    quote:
      "Cada clase tuvo algo especial. Uno de los puntos más fuertes fue comprender la mente de Cristo y la unidad, y también la renovación de la mente desde el arrepentimiento. Trajo mucha revelación en este tiempo.",
    name: "Matías Mastrogiovanni",
  },
  {
    id: 4,
    quote:
      "Pasar de una mente limitada y caída a la mente de Cristo me ayudó a entender mejor el plan de Dios para este tiempo. Cada clase fue oro y me dejó con más hambre de seguir aprendiendo.",
    name: "Cynthia Puma",
  },
  {
    id: 5,
    quote:
      "Este espacio me emocionó profundamente. Entender la justicia de Dios desde la raíz y ver cómo Él quiere restaurar todo a su estado original hizo de cada encuentro algo verdaderamente trascendente para mí.",
    name: "Ruidosa Conciencia",
  },
  {
    id: 6,
    quote:
      "Uno de los temas que más me impactó fue la batalla de conceptos. Literalmente transforma la forma de pensar y también la manera de hablar. No fue solo información: produjo un cambio real.",
    name: "Glo Rov",
  },
  {
    id: 7,
    quote:
      "Fue un curso increíble, lleno de desafíos, aventuras y enseñanzas que van desde lo interior hasta la práctica exterior. Uno de los temas que más me marcó fue la diferencia entre pensamiento dual y pensamiento asociativo. Realmente fue sensacional.",
    name: "Isahia Garciah",
  },
  {
    id: 8,
    quote:
      "Este curso responde preguntas muy profundas: qué paradigmas no bíblicos moldean la mente, cuáles son las características de la mente de Cristo y cómo trabajar con el Espíritu Santo para que esa mente se desarrolle en nosotros. Me encantó todo lo que fui aprendiendo.",
    name: "Vero Puglisi",
  },
  {
    id: 9,
    quote:
      "Las cosas que más me gustaron fueron: aprender sobre como nos ha impactado la mentalidad de Grecia, la importancia del silencio, el cómo influye lo que creo de mí misma en cómo me comunico y el poder e impacto de nuestras palabras en todo lo que nos rodea. El experimento de Masaru Emoto, que ya lo conocía, vino a reafirmarme muchas cosas.",
    name: "Claudia Sepúlveda Ayala",
  },
  {
    id: 10,
    quote:
      "Sinceramente hay un antes y un después en este gran proceso de la vida. Una mente transformada te ubica en otro lugar. No digo que ya se haya logrado todo, pero el camino se vive diferente, un día a la vez.",
    name: "Darío Gutierrez",
  },
  {
    id: 11,
    quote:
      "Esta semana terminamos el Nivel 1 del curso y solo con eso ya superó con creces mis expectativas. Destaco principalmente los condimentos y matices que Ger comparte respecto a verdades e ideas que solemos dar por sentadas y la forma en la que pone en perspectiva y nos conecta con el plan de Dios. ¡Preparado para seguir sorprendiéndome en el Nivel 2!",
    name: "Martín Vázquez",
  },
  {
    id: 12,
    quote:
      "Todos los temas fueron muy enriquecedores. Cada clase terminaba sorprendiéndome. Difícil elegir un solo tema. Tendré que decir al menos dos: “El silencio” y “La crítica”. Gracias Ger por cada una de las clases. Me llevo muchas cosas para poner en práctica.",
    name: "Caa Mroma",
  },
  {
    id: 13,
    quote:
      "Cómo la oratoria afecta la forma en la que pensamos; lo esencial de transformar nuestros pensamientos, repensarlos y anotarlos para cambiar nuestro diálogo.",
    name: "Sol Nonini",
  },
  {
    id: 14,
    quote:
      "Sin dudas, la idea de que en la multitud de subjetividades nos acercamos a la objetividad. Por eso, en parte, necesitamos al otro. Eso me sigue impactando y hasta lo enseño hoy en día.",
    name: "Lucas Esomoza",
  },
  {
    id: 15,
    quote:
      "El tema que más me marcó fue la intro de PNL, quedé fascinada. Gracias Ger.",
    name: "Maaaarmg",
  },
  {
    id: 16,
    quote:
      "Sin dudas, todos. Pero la mente asociativa y el ambiente de crítica lo busco aplicar siempre en todo. Esos dos temas son clave para mí.",
    name: "Di Giovannicolas",
  },
  {
    id: 17,
    quote:
      "Contrastación de luz y oscuridad; mente dual vs asociativa; el silencio. Tantos temas que me volaron la cabeza. Con ganas de profundizar más. Gracias Ger por brindarme la oportunidad de aprender de vos. No me quedo con solo aprender, sino que al ponerlo en práctica también enseño a otros.",
    name: "Noelia Silva Emilse",
  },
  {
    id: 18,
    quote:
      "Tener el conocimiento de que existe una mente dual y una mente asociativa cambió mi perspectiva en todo. Ahora implementar no es nada fácil, pero ya tengo luz cuando pienso de una manera o de otra.",
    name: "Débora Biain",
  },
  {
    id: 19,
    quote:
      "Para ser efectivos en cómo queremos llegar a dónde vamos, tenemos que entender de dónde venimos y como llegamos a dónde estamos hoy. Ver de forma tan sencilla y profunda la dualidad de la mente me motivó no solo a querer seguir en el curso si o a realmente abrir mí conocimiento! Muy bueno.",
    name: "Neri Lugones",
  },
  {
    id: 20,
    quote:
      "Cada tema fue un aprender y un crecer en mi manera de pensar, sigo reflexionando cada día lo aprendido pero uno de los temas que más me llegó fue el “Ecosistema de crítica”, y entender lo importante de hacer un ambiente de crítica y de esa manera poder corregir cuántos errores para nuestro desarrollo en todos los aspectos. Gracias Ger por todo!!",
    name: "Jona Alvarez",
  },
  {
    id: 21,
    quote:
      "Si bien todos los temas fueron importantes y me cambiaron por completo la manera de expresarme, el que más me quedó y en el que siempre pienso es en el silencio y la pausa. Me ayudó mucho conocer esto para darle tiempo al otro de escuchar y entender lo que digo.",
    name: "Davv Valentini",
  },
  {
    id: 22,
    quote:
      "Con cada tema quedas sorprendido. Súper recomendable! Lo más impactante fue mente dual y sistema de crítica.",
    name: "Caro Zuñiga",
  },
  {
    id: 23,
    quote:
      "Difícil elegir un solo tema!! Gracias Ger porque con este curso aprendí muchísimo. PNL, crítica, el uso del silencio… ¡todo!",
    name: "Jazmin Nevans",
  },
  {
    id: 24,
    quote:
      "Que la mentalidad de Grecia se remonta desde el mismo jardín del Edén con la caída del hombre en pegado, impresionante.",
    name: "Ezequiel Scialo",
  },
  {
    id: 25,
    quote:
      "Mentalidad dual vs mentalidad asociativa; el uso y la incorporación del silencio en el discurso; poder eliminar los vicios lingüísticos.",
    name: "Lucas Daniel",
  },
  {
    id: 26,
    quote:
      "Las cosas que mas me gustaron fueron: aprender sobre como nos ha impactado la mentalidad de Grecia, la importancia del silencio, el cómo influye lo que creo de mi misma en cómo me comunico y el poder e impacto de nuestras palabras en todo lo que nos rodea. El experimento de Masaru Emoto, que ya lo conocía, vino a reafirmarme muchas cosas.",
    name: "Claudia Sepúlveda Ayala",
  },
  {
    id: 27,
    quote:
      "Sinceramente hay un antes y un después en este gran proceso de la vida. Una menta transformada te ubica en otro lugar. No digo que ya se haya logrado todo pero el camino se vive diferente, un día a la vez!",
    name: "Darío Gutierrez",
  },
  {
    id: 28,
    quote:
      "Esta semana terminamos el Nivel 1 del curso y solo con eso ya superó con creces mis expectativas. Destaco principalmente los condimentos y matices que Ger comparte respecto a verdades e ideas que solemos dar por sentadas y la forma en la que pone en perspectiva y nos conecta con el plan de Dios. ¡Preparado para seguir sorprendiéndome en el Nivel 2!",
    name: "Martín Vázquez",
  },
  {
    id: 29,
    quote:
      "Todos los temas fueron muy enriquecedores. Cada clase terminaba sorprendiendo. Difícil elegir un solo tema. Tendré que decir al menos dos: “El silencio” y “La crítica”. Gracias Ger por cada una de las clases. Me llevo muchas cosas para poner en práctica.",
    name: "Caa Mroma",
  },
  {
    id: 30,
    quote:
      "Como la oratoria afecta la forma en la que pensamos, lo esencial de transformar nuestros pensamientos, repensarlos, anotarlo, para cambiar nuestro diálogo.",
    name: "Sol Nonini",
  },
  {
    id: 31,
    quote:
      "Sin dudas la idea de que en la multitud de subjetividades nos acercamos a la objetividad. Por eso, en parte, necesitamos al otro! Eso me sigue impactando y hasta lo enseño hoy en día!",
    name: "Lucas Esomoza",
  },
  {
    id: 32,
    quote:
      "El tema que más me marco fue la intro de PNL, quedé fascinada. Gracias Ger.",
    name: "Maaaarmg",
  },
  {
    id: 33,
    quote:
      "Sin dudas, todos. Pero la mente asociativa y el ambiente de crítica lo busco aplicar siempre en todo. Esos dos temas son clave.",
    name: "Di Giovannicolas",
  },
  {
    id: 34,
    quote:
      "Constratación de luz y oscuridad; mente dual vs asociativa, el silencio, tantos temas que me volaron la cabeza. Con ganas de profundizar más! Gracias Ger por brindarme la oportunidad de aprender de vos. No me quedo con solo aprender, sino que al ponerlo en práctica también enseño a otros.",
    name: "Noelia Silva Emilse",
  },
  {
    id: 35,
    quote:
      "Tener el conocimiento de que existe una mente dual y una mente asociativa cambio mi perspectiva en todo!!! Ahora implementar no es nada facil pero ya tengo luz cuando pienso de una manera o de otra!!!",
    name: "Débora Biain",
  },
];

const PROOF_IMAGES = [
  { src: testimonio1, alt: "Mensaje real 1" },
  { src: testimonio2, alt: "Mensaje real 2" },
  { src: testimonio5, alt: "Mensaje real 3" },
  { src: testimonio8, alt: "Mensaje real 4" },
];

function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-white/42 ${className}`}>
      {children}
    </p>
  );
}

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
    el.style.setProperty("--rx", `${(-y / 95).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x / 95).toFixed(2)}deg`);
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
      className={`relative rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_0_40px_rgba(152,245,225,0.08)] transition-transform duration-150 ${className}`}
      style={{
        transform:
          "perspective(1100px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        willChange: "transform",
      }}
    >
      <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-mint/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-mint/10 blur-3xl" />
      {children}
    </div>
  );
}

function Lightbox({ collection, index, onClose, onPrev, onNext }) {
  if (index === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="relative w-full max-w-6xl"
          initial={{ scale: 0.97, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: 10, opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10 rounded-full border border-white/15 bg-black/50 backdrop-blur px-3 py-2 text-white/85 hover:text-white hover:bg-black/70 transition"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/15 bg-black/40 backdrop-blur px-3 py-2 text-white/85 hover:text-white hover:bg-black/70 transition"
            aria-label="Anterior"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/15 bg-black/40 backdrop-blur px-3 py-2 text-white/85 hover:text-white hover:bg-black/70 transition"
            aria-label="Siguiente"
          >
            ›
          </button>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_0_40px_rgba(152,245,225,0.10)]">
            <img
              src={collection[index].src}
              alt={collection[index].alt || "Imagen ampliada"}
              className="w-full max-h-[82vh] object-contain bg-black/20"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="mt-3 flex items-center justify-center text-xs text-white/60">
            {index + 1} / {collection.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function QuoteCard({ quote, name }) {
  return (
    <Card3D className="h-full p-4 sm:p-5 md:p-7">
      <div className="flex h-full flex-col">
        <span className="text-[24px] sm:text-[28px] md:text-[34px] leading-none text-mint/80">
          “
        </span>

        <p className="mt-3 text-white/84 text-[13px] sm:text-[14px] md:text-[16px] leading-5 sm:leading-6 md:leading-7">
          {quote}
        </p>

        <div className="mt-auto pt-4 sm:pt-5 md:pt-6">
          <div className="h-px w-10 sm:w-12 md:w-14 bg-gradient-to-r from-mint/60 to-transparent" />
          <p className="mt-3 md:mt-4 text-white font-medium text-[13px] sm:text-[14px] md:text-[16px]">
            {name}
          </p>
        </div>
      </div>
    </Card3D>
  );
}

function ProofShot({ item, index, onOpen, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onOpen("proof", index)}
      className={[
        "group relative overflow-hidden rounded-[24px]",
        "border border-white/10 bg-[#0c111d]",
        "shadow-[0_14px_34px_rgba(0,0,0,0.24)]",
        "transition duration-300 hover:-translate-y-0.5 hover:border-white/15",
        "focus:outline-none focus:ring-2 focus:ring-mint/40",
        className,
      ].join(" ")}
      aria-label={`Abrir captura ${index + 1}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_22%,transparent_78%,rgba(255,255,255,0.02))]" />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-white/6 rounded-[24px]" />

      <div className="flex h-full w-full items-center justify-center p-3 md:p-4">
        <img
          src={item.src}
          alt={item.alt}
          className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      </div>
    </button>
  );
}

export default function Comunidad() {
  useScrollReveal();
  const { user } = useUser();

  const [lightbox, setLightbox] = useState({ type: null, index: null });
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const currentCollection =
    lightbox.type === "proof" ? PROOF_IMAGES : GALLERY_IMAGES;

  const initialTestimonials = 6;

  const visibleTestimonials = useMemo(() => {
    return showAllTestimonials
      ? TESTIMONIALS
      : TESTIMONIALS.slice(0, initialTestimonials);
  }, [showAllTestimonials]);

  const closeLightbox = () => setLightbox({ type: null, index: null });
  const openLightbox = (type, index) => setLightbox({ type, index });

  const prevImg = (e) => {
    e?.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: prev.index === 0 ? currentCollection.length - 1 : prev.index - 1,
    }));
  };

  const nextImg = (e) => {
    e?.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index:
        prev.index === currentCollection.length - 1 ? 0 : prev.index + 1,
    }));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox.index === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.index, currentCollection.length]);

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

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-12 md:pt-16 pb-24 md:pb-32">
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
                     SINEW
                  </span>
                </motion.div>


                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.28 }}
                  className="mt-4 md:mt-5 text-[clamp(24px,4.8vw,68px)] font-semibold tracking-tight leading-[0.96] text-white"
                >
                  Una comunidad
                  <span className="block bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
                    que crece
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.38 }}
                  className="mt-5 md:mt-6 max-w-[980px] mx-auto text-[14px] sm:text-[15px] md:text-[18px] xl:text-[20px] leading-7 md:leading-8 xl:leading-9 text-white/70"
                >
                  Experiencias, testimonios y momentos compartidos en el recorrido de formación de SINEW.
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
                  className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3"
                >
                  <a
                    href="#galeria"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/30 bg-mint/12 px-6 py-3 text-sm md:text-base text-mint hover:bg-mint hover:text-black transition-all duration-300 shadow-[0_0_24px_rgba(152,245,225,0.16)]"
                  >
                    Ver galería
                    <span aria-hidden="true">→</span>
                  </a>

                  <Link
                    to={user ? "/cursos" : "/login"}
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm md:text-base text-white hover:bg-white/10 transition"
                  >
                    {user ? "Explorar recursos" : "Iniciar sesión"}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          id="opiniones"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.04 }}
          className="mb-16 md:mb-24 scroll-mt-24"
        >
          <div className="mb-6 md:mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/52">
              Lo que dicen los estudiantes
            </p>
            <p className="mt-2 max-w-3xl text-white/66 text-sm md:text-base leading-relaxed">
              Testimonios de personas que ya vivieron la experiencia de formación.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
            {visibleTestimonials.map((item) => (
              <QuoteCard key={item.id} quote={item.quote} name={item.name} />
            ))}
          </div>

          {TESTIMONIALS.length > initialTestimonials && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllTestimonials((prev) => !prev)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm sm:text-base text-white/90 backdrop-blur shadow-[0_0_25px_rgba(152,245,225,0.12)] transition duration-300 hover:bg-white/10 hover:border-white/25 hover:shadow-[0_0_35px_rgba(152,245,225,0.22)]"
              >
                {showAllTestimonials ? "Ver menos" : "Ver más"}
                <span
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${
                    showAllTestimonials ? "rotate-90" : "translate-x-0.5"
                  }`}
                >
                  →
                </span>
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-16 md:mb-24"
        >
          <div className="mb-6 md:mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/52">
              Mensajes reales
            </p>
            <p className="mt-2 max-w-3xl text-white/66 text-sm md:text-base leading-relaxed">
              Algunas capturas originales se mantienen como respaldo visual de la
              experiencia compartida por participantes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 xl:gap-5">
            {PROOF_IMAGES.map((item, index) => (
              <ProofShot
                key={item.alt}
                item={item}
                index={index}
                onOpen={openLightbox}
                className="h-[180px] sm:h-[220px] md:h-[250px] xl:h-[280px]"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          id="galeria"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mb-16 md:mb-24 scroll-mt-24"
        >
          <div className="mb-6 md:mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/52">
              Galería
            </p>
            <p className="mt-2 max-w-3xl text-white/66 text-sm md:text-base leading-relaxed">
              Encuentros, espacios de formación y momentos compartidos en SINEW.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-3 md:p-4 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px] xl:auto-rows-[230px]">
              {GALLERY_IMAGES.map((img, i) => {
                const spanClass =
                  i === 0
                    ? "md:col-span-2 md:row-span-2"
                    : i === 3
                    ? "xl:col-span-2"
                    : i === 5
                    ? "md:col-span-2 xl:col-span-2 md:row-span-2"
                    : i === 8
                    ? "xl:col-span-2"
                    : "col-span-1 row-span-1";

                return (
                  <button
                    key={img.alt + i}
                    type="button"
                    onClick={() => openLightbox("galeria", i)}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_18px_rgba(152,245,225,0.05)] transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-mint/50 ${spanClass}`}
                    aria-label={`Abrir imagen ${i + 1}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <Card3D className="p-8 md:p-10">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div className="max-w-3xl">
                <p className="text-white/68 leading-relaxed text-sm md:text-base">
                  Esta comunidad sigue creciendo. Próximamente vamos a sumar más
                  experiencias, nuevos recursos y nuevos testimonios que ayuden a contar
                  lo que Dios está haciendo a través de SINEW.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-white hover:bg-white/10 transition"
                >
                  Volver al inicio
                </Link>

                <Link
                  to="/contacto"
                  className="rounded-xl border border-mint/30 bg-mint/10 px-5 py-3 text-mint hover:bg-mint/15 transition"
                >
                  Contactarnos
                </Link>
              </div>
            </div>
          </Card3D>
        </motion.div>
      </div>

      <Lightbox
        collection={currentCollection}
        index={lightbox.index}
        onClose={closeLightbox}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </section>
  );
}