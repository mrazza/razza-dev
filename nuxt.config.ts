// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true
  },
  app: {
    head: {
      title: 'razza.dev | Matthew Razza - Staff Software Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Personal website of Matthew Razza, Staff Software Engineer at Google NYC. Simple, minimalist, text-based page showcasing projects and contact links.' 
        },
        { name: 'theme-color', content: '#0a0a0a' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'razza.dev | Matthew Razza - Staff Software Engineer' },
        { property: 'og:description', content: 'Personal website of Matthew Razza, Staff Software Engineer at Google NYC.' },
        { property: 'og:site_name', content: 'razza.dev' },
        // Twitter
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'razza.dev | Matthew Razza - Staff Software Engineer' },
        { name: 'twitter:description', content: 'Personal website of Matthew Razza, Staff Software Engineer at Google NYC.' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  }
});

