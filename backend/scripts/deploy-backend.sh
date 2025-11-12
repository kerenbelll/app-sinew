#!/usr/bin/env bash
set -euo pipefail

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/backend"
HEALTH_LOCAL="http://127.0.0.1:5001/health"
HEALTH_EXT="https://api.sineworg.com/api/paypal/ping"

# 0) Comprobaciones locales
[ -d "backend" ] || { echo "❌ Ejecutá este script desde la raíz del repo (debe existir ./backend)"; exit 1; }
command -v rsync >/dev/null || { echo "❌ Falta rsync en tu Mac: brew install rsync"; exit 1; }

# 1) Backup remoto
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/backend-backup-\$(date +%F-%H%M%S).tgz . || true"

# 2) Sincronizar backend (sin .env, sin node_modules)
rsync -avz --delete \
  --exclude ".env" \
  --exclude "node_modules/" \
  --exclude "logs/" \
  --exclude ".DS_Store" \
  --exclude "protected-pdfs/" \
  backend/ "$USER@$HOST:$REMOTE_DIR/"

# 3) Instalar deps y reiniciar PM2
ssh "$USER@$HOST" bash -lc "
  set -euo pipefail
  cd $REMOTE_DIR
  [ -f package-lock.json ] && npm ci || npm install

  # arrancar / reiniciar
  if pm2 list | grep -q ' backend '; then
    pm2 restart backend --update-env
  else
    pm2 start index.js --name backend --cwd $REMOTE_DIR --update-env
  fi
  pm2 save
"

# 4) Healthchecks rápidos
ssh "$USER@$HOST" bash -lc "
  set -e
  echo -n 'Ping puerto 5001 (local): '
  (curl -sSf $HEALTH_LOCAL >/dev/null || curl -sSf http://127.0.0.1:5001/__routes >/dev/null) && echo OK || echo FAIL
"
echo -n "Ping público (PayPal ping): "
curl -s "$HEALTH_EXT" || true
echo
echo "✅ Backend actualizado."