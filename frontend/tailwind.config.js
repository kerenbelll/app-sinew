/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // opcional: útil si más adelante querés toggle de tema
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: '#98f5e1',
        primary: '#050c26',
        secondary: '#1f2937',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px #98f5e1)' },
          '50%': { filter: 'drop-shadow(0 0 25px #98f5e1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'glow': 'glow 2.5s ease-in-out infinite',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}