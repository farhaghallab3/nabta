/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#2C5F2D",
          50: "#EEF4EE",
          100: "#D6E5D6",
          600: "#2C5F2D",
          700: "#234C24",
          900: "#1B2B1C",
        },
        moss: {
          DEFAULT: "#97BC62",
          light: "#B8D48C",
        },
        cream: "#F5F5F5",
        ink: "#1B2B1C",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Cairo",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: ["'Clash Display'", "Inter", "Cairo", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(27, 43, 28, 0.18)",
        card: "0 4px 24px -8px rgba(27, 43, 28, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-bar": {
          "0%": { width: "0%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "grow-bar": "grow-bar 1s ease-out both",
      },
    },
  },
  plugins: [],
};
