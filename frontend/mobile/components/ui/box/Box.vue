<template>
  <div class="basf-box">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Box'
}
</script>

<style scoped lang="scss">
.basf-box {
  padding: 15px;
}
</style>
