<template>
  <button class="button" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Btn'
}
</script>

<style scoped lang="scss">
.button {
  font-size: 1rem;
  cursor: pointer;
  display: inline-block;

  min-height: 1em;
  outline: 0;
  border: none;
  vertical-align: baseline;
  background: #e0e1e2 none;

  color: rgba(0, 0, 0, .6);
  margin: 0 .25em 0 0;
  padding: .78571429em 1.5em .78571429em;
  text-transform: none;
  text-shadow: none;
  font-weight: 700;
  line-height: 1em;
  font-style: normal;
  text-align: center;
  text-decoration: none;
  border-radius: .28571429rem;
  user-select: none;

  &:disabled {
    cursor: default;
    opacity: .45 !important;
    background-image: none !important;
    box-shadow: none !important;
    pointer-events: none !important;
  }
}
</style>
