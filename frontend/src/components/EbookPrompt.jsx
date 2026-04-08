import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import portada from "../assets/img/portada.jpg";

const STORAGE_KEY = "sinew_ebook_prompt_closed";

export default function EbookPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const wasClosed = sessionStorage.getItem(STORAGE_KEY) === "true";
    if (wasClosed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const trigger = window.innerHeight * 0.4;
      if (window.scrollY > trigger) {
        setIsVisible(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[120] sm:bottom-4 sm:left-6 sm:right-6">
      <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-[20px] border border-white/10 bg-[#0b1222]/96 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mint/70 to-transparent" />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar aviso"
          className="absolute right-3 top-3 z-10 text-white/50 hover:text-white text-lg transition"
        >
          ×
        </button>

        <div className="flex items-start sm:items-center gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <img
            src={portada}
            alt="E-book Hábitos Integrativos"
            className="h-[72px] sm:h-[78px] w-auto object-contain rounded-md shrink-0"
          />

          <div className="flex-1 min-w-0 pr-8 sm:pr-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-mint/70">
              Nuevo e-book
            </p>

            <h3 className="text-white font-semibold text-sm sm:text-base leading-tight">
              Hábitos Integrativos
            </h3>

            <p className="mt-1 text-white/70 text-xs sm:text-sm leading-snug">
              Guía práctica para unificar espíritu, alma y cuerpo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
            <Link
              to="/checkout"
              className="whitespace-nowrap rounded-full border border-mint/30 bg-mint/15 px-4 py-2 text-xs sm:text-sm text-mint hover:bg-mint hover:text-black transition"
            >
              Ver
            </Link>

            <button
              type="button"
              onClick={handleClose}
              className="hidden sm:inline text-xs text-white/50 hover:text-white transition"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}