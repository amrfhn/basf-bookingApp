<template>
  <div v-if="loading" class="loading-page">
    <p>{{ $t('loading') }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
  z-index: 1000;
}
</style>

<i18n lang="yaml">
  en:
    loading: "Loading..."
  de:
    loading: "Programmladen..."
  es:
    loading: "Cargando..."
  pt:
    loading: "Carregando..."
</i18n>
