// scripts/simulate_purchase.js
// Uso: node scripts/simulate_purchase.js <email> <password_opcional> [BOOK_ID]
// Si no pasás password, intenta con la var de entorno PASS o te pedirá por stdin.

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const API = process.env.API || 'https://api.sineworg.com';

async function promptSecret(promptText) {
  const rl = readline.createInterface({ input, output });
  const pwd = await rl.question(promptText);
  rl.close();
  return pwd.trim();
}

async function main() {
  const email = process.argv[2];
  let pass  = process.argv[3] || process.env.PASS || '';
  const bookIdArg = process.argv[4] || '';

  if (!email) {
    console.error('Uso: node scripts/simulate_purchase.js <email> <password_opcional> [BOOK_ID]');
    process.exit(1);
  }
  if (!pass) {
    pass = await promptSecret('Password: ');
  }

  // 1) Login
  const loginRes = await fetch(`${API}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ email, password: pass }),
  });
  if (!loginRes.ok) {
    const t = await loginRes.text();
    throw new Error(`Login fallo ${loginRes.status}: ${t}`);
  }
  const login = await loginRes.json();
  const token = login.token;
  if (!token) throw new Error('Login ok pero sin token');

  console.log('✓ Login OK. Usuario:', login?.user?.email);

  // 2) Obtener bookId si no vino por arg
  let bookId = bookIdArg;
  if (!bookId) {
    const booksRes = await fetch(`${API}/api/book`);
    if (!booksRes.ok) {
      const t = await booksRes.text();
      throw new Error(`No pude listar libros: ${booksRes.status} ${t}`);
    }
    const books = await booksRes.json();
    if (!Array.isArray(books) || books.length === 0) {
      throw new Error('No hay libros en /api/book');
    }
    bookId = books[0]._id || books[0].id;
    console.log('→ Usando BOOK_ID =', bookId, '|', books[0]?.title);
  } else {
    console.log('→ Usando BOOK_ID (CLI) =', bookId);
  }

  // 3) Comprar (manual/simulado)
  const buyRes = await fetch(`${API}/api/purchase/buy/${bookId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':'application/json'
    }
  });
  if (!buyRes.ok) {
    const t = await buyRes.text();
    throw new Error(`Compra fallo ${buyRes.status}: ${t}`);
  }
  const out = await buyRes.json();

  console.log('\n=== RESULTADO COMPRA SIMULADA ===');
  console.log(JSON.stringify(out, null, 2));
  console.log('\n• Abri /gracias con el token para probar la descarga automática:');
  console.log(' ', out.downloadLink || '(sin link)');
  console.log('• Endpoint crudo de descarga (una vez):');
  console.log(' ', out.rawDownload || '(sin link)');
}

main().catch(e => {
  console.error('ERROR:', e?.message || e);
  process.exit(1);
});
