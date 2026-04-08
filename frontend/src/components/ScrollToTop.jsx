// src/components/ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Si hay hash, dejamos que esa navegación la maneje el navegador
    if (hash) return;

    // Reset inmediato, sin animación, antes de pintar
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}