<template>
  <footer>
    <div class="container">
      <slot />
    </div>
  </footer>
</template>

<script>
export default {
  name: 'UiFooter'
}
</script>

<style scoped lang="scss">

footer {
  background-color: #706f6f;
  color: #fff;

  width: 100%;
  min-height: 2.5rem;
  padding: 10px 0 10px 0;
}

</style>
