// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import API from '../api/api';

const Ctx = createContext(null);

// helpers de token (compat con legacy)
const readToken = () => localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
const writeToken = (t) => {
  if (!t) return;
  localStorage.setItem('auth_token', t);
  localStorage.setItem('token', t);
};
const clearToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token');
};

function setApiAuthHeader(token) {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);      // { id, name, email } | null
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = readToken();
      if (!token) {
        setApiAuthHeader(null);
        setUser(null);
        return;
      }
      setApiAuthHeader(token); // 👈 asegura header antes de pedir profile
      const { data } = await API.get('/users/profile'); // baseURL ya /api
      setUser({ id: data.id, name: data.name || '', email: data.email });
    } catch {
      clearToken();
      setApiAuthHeader(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // al montar, intentar hidratar desde storage
    const token = readToken();
    setApiAuthHeader(token || null);
    loadProfile();
  }, [loadProfile]);

  const login = useCallback(({ token, id, name, email }) => {
    if (token) {
      writeToken(token);
      setApiAuthHeader(token);
    }
    setUser({ id, name: name || '', email });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setApiAuthHeader(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      reloadProfile: loadProfile,
      // expone el token si querés, pero NO lo uses fuera del API centralizado
      token: readToken(),
    }),
    [user, loading, isAuthenticated, login, logout, loadProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  return useContext(Ctx);
}