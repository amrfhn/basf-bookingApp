<template>
  <btn class="negative" v-on="$listeners">
    <slot />
  </btn>
</template>

<script>
import Btn from './Btn'

export default {
  name: 'BtnNegative',
  components: { Btn }
}
</script>

<style scoped lang="scss">
.negative {
  background-color: #db2828;
  color: #fff;
  text-shadow: none;
  background-image: none;

  &:hover {
    background-color: #f52a2a;
  }
}
</style>
