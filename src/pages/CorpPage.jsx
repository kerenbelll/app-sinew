// src/pages/CorpPage.jsx
import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal'; // o la ruta correcta


export default function CorpPage() {
    useScrollReveal(); // Activar scroll reveal

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-mint mb-6">Corp</h1>
        <p className="text-white/80 text-lg leading-relaxed">
          Corp es la rama de networking y desarrollo profesional del Reino. Conectamos personas con propósito a través de eventos, mentorías y proyectos colaborativos.
        </p>
        <p className="text-white/60 mt-4 text-sm italic">"Dos son mejor que uno, porque juntos logran más."</p>
      </div>
    </section>
  );
}