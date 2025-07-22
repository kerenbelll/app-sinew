import React, { useRef, useEffect } from 'react';
import Hero from '../components/Hero';
import Ramas from '../components/Ramas';
import { motion } from 'framer-motion';

export default function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch((error) => {
            console.log('User interaction required to play video:', error);
          });
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <main className="bg-primary text-white scroll-smooth">
      <Hero />

      <Ramas />

      <section className="relative w-full h-[80vh] overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/videos/ClaseIntro.mp4"  // Aquí la ruta relativa desde public
          controls
          playsInline
        />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <a
            href="#ramas"
            className="mt-6 inline-block px-6 py-3 text-white border border-white rounded-full backdrop-blur-md bg-white/10 hover:bg-mint hover:text-black transition-all duration-300 ease-in-out pointer-events-auto"
          >
            Acceder al curso
          </a>
        </motion.div>
      </section>
    </main>
  );
}