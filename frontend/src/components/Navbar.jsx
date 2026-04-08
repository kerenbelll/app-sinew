import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import sinewLogo from "../assets/img/B1.png";

import {
  ArrowRightOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  UserPlusIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const sections = [
  "home",
  "sobre-nosotros",
  "comunidad",
  "cursos",
  "red-sinew",
  "contacto",
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLandscapePhone, setIsLandscapePhone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [hasHeroBehind, setHasHeroBehind] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const headerRef = useRef(null);
  const { user, logout } = useUser();

  useEffect(() => {
    const mqlLandscape = window.matchMedia("(orientation: landscape)");
    const mqlMobile = window.matchMedia("(max-width: 1023px)");

    const handleMQ = () => {
      const h = window.innerHeight;
      setIsLandscapePhone(mqlLandscape.matches && h <= 500);
      setIsMobile(mqlMobile.matches);
    };

    handleMQ();
    window.addEventListener("resize", handleMQ);
    mqlLandscape.addEventListener?.("change", handleMQ);
    mqlMobile.addEventListener?.("change", handleMQ);

    return () => {
      window.removeEventListener("resize", handleMQ);
      mqlLandscape.removeEventListener?.("change", handleMQ);
      mqlMobile.removeEventListener?.("change", handleMQ);
    };
  }, []);

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

  useEffect(() => {
    const p = location.pathname.replace("/", "");
    setActiveSection(p || "home");

    const checkHero = () => setHasHeroBehind(Boolean(document.getElementById("hero")));
    const t = setTimeout(checkHero, 0);
    checkHero();

    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    const onClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : originalOverflow || "";

    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isOpen]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => setHeaderHeight(el.getBoundingClientRect().height);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (hasHeroBehind) {
      document.body.style.paddingTop = "0px";
    } else {
      document.body.style.paddingTop = `${Math.ceil(headerHeight)}px`;
    }

    return () => {
      document.body.style.paddingTop = "";
    };
  }, [hasHeroBehind, headerHeight]);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const linkBase =
    "relative uppercase tracking-wide transition text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mint/70 rounded";
  const linkActive = "text-mint";
  const linkIdle = "text-white hover:text-mint";

  const getLabel = (section) => {
    switch (section) {
      case "home":
        return "Home";
      case "cursos":
        return "Recursos";
      case "sobre-nosotros":
        return "Sobre Nosotros";
      case "red-sinew":
        return "Red Sinew";
      default:
        return section.charAt(0).toUpperCase() + section.slice(1);
    }
  };

  const renderLinks = (isMobileMenu = false) =>
    sections.map((section) => {
      const label = getLabel(section);

      if (section === "home") {
        return (
          <button
            key={section}
            onClick={() => {
              closeMenu();
            
              if (location.pathname === "/") {
                const hero = document.getElementById("hero");
                if (hero) {
                  hero.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                return;
              }
            
              navigate("/");
            }}
            className={`${linkBase} ${
              activeSection === section ? linkActive : linkIdle
            } ${isMobileMenu ? "text-base" : "text-sm"}`}
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
          } ${isMobileMenu ? "text-base" : "text-sm"}`}
        >
          {label}
        </Link>
      );
    });

  const isTopTransparent = !isOpen && !scrolled;
  const bgColor = isOpen
    ? "rgba(11,18,34,1)"
    : scrolled
    ? "rgba(5,12,38,0.75)"
    : "rgba(5,12,38,0.18)";

  const backdropClass = isTopTransparent ? "backdrop-blur-0" : "backdrop-blur-md";
  const showBorder = isOpen || scrolled;
  const showShadow = isOpen || scrolled;

  const headerHeightClasses = isLandscapePhone
    ? "h-12"
    : isMobile
    ? scrolled || isOpen
      ? "h-14"
      : "h-16"
    : scrolled || isOpen
    ? "h-20"
    : "h-24";

  const logoHeightClasses = isLandscapePhone
    ? "h-8"
    : isMobile
    ? "h-10 sm:h-12"
    : "h-14 sm:h-16 lg:h-20";

  return (
    <>
      <div
        className="fixed top-0 left-0 h-1 bg-mint z-[70] transition-[width]"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[65] transition-all duration-500"
        role="navigation"
        aria-label="Principal"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
      >
        <div
          className={`absolute inset-0 -z-10 ${backdropClass} transition-all duration-500 ${
            showBorder ? "border-b border-white/10" : "border-b border-transparent"
          } ${showShadow ? "shadow-[0_8px_30px_rgba(0,0,0,0.28)]" : "shadow-none"}`}
          style={{ backgroundColor: bgColor }}
          aria-hidden="true"
        />

        <div
          className={`w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 flex justify-between items-center transition-all ${headerHeightClasses}`}
        >
          <Link
            to="/"
            className="flex items-center group shrink-0"
            aria-label="Ir al inicio"
            onClick={() => {
              if (location.pathname === "/") {
                const hero = document.getElementById("hero");
                if (hero) hero.scrollIntoView({ behavior: "smooth", block: "start" });
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img
              src={sinewLogo}
              alt="SINEW Logo"
              className={`w-auto transition-transform duration-300 group-hover:scale-[1.03] drop-shadow-[0_0_18px_rgba(152,245,225,0.25)] ${logoHeightClasses}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 font-medium ml-8">
            <div className="flex items-center gap-6 xl:gap-8 2xl:gap-10">
              {renderLinks(false)}
            </div>

            {!user ? (
              <div className="flex items-center gap-3 xl:gap-4 ml-2">
                <Link
                  to="/login"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition relative group"
                  aria-label="Iniciar sesión"
                  title="Iniciar sesión"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-white group-hover:text-mint transition" />
                </Link>
                <Link
                  to="/register"
                  className="p-2 rounded-full bg-mint text-[#0d1b2a] hover:opacity-90 transition shadow-[0_0_18px_rgba(152,245,225,0.35)]"
                  aria-label="Registrarse"
                  title="Crear cuenta"
                >
                  <UserPlusIcon className="h-6 w-6" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 xl:gap-4 ml-2">
                <Link
                  to="/perfil"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition"
                  aria-label="Perfil"
                  title="Mi perfil"
                >
                  <UserCircleIcon className="h-6 w-6 text-white hover:text-mint" />
                </Link>

                <Link
                  to="/ajustes"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition"
                  aria-label="Ajustes de cuenta"
                  title="Ajustes"
                >
                  <Cog6ToothIcon className="h-6 w-6 text-white hover:text-mint" />
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition group"
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-white group-hover:text-mint transition" />
                </button>
              </div>
            )}
          </nav>

          <button
            onClick={toggleMenu}
            className="lg:hidden relative w-10 h-10 focus:outline-none"
            aria-label="Abrir menú"
            title="Menú"
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
                src={sinewLogo}
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
              <div className="flex items-center gap-4">
                <Link
                  to="/perfil"
                  onClick={closeMenu}
                  aria-label="Perfil"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition"
                >
                  <UserCircleIcon className="h-6 w-6 text-white hover:text-mint" />
                </Link>

                <Link
                  to="/ajustes"
                  onClick={closeMenu}
                  aria-label="Ajustes"
                  className="p-2 rounded-full bg-white/10 hover:bg-mint/20 transition"
                >
                  <Cog6ToothIcon className="h-6 w-6 text-white hover:text-mint" />
                </Link>

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
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;