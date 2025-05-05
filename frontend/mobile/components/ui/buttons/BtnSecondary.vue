<template>
  <btn class="secondary" v-on="$listeners">
    <slot />
  </btn>
</template>

<script>
import Btn from './Btn'

export default {
  name: 'BtnSecondary',
  components: { Btn }
}
</script>

<style scoped lang="scss">
.secondary {
  color: #fff;
}
</style>
