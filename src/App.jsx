import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import Comunidad from './pages/Comunidad';
import Contacto from './pages/Contacto';
import SynergyPage from './pages/SynergyPage';
import XTalentPage from './pages/XTalentPage';
import CorpPage from './pages/CorpPage';
import Footer from './components/Footer';
import Ramas from './components/Ramas';

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ramas" element={<Ramas />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/synergy" element={<SynergyPage />} />
          <Route path="/xtalent" element={<XTalentPage />} />
          <Route path="/corp" element={<CorpPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}