import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FondoParticulas from "../components/FondoParticulas";
import synergyLogo from "../assets/img/synergylogocolor.png";

const CONTENT_BY_SLUG = {
  comunicacion: {
    descripcion: "Fundamentos para una relación sana con Dios.",
    descripcionLarga:
      "¿Peleas con el pecado y ciclos que se repiten en el tiempo? ¿Sentís que estás atrapado y no podés salir? ¡El primer paso es ser hijos! Pero para ser hijos debemos ser estudiantes primero. El Padre busca un corazón dispuesto a aprender. Tanto un Padre, como un árbol y un maestro tienen en común que se reproducen y trascienden. Se replican en otros. Así es como El Padre quiere restaurar Su Imagen en nosotros nuevamente; enseñándonos. Aprende los fundamentos para desarrollar una relación sana con Dios y dar frutos en abundancia.",
    chips: ["Gratis", "Fundamentos", "Relación sana con Dios"],
  },
  "pro-avanzado": {
    descripcion: "Ubicá la tecnología y las ideologías en el Plan de Dios.",
    descripcionLarga:
      "¿Te abruma el avance vertiginoso de la tecnología? ¿Te sentís confundido por los medios, las noticias y las ideologías? ¿Será que el antisemitisimo y el avance del Islam están ajenos a la agenda de Dios? ¿Qué hacemos con la IA? ¿Y la computación cuántica? Encontrá el lugar de la tecnología y las ideologías dentro del Plan de Dios, a Él no se le escapa nada y todo tiene un propósito dentro de Su voluntad. Aprende a entender los tiempos y a convertirte en una señal que apunte a Cristo en medio de la oscuridad. Isacar observaba estrellas para entender las temporadas ¿Qué observamos nosotros?",
    chips: ["Tecnología", "Ideologías", "Plan de Dios"],
  },
  "renovacion-mente": {
    descripcion: "¿Cómo renuevo la mente de manera práctica y cotidiana?",
    descripcionLarga:
      "¿Te sentís dividido internamente? ¿Te cuesta conciliar tu llamado con tu trabajo o estudios? O incluso, ¿Tenés dificultades para entender qué es lo que Dios espera de vos? En este curso recibirás herramientas bíblicas practicas para renovar tu mente y, así, entender la buena, agradable y perfecta voluntad de Dios. Tenemos que salir del viejo paradigma caído y renovarnos a lo nuevo. Tenemos la mente de Cristo, ¡Desarrollémosla!",
    chips: ["Llamado", "Herramientas bíblicas", "Renovación"],
  },
  "entendiendo-biblia": {
    descripcion: "Un recorrido paso a paso para comprender la Biblia de manera integral.",
    descripcionLarga:
      "En este curso aprenderemos a abordar La Biblia como un todo, una narrativa única desde el principio hasta el final. 8 ejes temáticos desde Génesis hasta Apocalipsis, una sola historia: El Plan de Dios. Clase a clase profundizaremos en el Evangelio del Reino y adquiriremos la capacidad de entender los ejes temáticos de Las Escrituras, es decir, lo que Dios reitera una y otra vez sin parar hasta el final. El Mesías, el Anticristo, La Gran Tribulación, Israel, La Inclusión de los Gentiles, La Era Venidera (Milenio), Las Fiestas del Señor y La Resurrección y Reunión de los exiliados. ¿Qué es el evangelio del Reino? ¿De qué se compone? ¡Este curso es para vos!",
    chips: ["Biblia", "Reino", "Escrituras"],
  },

  "masterclass-anatomia": {
    descripcion: "Una introducción para profundizar en la identidad de la Iglesia.",
    descripcionLarga:
      "¿Cómo es la Iglesia Gloriosa? A sabiendas de que la iglesia que vemos hoy es la materia prima de aquella Iglesia que resiste y persevera en el fin de la era, necesitamos profundizar en Las Escrituras para entender cómo ve Dios a la Iglesia. Israel, la unidad y otros temas esenciales forman parte del core de la Iglesia Gloriosa. Podrán decir al final: ¡Su novia se ha preparado!",
    chips: ["Iglesia", "Identidad", "Gloria"],
  },
  "masterclass-silencio": {
    descripcion:
      "Dios nos muestra al silencio como la antesala de lo impresionante, el preludio de las maravillas.",
    descripcionLarga:
      "El silencio muchas veces es visto como ausencia, falta y pérdida. Escuchamos expresiones como hubo un silencio sepulcral e, inconscientemente, vinculamos al silencio incluso con la muerte. Bíblicamente esto no es estrictamente así. Dios nos muestra al silencio como la antesala de lo impresionante, el preludio de las maravillas. En nuestro discurso podemos utilizar el silencio como algo fantástico, un arte divino que, al ser imagen y semejanza del Dios eterno, tenemos a nuestra disposición. Selah.",
    chips: ["Silencio", "Dirección", "Escucha"],
  },
  "masterclass-ecosistema-critica": {
    descripcion: "¡Descubramos todas las bondades de dar y aceptar crítica!",
    descripcionLarga:
      "Generalmente demonizamos la crítica, pero estamos firmemente comprometidos con la siguiente verdad: la crítica no es el problema; en realidad nos queremos referir a la murmuración. Crítica es de frente, en la mesa, con ánimo de desarrollar nuevas cosas. La murmuración ataca agazapada en lo oscuro de una conversación donde el criticado no está presente. ¡Descubramos todas las bondades de dar y aceptar crítica! La Biblia y el mismo Dios nos lo aconsejan.",
    chips: ["Crítica", "Madurez", "Discernimiento"],
  },
  "masterclass-antropocentrismo": {
    descripcion: "Del antropocentrismo al Cristo-centrismo.",
    descripcionLarga:
      "¿Es Dios el genio de la lámpara? ¿Existe Él para mí o yo para Él? Estas son preguntas interesantes a la hora de entender la renovación de la mente. Pasar de una existencia ombliguista en donde todo gira en torno a uno mismo a una vida que se centra en Dios y Su plan es, en esencia, el principio de renovar la mente. Entender por qué pienso como pienso es esencial para poder sacrificar correctamente lo viejo y abrazar con todo lo que somos la nueva naturaleza que es en Cristo Jesús. Del antropocentrismo al Cristo-centrismo.",
    chips: ["Cristo", "Mente", "Cosmovisión"],
  },
  "masterclass-mente-dual": {
    descripcion: "La mente de Cristo está en nosotros, ¡desarrollémosla!",
    descripcionLarga:
      "Peleamos internamente, diariamente. Creo, no creo. Amo, no amo. Tengo fuerza, no la tengo. Sube y baja. Doble ánimo. Mente partida. ¿Soy yo o le pasa a todos? Como occidentales heredamos el dualismo griego y está fusionado con nuestra mentalidad. Conforma nuestro paradigma y es, muchas veces, la lente con la que vemos la realidad; generalmente sin saberlo ni notarlo. Dios nos llama a renovar la mente a una mentalidad integrativa e integral; completa. La mente de Cristo está en nosotros, ¡desarrollémosla!",
    chips: ["Mente", "Escritura", "Integridad"],
  },
  "masterclass-cv-entrevistas": {
    descripcion:
      "Un espacio planteado para crecer y adquirir herramientas para nuestra vida profesional.",
    descripcionLarga:
      "¿Cómo armo un CV correctamente? ¿Cómo me comporto en una entrevista laboral? ¿Qué digo y qué no? Todo esto y mucho más en un espacio planteado para crecer y adquirir herramientas para nuestra vida profesional. Mansos como palomas, ¡pero también astutos como serpientes!",
    chips: ["CV", "Entrevistas", "Trabajo"],
  },
  "masterclass-renovacion-mente": {
    descripcion: "¿De qué mente debo salir?, ¿A qué mentalidad debo ir?",
    descripcionLarga:
      "La mente de Cristo, la tenemos. Al menos eso dijo Pablo a los Corintios. Esto pareciera contradictorio a veces, ya que la mayoría de nosotros, los seres humanos, peleamos día tras día contra lo viejo intentando asirnos de lo nuevo. La Biblia detalla claramente lo que respecta a la vieja naturaleza, la vieja mentalidad pero también abarca de manera impactante las características de la Mente de nuestro amado Mesías. ¿De qué mente debo salir?, ¿A qué mentalidad debo ir?, ¿Cómo hago?",
    chips: ["Renovación", "Mentalidad", "Transformación"],
  },
  "masterclass-apocalipsis-islamico": {
    descripcion: "Una mirada bíblica sobre el Islam y los últimos tiempos.",
    descripcionLarga:
      "La religión más prolífera de los últimos 100 años es el Islam. ¿Debería esto alarmarnos? ¿Llamarnos la atención? ¿La Biblia dice algo al respecto? Creemos que la respuesta a todo esto es ¡SÍ! El Islam tiene una esperanza MUY similar a la del cristianismo bíblico; esperan un mesías, y por separado a Jesús, que también dicen, descenderá del cielo. Pero Isa (como llama el islam Jesús) no es Dios, ni tampoco el Mesías en sí mismo, sino una especie de apoyo del Mahdi, el salvador islámico. Sin pivotear sobre el Corán, sino apoyados en la profecía bíblica, observamos los últimos tiempos según el Islam y reflexionamos sobre la posibilidad de un Anticristo Islámico.",
    chips: ["Islam", "Profecía", "Últimos tiempos"],
  },
};

function splitTitleAndTeacher(rawTitle = "") {
  const parts = String(rawTitle).split(" - ");
  if (parts.length >= 2) {
    return {
      title: parts[0].trim(),
      teacher: parts.slice(1).join(" - ").trim(),
    };
  }
  return {
    title: rawTitle,
    teacher: "",
  };
}

function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-white/42 ${className}`}>
      {children}
    </p>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <h2
      className={`mt-4 text-[clamp(28px,3vw,44px)] font-semibold leading-[1.02] tracking-tight text-white ${className}`}
    >
      {children}
    </h2>
  );
}

function SegmentedButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center rounded-full",
        "px-4 py-2 md:px-4.5 md:py-2.5",
        "text-[13px] md:text-[14px] font-medium leading-none",
        "whitespace-nowrap transition duration-300",
        active
          ? "bg-mint text-black shadow-[0_0_20px_rgba(152,245,225,0.18)]"
          : "border border-white/12 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:border-white/20",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SubFilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center rounded-full",
        "px-3.5 py-2 md:px-4 md:py-2",
        "text-[12px] md:text-[13px] font-medium leading-none",
        "whitespace-nowrap transition duration-300",
        active
          ? "border border-mint/30 bg-mint/12 text-mint"
          : "border border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.07] hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ResourceCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = Boolean(item.descripcionLarga);

  const { title: resourceTitle, teacher: teacherName } = useMemo(
    () => splitTitleAndTeacher(item.titulo),
    [item.titulo]
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
    >
      <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-mint/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/5 blur-3xl" />

      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/8">
        {item.img ? (
          <img
            src={item.img}
            alt={resourceTitle}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <span className="text-white/50 text-sm">Sin imagen</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#060b14]/95 via-[#060b14]/30 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
              item.badgeTone === "mint"
                ? "bg-mint text-black"
                : "border border-white/14 bg-black/45 text-white"
            }`}
          >
            {item.badge}
          </span>

          {item.isArchive && (
            <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide border border-white/14 bg-white/[0.08] text-white">
              Archivo
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className="text-[18px] md:text-[20px] font-semibold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
            {resourceTitle}
          </h3>

          {teacherName ? (
            <p className="mt-1 text-[12px] md:text-[13px] font-medium tracking-[0.08em] uppercase text-white/70">
              Docente: {teacherName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {item.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[12px] text-white/76"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-[15px] md:text-[16px] leading-7 text-white/78">
            {item.descripcion}
          </p>

          <AnimatePresence initial={false}>
            {expanded && isLong && (
              <motion.div
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-[15px] md:text-[16px] leading-7 text-white/66">
                  {item.descripcionLarga}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 inline-flex items-center gap-2 text-sm md:text-[15px] font-medium text-mint hover:text-white transition"
            >
              {expanded ? "Ver menos" : "Ver más"}
              <span className={`transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}>
                →
              </span>
            </button>
          )}
        </div>

        <div className="mt-auto pt-7">
          <Link
            to={item.to}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm md:text-[15px] font-medium transition duration-300",
              item.primary
                ? "border border-mint/30 bg-mint/12 text-mint hover:bg-mint hover:text-black shadow-[0_0_24px_rgba(152,245,225,0.16)]"
                : "border border-white/18 bg-white/[0.04] text-white hover:bg-white/[0.10] hover:border-white/26",
            ].join(" ")}
          >
            {item.primary ? "Ver gratis" : "Ver recurso"}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Cursos() {
  const API = (import.meta.env.VITE_API_BASE || "http://localhost:5001").replace(/\/$/, "");
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [view, setView] = useState("cursos");
  const [masterclassFilter, setMasterclassFilter] = useState("recientes");

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();

        if (!mounted) return;
        setCatalog(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando cursos:", error);
        if (mounted) setCatalog([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      mounted = false;
    };
  }, [API]);

  const { cursos, masterclasses, archivo } = useMemo(() => {
    const normalized = (Array.isArray(catalog) ? catalog : []).map((course) => {
      const extra = CONTENT_BY_SLUG[course.slug] || {};
      const isFree = String(course.level || "").toLowerCase() === "free";
      const kind = course.kind || "course";
      const isArchive = Boolean(course.isArchive);

      return {
        slug: course.slug,
        titulo: course.title,
        img: course.thumbnail || "",
        descripcion: extra.descripcion || course.short || "",
        descripcionLarga: extra.descripcionLarga || course.long || "",
        chips: extra.chips || [],
        to: `/cursos/${course.slug}`,
        kind,
        isArchive,
        badge:
          kind === "masterclass"
            ? "Masterclass"
            : isFree
            ? "Curso gratuito"
            : "Curso",
        badgeTone: kind === "masterclass" || !isFree ? "dark" : "mint",
        primary: isFree,
      };
    });

    return {
      cursos: normalized.filter((item) => item.kind === "course"),
      masterclasses: normalized.filter(
        (item) => item.kind === "masterclass" && !item.isArchive
      ),
      archivo: normalized.filter(
        (item) => item.kind === "masterclass" && item.isArchive
      ),
    };
  }, [catalog]);

  const visibleItems = useMemo(() => {
    if (view === "cursos") return cursos;
    return masterclassFilter === "recientes" ? masterclasses : archivo;
  }, [view, masterclassFilter, cursos, masterclasses, archivo]);

  const currentEyebrow =
    view === "cursos"
      ? "Cursos"
      : masterclassFilter === "recientes"
      ? "Masterclasses"
      : "Archivo";

  const currentTitle =
    view === "cursos"
      ? "Recorridos más completos para profundizar"
      : masterclassFilter === "recientes"
      ? "Recursos puntuales para explorar temas específicos"
      : "Masterclasses de años anteriores";

  const currentDescription =
    view === "cursos"
      ? "Acá vas a encontrar los cursos disponibles de SINEW, incluyendo programas pagos y también cursos gratuitos."
      : masterclassFilter === "recientes"
      ? "Las masterclasses funcionan como recursos más breves y enfocados para abrir conversaciones, incorporar herramientas y explorar temas concretos."
      : "En esta sección reunimos contenido histórico y masterclasses de archivo que siguen aportando valor formativo.";

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060b14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1222] to-transparent z-0" />

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-28 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#98f5e1] opacity-[0.08] blur-3xl" />
        <div className="absolute top-[26%] left-[6%] h-[20rem] w-[20rem] rounded-full bg-white opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-[8%] right-[8%] h-[22rem] w-[22rem] rounded-full bg-[#98f5e1] opacity-[0.05] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] opacity-15">
        <FondoParticulas opacity={0.1} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-12 md:pt-16 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto w-full max-w-[1920px] mb-16 md:mb-24"
        >
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(152,245,225,0.08),transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,transparent_70%,rgba(255,255,255,0.015))]" />

            <div className="relative z-10 flex items-center justify-center px-5 sm:px-8 md:px-10 xl:px-16 2xl:px-24 py-14 sm:py-16 md:py-20 xl:py-24 2xl:py-28">
              <div className="w-full max-w-[1200px] text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="mb-6 md:mb-7 flex justify-center"
                >
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm shadow-[0_0_24px_rgba(152,245,225,0.08)]">
                    Área Synergy
                  </span>
                </motion.div>

                <motion.img
                  src={synergyLogo}
                  alt="Synergy"
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.16 }}
                  className="mx-auto w-[clamp(170px,22vw,320px)] h-auto select-none object-contain drop-shadow-[0_0_26px_rgba(152,245,225,0.16)]"
                  loading="eager"
                  decoding="async"
                />

                <SectionEyebrow className="mt-7 md:mt-8">Recursos</SectionEyebrow>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.28 }}
                  className="mt-4 md:mt-5 text-[clamp(24px,4.8vw,68px)] font-semibold tracking-tight leading-[0.96] text-white"
                >
                  Cursos y
                  <span className="block bg-gradient-to-r from-[#98f5e1] via-white to-[#98f5e1] bg-clip-text text-transparent">
                    Masterclasses
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.38 }}
                  className="mt-5 md:mt-6 max-w-[980px] mx-auto text-[14px] sm:text-[15px] md:text-[18px] xl:text-[20px] leading-7 md:leading-8 xl:leading-9 text-white/70"
                >
                  Recursos diseñados para avanzar con más claridad, profundidad y dirección.
                  Elegí el formato que mejor se ajuste a tu momento.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scaleX: 0.7 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mx-auto mt-8 md:mt-10 h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-white/28 to-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.56 }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 max-w-[420px] sm:max-w-none mx-auto"
                >
                  <SegmentedButton
                    active={view === "cursos"}
                    onClick={() => setView("cursos")}
                  >
                    Cursos
                  </SegmentedButton>

                  <SegmentedButton
                    active={view === "masterclasses"}
                    onClick={() => setView("masterclasses")}
                  >
                    Masterclasses
                  </SegmentedButton>
                </motion.div>

                {view === "masterclasses" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3"
                  >
                    <SubFilterButton
                      active={masterclassFilter === "recientes"}
                      onClick={() => setMasterclassFilter("recientes")}
                    >
                      Masterclasses recientes
                    </SubFilterButton>

                    <SubFilterButton
                      active={masterclassFilter === "archivo"}
                      onClick={() => setMasterclassFilter("archivo")}
                    >
                      Archivo
                    </SubFilterButton>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto w-full max-w-[1920px]">
          <div className="max-w-4xl">
            <SectionEyebrow>{currentEyebrow}</SectionEyebrow>
            <SectionTitle>{currentTitle}</SectionTitle>

            <p className="mt-4 max-w-3xl text-white/68 text-[15px] md:text-[17px] leading-7 md:leading-8">
              {currentDescription}
            </p>
          </div>

          {loading ? (
            <div className="mt-10 rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-7 text-white/60 text-[15px]">
              Cargando recursos...
            </div>
          ) : visibleItems.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
              {visibleItems.map((item) => (
                <ResourceCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-7 text-white/60 text-[15px]">
              No hay recursos disponibles en esta sección por ahora.
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-[1920px] flex justify-center mt-14 md:mt-16">
          <Link
            to="/"
            className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm md:text-base text-white hover:bg-white/10 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}