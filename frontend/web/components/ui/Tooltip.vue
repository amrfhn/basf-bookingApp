<template>
  <popper
    trigger="hover"
    root-class="customTooltip"
    :options="{
      placement: 'top',
      modifiers: {
        offset: { offset: '0.10px' },
        preventOverflow: { enabled: true }
      }
    }">
    <div class="popper">
      {{ content }}
    </div>
    <slot slot="reference">
    </slot>
  </popper>
</template>

<script>
import Popper from 'vue-popperjs'

export default {
  name: 'Tooltip',
  components: {
    popper: Popper
  },
  props: {
    content: { type: String, default: '' }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.popper {
  width: auto;
  background-color: #fafafa;
  color: #212121;
  text-align: center;
  padding: 2px;
  display: inline-block;
  border-radius: 3px;
  position: absolute;
  font-size: 14px;
  font-weight: normal;
  border: 1px #ebebeb solid;
  z-index: 200000;
  -moz-box-shadow: rgb(58, 58, 58) 0 0 6px 0;
  -webkit-box-shadow: rgb(58, 58, 58) 0 0 6px 0;
  box-shadow: rgb(124, 123, 123) 0 0 6px 0;
}
.popper .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
}
.popper[x-placement^="top"] {
  margin-bottom: 5px;
}
.popper[x-placement^="top"] .popper__arrow {
  border-width: 5px 5px 0 5px;
  border-color: #fafafa transparent transparent transparent;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper[x-placement^="bottom"] {
  margin-top: 5px;
}
.popper[x-placement^="bottom"] .popper__arrow {
  border-width: 0 5px 5px 5px;
  border-color: transparent transparent #fafafa transparent;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper[x-placement^="right"] {
  margin-left: 5px;
}
.popper[x-placement^="right"] .popper__arrow {
  border-width: 5px 5px 5px 0;
  border-color: transparent #fafafa transparent transparent;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
.popper[x-placement^="left"] {
  margin-right: 5px;
}
.popper[x-placement^="left"] .popper__arrow {
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent #fafafa;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.customTooltip {
  .popper {
    border: 0;
    padding: 2px 6px;
    font-size: 11px;
    &[x-placement^="bottom"] {
      .popper__arrow {
      }
    }
  }
}

</style>
