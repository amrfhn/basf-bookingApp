<template>
  <div v-show="showMap">
    <div id="area-map" />
  </div>
</template>

<script>
// In the future this will be dynamically charged
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
  props: {
    seats: { required: true },
    hoodId: { required: true },
    map: { type: String, required: true }
  },
  data () {
    return {
      ready: false,
      selectedSeats: []
    }
  },
  computed: {
    showMap () {
      return this.map !== ''
    }
  },
  watch: {
    map () { this.loadMap() },
    selectedSeats () { this.paint() },
    ready () { this.paint() }
  },
  mounted () {
    this.loadMap()
  },
  methods: {
    loadMap () {
      this.ready = false
      const mapDOM = document.getElementById('area-map')
      mapDOM.innerHTML = this.map
      if (!this.map.length) { return }
      const seats = document.getElementsByClassName('seat')
      for (const seat of seats) {
        seat.style.opacity = opacity
        seat.style.fill = COLORS.notInUse
        seat.style.cursor = cursor

        const seatCode = seat.id.replace('seat-', '')
        seat.addEventListener('click', () => {
          this.selectSeats(seatCode)
        })
      }
      mapDOM.firstElementChild.style.width = '100%'

      this.ready = true
    },
    paint () {
      if (!this.ready) { return }
      if (!this.seats) { return }
      for (const seat of Object.values(this.seats)) {
        const seatCode = seat.buildingMindsID != null ? seat.buildingMindsID : seat.code
        const seatDOM = document.getElementById(`seat-${seatCode}`)
        if (!seatDOM) {
          console.warn(`seat-${seatCode}  -  NOT FOUND`)
          continue
        }
        const selectedSeats = this.selectedSeats
        if (selectedSeats.includes(seat)) {
          seatDOM.style.fill = COLORS.selected
        } else if (seat.seatHoods.length > 0 && seat.seatHoods.some((hood) => {
          return hood.hoodId === this.hoodId
        })) {
          seatDOM.style.fill = COLORS.available
        } else {
          seatDOM.style.fill = COLORS.notInUse
        }
      }
    },
    selectSeats (seatCode) {
      const seat = this.seats[seatCode]
      if (!seat) { return }
      if (!this.selectedSeats.includes(seat)) {
        this.selectedSeats.push(seat)
      } else {
        this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id)
      }
      this.$root.$emit('select-seat-hood', this.selectedSeats)
    }
  }
}
</script>

<style lang="scss" scoped>
#area-map {
  width: 100%
}

</style>
