#!/usr/bin/env bash
set -euo pipefail

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/frontend"

# --- 1) Backup remoto rápido ---
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/frontend-backup-\$(date +%F-%H%M%S).tgz . || true"

# --- 2) Build local ---
echo "🏗️  Generando build local..."
cd "$(dirname "$0")/.."  # ir al directorio raíz del frontend
npm run build

# --- 3) Subir build al servidor ---
echo "🚀 Subiendo build al droplet..."
rsync -avz --delete \
  --exclude ".env" \
  --exclude "node_modules/" \
  --exclude ".DS_Store" \
  dist/ "$USER@$HOST:$REMOTE_DIR/dist/"

# --- 4) Actualizar archivos base (index.html, favicon, vite.config.js, etc.) ---
rsync -avz --delete \
  --exclude "node_modules/" \
  --exclude ".env" \
  --exclude ".DS_Store" \
  --exclude "dist/" \
  . "$USER@$HOST:$REMOTE_DIR/"

# --- 5) Health check simple ---
echo "🔎 Verificando frontend..."
ssh "$USER@$HOST" "curl -I -s https://www.sineworg.com | head -n 5 || true"

echo "✅ Frontend desplegado correctamente."