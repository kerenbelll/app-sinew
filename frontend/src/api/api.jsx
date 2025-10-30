// src/api/api.js
import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE || window.location.origin).replace(/\/$/, "");
const API = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: false,
});

// Leer token (compat: auth_token o token)
function readToken() {
  return localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
}

// Interceptor: agrega Authorization si hay token
API.interceptors.request.use((config) => {
  const t = readToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Interceptor de respuesta: si 401, limpiamos tokens
API.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default API;