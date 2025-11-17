// src/services/mercadopago.js
export async function createPreference({ price, currency = "ARS", title, buyer = {}, metadata = {} }) {
  const API = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");

  const res = await fetch(`${API}/api/mp/create-preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price, currency, title, buyer, metadata }),
  });

  let payload = null;
  try { payload = await res.json(); } catch { /* noop */ }

  if (!res.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `MP create-preference ${res.status}`;
    throw new Error(message);
  }

  const src = payload?.body && typeof payload.body === "object" ? payload.body : payload;

  const id = src?.id || payload?.id || payload?.body?.id || null;

  // ⚠️ AHORA: preferimos SIEMPRE init_point (checkout "normal")
  const initPoint =
    src?.init_point ||
    payload?.init_point ||
    payload?.body?.init_point ||
    src?.sandbox_init_point || // fallback si algún día lo necesitás
    payload?.sandbox_init_point ||
    payload?.body?.sandbox_init_point ||
    null;

  if (!id || !initPoint) {
    console.warn("MP payload:", payload);
    throw new Error("Respuesta de MP sin 'id' o 'init_point'.");
  }

  return {
    id,
    init_point: initPoint,
    sandbox_init_point: src?.sandbox_init_point || payload?.sandbox_init_point || null,
  };
}