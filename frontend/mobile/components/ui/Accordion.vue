<template>
  <div class="accordion-wrapper">
    <div class="accordion" :class="(isActive)?'active ' + name : ''" @click="toggleItem">
      <h3 class="accordion-title">
        {{ title }}
      </h3>
      <icon class="accordion-icon" icon="arrow_back" />
    </div>

    <div v-if="isActive" class="accordion-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  props: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    active: { type: Boolean, default: false }
  },
  data () {
    return {
      isActive: this.active
    }
  },
  methods: {
    toggleItem () {
      if (!this.isActive) {
        const accordionGroup = document.getElementsByClassName('active ' + this.name)
        for (const a of accordionGroup) { a.click() }
        this.$emit('active')
      }
      this.isActive = !this.isActive
    }
  }
}
</script>

<style scoped lang="scss">
.accordion-wrapper {
  margin: 0 auto;
  width: 100%;
  border-bottom: 1px solid grey;
  &:first-child {
    border-top: 1px solid grey;
  }

  .accordion {
    position: relative;
    display: flex;
    cursor: pointer;
    padding: 15px 30px 15px 0;

    .accordion-title {
      margin: 0;
    }
    .accordion-icon {
      right: 0;
      position: absolute;
      transform: rotate(270deg);
    }

  }
  .accordion.active {
    .accordion-icon {
      transform: rotate(90deg);
    }
  }

  .accordion-content {
    text-align: left;
    width: 100%;
    padding: 15px 30px 15px 0;
  }
}
</style>
