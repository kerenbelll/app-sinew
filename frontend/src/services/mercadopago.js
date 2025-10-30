// src/services/mercadopago.js
export async function createPreference(payload) {
    const API = (import.meta.env.VITE_API_BASE || 'http://localhost:5001').replace(/\/$/, '');
  
    const res = await fetch(`${API}/api/mp/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`create-preference ${res.status} – cuerpo: ${text?.slice(0,300)}`);
    }
  
    let pref;
    try {
      pref = await res.json();
    } catch (e) {
      throw new Error('create-preference devolvió JSON inválido');
    }
  
    if (!pref?.id && !pref?.init_point) {
      throw new Error(`create-preference inválida: ${JSON.stringify(pref)}`);
    }
  
    return pref;
  }