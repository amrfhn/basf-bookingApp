import i18n from './i18n/config'
import { version } from './package.json'

console.log('API_URL', process.env.API_URL)
console.log('ROUTER_BASE', process.env.ROUTER_BASE)
console.log('RESOURCE_URL', process.env.RESOURCE_URL)
console.log('ENV ', process.env.NODE_ENV)

export default {
  pwa: {
    meta: {
      title: 'Future of Work',
      author: 'bsa-gtu',
      description: 'This will be used to book seats at the office',
      lang: 'en',
      viewport: 'width=device-width, initial-scale=1',
      'mobile-web-app-capable': true,
      'apple-mobile-web-app-capable': false,
      nativeUI: false
    },
    manifest: {
      name: 'Future of Work',
      short_name: 'Future of Work',
      description: 'This will be used to book seats at the office',
      lang: 'en',
      background_color: '#00793a'
    },
    workbox: {
      dev: false,
      debug: false
    }
  },
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  // mode: 'spa',
  ssr: false,

  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',

  /*
   ** Nuxt Server
   ** See https://nuxtjs.org/api/configuration-server
   */
  server: {},

  /*
   ** Nuxt router
   ** See https://nuxtjs.org/api/configuration-router
   */
  router: {
    base: '/future_of_work/',
    middleware: 'auth'
  },

  /*
  ** Nuxt middleware
  ** See https://nuxtjs.org/guides/directory-structure/middleware/
  */
  middleware: [],

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Future of Work',
    meta: [
      { charset: 'utf-8' },
      { http_equiv: 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'stylesheet', type: 'text/css', href: (process.env.RESOURCE_URL || '/future_of_work/') + 'style/bootstrap.min.css', as: 'style' },
      { rel: 'stylesheet', type: 'text/css', href: (process.env.RESOURCE_URL || '/future_of_work/') + 'style/font-awesome.min.css', as: 'style' },
      { rel: 'stylesheet', type: 'text/css', href: (process.env.RESOURCE_URL || '/future_of_work/') + 'style/green.semantic.min.css', as: 'style' }
    ],
    script: [
      { src: (process.env.RESOURCE_URL || '/future_of_work/') + 'js/jquery.min.js', defer: true },
      { src: (process.env.RESOURCE_URL || '/future_of_work/') + 'js/bootstrap_3.min.js', defer: true },
      { src: (process.env.RESOURCE_URL || '/future_of_work/') + 'js/semantic.min.js', defer: true },
      { src: (process.env.RESOURCE_URL || '/future_of_work/') + 'js/navbar.js', defer: true }
    ]
  },

  /*
  ** Nuxt - The loading Property
  ** See https://nuxtjs.org/api/configuration-loading/
  */
  loading: '~/components/layouts/LoadingBar.vue',

  /*
  ** Nuxt serverMiddleware
  ** See https://nuxtjs.org/api/configuration-servermiddleware/
  */
  serverMiddleware: [],

  /*
   ** Nuxt - The env Property
   ** See https://nuxtjs.org/api/configuration-env/
   */
  env: {
    GITLAB_TOKEN: process.env.GITLAB_TOKEN,
    version: version || 'Snapshot',
    mode: process.env.NODE_ENV || 'development',
    ENV: process.env.ENV
  },

  /*
  ** Global CSS
  */
  css: ['~/assets/scss/global.scss'],

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~/plugins/web-components' },
    { src: '~/plugins/api' },
    { src: '~/plugins/sso' },
    { src: '~/plugins/dynamicKeys' },
    { src: '~/plugins/notification' },
    { src: '~/plugins/svgPanZoom.client.js', mode: 'client' }
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/pwa'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-i18n'
  ],

  // Doc: https://i18n.nuxtjs.org/
  i18n,

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    retry: { retries: 3 },
    baseURL: process.env.API_URL || '/future_of_work/api/'
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    // Fix related to core-js@3
    babel: {
      presets ({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
              loose: true
            }
          ]
        ]
      }
    },
    extend (config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      })
    }
  }
}
