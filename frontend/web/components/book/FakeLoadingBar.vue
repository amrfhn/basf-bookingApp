<template>
  <progress-bar :value="progressBar" :total="100" />
</template>

<script>
export default {
  name: 'FakeLoadingBar',
  data () { return { progressBar: 0 } },
  mounted () {
    const crypto = window.crypto || window.msCrypto

    const interval = setInterval(() => {
      const rng = crypto.getRandomValues(new Uint32Array(1))[0] / Math.pow(2, 32)
      const value = (100 - this.progressBar) / 100
      this.progressBar += rng * value
      if (this.authenticated) { clearInterval(interval) }
    }, 50)
  }
}
</script>

<style scoped>

</style>
