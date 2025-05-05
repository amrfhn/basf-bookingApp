<template>
  <div>
    <h2>{{ $t('floor') }} {{ floor.number }}</h2>
    <div class="helper" />
    <div id="floor-map" />
  </div>
</template>

<script>
export default {
  name: 'FloorMap',
  props: {
    floor: { type: Object, required: true }
  },
  mounted () {
    this.$api.floor.getMap(this.floor.id).then(this.mapSetting)
  },
  methods: {
    mapSetting (map) {
      const mapDOM = document.getElementById('floor-map')
      mapDOM.innerHTML = map
      const areas = document.getElementsByClassName('area')
      for (const area of areas) {
        area.addEventListener('click', () => { this.selectArea(area) })
      }
      mapDOM.firstElementChild.style.width = '100%'
    },
    selectArea (area) {
      const areaId = area.id.replace('area-', '')
      area.style.fill = '#ff0000'
      area.style.opacity = '0.5'
      this.$emit('select', areaId)
    }
  }
}
</script>

<style lang="scss" scoped>
#floor-map {
  width: 100%;
}

.helper { width: 260px; }

@media (min-width: 500px) {
  .helper { width: 440px; }
}

@media (min-width: 630px) {
  .helper { width: 570px; }
}

</style>
