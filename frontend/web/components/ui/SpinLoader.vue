<template>
  <div class="SpinLoader">
    <span :style="{ '--strokeColor': computedStrokeColor }" />
  </div>
</template>

<script>
export default {
  name: 'SpinLoader',
  props: {
    strokeColor: { type: String, default: '#fff' }
  },
  computed: {
    computedStrokeColor () {
      if (this.strokeColor.startsWith('--')) {
        return `var(${this.strokeColor})`
      } else {
        return this.strokeColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.SpinLoader {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  span {
    display: block;
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 50%;
    border-right-color: var(--strokeColor);
    animation: spinner-anim 0.8s linear infinite;
  }
}
@keyframes spinner-anim {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
