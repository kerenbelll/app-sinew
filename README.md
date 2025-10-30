# 🧩 SINEW — Plataforma integral para formación y comunidad

SINEW es una aplicación web full-stack desarrollada con **React + Vite** en el frontend y **Node.js + Express + MongoDB** en el backend.  
Permite gestionar cursos, descargas protegidas, pagos integrados (MercadoPago y PayPal) y acceso personalizado para los usuarios registrados.

---

## 🚀 Estructura del proyecto

sinew-app/
│
├── backend/         # API REST (Express + MongoDB)
│   ├── models/      # Modelos de datos Mongoose
│   ├── routes/      # Endpoints del servidor
│   ├── controllers/ # Lógica de negocio
│   ├── utils/       # Mailer y scripts auxiliares
│   ├── scripts/     # Seeds y herramientas de deploy
│   └── .env         # Variables del entorno (ignorada)
│
├── frontend/        # Aplicación React + Vite
│   ├── src/         # Componentes, páginas y assets
│   ├── public/      # Archivos estáticos
│   └── .env         # Variables de entorno frontend (ignorada)
│
└── README.md

---

## ⚙️ Requisitos

- Node.js 18 o superior  
- npm 9 o superior  
- MongoDB (local o Atlas)  
- Cuenta de PayPal Sandbox y/o MercadoPago Developers  
- Clave de API de servicio de mail (Resend / Nodemailer)

---

## 🧠 Instalación

Cloná el repositorio y accedé al proyecto:

```bash
git clone https://github.com/kerenbelll/app-sinew.git
cd app-sinew

🔹 Backend
cd backend
cp .env.example .env
npm ci
nodemon index.js

🔹 Frontend
cd frontend
cp .env.example .env
npm ci
npm run dev

El frontend se inicia en http://localhost:5173
y el backend escucha en http://localhost:5001.

💰 Pagos simulados

Para probar los flujos de pago sin afectar cuentas reales:
# MercadoPago
node backend/scripts/create_mp_preference.js

# PayPal (sandbox)
node backend/scripts/simulate_purchase.js

🧾 Notas
	•	Los videos grandes (como ClaseIntro.mp4) se sirven externamente y no forman parte del repo.
Se recomienda alojarlos en YouTube (no listado) o en un bucket (S3 / R2) y enlazarlos desde el frontend.
	•	Los archivos .env y PDFs protegidos están ignorados en .gitignore.
	•	Si clonas el repo y algo falla, corré npm ci en ambas carpetas para reinstalar dependencias limpias.

⸻

👩‍💻 Autora

Desarrollado por Keren Martínez
Full Stack Developer — Project Lead en SINEW
📧 info@sineworg.com
📍 Buenos Aires, Argentina

🔗 Proyecto en GitHub: [github.com/kerenbelll/app-sinew](https://github.com/kerenbelll/app-sinew)
🌐 Sitio en producción: [www.sineworg.com](https://www.sineworg.com)

👥 Equipo SINEW

Proyecto institucional de SINEW — Plataforma integral de formación y comunidad
🌐 www.sineworg.com
📧 info@sineworg.com
© 2025 SINEW. Todos los derechos reservados.