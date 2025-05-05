<template>
  <div :class="effectiveClass">
    <slot />
  </div>
</template>
<script>
import UiCommon from './UiCommon'

export default {
  name: 'UiGrid',
  props: {
    stackable: { type: Boolean, default: false },
    columns: { type: Number, default: 0 }
  },
  computed: {
    effectiveClass () {
      const base = 'ui grid'
      const columns = this.columns ? ` ${UiCommon.numToString(this.columns)} column` : ''
      const stackable = this.stackable ? ' stackable' : ''
      return base + columns + stackable
    }
  }
}
</script>
<style>
.ui.grid {
  margin: 0;
}
</style>
