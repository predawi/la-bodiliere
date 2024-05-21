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
          50: "#edfdfe",
          100: "#d0fafd",
          200: "#a8f3f9",
          300: "#6be8f5",
          400: "#28d4e8",
          500: "#0cb7ce",
          600: "#0e9cb9",
          700: "#12758c",
          800: "#185f72",
          900: "#184f61",
          950: "#0a3342",
        },
      },
    },
  },
  plugins: [],
};
