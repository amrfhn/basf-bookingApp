<template>
  <div class="progressBar2">
    <span :style="width" />
  </div>
</template>

<script>
export default {
  name: 'ProgressBar2',
  props: {
    value: { type: Number, default: 0.5 },
    total: { type: Number, default: 1 }
  },
  computed: {
    width () {
      const width = Math.min(100, this.value * 100 / this.total)
      return 'width: ' + width + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.progressBar2{
  height: 25px;
  position: relative;
  background: #FFFFFF;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 3px;

  span{
    display: block;
    height: 100%;
    border-radius: 3px;
    box-shadow:
        inset 0 2px 9px  rgba(255,255,255,0.3),
        inset 0 -2px 6px rgba(0,0,0,0.4);
    position: relative;
    overflow: hidden;
  }
}
</style>
