import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/img/A1.png";

// Icons
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const sections = ["home", "cursos", "comunidad", "contacto"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLandscapePhone, setIsLandscapePhone] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const { user, logout } = useUser();

  // Detectar móvil en landscape para ajustar alturas/tamaños
  useEffect(() => {
    const mql = window.matchMedia("(orientation: landscape)");
    const handler = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Heurística: teléfonos en landscape suelen tener bajo alto (<= 500)
      setIsLandscapePhone(mql.matches && h <= 500);
    };
    handler();
    window.addEventListener("resize", handler);
    mql.addEventListener?.("change", handler);
    return () => {
      window.removeEventListener("resize", handler);
      mql.removeEventListener?.("change", handler);
    };
  }, []);

  // Scroll (progreso y estado scrolled)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sección activa por ruta
  useEffect(() => {
    setActiveSection(location.pathname.replace("/", "") || "home");
  }, [location]);

  // Cerrar con ESC y clic afuera
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    const onClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  // Bloquear scroll del body con drawer abierto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const linkBase =
    "relative uppercase tracking-wide transition text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mint/70 rounded";
  const linkActive = "text-mint";
  const linkIdle = "text-white hover:text-mint";

  const renderLinks = (isMobile = false) =>
    sections.map((section) => {
      const label = section.charAt(0).toUpperCase() + section.slice(1);

      if (section === "home") {
        return (
          <button
            key={section}
            onClick={() => {
              closeMenu();
              navigate("/");
              setTimeout(() => {
                const hero = document.getElementById("hero");
                if (hero)
                  hero.scrollIntoView({ behavior: "smooth", block: "start" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 80);
            }}
            className={`${linkBase} ${
              activeSection === section ? linkActive : linkIdle
            } ${isMobile ? "text-base" : "text-sm"}`}
          >
            {label}
          </button>
        );
      }

      return (
        <Link
          key={section}
          to={`/${section}`}
          onClick={closeMenu}
          className={`${linkBase} ${
            activeSection === section ? linkActive : linkIdle
          } ${isMobile ? "text-base" : "text-sm"}`}
        >
          {label}
        </Link>
      );
    });

  // Fondo dinámico
  const bgColor = isOpen
    ? "rgba(11, 18, 34, 1)"
    : scrolled
    ? "rgba(5, 12, 38, 0.75)"
    : "rgba(0, 0, 0, 0)";
  const showBorder = isOpen || scrolled;
  const showShadow = isOpen || scrolled;

  return (
    <>
      {/* Barra de progreso */}
      <div
        className="fixed top-0 left-0 h-1 bg-mint z-[70] transition-[width]"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={`fixed top-0 left-0 w-full z-[65] transition-all duration-500`}
        role="navigation"
        aria-label="Principal"
        style={{
          paddingTop: "max(0px, env(safe-area-inset-top))",
        }}
      >
        {/* Fondo */}
        <div
          className={`absolute inset-0 -z-10 backdrop-blur-md transition-all duration-500 ${
            showBorder ? "border-b border-white/10" : "border-b border-transparent"
          } ${showShadow ? "shadow-[0_8px_30px_rgba(0,0,0,0.28)]" : "shadow-none"}`}
          style={{ backgroundColor: bgColor }}
          aria-hidden="true"
        />

        <div
          className={`max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center transition-all ${
            // Alturas más compactas en landscape phone
            isLandscapePhone ? "h-14" : scrolled || isOpen ? "h-20" : "h-24"
          }`}
        >
          {/* Logo (más chico en landscape phone) */}
          <Link
            to="/"
            className="flex items-center group"
            aria-label="Ir al inicio"
            onClick={() => {
              if (location.pathname === "/") {
                const hero = document.getElementById("hero");
                if (hero)
                  hero.scrollIntoView({ behavior: "smooth", block: "start" });
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img
              src={logo}
              alt="SINEW Logo"
              className={`w-auto transition-transform duration-300 group-hover:scale-[1.03] drop-shadow-[0_0_18px_rgba(152,245,225,0.25)]
                ${isLandscapePhone ? "h-10" : "h-14 sm:h-16 lg:h-20"}`}
            />
          </Link>

          {/* OJO: mantenemos hamburguesa también en landscape móvil (no usamos md:flex, sino lg:flex) */}
          <nav className="hidden lg:flex items-center gap-8 font-medium">
            <div className="group flex items-center gap-8">{renderLinks(false)}</div>

            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition relative group"
                  aria-label="Iniciar sesión"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-white group-hover:text-mint transition" />
                </Link>
                <Link
                  to="/register"
                  className="p-2 rounded-full bg-mint text-[#0d1b2a] hover:opacity-90 transition shadow-[0_0_18px_rgba(152,245,225,0.35)]"
                  aria-label="Registrarse"
                >
                  <UserPlusIcon className="h-6 w-6" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition group"
                aria-label="Cerrar sesión"
              >
                <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-white group-hover:text-mint transition" />
              </button>
            )}
          </nav>

          {/* Hamburguesa (también para landscape móvil) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden relative w-10 h-10 focus:outline-none"
            aria-label="Abrir menú"
          >
            <span
              className={`absolute h-[2px] w-6 bg-white left-2 transition-transform duration-300 ${
                isOpen ? "rotate-45 top-4" : "top-3"
              }`}
            />
            <span
              className={`absolute h-[2px] w-6 bg-white left-2 transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "top-5"
              }`}
            />
            <span
              className={`absolute h-[2px] w-6 bg-white left-2 transition-transform duration-300 ${
                isOpen ? "-rotate-45 top-4" : "top-7"
              }`}
            />
          </button>
        </div>

        {/* Drawer móvil */}
        <div
          ref={drawerRef}
          className={`fixed top-0 right-0 h-full w-72 bg-[#0b1222] text-white transform transition-transform duration-300 z-[70] border-l border-white/10 shadow-2xl ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="SINEW"
                className="h-14 w-auto transition-transform duration-300 hover:scale-105 drop-shadow-[0_0_20px_rgba(152,245,225,0.35)]"
              />
            </div>
            <button
              onClick={closeMenu}
              aria-label="Cerrar menú"
              className="text-white/80 hover:text-white text-2xl leading-none"
              title="Cerrar"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-col items-start space-y-6 px-6 py-6">
            {renderLinks(true)}

            <div className="w-full h-px bg-white/10 my-2" />

            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  aria-label="Iniciar sesión"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-white hover:text-mint" />
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  aria-label="Registrarse"
                  className="p-2 rounded-full bg-mint text-[#0d1b2a] hover:opacity-90 transition shadow-md"
                >
                  <UserPlusIcon className="h-6 w-6" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                  navigate("/");
                }}
                aria-label="Cerrar sesión"
                className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition"
              >
                <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-white hover:text-mint" />
              </button>
            )}
          </nav>
        </div>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-[60] lg:hidden transition-opacity duration-500"
            onClick={closeMenu}
          />
        )}
      </header>
    </>
  );
};

export default Navbar;