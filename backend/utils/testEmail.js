import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

async function sendTestEmail() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'SINEW <info@sineworg.com>',  // tu dominio verificado en Resend
      to: 'kerenbelmart@gmail.com',        // poné tu casilla real para probar
      subject: 'Prueba de envío con Resend ✅',
      html: '<p>Hola! Este es un correo de <strong>prueba</strong> enviado con Resend.</p>',
    });

    console.log('Correo enviado:', result);
  } catch (err) {
    console.error('Error enviando correo:', err);
  }
}

sendTestEmail();