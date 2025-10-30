#!/usr/bin/env bash
set -euo pipefail

# ==== Config ====
USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/frontend"
DIST_DIR_LOCAL="dist"
ENV_FILE_LOCAL=".env.production"
VITE_API_BASE_VALUE="https://api.sineworg.com"   # <— IMPORTANTE: tu API

# ==== Pre-flight ====
if [ ! -f package.json ]; then
  echo "❌ Ejecutá este script desde la raíz del proyecto (donde está package.json)."
  exit 1
fi

# Si existe lock, usamos ci; sino, install
if [ -f package-lock.json ]; then
  PKG_CMD="npm ci"
else
  PKG_CMD="npm install"
fi

# ==== Build ====
echo "VITE_API_BASE=${VITE_API_BASE_VALUE}" > "${ENV_FILE_LOCAL}"
echo "✔ .env.production listo con VITE_API_BASE=${VITE_API_BASE_VALUE}"

${PKG_CMD}
npm run build

# Verificación de build
if [ ! -d "${DIST_DIR_LOCAL}" ] || [ -z "$(ls -A "${DIST_DIR_LOCAL}")" ]; then
  echo "❌ No se generó dist/ correctamente."
  exit 1
fi

# ==== Deploy ====
# Subida (rsync preferido, scp fallback)
if command -v rsync >/dev/null 2>&1; then
  rsync -avz --delete "${DIST_DIR_LOCAL}/" "${USER}@${HOST}:${REMOTE_DIR}/dist/"
else
  ssh "${USER}@${HOST}" "mkdir -p ${REMOTE_DIR}/dist"
  scp -r "${DIST_DIR_LOCAL}/"* "${USER}@${HOST}:${REMOTE_DIR}/dist/"
fi

# Propietario/Permisos + test y reload de Nginx
ssh "${USER}@${HOST}" "
  chown -R www-data:www-data ${REMOTE_DIR}/dist &&
  find ${REMOTE_DIR}/dist -type d -exec chmod 755 {} \; &&
  find ${REMOTE_DIR}/dist -type f -exec chmod 644 {} \; &&
  nginx -t && systemctl reload nginx || true
"

echo "✅ Deploy FRONTEND completo"