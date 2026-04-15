// src/components/Hero.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "../assets/img/sinew6.jpg";
import useScrollReveal from "../hooks/useScrollReveal";
import Logo from "../assets/img/A1.png";

function RevealText({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Hero = () => {
  useScrollReveal();
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "0%"] : ["0%", "8%"]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "0%"] : ["0%", "18px"]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.52],
    isMobile ? [1, 1] : [1, 0]
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#0b1222] text-white font-sans"
    >
      {/* Fondo */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY }}
      >
        <img
          src={heroImage}
          alt="Fondo hero"
          className={`w-full h-full object-cover opacity-80 ${
            isMobile ? "scale-[1.01]" : "scale-[1.02]"
          }`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.54)_55%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[#08101f]/55" />
      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 rounded-full bg-[#98f5e1] blur-3xl ${
            isMobile
              ? "h-[18rem] w-[7rem] opacity-[0.05]"
              : "h-[24rem] w-[9rem] opacity-[0.08]"
          }`}
        />
        <div
          className={`absolute bottom-0 right-[18%] rounded-full bg-[#98f5e1] blur-3xl ${
            isMobile
              ? "h-[6rem] w-[14rem] opacity-[0.05]"
              : "h-[8rem] w-[20rem] opacity-[0.08]"
          }`}
        />
      </div>

      {/* Contenido */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-30 mx-auto flex max-w-5xl flex-col items-center px-5 pt-10 pb-24 text-center sm:px-6 lg:px-8 will-change-transform"
      >
        <RevealText delay={0.05}>
          <img
            src={Logo}
            alt="SINEW"
            className="mb-7 h-auto w-[clamp(210px,40vw,540px)] select-none drop-shadow-[0_0_18px_rgba(152,245,225,0.22)]"
            loading="eager"
            decoding="async"
            sizes="(min-width:1280px) 540px, (min-width:768px) 40vw, 82vw"
          />
        </RevealText>

        <div className="max-w-4xl">
          <RevealText delay={0.16}>
            <h1 className="text-[clamp(38px,6.5vw,88px)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
              Piezas distintas
            </h1>
          </RevealText>

          <RevealText delay={0.24}>
            <h2 className="mt-2 text-[clamp(20px,3.5vw,34px)] font-medium leading-tight tracking-[-0.03em] text-white/85">
              Un mismo cuerpo
            </h2>
          </RevealText>
        </div>

        <RevealText delay={0.34} className="mt-7 max-w-3xl">
          <p className="text-[15px] leading-7 text-white/78 sm:text-[17px] sm:leading-8 lg:text-[18px]">
            Creemos que cada <span className="font-medium text-white">profesión</span>,{" "}
            <span className="font-medium text-white">talento</span> y{" "}
            <span className="font-medium text-white">recurso</span> tienen un lugar en el
            plan de Dios. Por eso capacitamos, conectamos y activamos a
            profesionales, estudiantes y emprendedores para desarrollar ideas,
            proyectos y soluciones que fortalezcan al cuerpo de Cristo en
            tiempos que demandan claridad, resiliencia y dirección.
          </p>

          <div className="mx-auto mt-7 h-px w-28 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        </RevealText>

        <RevealText delay={0.46} className="mt-7 flex items-center">
          <a
            href="#ramas"
            aria-label="Explorar áreas"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition duration-300 hover:border-white/25 hover:bg-white/10 hover:shadow-[0_0_26px_rgba(152,245,225,0.18)] sm:px-6 sm:text-[14px]"
          >
            Explorar las 3 áreas
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </RevealText>
      </motion.div>
    </section>
  );
};

export default Hero;