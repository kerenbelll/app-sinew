#!/usr/bin/env bash
set -euo pipefail

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/backend"

# --- 0) Comprobaciones rápidas locales ---
[ -d "backend" ] || { echo "❌ Ejecutá este script desde la raíz del repo (debe existir ./backend)"; exit 1; }
command -v rsync >/dev/null || { echo "❌ Falta rsync en tu Mac: brew install rsync"; exit 1; }

# --- 1) Backup remoto ---
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/backend-backup-\$(date +%F-%H%M%S).tgz . || true"

# --- 2) Sincronizar backend completo (EXCLUYENDO cosas sensibles o pesadas) ---
rsync -avz --delete \
  --exclude ".env" \
  --exclude "node_modules/" \
  --exclude "logs/" \
  --exclude ".DS_Store" \
  --exclude "protected-pdfs/" \
  backend/ "$USER@$HOST:$REMOTE_DIR/"

# --- 3) Instalar deps y reiniciar PM2 ---
ssh "$USER@$HOST" bash -lc "
  set -euo pipefail
  cd $REMOTE_DIR
  # instala exacto según lockfile (si no hay cambios, es rápido)
  npm ci

  # matar alias viejos si existían
  pm2 stop sinew-backend >/dev/null 2>&1 || true
  pm2 delete sinew-backend >/dev/null 2>&1 || true

  # levantar/reiniciar 'backend'
  if pm2 list | grep -q ' backend '; then
    pm2 restart backend --update-env
  else
    pm2 start index.js --name backend --cwd $REMOTE_DIR --update-env
  fi
  pm2 save
"

# --- 4) Healthchecks (ajustá endpoints si hiciera falta) ---
ssh "$USER@$HOST" bash -lc '
  set -e
  echo -n "Ping puerto 5001: "
  (curl -sSf http://127.0.0.1:5001/health || curl -sSf http://127.0.0.1:5001/__routes) >/dev/null && echo "OK" || echo "FAIL"
  echo -n "PayPal ping: " && (curl -sS http://127.0.0.1:5001/api/paypal/ping || true); echo
  echo -n "MP ping: " && (curl -sS http://127.0.0.1:5001/api/mp/ping || true); echo
'

echo "✅ Backend actualizado."