<template>
  <div>
    <box3>
      <h1>{{ $t('welcome') }}</h1>
      <p>{{ $t('auth') }}</p>
    </box3>
  </div>
</template>

<script>
export default {
  async created () {
    await this.$store.dispatch('auth/waitAuth')
    const latest = await this.$api.building.userLatest()
    if (latest) {
      this.$router.push(this.localePath('/book') + '/')
    } else {
      this.$router.push(this.localePath('/about') + '/')
    }
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "welcome": "Welcome!",
    "auth": "Authenticating..."
  },
  "de": {
    "welcome": "Willkommen!",
    "auth": "Authenticating..."
  },
  "pt": {
    "welcome": "Bem vinda!",
    "auth": "Authenticating..."
  },
  "es": {
    "welcome": "Bienvenido!",
    "auth": "Redireccionando..."
  }
}
</i18n>
