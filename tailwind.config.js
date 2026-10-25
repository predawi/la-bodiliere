/** @type {import('tailwindcss').Config} */
const tokens = [
  "craie",
  "surface",
  "surface-sunk",
  "galet",
  "galet-strong",
  "ink",
  "ink-muted",
  "sea",
  "sea-strong",
  "sea-strong-hover",
  "on-sea",
  "sea-tint",
  "abysse",
  "on-abysse",
  "abysse-muted",
  "ecume",
  "soleil",
  "on-soleil",
  "bouee",
  "on-bouee",
  "bouee-tint",
  "algue",
  "algue-tint",
  "focus",
];

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
      colors: Object.fromEntries(tokens.map((name) => [name, `var(--${name})`])),
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", '"Times New Roman"', "serif"],
        sans: ['"Atkinson Hyperlegible Next"', '"Atkinson Hyperlegible"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        field: "10px",
        card: "20px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        dialog: "var(--shadow-dialog)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
