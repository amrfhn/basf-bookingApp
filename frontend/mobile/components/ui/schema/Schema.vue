<template>
  <blue v-if="schema==='blue'">
    <slot />
  </blue>
  <green v-else-if="schema==='green'">
    <slot />
  </green>
  <light-blue v-else-if="schema==='light-blue'">
    <slot />
  </light-blue>
  <light-green v-else-if="schema==='light-green'">
    <slot />
  </light-green>
  <orange v-else-if="schema==='orange'">
    <slot />
  </orange>
  <red v-else-if="schema==='red'">
    <slot />
  </red>
  <div v-else>
    <h1>Error: Schema not Found - {{ schema }}</h1>
  </div>
</template>

<script>
import Blue from './Blue'
import LightBlue from './LightBlue'
import Green from './Green'
import LightGreen from './LightGreen'
import Red from './Red'
import Orange from './Orange'

export default {
  name: 'Schema',
  components: { Blue, Green, LightBlue, LightGreen, Orange, Red },
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
