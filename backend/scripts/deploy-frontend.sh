#!/usr/bin/env bash
set -euo pipefail

# === Rutas absolutas, sin depender de desde dónde lo ejecutes ===
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"      # .../sinew-app
FRONTEND_DIR="$REPO_ROOT/frontend"

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/frontend"

# 1) Backup remoto
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/frontend-backup-\$(date +%F-%H%M%S).tgz . || true"

# 2) Build local del frontend
echo "🏗️  Generando build local (frontend)..."
cd "$FRONTEND_DIR"
[ -f package-lock.json ] && npm ci || npm install
printf "VITE_API_BASE=https://api.sineworg.com\n" > .env.production
npm run build

# 3) Subir dist/ al droplet
echo "🚀 Subiendo build al droplet..."
rsync -avz --delete "dist/" "$USER@$HOST:$REMOTE_DIR/dist/"

# 4) (opcional) Sincronizar los archivos base del proyecto (sin node_modules ni dist)
rsync -avz --delete \
  --exclude "node_modules/" --exclude ".env" --exclude ".DS_Store" --exclude "dist/" \
  "$FRONTEND_DIR/" "$USER@$HOST:$REMOTE_DIR/"

# 5) Health check
echo "🔎 Verificando frontend..."
ssh "$USER@$HOST" "curl -I -s https://www.sineworg.com | head -n 5 || true"

echo "✅ Frontend desplegado correctamente."