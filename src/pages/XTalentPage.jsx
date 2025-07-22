// src/pages/XTalentPage.jsx
import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal'; // o la ruta correcta


export default function XTalentPage() {
    
  return (
    <section className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-mint mb-6">X Talent</h1>
        <p className="text-white/80 text-lg leading-relaxed">
          X Talent ayuda a los jóvenes a descubrir sus talentos y vocación desde una perspectiva del Reino. Brindamos mentorías, talleres y pruebas vocacionales espirituales.
        </p>
        <p className="text-white/60 mt-4 text-sm italic">"Tus dones abren camino ante ti..."</p>
      </div>
    </section>
  );
}