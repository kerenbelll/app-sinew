// backend/controllers/redNetworkController.js
import RedNetworkLead from "../models/RedNetworkLead.js";
import { sendRedNetworkLeadEmail } from "../utils/mailer.js";

const ALLOWED_INTERESTS = [
  "Contactos",
  "Colaboración",
  "Oportunidades",
  "Aprender",
  "Ofrecer",
];

export const joinRedNetwork = async (req, res) => {
  try {
    const {
      fullName,
      profession,
      church,
      country,
      customCountry,
      city,
      whatsapp,
      email,
      interests,
    } = req.body;

    const normalizedCountry =
      country === "Otro"
        ? String(customCountry || "").trim()
        : String(country || "").trim();

    const cleanInterests = Array.isArray(interests)
      ? interests.filter((item) => ALLOWED_INTERESTS.includes(item))
      : [];

    if (
      !String(fullName || "").trim() ||
      !String(profession || "").trim() ||
      !normalizedCountry ||
      !String(city || "").trim() ||
      !String(whatsapp || "").trim() ||
      !String(email || "").trim()
    ) {
      return res.status(400).json({
        message: "Por favor completá todos los campos obligatorios.",
      });
    }

    const lead = await RedNetworkLead.create({
      fullName: String(fullName).trim(),
      profession: String(profession).trim(),
      church: String(church || "").trim(),
      country: normalizedCountry,
      city: String(city).trim(),
      whatsapp: String(whatsapp).trim(),
      email: String(email).trim().toLowerCase(),
      interests: cleanInterests,
    });

    try {
      await sendRedNetworkLeadEmail({
        fullName: lead.fullName,
        profession: lead.profession,
        church: lead.church,
        country: lead.country,
        city: lead.city,
        whatsapp: lead.whatsapp,
        email: lead.email,
        interests: lead.interests,
      });
    } catch (mailError) {
      console.error("[RED NETWORK] error enviando mail:", mailError.message);
    }

    return res.status(201).json({
      message: "Solicitud enviada correctamente.",
      data: lead,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error al enviar la solicitud.",
      error: error.message,
    });
  }
};