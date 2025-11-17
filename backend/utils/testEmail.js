import { sendCourseAccessEmail } from "../utils/mailer.js";

const email = process.argv[2] || "kerenbelmart@gmail.com";

(async () => {
  console.log("Enviando mail de prueba a:", email);

  const r = await sendCourseAccessEmail({
    toEmail: email,
    buyerName: "Prueba Estética",
    courseTitle: "Renovación de la Mente",
    courseUrl: "https://sineworg.com/cursos/masterclass?paid=1"
  });

  console.log("Resultado:", r);
  process.exit(0);
})();