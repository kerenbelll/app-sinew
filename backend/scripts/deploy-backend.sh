#!/usr/bin/env bash
set -euo pipefail

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/backend"

# 1) Backup remoto rápido
ssh "$USER@$HOST" "mkdir -p $REMOTE_DIR && cd $REMOTE_DIR && tar -czf /root/backend-backup-\$(date +%F-%H%M%S).tgz . || true"

# 2) Subir archivos cambiados (routes, models, controllers, utils, package*)
scp -r \
  index.js package.json package-lock.json \
  routes/mercadoPagoRoutes.js routes/paypalRoutes.js routes/purchaseRoutes.js routes/downloadRoutes.js routes/courseRoutes.js \
  models/Course.js models/CourseAccess.js models/DownloadToken.js \
  controllers/downloadController.js \
  utils/mailer.js \
  "$USER@$HOST:$REMOTE_DIR/"

# 3) Instalar deps y reiniciar PM2 (unificar en "backend")
ssh "$USER@$HOST" bash -lc "
  cd $REMOTE_DIR
  npm ci

  # matar y borrar duplicados si existieran
  pm2 stop sinew-backend >/dev/null 2>&1 || true
  pm2 delete sinew-backend >/dev/null 2>&1 || true

  # asegurar que 'backend' exista y use este cwd
  if pm2 list | grep -q ' backend '; then
    pm2 restart backend --update-env
  else
    pm2 start index.js --name backend --cwd $REMOTE_DIR --update-env
  fi
  pm2 save
"

# 4) Health checks locales al droplet (puerto 5001)
ssh "$USER@$HOST" bash -lc '
  curl -s http://127.0.0.1:5001/__routes >/dev/null && echo "✅ /__routes OK" || echo "❌ /__routes FAIL"
  echo -n "PayPal ping: " && curl -s http://127.0.0.1:5001/api/paypal/ping || true; echo
  echo -n "MP ping: " && curl -s http://127.0.0.1:5001/api/mp/ping || true; echo
'

echo "✅ Backend actualizado."