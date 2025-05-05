<template>
  <div class="ui input">
    <input v-model="inputValue" :placeholder="placeholder" @keyup="suggest" @blur="onBlur">
    <div v-if="show && suggestedOptions.length" class="suggestionList">
      <div v-for="(op, i) in suggestedOptions" :key="valueSelector(op,i)" class="option" :title="labelSelector(op)" @click="setValue(op)">
        <span>{{ labelSelector(op) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuggestionList',
  props: {
    options: { type: Array, default: () => [] },
    labelSelector: { type: Function, default: e => e },
    valueSelector: { type: Function, default: e => e },
    placeholder: { type: String, default: null },
    minLength: { type: Number, default: 0 },
    delay: { type: Number, default: 100 },
    value: { type: null, default: () => {} }
  },
  data () {
    return {
      show: false,
      localValue: this.value,
      inputValue: this.value
    }
  },
  computed: {
    suggestedOptions () {
      return this.removeDuplicatesByKey(this.options.filter(o => this.labelSelector(o).startsWith(this.inputValue || '')), this.valueSelector)
    }
  },
  watch: {
    localValue (newValue) {
      this.inputValue = newValue ? this.labelSelector(newValue) : null
      this.$emit('input', newValue ? this.valueSelector(newValue) : null)
    },
    value (newValue) {
      this.localValue = this.options.find(o => this.valueSelector(o) === newValue)
    }
  },
  methods: {
    onBlur () {
      function _onBlur () {
        this.localValue = (!this.inputValue || this.inputValue === '') ? null : this.suggestedOptions[0]
        this.show = false
      }
      setTimeout(_onBlur.bind(this), 150)
    },
    setValue (op) {
      this.show = false
      this.localValue = op
      this.inputValue = this.labelSelector(op)
    },
    suggest () {
      this.show = this.inputValue.length >= this.minLength
    },
    removeDuplicatesByKey (a, key) { // unique by key: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
      const seen = {}
      return a.filter(function (item) {
        const k = key(item)
        return Object.prototype.hasOwnProperty.call(seen, k) ? false : (seen[k] = true) // change to Object. : https://stackoverflow.com/questions/39282873/how-do-i-access-the-object-prototype-method-in-the-following-logic
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ui .input {
  display: inline-block;
  width: 100%;
  border-radius: 0;

  input {
    width: 100%;
  }

  .suggestionList{
    z-index: 1;
    box-shadow: 2px 3px 10px -2px #808080;
    position: absolute;
    background: #fff;
    padding: 10px;
    //border-radius: 0 0 10px 10px;
    width: inherit;
    max-height: 250px;
    overflow: auto;

    .option {
      padding: 5px;
      cursor: pointer;
      height: 40px;
      white-space: nowrap;
      overflow-x: hidden;

      span{
        white-space: nowrap;
      }
    }
  }
}
</style>
