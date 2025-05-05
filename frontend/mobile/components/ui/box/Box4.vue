<template>
  <box class="basf-box4">
    <slot />
  </box>
</template>

<script>
import Box from './Box'

export default {
  name: 'Box4',
  components: { Box }
}
</script>

<style scoped lang="scss">
.basf-box4 {
  color: #7c7c7c;
  background-color: #fff;
}
</style>
