// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Cursos from "./pages/Cursos";
import CursoDetalle from "./pages/CursoDetalle";
import Comunidad from "./pages/Comunidad";
import Contacto from "./pages/Contacto";

import SynergyPage from "./pages/SynergyPage";
import XTalentPage from "./pages/XTalentPage";
import CorpPage from "./pages/CorpPage";

import Ramas from "./components/Ramas";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Gracias from "./pages/Gracias";
import Download from "./pages/Download";
import ResetPassword from "./pages/ResetPassword";

import { UserProvider, useUser } from "./context/UserContext";

// ===== Loader full-screen mientras se resuelve `user` =====
function FullScreenLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-white text-black">
      <div className="flex items-center gap-3 text-sm text-black/70">
        <span className="inline-block size-3 rounded-full animate-pulse bg-black/60" />
        Cargando…
      </div>
    </div>
  );
}

// ===== Rutas que requieren login =====
function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

// ===== Rutas públicas exclusivas (login/register) =====
function PublicOnlyRoute({ children, to = "/checkout" }) {
  const { user, loading } = useUser();
  if (loading) return <FullScreenLoader />;
  if (user) return <Navigate to={to} replace />;
  return children;
}

// ===== App =====
export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quart",
      offset: 40,
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <UserProvider>
        <Router>
          <Navbar />
          {/* Forzar scroll arriba en cada navegación */}
          <ScrollToTop behavior="instant" />

          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/ramas" element={<Ramas />} />

            {/* Catálogo y detalle de cursos */}
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/cursos/:slug" element={<CursoDetalle />} />

            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/contacto" element={<Contacto />} />

            {/* Páginas informativas */}
            <Route path="/synergy" element={<SynergyPage />} />
            <Route path="/xtalent" element={<XTalentPage />} />
            <Route path="/corp" element={<CorpPage />} />

            {/* Auth: si ya está logueado, no mostrar estas páginas */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute to="/checkout">
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute to="/checkout">
                  <Register />
                </PublicOnlyRoute>
              }
            />

            {/* Protegidas */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gracias"
              element={
                  <Gracias />             
              }
            />

            {/* Páginas con token en URL (no requieren login) */}
            <Route path="/download/:token" element={<Download />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
}