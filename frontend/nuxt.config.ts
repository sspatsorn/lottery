// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'สุ่มเลขนำโชค',
      htmlAttrs: { lang: 'th' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'เว็บสุ่มเลขหวยนำโชค พร้อมวิเคราะห์เลขมงคลด้วย Gemini AI' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap',
        },
        { rel: 'apple-touch-icon', href: '/pwa-icon.svg' },
        { rel: 'icon', type: 'image/svg+xml', href: '/pwa-icon.svg' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'สุ่มเลขนำโชค',
      short_name: 'เลขนำโชค',
      description: 'เว็บสุ่มเลขหวยนำโชค พร้อมวิเคราะห์เลขมงคล',
      theme_color: '#ffffff',
      background_color: '#f9fafb',
      display: 'standalone',
      orientation: 'portrait-primary',
      lang: 'th',
      start_url: '/',
      icons: [
        {
          src: '/pwa-icon.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
    },
    devOptions: {
      enabled: true,
    },
  },
})
