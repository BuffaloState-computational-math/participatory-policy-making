const apiURL = 'https://someapiurl.com'
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://participatory-policy-making.herokuapp.com'
    : 'http://localhost:3000'

export default {
  publicRuntimeConfig: {
    baseURL,
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/markdownit',
    '@nuxtjs/google-gtag',
    '@nuxtjs/sentry',
  ],
  proxy: {
    '/api': {
      target: apiURL,
      // onProxyReq(proxyReq) {
      //   console.log(proxyReq.path)
      // },
    },
  },
  markdownit: {
    injected: true,
    use: [
      [
        'markdown-it-anchor',
        {
          level: 1,
          slugify: (text) => text.toLowerCase().replace(/[^\w]+/g, '-'),
          permalink: false,
          // renderPermalink: (slug, opts, state, permalink) => {},
          permalinkClass: 'header-anchor',
          permalinkSymbol: '¶',
          permalinkBefore: false,
        },
      ],
    ],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  'google-gtag': {
    id: 'G-ES5BRWWS9D',
    debug: false, // Enable to track in development
    config: {
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
    },
  },
  sentry: {
    initialize: process.env.NODE_ENV === 'production',
    dsn:
      'https://f93b0eb90ee54957a1cc5f1c43396be8@o311837.ingest.sentry.io/5519232',
  },
}
