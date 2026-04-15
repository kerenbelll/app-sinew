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

function MethodCard({
  active,
  title,
  subtitle,
  badge,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left transition duration-300",
        active
          ? "border-mint/40 bg-mint/10 shadow-[0_0_24px_rgba(152,245,225,0.14)]"
          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-white/62">{subtitle}</p>
        </div>

        {badge ? (
          <span
            className={[
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
              active
                ? "bg-mint text-black"
                : "border border-white/12 bg-white/[0.05] text-white/75",
            ].join(" ")}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {children ? <div className="mt-3">{children}</div> : null}
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-[15px] font-semibold tracking-tight text-white">
      {children}
    </h2>
  );
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
    metodoPago: "mp",
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

  const buttonStyle = useMemo(
    () => ({
      layout: "vertical",
      shape: "pill",
      label: "pay",
      tagline: false,
      height: 42,
    }),
    []
  );

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
  }, [API_BASE, requestedResourceSlug, resourceSlug]);

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
      ? "Libro digital"
      : selectedResource
      ? selectedResource.title
      : productType === "masterclass"
      ? "Masterclass"
      : "Curso";

  return (
    <div className="min-h-screen bg-[#08101f] text-white px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Checkout
          </p>
          <h1 className="mt-3 text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
            Finalizar compra
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-6 text-white/64 sm:text-[15px]">
            Elegí tu recurso, completá tus datos y pagá en pesos o en dólares.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 md:p-7">
            <div className="grid gap-6">
              <div>
                <SectionTitle>Producto</SectionTitle>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "book", label: "E-book" },
                    { value: "course", label: "Curso" },
                    { value: "masterclass", label: "Masterclass" },
                  ].map((item) => {
                    const active = productType === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setProductType(item.value);
                          setErrorMsg("");
                        }}
                        className={[
                          "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                          active
                            ? "border-mint/40 bg-mint/10 text-mint"
                            : "border-white/10 bg-white/[0.03] text-white/78 hover:bg-white/[0.06]",
                        ].join(" ")}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {productType !== "book" && (
                <div>
                  <SectionTitle>
                    {productType === "masterclass" ? "Seleccioná la masterclass" : "Seleccioná el curso"}
                  </SectionTitle>

                  <div className="mt-4">
                    <select
                      value={resourceSlug}
                      onChange={(e) => {
                        setResourceSlug(e.target.value);
                        setErrorMsg("");
                      }}
                      disabled={resourcesLoading || filteredResources.length === 0}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition disabled:opacity-60"
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
                          <option key={r.slug} className="bg-[#0b1222]" value={r.slug}>
                            {r.title} (USD {Number(r.price).toFixed(2)})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <SectionTitle>Datos de compra</SectionTitle>

                <div className="mt-4 grid gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-white/65">
                      Nombre completo
                    </label>
                    <input
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-white/65">
                      Correo electrónico
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <SectionTitle>Método de pago</SectionTitle>

                <div className="mt-4 grid gap-3">
                  <MethodCard
                    active={formData.metodoPago === "mp"}
                    title="Mercado Pago"
                    subtitle="Pagar en pesos argentinos."
                    badge="Recomendado"
                    onClick={() => setFormData((prev) => ({ ...prev, metodoPago: "mp" }))}
                  >
                    <p className="text-sm font-medium text-white/82">
                      ARS {Intl.NumberFormat("es-AR").format(currentARS)}
                    </p>
                  </MethodCard>

                  <MethodCard
                    active={formData.metodoPago === "paypal"}
                    title="PayPal"
                    subtitle="Pagar en dólares con tarjeta o cuenta PayPal."
                    badge="USD"
                    onClick={() => setFormData((prev) => ({ ...prev, metodoPago: "paypal" }))}
                  >
                    <p className="text-sm font-medium text-white/82">
                      USD {currentUSD}
                    </p>
                  </MethodCard>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200 whitespace-pre-wrap">
                  {errorMsg}
                </div>
              )}

              {formData.metodoPago === "mp" && (
                <button
                  type="button"
                  onClick={handleMercadoPago}
                  disabled={mpLoading || (productType !== "book" && !selectedResource)}
                  className={`inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-mint/30 bg-mint/12 px-5 py-3 text-sm font-medium text-mint transition hover:bg-mint hover:text-[#0d1b2a] ${
                    mpLoading || (productType !== "book" && !selectedResource)
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                >
                  {mpLoading
                    ? "Redirigiendo a Mercado Pago…"
                    : `Pagar en pesos argentinos`}
                </button>
              )}

              {formData.metodoPago === "paypal" && clientId && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">Pagar con PayPal</p>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/65">
                      USD {currentUSD}
                    </span>
                  </div>

                  <div className="paypal-clean">
                    <PayPalScriptProvider options={paypalOptions}>
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
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 md:p-7 h-fit">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Resumen
            </p>

            <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-white">
              {productLabel}
            </h2>

            <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-[#0b1222]/55 p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-white/65">
                <span>Tipo</span>
                <span className="text-white/88">
                  {productType === "book"
                    ? "Libro"
                    : productType === "masterclass"
                    ? "Masterclass"
                    : "Curso"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-white/65">
                <span>Precio en ARS</span>
                <span className="text-white/88">
                  ARS {Intl.NumberFormat("es-AR").format(currentARS)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-white/65">
                <span>Precio en USD</span>
                <span className="text-white/88">USD {currentUSD}</span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center justify-between gap-3 text-sm font-medium text-white">
                <span>Total</span>
                <span>
                  {formData.metodoPago === "mp"
                    ? `ARS ${Intl.NumberFormat("es-AR").format(currentARS)}`
                    : `USD ${currentUSD}`}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm leading-6 text-white/64">
                Recomendamos pagar en <span className="text-white font-medium">pesos argentinos</span> si estás en Argentina.
                También podés elegir <span className="text-white font-medium">PayPal en USD</span> si preferís operar en dólares.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}