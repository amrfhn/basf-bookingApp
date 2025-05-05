<template>
  <div :class=" {'brand-header':true, 'fade-out':faded}">
    <div class="container">
      <a :href="href" class="logo">
        <img
          src="~/assets/img/logo.svg"
          alt="BASF logo 'We create chemistry'"
          title="BASF 'We create chemistry'"
        >
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UiBrandHeader',
  props: {
    href: { type: String, default: '#' }
  },
  data () {
    return {
      scroll: 0
    }
  },
  computed: {
    faded () {
      return this.scroll > 50
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.scroll = window.scrollY
    }
  }
}
</script>
<style lang="scss" scoped>

.brand-header {
  min-height: 80px;
  margin-bottom: 20px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  transition: all .4s ease;

  &.fade-out {
    top: -80px;
  }

  .logo {
    display: block;
    box-sizing: content-box;
    margin-left: -15px;
    padding: 15px 15px;
    height: 50px;
    width: 160px;

    img {
      margin-top: -15px;
    }
  }
}
</style>
