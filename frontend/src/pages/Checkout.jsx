import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { createPreference } from "../services/mercadopago";

const PRICE_USD_BOOK = "13.00";
const PRICE_ARS_BOOK = 12900;

const toARS = (resource) => {
  const usd = Number(resource?.price || 0);

  if (usd <= 0) return 0;
  if (usd === 35) return 34900;
  if (usd === 13) return 12900;

  return Math.round(usd * 1000);
};

function normalizeType(value) {
  if (value === "book") return "book";
  if (value === "masterclass") return "masterclass";
  return "course";
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");

  const token = useMemo(
    () => localStorage.getItem("token") || localStorage.getItem("auth_token"),
    [location.key]
  );

  const isLoggedIn = !!token;

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const requestedType = normalizeType(
    location.state?.productType || searchParams.get("type") || "book"
  );

  const requestedResourceSlug =
    location.state?.courseSlug ||
    searchParams.get("course") ||
    "";

  const [productType, setProductType] = useState(
    requestedType === "book" ? "book" : requestedType
  );

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourceSlug, setResourceSlug] = useState(requestedResourceSlug);
  const [errorMsg, setErrorMsg] = useState("");
  const [mpLoading, setMpLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    metodoPago: "paypal",
  });

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

  useEffect(() => {
    let mounted = true;

    async function loadResources() {
      try {
        setResourcesLoading(true);
        setErrorMsg("");

        const res = await fetch(`${API_BASE}/api/courses`);
        const data = await res.json();

        if (!mounted) return;

        const normalized = Array.isArray(data) ? data : [];

        // Solo recursos pagos, tanto cursos como masterclasses
        const paidResources = normalized.filter((item) => {
          const kind = String(item.kind || "").toLowerCase();
          const level = String(item.level || "").toLowerCase();
          const price = Number(item.price || 0);

          return (kind === "course" || kind === "masterclass") && level === "pro" && price > 0;
        });

        setResources(paidResources);

        const requestedExists = paidResources.some((r) => r.slug === requestedResourceSlug);

        if (requestedResourceSlug && requestedExists) {
          setResourceSlug(requestedResourceSlug);

          const requestedItem = paidResources.find((r) => r.slug === requestedResourceSlug);
          if (requestedItem?.kind === "masterclass") setProductType("masterclass");
          if (requestedItem?.kind === "course") setProductType("course");
          return;
        }

        if (!paidResources.some((r) => r.slug === resourceSlug)) {
          setResourceSlug(paidResources[0]?.slug || "");
        }
      } catch (error) {
        console.error("Error cargando recursos para checkout:", error);
        if (mounted) {
          setResources([]);
          setErrorMsg("No se pudieron cargar los recursos disponibles.");
        }
      } finally {
        if (mounted) setResourcesLoading(false);
      }
    }

    loadResources();

    return () => {
      mounted = false;
    };
  }, [API_BASE, requestedResourceSlug]);

  const filteredResources = useMemo(() => {
    if (productType === "course") {
      return resources.filter((r) => String(r.kind || "").toLowerCase() === "course");
    }

    if (productType === "masterclass") {
      return resources.filter((r) => String(r.kind || "").toLowerCase() === "masterclass");
    }

    return [];
  }, [productType, resources]);

  useEffect(() => {
    if (productType === "book") return;

    const existsInCurrentType = filteredResources.some((r) => r.slug === resourceSlug);

    if (!existsInCurrentType) {
      setResourceSlug(filteredResources[0]?.slug || "");
    }
  }, [filteredResources, productType, resourceSlug]);

  const selectedResource = useMemo(
    () => resources.find((r) => r.slug === resourceSlug) || null,
    [resources, resourceSlug]
  );

  const currentUSD =
    productType === "book"
      ? PRICE_USD_BOOK
      : String(Number(selectedResource?.price || 0).toFixed(2));

  const currentARS =
    productType === "book"
      ? PRICE_ARS_BOOK
      : toARS(selectedResource);

  const currentTitle =
    productType === "book"
      ? "Libro digital - SINEW"
      : selectedResource?.title || "Recurso SINEW";

  const metadata =
    productType === "book"
      ? { source: "checkout_spa", type: "book" }
      : {
          source: "checkout_spa",
          type: productType,
          slug: selectedResource?.slug,
          courseSlug: selectedResource?.slug,
          kind: selectedResource?.kind,
        };

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requireLoginAndForm = () => {
    if (!isLoggedIn) {
      setErrorMsg("Debes iniciar sesión para comprar.");
      navigate("/login", { state: { from: location.pathname + location.search } });
      return false;
    }

    if (!isFormValid) {
      setErrorMsg("Completá nombre y un email válido.");
      return false;
    }

    if (productType !== "book" && !selectedResource) {
      setErrorMsg("No hay un recurso válido seleccionado.");
      return false;
    }

    return true;
  };

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

      const url = pref.init_point || pref.sandbox_init_point;

      if (!url) {
        throw new Error(
          "La preferencia no devolvió URL de checkout. Verificá `init_point`/`sandbox_init_point` y las credenciales."
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

  const productLabel =
    productType === "book"
      ? `Libro (USD ${PRICE_USD_BOOK})`
      : selectedResource
      ? `${selectedResource.title} (USD ${currentUSD})`
      : productType === "masterclass"
      ? "Masterclass"
      : "Curso";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl bg-[#0b1222]/70 backdrop-blur border border-white/10 shadow-2xl p-8 rounded-2xl space-y-8">
        <header className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Finalizar compra</h2>
          <p className="text-white/70 text-sm">
            Completá tus datos y elegí tu método de pago.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="block text-sm text-white/70 mb-1">Producto</span>
            <select
              value={productType}
              onChange={(e) => {
                const nextType = normalizeType(e.target.value);
                setProductType(nextType);
                setErrorMsg("");
              }}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <option className="bg-[#0b1222]" value="book">
                Libro (USD {PRICE_USD_BOOK})
              </option>
              <option className="bg-[#0b1222]" value="course">
                Curso
              </option>
              <option className="bg-[#0b1222]" value="masterclass">
                Masterclass
              </option>
            </select>
          </label>

          {productType !== "book" && (
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">
                Seleccioná el {productType === "masterclass" ? "recurso" : "curso"}
              </span>
              <select
                value={resourceSlug}
                onChange={(e) => {
                  setResourceSlug(e.target.value);
                  setErrorMsg("");
                }}
                disabled={resourcesLoading || filteredResources.length === 0}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-60"
              >
                {resourcesLoading ? (
                  <option className="bg-[#0b1222]" value="">
                    Cargando recursos...
                  </option>
                ) : filteredResources.length === 0 ? (
                  <option className="bg-[#0b1222]" value="">
                    No hay recursos pagos disponibles
                  </option>
                ) : (
                  filteredResources.map((r) => (
                    <option
                      key={r.slug}
                      className="bg-[#0b1222]"
                      value={r.slug}
                    >
                      {r.title} (USD {Number(r.price).toFixed(2)})
                    </option>
                  ))
                )}
              </select>
            </label>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
          <div className="flex items-center justify-between gap-4">
            <span>Producto seleccionado</span>
            <span className="font-medium text-white">{productLabel}</span>
          </div>

          {formData.metodoPago === "mp" && (
            <div className="mt-2 flex items-center justify-between gap-4">
              <span>Precio en ARS</span>
              <span className="font-medium text-white">
                ARS {Intl.NumberFormat("es-AR").format(currentARS)}
              </span>
            </div>
          )}
        </div>

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
                Mercado Pago (ARS {Intl.NumberFormat("es-AR").format(currentARS)})
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
                  const isBook = productType === "book";

                  const payload = {
                    items: [
                      {
                        type: isBook ? "book" : productType,
                        sku: isBook ? "libro-001" : selectedResource?.slug,
                        name: currentTitle,
                        quantity: 1,
                        unit_amount: parseFloat(currentUSD),
                        currency: "USD",
                      },
                    ],
                    meta: isBook
                      ? {
                          buyerEmail: formData.email,
                          type: "book",
                        }
                      : {
                          buyerEmail: formData.email,
                          courseSlug: selectedResource?.slug,
                          slug: selectedResource?.slug,
                          type: productType,
                          kind: selectedResource?.kind,
                        },
                  };

                  const { data } = await axios.post(
                    `${API_BASE}/api/paypal/create-order`,
                    payload,
                    {
                      headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : undefined,
                    }
                  );

                  return data.id;
                }}
                onApprove={async ({ orderID }) => {
                  try {
                    const isBook = productType === "book";

                    const body = {
                      orderID,
                      email: formData.email,
                      name: formData.nombre,
                      ...(isBook
                        ? {}
                        : {
                            courseSlug: selectedResource?.slug,
                            type: productType,
                          }),
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
                      window.location.replace(redirectTo);
                    } else {
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

        {formData.metodoPago === "mp" && (
          <button
            type="button"
            onClick={handleMercadoPago}
            disabled={mpLoading || (productType !== "book" && !selectedResource)}
            className={`w-full px-4 py-3 rounded-xl font-medium border border-mint text-mint hover:bg-mint hover:text-[#0d1b2a] transition ${
              mpLoading || (productType !== "book" && !selectedResource)
                ? "opacity-70 cursor-not-allowed"
                : ""
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