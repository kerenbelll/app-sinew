// src/pages/Home.jsx
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import Hero from "../components/Hero";
import Ramas from "../components/Ramas";
import { motion, useScroll, useTransform } from "framer-motion";
import LibroVenta from "../components/LibroVenta";
import FondoParticulas from "../components/FondoParticulas";

export default function Home() {
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: videoSectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1.04, 1.02]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
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

      {/* Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-30">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[55rem] h-[55rem] rounded-full blur-3xl opacity-15 bg-[#98f5e1]" />
        <div className="absolute -bottom-48 -right-32 w-[45rem] h-[45rem] rounded-full blur-[80px] opacity-10 bg-white" />
        <div className="absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-10 bg-[#98f5e1]" />
      </div>

      {/* Viñeta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Partículas globales */}
      <FondoParticulas className="pointer-events-none fixed inset-0 -z-10 opacity-70" />

      <Hero />
      <Ramas />

      {/* Sección video premium */}
      <section
        ref={videoSectionRef}
        className="relative z-30 w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-16 md:py-20 xl:py-24"
      >
        {/* franja oscura elegante */}
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#09101d]/80 backdrop-blur-xl shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
          >
            {/* ambient glows */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-[18%] h-[18rem] w-[18rem] rounded-full bg-mint/10 blur-3xl" />
              <div className="absolute bottom-0 right-[7%] h-[16rem] w-[16rem] rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
              {/* texto */}
              <div className="xl:col-span-4 border-b xl:border-b-0 xl:border-r border-white/10 p-7 md:p-9 xl:p-10 flex items-center">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/72">
                    <span className="h-2 w-2 rounded-full bg-mint" />
                    Curso gratuito
                  </div>

                  <h2 className="mt-5 text-[clamp(28px,3.1vw,48px)] font-semibold tracking-tight leading-[0.95]">
                    El Padre, el Árbol
                    <span className="block bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
                      y el Maestro
                    </span>
                  </h2>

                  <p className="mt-5 text-white/68 text-[15px] md:text-[17px] leading-7 md:leading-8">
                     Accedé a este curso de forma totalmente gratuita. ¡Es un gran punto de partida para tu recorrido en Sinew!                  </p>

                  

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/cursos/comunicacion"
                      className="inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-6 py-3 text-sm md:text-base text-mint hover:bg-mint hover:text-black transition-all duration-300 shadow-[0_0_24px_rgba(152,245,225,0.18)]"
                    >
                      Ver curso
                    </Link>

                   
                  </div>
                </div>
              </div>

              {/* video */}
              <div className="xl:col-span-8 p-4 md:p-5 xl:p-6">
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/30 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 backdrop-blur-md px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/78">
                      <span className="h-2 w-2 rounded-full bg-mint/85" />
                      Introducción
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {/* overlays pro */}
                    <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_34%)]" />
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
                    <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-white/8 rounded-[28px]" />

                    <motion.div
                      style={{ y: videoY, scale: videoScale }}
                      className="absolute inset-0"
                    >
                      <video
                        ref={videoRef}
                        className="absolute inset-0 z-0 h-full w-full object-cover"
                        src="https://dl.dropboxusercontent.com/scl/fi/k47456d1u7m2lc412icdc/0_Intro_EPEAEM_2025_Video.mp4?rlkey=8ivdn1x9g4pvhbk1bwpy1jlct&st=jwwoimqe&dl=0"
                        controls
                        playsInline
                        muted
                        loop
                        preload="metadata"
                        style={{
                          filter:
                            "brightness(1.02) contrast(1.09) saturate(1.07) sepia(0.02)",
                          willChange: "transform",
                        }}
                      />
                    </motion.div>

                    {!isVideoVisible && (
                      <div className="absolute inset-0 z-20 bg-black/15 pointer-events-none" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Libro */}
      <section
  id="libro"
  className="relative z-10 overflow-hidden pt-8 pb-0 bg-gradient-to-b from-transparent via-[#0b1222] to-[#060b14]"
>
  <LibroVenta />
</section>
    </main>
  );
}