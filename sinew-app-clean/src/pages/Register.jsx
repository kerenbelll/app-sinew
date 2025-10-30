// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');

  const navigate = useNavigate();

  // Siempre forzamos a pegarle a /api
  const API_BASE = (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, '');

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Ingresá tu nombre';
    else if (name.trim().length < 2) e.name = 'Nombre muy corto';

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) e.email = 'Ingresá tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) e.email = 'Email inválido';

    if (!password) e.password = 'Ingresá una contraseña';
    else {
      if (password.length < 8) e.password = 'Mínimo 8 caracteres';
      if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        e.password = (e.password ? e.password + ' • ' : '') + 'Debe tener letras y números';
      }
    }

    if (!password2) e.password2 = 'Repetí la contraseña';
    else if (password !== password2) e.password2 = 'Las contraseñas no coinciden';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault(); // clave: no dejar que el form postee a /users/register
    setErrMsg('');
    setOkMsg('');
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setSubmitting(true);

      await axios.post(`${API_BASE}/api/users/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setOkMsg('Usuario registrado. Te redirigimos para iniciar sesión…');
      setTimeout(() => navigate('/login', { replace: true }), 900);
    } catch (err) {
      console.error('[REGISTER] error:', err);

      const status = err?.response?.status;
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '';

      if (status === 409 || /11000|duplicate/i.test(serverMsg)) {
        setErrMsg('Ese email ya está registrado. Probá iniciar sesión.');
      } else if (status === 400) {
        setErrMsg(serverMsg || 'Datos inválidos. Revisá el formulario.');
      } else if (status === 422) {
        setErrMsg(serverMsg || 'Validación fallida. Revisá los campos.');
      } else {
        setErrMsg(serverMsg || 'Error al registrar. Intentá de nuevo en unos minutos.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white px-4 py-16">
      <div className="w-full max-w-md bg-[#0b1222]/70 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">CREAR CUENTA</h2>

        {errMsg && (
          <div className="mb-4 p-3 rounded border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
            {errMsg}
          </div>
        )}
        {okMsg && (
          <div className="mb-4 p-3 rounded border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 text-sm">
            {okMsg}
          </div>
        )}

        {/* action para blindar contra submit nativo si se pierde el handler */}
        <form onSubmit={handleSubmit} action="javascript:void(0)" className="space-y-4" noValidate>
          {/* Nombre */}
          <div>
            <label htmlFor="reg-name" className="sr-only">Nombre</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`block w-full px-3 py-2 rounded-xl bg-white/5 border ${errors.name ? 'border-red-500/60' : 'border-white/10'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint`}
              autoComplete="name"
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'reg-name-err' : undefined}
            />
            {errors.name && (
              <p id="reg-name-err" className="text-red-300 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="sr-only">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full px-3 py-2 rounded-xl bg-white/5 border ${errors.email ? 'border-red-500/60' : 'border-white/10'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint`}
              autoComplete="email"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'reg-email-err' : undefined}
            />
            {errors.email && (
              <p id="reg-email-err" className="text-red-300 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="reg-password" className="sr-only">Contraseña</label>
            <div className="relative">
              <input
                id="reg-password"
                name="password"
                type={showPass1 ? 'text' : 'password'}
                placeholder="Contraseña (mín. 8, letras y números)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full px-3 py-2 rounded-xl bg-white/5 border ${errors.password ? 'border-red-500/60' : 'border-white/10'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint pr-24`}
                autoComplete="new-password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'reg-password-err' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPass1(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20"
              >
                {showPass1 ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && (
              <p id="reg-password-err" className="text-red-300 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmación */}
          <div>
            <label htmlFor="reg-password2" className="sr-only">Confirmar contraseña</label>
            <div className="relative">
              <input
                id="reg-password2"
                name="password2"
                type={showPass2 ? 'text' : 'password'}
                placeholder="Repetir contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={`block w-full px-3 py-2 rounded-xl bg-white/5 border ${errors.password2 ? 'border-red-500/60' : 'border-white/10'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint pr-24`}
                autoComplete="new-password"
                required
                aria-invalid={!!errors.password2}
                aria-describedby={errors.password2 ? 'reg-password2-err' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPass2(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20"
              >
                {showPass2 ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password2 && (
              <p id="reg-password2-err" className="text-red-300 text-xs mt-1">{errors.password2}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full px-4 py-2 rounded-xl text-black font-medium bg-mint hover:opacity-90 transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>

          <div className="text-sm text-white/80 text-center">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="underline underline-offset-4 hover:text-white transition">
              Iniciar sesión
            </Link>
          </div>

          <p className="text-xs text-white/60 mt-2">
            Consejito: usá una contraseña única, con mayúsculas, minúsculas y números.
          </p>
        </form>
      </div>
    </div>
  );
}