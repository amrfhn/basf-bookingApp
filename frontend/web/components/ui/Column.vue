<template>
  <div :class="effectiveClass">
    <slot />
  </div>
</template>
<script>
import UiCommon from './UiCommon'

export default {
  name: 'Column',
  props: { wide: { type: Number, default: 0 } },
  computed: {
    effectiveClass () {
      const base = 'column'
      const wide = this.wide ? ` ${UiCommon.numToString(this.wide)} wide` : ''
      return base + wide
    }
  }
}
</script>
<style>
.ui.grid > .row > .column:first-child {
  padding-left: 0;
}

.ui.grid > .row > .column:last-child {
  padding-right: 0;
}
</style>
