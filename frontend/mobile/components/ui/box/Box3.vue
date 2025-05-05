<template>
  <box class="basf-box3">
    <slot />
  </box>
</template>

<script>
import Box from './Box'

export default {
  name: 'Box3',
  components: { Box }
}
</script>

<style scoped lang="scss">
.basf-box3 {
  color: #000;
  background-color: #f0f0f0;
}
</style>
