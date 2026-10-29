// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/tailwind.scss"],

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
    "@nuxt/image",
    "nuxt-mail",
  ],

  runtimeConfig: {
    openweatherApiKey: "",
    // process.env is read at build time: MAILGUN_* must be set when running yarn build.
    mail: {
      message: {
        to: "bertout.benjamin@gmail.com",
        from: process.env.MAILGUN_FROM,
      },
      smtp: {
        host: process.env.MAILGUN_SMTP_HOST || "smtp.mailgun.org",
        port: 587,
        auth: {
          user: process.env.MAILGUN_SMTP_USER,
          pass: process.env.MAILGUN_SMTP_PASSWORD,
        },
      },
    },
  },

  googleFonts: {
    download: false,
    families: {
      "Instrument Serif": {
        wght: [400],
      },
      "Atkinson Hyperlegible Next": {
        wght: [400, 500, 600],
      },
    },
  },

  supabase: {
    redirect: false,
    types: false,
  },

  image: {
    format: ["webp", "avif"],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      title: "La Bodilière",
      htmlAttrs: {
        lang: "fr",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Site officiel de la Bodilière - Dieppe",
        },
        { name: "format-detection", content: "telephone=no" },
        { name: "theme-color", content: "#f3f6f7" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
});
