// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ behavior = 'auto' }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // si hay un hash (#section), dejamos que el navegador haga el scroll al ancla
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, hash, behavior]);

  return null;
}