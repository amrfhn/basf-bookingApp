<template>
  <schema :schema="schema" class="page-container">
    <slot name="header">
      <ui-brand-header />
    </slot>

    <div class="container">
      <slot />
    </div>

    <slot name="footer">
      <ui-footer>
        <div class="left">
          Project name
        </div>
        <div class="right">
          v 1.0.0
        </div>
      </ui-footer>
    </slot>
  </schema>
</template>

<script>
import '~/assets/styles/basf-semantic-ui/main.css'

import UiFooter from './UiFooter'
import UiBrandHeader from './UiBrandHeader'
import Schema from './schema/Schema'

export default {
  name: 'UiLayout',
  components: { UiFooter, UiBrandHeader, Schema },
  props: {
    schema: {
      type: String,
      required: true,
      validator (value) {
        return [
          'blue',
          'green',
          'light-blue',
          'light-green',
          'orange',
          'red'
        ].includes(value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .container {
    flex: 1 0 auto;
  }

  footer {
    flex-shrink: 0;
  }
}
</style>
