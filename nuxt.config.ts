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
          content: 'Interactive personal landing page of Matthew Razza, Staff Software Engineer at Google NYC. Features a custom 2D physics gravity sandbox, harmonic vector resonance waves, programmatic Web Audio synthesis, and open-source project showcases.' 
        },
        { name: 'theme-color', content: '#6366f1' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'razza.dev | Matthew Razza - Staff Software Engineer' },
        { property: 'og:description', content: 'Interactive personal landing page of Matthew Razza. Features custom 2D physics gravity sandbox, vector resonance waves, and programmatic Web Audio synthesis.' },
        { property: 'og:site_name', content: 'razza.dev' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'razza.dev | Matthew Razza - Staff Software Engineer' },
        { name: 'twitter:description', content: 'Interactive personal landing page of Matthew Razza. Features custom 2D physics gravity sandbox, vector resonance waves, and programmatic Web Audio synthesis.' }
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

