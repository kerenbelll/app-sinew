// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Forgot password modal
  const [fpOpen, setFpOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState('');

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Siempre forzamos a pegarle a /api
  const API_BASE = (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, '');

  const safeDestAfterLogin = () => {
    const rawFrom = location.state?.from;
    try {
      // rawFrom puede ser string ("/cursos/x?buy=1") o un objeto { pathname, search }
      const url = new URL(
        typeof rawFrom === 'string'
          ? rawFrom
          : (rawFrom?.pathname || '/') + (rawFrom?.search || ''),
        window.location.origin
      );
      url.searchParams.delete('buy'); // 👈 limpiamos el query
      return url.pathname + url.search || '/';
    } catch {
      return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE}/api/users/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('auth_token', data.token); // compat
      }
      login({ token: data?.token, ...data.user });
      navigate(safeDestAfterLogin(), { replace: true });
    } catch (err) {
      console.error('[LOGIN] error:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setErrMsg(serverMsg || 'Login fallido. Verificá tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const openForgot = () => {
    setFpEmail(email || '');
    setFpMsg('');
    setFpOpen(true);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setFpMsg('');
    if (!fpEmail.trim()) {
      setFpMsg('Ingresá tu email para recuperar la contraseña.');
      return;
    }
    try {
      setFpLoading(true);
      const { data } = await axios.post(`${API_BASE}/api/users/forgot-password`, { email: fpEmail }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setFpMsg(
        data?.message ||
        'Si el email está registrado, te enviamos instrucciones para resetear la contraseña.'
      );
    } catch (err) {
      console.error('[FORGOT] error:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setFpMsg(serverMsg || 'No pudimos procesar la solicitud. Probá más tarde.');
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white px-4 py-16">
      <div className="w-full max-w-md bg-[#0b1222]/70 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">INICIAR SESIÓN</h2>

        {errMsg && (
          <div className="mb-4 p-3 rounded border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
            {errMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint pr-24"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20"
              >
                {showPass ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-xl text-black font-medium bg-mint hover:opacity-90 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Ingresando…' : 'Entrar'}
          </button>

          <div className="flex items-center justify-between text-sm text-white/80">
            <button
              type="button"
              onClick={openForgot}
              className="underline underline-offset-4 hover:text-white transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <Link
              to="/register"
              className="underline underline-offset-4 hover:text-white transition"
            >
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>

      {/* Modal de recuperación */}
      {fpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-[#0b1222] border border-white/10 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Recuperar contraseña</h3>
              <button
                type="button"
                onClick={() => setFpOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-white/70 mb-4">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleForgot} className="space-y-3">
              <label htmlFor="fp-email" className="sr-only">Email</label>
              <input
                id="fp-email"
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="tu@email.com"
                className="block w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint"
                required
              />
              <button
                type="submit"
                disabled={fpLoading}
                className={`w-full px-4 py-2 rounded-xl text-black font-medium bg-mint hover:opacity-90 transition ${fpLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {fpLoading ? 'Enviando…' : 'Enviar instrucciones'}
              </button>
            </form>

            {fpMsg && (
              <div className="mt-3 p-3 rounded border border-white/10 bg-white/5 text-sm">
                {fpMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}