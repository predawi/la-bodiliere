/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        bodil: {
          50: "oklch(98.26% 0.017 201.4)",
          100: "oklch(95.66% 0.043 201.79)",
          200: "oklch(91.73% 0.074 202.27)",
          300: "oklch(86.5% 0.112 204.56)",
          400: "oklch(79.79% 0.131 207.43)",
          500: "oklch(71.51% 0.123 210.72)",
          600: "oklch(63.99% 0.113 217.61)",
          700: "oklch(52.1% 0.09 218.82)",
          800: "oklch(45.19% 0.073 220.09)",
          900: "oklch(40.05% 0.063 223.74)",
          950: "oklch(30.13% 0.051 227.16)",
        },
      },
    },
  },
  plugins: [],
};
