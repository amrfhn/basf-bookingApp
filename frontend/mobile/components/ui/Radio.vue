<template>
  <div class="radio">
    <input
      :id="id"
      v-model="editable"
      type="radio"
      :name="name"
      :value="rValue"
      :checked="checked"
    >
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  props: {
    value: { type: null, default: null },
    rValue: { type: null, default: null },
    label: { type: String, default: null },
    name: { type: String, default: null }
  },
  data () {
    return {
      id: 'RB' + Math.round(Math.random() * 100000),
      editable: null
    }
  },
  computed: {
    checked () { return this.rValue === this.value }
  },
  watch: {
    value (newValue) { this.editable = newValue },
    editable (newValue) { this.$emit('input', newValue) }
  },
  mounted () {
    if (this.rValue === this.value) { this.editable = this.value }
  }
}
</script>

<style scoped lang="scss">
.radio{
  display: inline-block;
  position: relative;
  vertical-align: baseline;
  min-height: 15px;
  min-width: 17px;
  line-height: 17px;
  margin-top: 10px;
  margin-bottom: 10px;

  input[type=radio]{
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0!important;
    outline: 0;
    z-index: 3;
    width: 17px;
    height: 17px;
  }

  label {
    padding-left: 1.85714em;
    margin-right: 10px;
    box-sizing: content-box;

    &:before {
      position: absolute;
      content: '';
      transition: border .1s ease,opacity .1s ease,transform .1s ease,box-shadow .1s ease,-webkit-transform .1s ease,-webkit-box-shadow .1s ease;
      -webkit-transform: none;
      transform: none;
      width: 13px;
      height: 13px;
      border-radius: 500rem;
      top: 1px;
      left: 0;
      background: #fff;
      border: 1px solid #000;
    }

    &:after {
      position: absolute;
      font-size: 14px;
      text-align: center;
      opacity: 0;
      transition: border .1s ease,opacity .1s ease,transform .1s ease,box-shadow .1s ease;
      border: none;
      content: '';
      line-height: 15px;

      top: 1px;
      left: 0;
      width: 15px;
      height: 15px;
      border-radius: 500rem;
      transform: scale(.46666667);
      background-color: #000;
    }
  }

 input:checked~label:after{
   opacity: 1;
 }
}
</style>
