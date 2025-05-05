<template>
  <div class="datepicker">
    <d-p
      :id="id"
      v-model="editable"
      :disabled-dates="disabledDates()"
      :language="lang"
    />
    <btn-primary @click="show">
      <i class="icon calendar" />
    </btn-primary>
  </div>
</template>

<script>
import dP from 'vuejs-datepicker'
import * as locale from 'vuejs-datepicker/dist/locale'

export default {
  name: 'Datepicker',
  components: { dP },
  props: {
    value: { type: null, default: null },
    disabledDates: {
      type: Function,
      default: () => {
      }
    },
    language: { type: String, default: undefined }
  },
  data () {
    return {
      id: 'DP' + Math.round(Math.random() * 100000),
      editable: null
    }
  },
  computed: {
    lang () {
      return locale[this.language] || locale.en
    }
  },
  watch: {
    value (newValue) {
      this.editable = newValue
    },
    editable (newValue) {
      this.$emit('input', newValue)
    }
  },
  mounted () {
    this.editable = this.value

    const targetNode = document.getElementById(this.id).parentNode
    targetNode.classList.add('dp')
    const grandParent = targetNode.parentNode

    helper(grandParent, getDataId(grandParent))
  },
  methods: {
    show () {
      document.getElementById(this.id).click()
    }
  }
}

function getDataId (node) {
  const attributes = node.attributes
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i].name.startsWith('data-v-')) {
      return attributes[i].name
    }
  }
  return null
}

function helper (node, id) {
  node.setAttribute(id, '')
  const children = node.children
  for (let i = 0; i < children.length; i++) {
    helper(children[i], id)
  }
}
</script>

<style scoped lang="scss">
	.datepicker {
		display: flex;
		box-sizing: border-box;

		.vdp-datepicker {
			width: 100%;
			height: auto;

			.dp {
				width: 100%;
				height: 100%;

				input {
					padding: 10px;
					width: 100%;
					height: 100%;
					cursor: pointer;
					border-radius: 3px;
					border: 1px solid rgba(34, 36, 38, 0.15);
				}
			}
		}

		button {
			border-radius: 0 5px 5px 0;
			padding: 7px;
			margin: 0;
			min-width: 40px;
			height: 40px;

			svg {
				height: 100%;
				width: auto;
				padding: 0;
			}
		}
	}
</style>
