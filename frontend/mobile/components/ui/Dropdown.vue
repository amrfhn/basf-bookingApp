<template lang="html">
  <select v-model="localValue" class="dropdown" @change="change">
    <option v-if="nonSelected" :value="null" :disabled="!nullable">
      {{ nonSelected }}
    </option>
    <option v-for="(op, i) in options" :key="i" :value="valueSelector(op)" :label="labelSelector(op)">
      {{ labelSelector(op) }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    nullable: { type: Boolean, default: false },
    nonSelected: { type: String, default: null },
    options: { type: Array, default: () => [] },
    labelSelector: { type: Function, default: e => e },
    valueSelector: { type: Function, default: e => e },
    value: { type: null }
  },
  data () {
    return {
      localValue: this.value
    }
  },
  watch: {
    localValue (newValue) {
      this.$emit('input', newValue)
    },
    value (newValue) {
      this.localValue = newValue
    }
  },
  methods: {
    change (e) {
      setTimeout(() => this.$emit('change', e), 50)
    }
  }
}
</script>
<style lang="scss" scoped>
.dropdown{
  width: 100%;
  cursor: pointer;
  border-radius: 3px;
  height: 38px;
  padding: .5em;
  border: 1px solid rgba(34,36,38,.15);
}
</style>
