<template>
  <div>Hello {{ greeting }} from the Component</div>
</template>

<script>
export default {
  name: 'MyComponent',
  props: {
    greeting: { type: String, default: 'Foo' }
  }
}
</script>

<style scoped>

</style>
