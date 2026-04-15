#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/frontend"

echo "🗂️ Generando backup remoto del frontend..."
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/frontend-backup-\$(date +%F-%H%M%S).tgz . || true"

echo "🏗️ Generando build local (frontend)..."
cd "$FRONTEND_DIR"
[ -f package-lock.json ] && npm ci || npm install

printf "VITE_API_BASE=https://api.sineworg.com\n" > .env.production
npm run build

echo "🚀 Subiendo build al droplet..."
rsync -avz --delete "dist/" "$USER@$HOST:$REMOTE_DIR/dist/"

echo "🔐 Corrigiendo permisos en dist..."
ssh "$USER@$HOST" "
  find $REMOTE_DIR/dist -type d -exec chmod 755 {} \; &&
  find $REMOTE_DIR/dist -type f -exec chmod 644 {} \;
"

echo "📦 Sincronizando archivos base del frontend..."
rsync -avz --delete \
  --exclude "node_modules/" \
  --exclude ".env" \
  --exclude ".env.production" \
  --exclude ".DS_Store" \
  --exclude "dist/" \
  "$FRONTEND_DIR/" "$USER@$HOST:$REMOTE_DIR/"

echo "🔎 Verificando frontend..."
ssh "$USER@$HOST" "curl -I -s https://www.sineworg.com | head -n 5 || true"
ssh "$USER@$HOST" "curl -I -s https://sineworg.com/assets/cursos/entendiendo.png | head -n 5 || true"

echo "✅ Frontend desplegado correctamente."