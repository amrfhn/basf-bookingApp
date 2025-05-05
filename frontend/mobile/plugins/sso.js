const URL_SSO = 'https://app.roqs.basf.net/auth/login.html'

export default ({ app, redirect }, inject) => {
  inject('sso', (urlCallback) => {
    const url = urlCallback || window.location.href
    redirect(URL_SSO + '?redirect_uri=' + url)
  })
}
