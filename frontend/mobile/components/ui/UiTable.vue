<template>
  <div class="scroll">
    <table class="table">
      <slot />
    </table>
  </div>
</template>
<script>
export default { name: 'UiTable' }
</script>
<style>
.scroll {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 400px;
}
</style>
