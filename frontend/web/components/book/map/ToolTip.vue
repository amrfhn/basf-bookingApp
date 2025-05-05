<template>
  <div v-show="seat || showInfo || showAmenities" id="tooltipElement">
    <div v-if="seat != null" class="hoverMessage">
      {{ $t('mainpage.confirmationModal.seatNumber') }} {{ seat.code }}
    </div>
    <div v-if="showInfo || showAmenities" class="hoverMessage">
      <!--  info bookings -->
      <ul v-if="showInfo">
        <li v-for="(elem, i) in seat.details" :key="i">
          {{ elem.date }} - {{ elem.fullName }}
        </li>
      </ul>
      <hr v-if="showInfo && showAmenities">
      <!--  info amenities -->
      <ul v-if="showAmenities">
        <li v-for="(elem, i) in availableAmenities(seat.amenities)" :key="i">
          <template v-if="(elem.type ==='BOOLEAN')">
            {{ dk(elem.key) }}
          </template>
          <template v-if="elem.type ==='NUMERIC'">
            {{ dk(elem.key) }}: {{ elem.numericValue }}
          </template>
          <template v-if="elem.type ==='MULTI'">
            {{ dk(elem.key) === dk(elem.multiValue) ? dk(elem.key) : dk(elem.key) + " : " + dk(elem.multiValue) }}
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { availableAmenities } from '../../../common/Filters'

const COLORS = {
  notInUse: '#BDDCE1FF',
  booked: '#C70124FF',
  reserved: '#F39500FF',
  firstAider: '#0D99D4FF',
  available: '#65AC1EFF',
  selected: '#014A97FF'
}

export default {
  name: 'ToolTip',
  data () {
    return {
      position: null,
      seat: null
    }
  },
  computed: {
    showAmenities () { return this.seat && this.seat.amenities && (this.seat.isAvailable || this.seat.isReserved) },
    showInfo () { return this.seat && this.seat.details && (this.seat.isBooked || this.seat.isReserved) }
  },
  watch: {
    position () { this.relocate() }
  },
  mounted () {
    this.$nuxt.$on('seatPosition', this.setSeatPosition)
  },
  methods: {
    relocate () {
      if (this.position) {
        const tooltip = document.getElementById('tooltipElement')
        tooltip.style.top = (this.position.y + window.pageYOffset - 5) + 'px'
        tooltip.style.left = (this.position.x - 5) + 'px'
        if (this.seat.isFirstAider) {
          tooltip.style.backgroundColor = COLORS.firstAider
        } else if (this.seat.isBooked) {
          tooltip.style.backgroundColor = COLORS.booked
        } else if (this.seat.hide) {
          tooltip.style.backgroundColor = COLORS.booked
        } else if (this.seat.selected) {
          tooltip.style.backgroundColor = COLORS.selected
        } else if (this.seat.isReserved) {
          tooltip.style.backgroundColor = COLORS.reserved
        } else if (this.seat.isAvailable) {
          tooltip.style.backgroundColor = COLORS.available
        } else {
          tooltip.style.backgroundColor = COLORS.notInUse
        }
      }
    },
    dk (k) {
      const auxKey = 'amenities.' + k
      const value = this.$dk(auxKey)
      return value === auxKey ? k : value
    },
    setSeatPosition (value) {
      this.position = value[0]
      this.seat = value[1]
    },
    availableAmenities
  }
}
</script>

<style scoped>

#tooltipElement {
  padding: 5px;
  margin: 10px;
  position: absolute;
  pointer-events: none;
  border-radius: 6px;
  border: solid 1px white;
}

.hoverMessage {
  color: white;
  padding: 5px;
}

#tooltipElement ul {
  margin: 0;
  padding-left: 1.2em;
}
</style>
