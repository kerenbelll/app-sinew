// backend/scripts/seed-courses.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";

// cargar .env
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Falta MONGO_URI en .env");

  await mongoose.connect(uri);
  console.log("✅ Conectado a Mongo para seed");

  const data = [
    {
      slug: "comunicacion",
      title: "El Padre, el Árbol y el Maestro",
      level: "free",
      short: "Fundamentos para una relación sana con Dios.",
      long:
        "¿Peleas con el pecado y ciclos que se repiten en el tiempo? ...",
      price: 0,
      currency: "USD",
      thumbnail: "/assets/cursos/arbol.jpg",
      lessons: [
        { title: "Intro",   videoUrl: "https://youtu.be/R_XP5HOfzxo" },
        { title: "Clase 1", videoUrl: "https://www.youtube.com/watch?v=tbbF_Y6qIQM" },
        { title: "Clase 2", videoUrl: "https://www.youtube.com/watch?v=yfLieVNSe4s" },
        { title: "Clase 3", videoUrl: "https://www.youtube.com/watch?v=5N6pPBhJy0I" },
      ],
    },
    {
      slug: "pro-avanzado",
      title: "Comunicación, tecnología y el plan de Dios",
      level: "pro",
      short: "Ubicá la tecnología y las ideologías en el Plan de Dios.",
      long:
        "¿Te abruma el avance vertiginoso de la tecnología? ...",
      price: 35,
      currency: "USD",
      thumbnail: "/assets/cursos/tecnologia.jpg",
      lessons: [
        { title: "Intro",   videoUrl: "https://www.youtube.com/watch?v=MBZR8MboWbE" },
        { title: "Clase 1", videoUrl: "https://www.youtube.com/watch?v=rbFUT_u-jFc" },
        { title: "Clase 2", videoUrl: "https://www.youtube.com/watch?v=0tgE0lPPO4o" },
        // ...
      ],
    },
    {
      slug: "masterclass",
      title: "Renovación de la Mente",
      level: "pro",
      short: "Herramientas bíblicas prácticas para tu llamado.",
      long:
        "¿Te sentís dividido internamente? ...",
      price: 35,
      currency: "USD",
      thumbnail: "/assets/cursos/renovacion.jpg",
      lessons: [
        { title: "Intro",   videoUrl: "https://www.youtube.com/watch?v=Vgaolsn4cH8" },
        { title: "Clase 1", videoUrl: "https://www.youtube.com/watch?v=beIPGnOYIdQ" },
        // ...
      ],
    },
  ];

  await Course.deleteMany({});
  await Course.insertMany(data);
  console.log("🌱 Seed OK: 3 cursos insertados");

  await mongoose.disconnect();
  console.log("🔌 Desconectado");
}

main().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});