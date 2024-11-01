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
    mail: {
      message: {
        to: "bertout.benjamin@gmail.com",
      },
      smtp: {
        host: "smtp.mailgun.com",
        port: 587,
      },
    },
  },

  googleFonts: {
    download: false,
    families: {
      "Dancing Script": {
        wght: "500",
      },
      "Open Sans": {
        wght: [400, 700],
        ital: [400, 700],
      },
    },
  },

  supabase: {
    redirect: false,
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
        { name: "theme-color", content: "#96ac36" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
});
