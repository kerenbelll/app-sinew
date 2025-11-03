#!/usr/bin/env bash
set -euo pipefail

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/frontend"

# Ubicación real del frontend (carpeta padre del script)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$FRONTEND_DIR/package.json" ]; then
  echo "❌ No encuentro $FRONTEND_DIR/package.json. Verificá que el frontend esté completo."
  exit 1
fi

# 1) Backup remoto
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/frontend-backup-\$(date +%F-%H%M%S).tgz . || true"

# 2) Build local
echo "🏗️  Generando build local..."
cd "$FRONTEND_DIR"
npm run build

# 3) Subir build (dist/)
echo "🚀 Subiendo build..."
rsync -avz --delete \
  --exclude ".env" --exclude "node_modules/" --exclude ".DS_Store" \
  dist/ "$USER@$HOST:$REMOTE_DIR/dist/"

# 4) Subir base del proyecto (index.html, vite.config, etc.)
rsync -avz --delete \
  --exclude "node_modules/" --exclude ".env" --exclude ".DS_Store" --exclude "dist/" \
  . "$USER@$HOST:$REMOTE_DIR/"

# 5) Health check
echo "🔎 Verificando frontend..."
ssh "$USER@$HOST" "curl -I -s https://www.sineworg.com | head -n 5 || true"

echo "✅ Frontend desplegado correctamente."