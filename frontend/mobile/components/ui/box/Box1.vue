<template>
  <box class="basf-box1">
    <slot />
  </box>
</template>

<script>
import Box from './Box'

export default {
  name: 'Box1',
  components: { Box }
}
</script>

<style scoped lang="scss">
.basf-box1 {
  color: #000;
  background-color: #fff;
}
</style>
