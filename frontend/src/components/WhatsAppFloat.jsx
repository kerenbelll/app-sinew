import React from "react";

export default function WhatsAppFloat() {
  const phone = "5491141932894"; 
  const message = encodeURIComponent(
    "Hola, quisiera recibir más información sobre Sinew, sus recursos y la red."
  );

  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="WhatsApp"
      className="
        fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[80]
        group
      "
    >
      <div
        className="
          relative flex items-center justify-center
          h-14 w-14 md:h-16 md:w-16
          rounded-full
          border border-mint/40
          bg-[#0b1222]/80
          backdrop-blur-md
          shadow-[0_0_25px_rgba(152,245,225,0.22)]
          transition-all duration-300
          hover:scale-105
          hover:border-mint/70
          hover:shadow-[0_0_35px_rgba(152,245,225,0.38)]
        "
      >
        {/* glow suave exterior */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-mint/10 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ícono */}
        <svg
          viewBox="0 0 32 32"
          className="relative h-7 w-7 md:h-8 md:w-8 text-mint"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.31c-.29-.15-1.72-.85-1.98-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.14-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.35-1.43-.87-.77-1.46-1.72-1.64-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.14-.17.19-.29.29-.49.1-.19.05-.37-.02-.51-.08-.15-.66-1.59-.9-2.18-.24-.57-.49-.49-.66-.5h-.56c-.19 0-.49.07-.75.37-.27.29-1.01.99-1.01 2.42s1.03 2.81 1.17 3 .02.29 1.99 3.03c1.97 2.73 4.83 3.79 5.13 3.91.29.12 2.05.79 2.79.63.75-.15 1.72-.71 1.97-1.39.24-.68.24-1.27.17-1.39-.08-.12-.27-.19-.56-.34Z" />
          <path d="M16 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.24.58 4.43 1.69 6.37L3 29l6.82-1.79A12.75 12.75 0 0 0 16 28.8c7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16 3.2Zm0 23.32c-1.91 0-3.77-.51-5.4-1.47l-.39-.23-4.05 1.06 1.08-3.95-.25-.41A10.5 10.5 0 0 1 5.49 16C5.49 10.2 10.2 5.49 16 5.49S26.51 10.2 26.51 16 21.8 26.52 16 26.52Z" />
        </svg>
      </div>

      {/* tooltip desktop */}
      <div
        className="
          pointer-events-none absolute right-[72px] top-1/2 -translate-y-1/2
          hidden md:flex
          items-center
          rounded-full border border-white/10
          bg-[#0b1222]/85
          px-4 py-2
          text-sm text-white/85
          backdrop-blur-md
          shadow-[0_0_20px_rgba(0,0,0,0.25)]
          opacity-0 translate-x-2
          transition-all duration-300
          group-hover:opacity-100
          group-hover:translate-x-0
          whitespace-nowrap
        "
      >
        Hablemos!
      </div>
    </a>
  );
}