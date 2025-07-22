// src/pages/SynergyPage.jsx
import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal'; // o la ruta correcta


export default function SynergyPage() {
    useScrollReveal(); // Activar scroll reveal

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-mint mb-6">Synergy</h1>
        <p className="text-white/80 text-lg leading-relaxed">
          Synergy es la rama educativa de SINEW. Aquí formamos discípulos apasionados por el Reino, con enseñanzas basadas en la Biblia, enfocadas en descubrir el propósito eterno de Dios.
        </p>
        <p className="text-white/60 mt-4 text-sm italic">"La sabiduría comienza con el temor de Dios."</p>
      </div>
    </section>
  );
}