// scripts/create_mp_preference.js
// Uso: node scripts/create_mp_preference.js [ARS_precio] ["Titulo"] ["email_comprador"]

const API = process.env.API || 'https://api.sineworg.com';

async function main() {
  const price = Number(process.argv[2] || 12900);
  const title = process.argv[3] || 'Libro digital - SINEW';
  const buyerEmail = process.argv[4] || `comprador-test+${Date.now()}@example.com`;

  const body = {
    price,
    currency: 'ARS',
    title,
    buyer: { name: 'APRO', email: buyerEmail },
    metadata: { source: 'cli' }
  };

  const r = await fetch(`${API}/api/mp/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`create-preference ${r.status}: ${t}`);
  }
  const json = await r.json();
  const initPoint = json.init_point || json.sandbox_init_point;
  if (!initPoint) throw new Error(`Respuesta sin init_point: ${JSON.stringify(json)}`);

  console.log('✓ Preferencia creada');
  console.log('ID:', json.id);
  console.log('INIT POINT:', initPoint);
  console.log('\nAbrí ese enlace en el navegador y paga con tarjeta de prueba.');
  console.log('Tarjeta VISA prueba: 4509 9535 6623 3704 | Vto 12/30 | CVV 123 | DNI 12345678');
}

main().catch(e=>{
  console.error('ERROR:', e?.message || e);
  process.exit(1);
});

