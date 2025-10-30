// controllers/contactController.js
import ContactMessage from '../models/sendMessage.js';

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Por favor completa todos los campos.' });
  }

  try {
    const newMessage = await ContactMessage.create({ name, email, message });

    return res.status(201).json({
      message: 'Mensaje enviado correctamente.',
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Hubo un error al enviar el mensaje.',
      error: error.message,
    });
  }
};

export default sendMessage;