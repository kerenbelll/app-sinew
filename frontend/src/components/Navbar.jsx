// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/img/A1.png';

const sections = ['home', 'cursos', 'comunidad', 'contacto'];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const navRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveSection(location.pathname.slice(1) || 'home');
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const renderLinks = (isMobile = false) =>
    sections.map((section) => {
      if (section === 'home') {
        return (
          <button
            key={section}
            onClick={() => {
              closeMenu();
              navigate('/'); // redirige a home
              setTimeout(() => {
                const hero = document.getElementById('hero');
                if (hero) {
                  hero.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className={`${
              activeSection === section ? 'text-mint' : 'text-white'
            } hover:text-mint transition duration-300 relative group uppercase tracking-wide ${
              isMobile ? 'text-lg' : 'text-sm'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
            <span className="block h-[2px] w-0 bg-mint group-hover:w-full transition-all duration-300 mt-1" />
          </button>
        );
      }

      return (
        <Link
          key={section}
          to={`/${section}`}
          onClick={closeMenu}
          className={`${
            activeSection === section ? 'text-mint' : 'text-white'
          } hover:text-mint transition duration-300 relative group uppercase tracking-wide ${
            isMobile ? 'text-lg' : 'text-sm'
          }`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
          <span className="block h-[2px] w-0 bg-mint group-hover:w-full transition-all duration-300 mt-1" />
        </Link>
      );
    });

  return (
    <>
      {/* Barra de progreso */}
      <div className="fixed top-0 left-0 h-1 bg-mint z-[60]" style={{ width: `${scrollProgress}%` }} />

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#050c26]/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/ramas" className="flex items-center group">
            <img
              src={logo}
              alt="SINEW Logo"
              className="h-24 max-h-24 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            {renderLinks()}
          </nav>

          {/* Hamburguesa */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative w-8 h-8 focus:outline-none"
            aria-label="Menú móvil"
          >
            <span
              className={`absolute h-[2px] w-full bg-white left-0 transition-transform duration-300 ${
                isOpen ? 'rotate-45 top-3.5' : 'top-2'
              }`}
            />
            <span
              className={`absolute h-[2px] w-full bg-white left-0 transition-opacity duration-300 ${
                isOpen ? 'opacity-0' : 'top-4'
              }`}
            />
            <span
              className={`absolute h-[2px] w-full bg-white left-0 transition-transform duration-300 ${
                isOpen ? '-rotate-45 top-3.5' : 'top-6'
              }`}
            />
          </button>
        </div>

        {/* Menú móvil */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-[#0c122f] text-white transform transition-transform duration-300 z-[60] border-l border-white/10 shadow-xl ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={closeMenu} aria-label="Cerrar menú" className="text-white text-xl">
              ✕
            </button>
          </div>
          <nav className="flex flex-col items-start space-y-6 px-6 mt-6 text-left">
            {renderLinks(true)}
          </nav>
        </div>

        {/* Fondo oscuro al abrir menú */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={closeMenu}
          />
        )}
      </header>
    </>
  );
};

export default Navbar;