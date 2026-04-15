import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import FondoParticulas from "../components/FondoParticulas";

const API_BASE = (
  import.meta.env.VITE_API_BASE || "http://localhost:5001"
).replace(/\/$/, "");

const COUNTRY_OPTIONS = [
  "Argentina",
  "España",
  "Chile",
  "Uruguay",
  "Paraguay",
  "México",
  "Colombia",
  "Perú",
  "Estados Unidos",
  "Otro",
];

const INTEREST_OPTIONS = [
  "Contactos",
  "Colaboración",
  "Oportunidades",
  "Aprender",
  "Ofrecer",
];

export default function UnirmeRed() {
  const [form, setForm] = useState({
    fullName: "",
    profession: "",
    church: "",
    country: "",
    customCountry: "",
    city: "",
    whatsapp: "",
    email: "",
    interests: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const finalCountry = useMemo(() => {
    return form.country === "Otro" ? form.customCountry.trim() : form.country;
  }, [form.country, form.customCountry]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (value) => {
    setForm((prev) => {
      const exists = prev.interests.includes(value);

      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== value)
          : [...prev.interests, value],
      };
    });
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Ingresá tu nombre y apellido.";
    if (!form.profession.trim()) return "Ingresá tu profesión o rubro.";
    if (!form.country) return "Seleccioná un país.";
    if (form.country === "Otro" && !form.customCountry.trim()) {
      return "Especificá tu país.";
    }
    if (!form.city.trim()) return "Ingresá tu ciudad.";
    if (!form.whatsapp.trim()) return "Ingresá tu WhatsApp.";
    if (!form.email.trim()) return "Ingresá tu email.";

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) return "Ingresá un email válido.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setOkMsg("");

    const validationError = validate();
    if (validationError) {
      setErrMsg(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName: form.fullName.trim(),
        profession: form.profession.trim(),
        church: form.church.trim(),
        country: form.country,
        customCountry: form.customCountry.trim(),
        city: form.city.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim().toLowerCase(),
        interests: form.interests,
      };

      const res = await fetch(`${API_BASE}/api/red-network/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "No pudimos enviar la solicitud.");
      }

      setOkMsg("Solicitud enviada correctamente. Pronto nos pondremos en contacto.");
      setForm({
        fullName: "",
        profession: "",
        church: "",
        country: "",
        customCountry: "",
        city: "",
        whatsapp: "",
        email: "",
        interests: [],
      });
    } catch (error) {
      setErrMsg(error.message || "Hubo un error al enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1222] to-transparent z-0" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[18%] left-[10%] h-[24rem] w-[24rem] rounded-full bg-white opacity-[0.03] blur-3xl" />
        <div className="absolute -top-20 right-[12%] h-[26rem] w-[26rem] rounded-full bg-[#98f5e1] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-[8%] left-[12%] h-[22rem] w-[22rem] rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] opacity-18">
        <FondoParticulas opacity={0.12} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-12 md:pt-16 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full"
        >
          <div className="mx-auto max-w-[980px]">
            <div className="text-center mb-12 md:mb-14">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">
                Red SINEW
              </p>

              <h1 className="mt-4 text-[clamp(28px,4vw,52px)] font-semibold tracking-tight leading-[0.98] text-white">
                Unirme a la red
              </h1>

              <p className="mt-4 max-w-2xl mx-auto text-white/68 text-[15px] md:text-[17px] leading-7 md:leading-8">
                Completá tus datos para comenzar a conectar con otros según tu
                rubro, vocación o interés.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 md:p-10 xl:p-12">
              {errMsg && (
                <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errMsg}
                </div>
              )}

              {okMsg && (
                <div className="mb-6 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint">
                  {okMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm text-white/72 mb-2">
                    Nombre y apellido
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="profession" className="block text-sm text-white/72 mb-2">
                    Profesión / Rubro
                  </label>
                  <input
                    id="profession"
                    name="profession"
                    type="text"
                    value={form.profession}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                    placeholder="Ej: Diseño, salud, educación"
                  />
                </div>

                <div>
                  <label htmlFor="church" className="block text-sm text-white/72 mb-2">
                    Iglesia
                  </label>
                  <input
                    id="church"
                    name="church"
                    type="text"
                    value={form.church}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                    placeholder="Tu iglesia"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm text-white/72 mb-2">
                    País
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                  >
                    <option value="" className="text-black">
                      Seleccionar país
                    </option>
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country} value={country} className="text-black">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm text-white/72 mb-2">
                    Ciudad
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                    placeholder="Tu ciudad"
                  />
                </div>

                {form.country === "Otro" && (
                  <div className="md:col-span-2">
                    <label htmlFor="customCountry" className="block text-sm text-white/72 mb-2">
                      Especificá tu país
                    </label>
                    <input
                      id="customCountry"
                      name="customCountry"
                      type="text"
                      value={form.customCountry}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                      placeholder="Escribí tu país"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="whatsapp" className="block text-sm text-white/72 mb-2">
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="text"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                    placeholder="Tu número"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-white/72 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-mint/40 focus:bg-white/[0.06]"
                    placeholder="Tu email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/72 mb-2">
                    Qué buscás
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-white/80">
                    {INTEREST_OPTIONS.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.05]"
                      >
                        <input
                          type="checkbox"
                          checked={form.interests.includes(item)}
                          onChange={() => handleInterestChange(item)}
                          className="accent-[#98f5e1] h-4 w-4"
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex items-center justify-center rounded-full border border-mint/30 bg-mint/12 px-7 py-3 text-sm md:text-base text-mint transition-all duration-300 shadow-[0_0_24px_rgba(152,245,225,0.14)] ${
                      submitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-mint hover:text-black"
                    }`}
                  >
                    {submitting ? "Enviando..." : "Enviar solicitud"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}