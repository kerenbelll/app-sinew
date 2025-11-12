// src/pages/Home.jsx
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Hero from "../components/Hero";
import Ramas from "../components/Ramas";
import { motion } from "framer-motion";
import LibroVenta from "../components/LibroVenta";
import ModalPublicidad from "../components/ModalPublicidad";
import FondoParticulas from "../components/FondoParticulas";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setShowModal(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0b1222] text-white scroll-smooth overflow-x-clip">
      {/* Grid tenue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-40 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Mesh (glows) */}
      <div className="pointer-events-none absolute inset-0 -z-30">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[55rem] h-[55rem] rounded-full blur-3xl opacity-15 bg-[#98f5e1]" />
        <div className="absolute -bottom-48 -right-32 w-[45rem] h-[45rem] rounded-full blur-[80px] opacity-10 bg-white" />
        <div className="absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
      </div>

      {/* Viñeta general */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Partículas SIEMPRE por detrás del contenido (z-index negativo) */}
      <FondoParticulas className="pointer-events-none fixed inset-0 -z-10 opacity-70" />

      {showModal && <ModalPublicidad onClose={() => setShowModal(false)} />}

      <Hero />
      <Ramas />

      {/* Video (z-index alto para quedar por encima de cualquier overlay/partículas) */}
      <section className="relative z-30 w-full flex justify-center px-4 md:px-6 lg:px-8 mt-8 md:mt-10">
        <div className="w-full max-w-5xl">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_20px_80px_rgba(0,0,0,0.55)] mx-auto">
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

            {/* Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint text-black px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-wide shadow-[0_0_14px_rgba(152,245,225,0.35)]">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    fill="currentColor"
                    d="M12 2a1 1 0 0 1 .894.553l2.382 4.83l5.329.775a1 1 0 0 1 .554 1.706l-3.855 3.758l.91 5.305a1 1 0 0 1-1.451 1.054L12 17.77l-4.763 2.5a1 1 0 0 1-1.451-1.054l.91-5.305L2.84 9.864a1 1 0 0 1 .554-1.706l5.329-.775l2.382-4.83A1 1 0 0 1 12 2Z"
                  />
                </svg>
                Curso gratuito
              </span>
            </div>

            {/* Contenedor de video con mejora visual */}
            <div className="relative w-full aspect-video z-30">
              {/* Capa de realce (nitidez/contraste sutil) */}
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.08] bg-white z-10" />
              {/* Video arriba de partículas */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="https://dl.dropboxusercontent.com/scl/fi/k47456d1u7m2lc412icdc/0_Intro_EPEAEM_2025_Video.mp4?rlkey=8ivdn1x9g4pvhbk1bwpy1jlct&st=jwwoimqe&dl=0"
                controls
                playsInline
                muted
                loop
                preload="metadata"
                // Mejora de nitidez (CSS filters, no “sharpen” puro pero ayuda)
                style={{
                  filter: "contrast(1.08) saturate(1.06) brightness(1.03)",
                  willChange: "transform",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="relative z-30 flex justify-center mt-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Link
            to="/cursos"
            className="inline-block px-8 py-3 text-white border border-white/15 rounded-full bg-white/5 hover:bg-mint hover:text-black transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(152,245,225,0.25)] backdrop-blur-sm"
          >
            Acceder al curso
          </Link>
        </motion.div>
      </div>

      {/* Libro */}
      <section id="libro" className="relative z-10 overflow-hidden pt-8 pb-0 bg-gradient-to-b from-transparent to-[#0b1222]">
        <LibroVenta />
      </section>
    </main>
  );
}