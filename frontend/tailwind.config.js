/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef8ff",
          100: "#d9efff",
          200: "#bce2ff",
          300: "#8dcfff",
          400: "#57b2ff",
          500: "#2491ff",
          600: "#0d73e0",
          700: "#0c5bb0",
          800: "#114d8f",
          900: "#154278",
        },
        hospital: {
          dark: "#0b1220",
          card: "#111827",
          line: "#1f2937",
          soft: "#94a3b8",
        },
      },
      boxShadow: {
        glow: "0 10px 40px rgba(36,145,255,0.18)",
        glass: "0 8px 30px rgba(0,0,0,0.18)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};