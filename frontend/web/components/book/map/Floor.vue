<template>
  <div v-show="!area">
    <div class="helper" />
    <div id="floor-map" />
  </div>
</template>

<script>
const opacity = '1.0'
const cursor = 'pointer'

export default {
  name: 'FloorMap',
  data () {
    return {
      map: ''
    }
  },
  computed: {
    floor () { return this.$store.getters['floor/getSelectedFloorBooking'] },
    area () { return this.$store.getters['floor/getSelectedAreaBooking'] }
  },
  watch: {
    async floor (floor) {
      if (floor && floor.map !== '') {
        const floorMap = await this.$api.floor.getMap(floor.id)
        this.map = floorMap
      }
    },
    map (value) { this.mapSetting() }
  },
  async mounted () {
    if (this.floor && this.floor.map !== '') {
      const floorMap = await this.$api.floor.getMap(this.floor.id)
      this.map = floorMap
    }
    this.mapSetting()
  },
  methods: {
    mapSetting () {
      const mapDOM = document.getElementById('floor-map')
      mapDOM.innerHTML = this.map
      const areas = document.getElementsByClassName('area')
      for (const area of areas) {
        area.addEventListener('click', () => { this.selectArea(area) })
        area.style.opacity = opacity
        area.style.cursor = cursor
      }
      if (mapDOM.firstElementChild) {
        mapDOM.firstElementChild.style.width = '100%'
      }
    },
    async selectArea (SVGarea) {
      const areaCode = SVGarea.id.replace('area-', '')
      const originalColor = SVGarea.style.fill
      SVGarea.style.fill = '#FF00007F'
      setTimeout(() => { SVGarea.style.fill = originalColor }, 500)
      const area = await this.$api.floor.area(this.floor.id, areaCode)
      this.$store.dispatch('floor/selectAreaBooking', area)
    }
  }
}
</script>

<style lang="scss" scoped>
#floor-map {
  width: 80%;
}

.helper { width: 260px; }

@media (min-width: 500px) {
  .helper { width: 440px; }
}

@media (min-width: 630px) {
  .helper { width: 570px; }
}

</style>
