export default ({ app, redirect, $nuxt }, inject) => {
  inject('console', {
    info (msg) { window.$nuxt.$emit('notification', 'info', msg) },
    success (msg) { window.$nuxt.$emit('notification', 'success', msg) },
    warn (msg) { window.$nuxt.$emit('notification', 'warn', msg) },
    error (msg) { window.$nuxt.$emit('notification', 'error', msg) }
  })
}
