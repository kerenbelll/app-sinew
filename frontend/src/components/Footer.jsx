import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import logo from "../assets/img/B1.png";

export default function Footer() {
  return (
    <footer
      className="text-white"
      style={{
        background:
          "radial-gradient(1200px 700px at 80% -10%, rgba(152,245,225,0.18), transparent 55%), radial-gradient(900px 600px at -10% 110%, rgba(255,255,255,0.06), transparent 50%), #0b1222",
      }}
    >
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-14 md:py-16">
        
        {/* fila superior */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          
          {/* Marca */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="SINEW"
              className="h-9 md:h-10 lg:h-11 select-none"
            />
            <p className="text-sm text-white/65 max-w-xs leading-relaxed">
              Formación y comunidad.
            </p>
          </div>

          {/* Navegación */}
          <nav className="text-sm">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white/75">
              <li>
                <a href="/sobre-nosotros" className="hover:text-white transition">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/comunidad" className="hover:text-white transition">
                  Comunidad
                </a>
              </li>
              <li>
                <a href="/cursos" className="hover:text-white transition">
                  Recursos
                </a>
              </li>
              <li>
                <a href="/red-sinew" className="hover:text-white transition">
                  Red Sinew
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:text-white transition">
                  Contacto
                </a>
              </li>

              <span className="hidden md:inline text-white/20">|</span>

              <li>
                <a href="/terminos" className="hover:text-white transition">
                  Términos
                </a>
              </li>
              <li>
                <a href="/privacidad" className="hover:text-white transition">
                  Privacidad
                </a>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { Icon: FaInstagram, href: "https://www.instagram.com/sinew.ar", label: "Instagram" },
              { Icon: FaLinkedin,  href: "https://linkedin.com/company/sinew", label: "LinkedIn" },
              { Icon: FaYoutube,   href: "https://youtube.com/sinew",         label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/75 hover:text-white hover:bg-white/10 transition"
              >
                <Icon />
              </a>
            ))}

            <a
              href="mailto:info@sineworg.com"
              className="ml-2 hidden md:inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition"
            >
              info@sineworg.com
            </a>
          </div>
        </div>

        {/* divisor */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        {/* fila inferior */}
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/55 md:flex-row">
          <p>
            © {new Date().getFullYear()} SINEW. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}