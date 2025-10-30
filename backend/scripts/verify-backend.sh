#!/usr/bin/env bash
set -euo pipefail

USER="root"
HOST="167.71.84.222"
REMOTE_DIR="/var/www/sineworg/backend"
FRONT_URL="https://sineworg.com"

# Pings externos (NGINX→node)
echo -n "PayPal ping (https): " && curl -s "$FRONT_URL/api/paypal/ping" || true; echo
echo -n "MP ping (https): " && curl -s "$FRONT_URL/api/mp/ping" || true; echo

# Generar un token 24h en Mongo y chequear HEAD/GET
ssh "$USER@$HOST" "node --input-type=module" <<'NODE'
import 'dotenv/config';
import mongoose from 'mongoose';
import crypto from 'crypto';
import DownloadToken from '/var/www/sineworg/backend/models/DownloadToken.js';
import User from '/var/www/sineworg/backend/models/User.js';

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });

const email = 'tester@sineworg.com';
const name = 'Verificador Deploy';
let user = await User.findOne({ email });
if (!user) user = await User.create({ email, name, passwordHash: 'TEMP' });

const token = crypto.randomBytes(32).toString('hex');
const expiresAt = new Date(Date.now() + 24*60*60*1000);
await DownloadToken.create({ userId: user._id, token, expiresAt, used: false });

console.log(token);
await mongoose.disconnect();
NODE