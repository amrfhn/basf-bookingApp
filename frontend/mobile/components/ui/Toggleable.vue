<template>
  <div class="toggleable">
    <div class="header" @click="toggle">
      <h3>{{ title }}</h3>
      <a>
        <i v-if="show" class="icon angle double up" />
        <i v-else class="icon angle double down" />
      </a>
    </div>
    <div v-show="show" class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toggleable',
  props: {
    title: { type: String, required: true }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggle () {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss">
.toggleable{

  .header{
    border-bottom: #706f6f 2px solid;

    h3{
      display: inline-block;
      margin-bottom: 5px;
    }

    a{
      float: right;
    }
  }

  .body{
    border-bottom: #706f6f 2px solid;
  }
}
</style>
