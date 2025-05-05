<template>
  <div v-show="showMap">
    <div id="area-map" />
  </div>
</template>

<script>
const COLORS = {
  notInUse: '#BDDCE1FF',
  booked: '#C70124FF',
  reserved: '#F39500FF',
  firstAider: '#0D99D4FF',
  available: '#65AC1EFF',
  selected: '#014A97FF'
}
const opacity = '1.0'
const cursor = 'pointer'

export default {
  name: 'SeatsMap',
  data () {
    return {
      ready: false,
      map: null,
      showMap: false
    }
  },
  computed: {
    area () {
      return this.$store.getters['floor/getSelectedAreaConfig']
    },
    seats () {
      return this.$store.getters['seat/getSeats']
    },
    selectedSeats () {
      return this.$store.getters['seat/getSelectedSeatsConfig']
    }
  },
  watch: {
    async area (area) {
      if (area) {
        this.map = await this.$api.area.getMap(area.id)
      } else {
        this.map = null
      }
    },
    map (map) {
      this.showMap = map !== null
    },
    selectedSeats (value) {
      this.paint()
    },
    seats (value) {
      this.loadMap()
      this.paint()
    },
    ready (value) {
      this.paint()
    }
  },
  async mounted () {
    if (this.area) {
      this.map = await this.$api.area.getMap(this.area.id)
    }
  },
  async updated () {
    if (this.area) {
      this.map = await this.$api.area.getMap(this.area.id)
    } else {
      this.map = null
    }
  },
  methods: {
    loadMap () {
      this.ready = false
      const mapDOM = document.getElementById('area-map')
      mapDOM.innerHTML = this.map
      if (!(this.map && this.map.length)) {
        return
      }
      const seats = document.getElementsByClassName('seat')
      for (const seat of seats) {
        seat.style.opacity = opacity
        seat.style.fill = COLORS.notInUse
        seat.style.cursor = cursor

        const seatCode = seat.id.replace('seat-', '')
        if (Object.keys(this.seats).includes(seatCode)) {
          seat.addEventListener('click', () => {
            this.$store.dispatch('seat/toggleSelectedSeatConfig', seatCode)
          })
        }
      }
      mapDOM.firstElementChild.style.width = '100%'

      this.ready = true
    },
    paint () {
      if (!this.ready) {
        return
      }
      if (!this.seats) {
        return
      }
      for (const seat of Object.values(this.seats)) {
        const seatCode = seat.buildingMindsID != null ? seat.buildingMindsID : seat.code
        const seatDOM = document.getElementById(`seat-${seatCode}`)
        if (!seatDOM) {
          console.warn(`seat-${seatCode}  -  NOT FOUND`)
          continue
        }
        const selectedSeats = this.selectedSeats
        if (selectedSeats.includes(seatCode)) {
          seatDOM.style.fill = COLORS.selected
        } else if (seat.isAvailable) {
          seatDOM.style.fill = COLORS.available
        } else {
          seatDOM.style.fill = COLORS.notInUse
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#area-map {
  width: 100%
}

</style>
