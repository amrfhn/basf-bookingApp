<template>
  <btn class="primary" v-on="$listeners">
    <slot />
  </btn>
</template>

<script>
import Btn from './Btn'

export default {
  name: 'BtnPrimary',
  components: { Btn }
}
</script>

<style scoped lang="scss">
.primary {
  color: #fff;
}
</style>
