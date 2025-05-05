<template>
  <box class="basf-box2">
    <slot />
  </box>
</template>

<script>
import Box from './Box'

export default {
  name: 'Box2',
  components: { Box }
}
</script>

<style scoped lang="scss">
.basf-box2 {
  color: #fff;
}
</style>
