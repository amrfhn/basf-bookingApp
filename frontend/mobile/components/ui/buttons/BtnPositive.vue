<template>
  <btn class="positive" v-on="$listeners">
    <slot />
  </btn>
</template>

<script>
import Btn from './Btn'

export default {
  name: 'BtnPositive',
  components: { Btn }
}
</script>

<style scoped lang="scss">
.positive {
  background-color: #198f35;
  color: #fff;
  text-shadow: none;

  &:hover {
    background-color: #1da83d;
  }
}
</style>
