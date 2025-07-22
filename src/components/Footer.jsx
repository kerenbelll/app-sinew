import useScrollReveal from '../hooks/useScrollReveal';
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import logo from '../assets/img/B1.png'; // Asegúrate que el path sea correcto

function Footer() {
  useScrollReveal(); // Activar scroll reveal

  return (
    <footer className="bg-[#1e293b] text-white w-full px-6 py-14" data-sr-id>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-20">
        
        {/* Logo */}
        <div className="flex-1 flex justify-center md:justify-start">
          <img src={logo} alt="SINEW logo" className="h-12" />
        </div>

        {/* Redes sociales */}
        <div className="flex-1 flex justify-center md:justify-end gap-6 text-xl">
         
          <a href="https://www.instagram.com/sinew.ar" target="_blank" rel="noreferrer" className="hover:text-mint transition">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com/company/sinew" target="_blank" rel="noreferrer" className="hover:text-mint transition">
            <FaLinkedin />
          </a>
          <a href="https://youtube.com/sinew" target="_blank" rel="noreferrer" className="hover:text-mint transition">
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-white/50">
        © 2025 SINEW. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;