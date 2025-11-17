// src/pages/Checkout.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { createPreference } from "../services/mercadopago"; // helper unificado MP

const COURSES = [
  { slug: "pro-avanzado", title: "Comunicación, tecnología y el plan de Dios", priceUSD: "35.00", priceARS: 34900 },
  { slug: "masterclass", title: "Renovación de la Mente", priceUSD: "35.00", priceARS: 34900 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [productType, setProductType] = useState("book"); // 'book' | 'course'
  const [courseSlug, setCourseSlug] = useState(COURSES[0].slug);

  const PRICE_USD_BOOK = "13.00";
  const PRICE_ARS_BOOK = 12900;

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");
  const token = useMemo(
    () => localStorage.getItem("token") || localStorage.getItem("auth_token"),
    []
  );
  const isLoggedIn = !!token;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    metodoPago: "paypal",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [mpLoading, setMpLoading] = useState(false);

  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isFormValid =
    formData.nombre.trim().length > 1 && isEmailValid(formData.email);

  const paypalOptions = useMemo(
    () => ({
      "client-id": clientId || "",
      currency: "USD",
      intent: "capture",
      components: "buttons",
    }),
    [clientId]
  );

  const buttonStyle = useMemo(() => ({ layout: "vertical" }), []);
  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requireLoginAndForm = () => {
    if (!isLoggedIn) {
      setErrorMsg("Debes iniciar sesión para comprar.");
      navigate("/login", { state: { from: "/checkout" } });
      return false;
    }
    if (!isFormValid) {
      setErrorMsg("Completá nombre y un email válido.");
      return false;
    }
    return true;
  };

  // precios dinámicos
  const currentUSD =
    productType === "book"
      ? PRICE_USD_BOOK
      : COURSES.find((c) => c.slug === courseSlug)?.priceUSD || "35.00";

  const currentARS =
    productType === "book"
      ? PRICE_ARS_BOOK
      : COURSES.find((c) => c.slug === courseSlug)?.priceARS || 35000;

  // títulos dinámicos
  const currentTitle =
    productType === "book"
      ? "Libro digital - SINEW"
      : COURSES.find((c) => c.slug === courseSlug)?.title || "Curso SINEW";

  // metadata para backend
  const metadata =
    productType === "book"
      ? { source: "checkout_spa" }
      : { type: "course", slug: courseSlug, courseSlug };

  // ===== MERCADO PAGO (usa helper unificado) =====
  const handleMercadoPago = async () => {
    try {
      setErrorMsg("");
      if (!requireLoginAndForm()) return;

      setMpLoading(true);

      const pref = await createPreference({
        price: Number(currentARS),
        currency: "ARS",
        title: currentTitle,
        buyer: {
          name: formData.nombre || "APRO",
          email: formData.email,
        },
        metadata,
      });

      if (!pref) throw new Error("Respuesta vacía de la API de preferencias.");

      // 🔹 En producción priorizamos SIEMPRE init_point (checkout real)
      const url = pref.init_point || pref.sandbox_init_point;

      if (!url) {
        throw new Error(
          "La preferencia no devolvió URL de checkout. Verificá que el backend envíe `init_point`/`sandbox_init_point` y que uses credenciales APP_USR válidas."
        );
      }

      window.location.href = url;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo iniciar Mercado Pago.";
      setErrorMsg(`Error iniciando Mercado Pago.\nDetalle: ${msg}`);
    } finally {
      setMpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl bg-[#0b1222]/70 backdrop-blur border border-white/10 shadow-2xl p-8 rounded-2xl space-y-8">
        <header className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Finalizar compra</h2>
          <p className="text-white/70 text-sm">
            Completá tus datos y elegí tu método de pago. El enlace de descarga
            es de un solo uso y vence en 24 h.
          </p>
        </header>

        {/* Producto */}
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="block text-sm text-white/70 mb-1">Producto</span>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <option className="bg-[#0b1222]" value="book">
                Libro (USD {PRICE_USD_BOOK})
              </option>
              <option className="bg-[#0b1222]" value="course">
                Curso
              </option>
            </select>
          </label>

          {productType === "course" && (
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">
                Seleccioná el curso
              </span>
              <select
                value={courseSlug}
                onChange={(e) => setCourseSlug(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
              >
                {COURSES.map((c) => (
                  <option
                    key={c.slug}
                    className="bg-[#0b1222]"
                    value={c.slug}
                  >
                    {c.title} (USD {c.priceUSD})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {/* form usuario */}
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm text-white/70 mb-1">
              Nombre completo
            </span>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
            />
          </label>

          <label className="block">
            <span className="block text-sm text-white/70 mb-1">
              Correo electrónico
            </span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
            />
          </label>

          <label className="block">
            <span className="block text-sm text-white/70 mb-1">
              Método de pago
            </span>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <option className="bg-[#0b1222]" value="paypal">
                PayPal (USD {currentUSD})
              </option>
              <option className="bg-[#0b1222]" value="mp">
                Mercado Pago (ARS{" "}
                {Intl.NumberFormat("es-AR").format(currentARS)})
              </option>
            </select>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 text-sm whitespace-pre-wrap">
            {errorMsg}
          </div>
        )}

{formData.metodoPago === "paypal" && clientId && (
  <PayPalScriptProvider options={paypalOptions}>
    <div className="rounded-xl border border-white/10 p-4 bg-white/5">
      <PayPalButtons
        style={buttonStyle}
        onClick={(data, actions) =>
          !requireLoginAndForm()
            ? actions.reject()
            : actions.resolve()
        }
        createOrder={async () => {
          // Armamos payload alineado a purchaseController.createOrder
          const isCourse = productType === "course";

          const payload = {
            items: [
              {
                type: isCourse ? "course" : "book",
                sku: isCourse ? courseSlug : "libro-001",
                name: currentTitle,
                quantity: 1,
                unit_amount: parseFloat(currentUSD),
                currency: "USD",
              },
            ],
            meta: isCourse
              ? { courseSlug, buyerEmail: formData.email }
              : { buyerEmail: formData.email },
          };

          const { data } = await axios.post(
            `${API_BASE}/api/paypal/create-order`,
            payload,
            {
              // auth opcional, tu backend hoy no lo exige
              headers: token
                ? { Authorization: `Bearer ${token}` }
                : undefined,
            }
          );

          return data.id; // PayPal espera que devolvamos el orderID
        }}
        onApprove={async ({ orderID }) => {
          try {
            const isCourse = productType === "course";

            const body = {
              orderID,
              email: formData.email,
              name: formData.nombre,
              ...(isCourse ? { courseSlug } : {}),
            };

            const res = await axios.post(
              `${API_BASE}/api/paypal/capture-order`,
              body,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const redirectTo = res.data?.redirectTo || null;
            const downloadLink = res.data?.redirectTo
              ? null
              : res.data?.downloadLink || null;
            const payerName = formData.nombre;

            if (redirectTo) {
              // Curso → te manda directo al curso o a /gracias ya con status
              window.location.replace(redirectTo);
            } else {
              // Libro sin redirectTo directo: usamos <Gracias/>
              navigate("/gracias", {
                replace: true,
                state: { downloadLink, payerName },
              });
            }
          } catch (err) {
            const msg =
              err?.response?.data?.error ||
              err?.message ||
              "Error capturando pago";
            setErrorMsg(msg);
          }
        }}
        onError={(err) =>
          setErrorMsg(err?.message || "Error con PayPal")
        }
      />
    </div>
  </PayPalScriptProvider>
)}

        {/* MERCADO PAGO */}
        {formData.metodoPago === "mp" && (
          <button
            type="button"
            onClick={handleMercadoPago}
            disabled={mpLoading}
            className={`w-full px-4 py-3 rounded-xl font-medium border border-mint text-mint hover:bg-mint hover:text-[#0d1b2a] transition ${
              mpLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {mpLoading
              ? "Redirigiendo a Mercado Pago…"
              : `Pagar con Mercado Pago (ARS ${Intl.NumberFormat("es-AR").format(
                  currentARS
                )})`}
          </button>
        )}
      </div>
    </div>
  );
}