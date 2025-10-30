// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import API from '../api/api';

const Ctx = createContext(null);

// helpers de token (compat)
const readToken = () => localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
const writeToken = (t) => {
  if (!t) return;
  localStorage.setItem('auth_token', t);
  localStorage.setItem('token', t); // compat con código legacy
};
const clearToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token');
};

export function UserProvider({ children }) {
  // user: { id, name, email } | null
  const [user, setUser] = useState(null);
  // loading: indica si estamos resolviendo el perfil inicial (evita parpadeos/loops)
  const [loading, setLoading] = useState(true);

  /**
   * Carga/valida el perfil usando el token guardado en localStorage.
   * - Si NO hay token: user=null.
   * - Si hay token inválido/expirado: lo borra y user=null.
   * - Si es válido: setea user con { id, name, email }.
   */
  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = readToken();
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await API.get('/users/profile'); // baseURL ya incluye /api
      setUser({ id: data.id, name: data.name || '', email: data.email });
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Al montar la app, valida token y resuelve estado inicial
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /**
   * login(): llamalo cuando el backend devuelva { token, user:{id,name,email} }
   * Guarda token en localStorage y setea user (sin re-pedir /profile).
   */
  const login = useCallback(({ token, id, name, email }) => {
    if (token) writeToken(token);
    setUser({ id, name: name || '', email });
  }, []);

  /** logout(): limpia token y user del contexto */
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // Derivados útiles
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      reloadProfile: loadProfile,
    }),
    [user, loading, isAuthenticated, login, logout, loadProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  return useContext(Ctx);
}