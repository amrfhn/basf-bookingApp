import VueCookies from 'vue-cookies'

export default function ({ store, route, $sso }) {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const publicRoutes = ['/', '/es', '/de', '/es/', '/de/']
  const publicRoute = publicRoutes.includes(route.path)
  const isDev = process.env.mode === 'development'
  const gitlabToken = process.env.GITLAB_TOKEN

  // skip if already authenticated
  if (isAuthenticated) { return }

  const accessToken = VueCookies.get('basf_federation_access_token') || (isDev ? gitlabToken : null) // isDev ? 'dev_user' : null

  store.dispatch('auth/authenticate', accessToken)
    .catch((error) => {
      console.error('Error:', error.response.data)
      if (!publicRoute) { return $sso(window.location.href) }
      console.warn('[Auth]: Not authenticated.')
    })
}
