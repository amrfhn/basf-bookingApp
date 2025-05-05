<template>
  <div v-show="!!area">
    <div class="helper" />
    <div id="area-map" style="height: 100%; min-height:500px" />
  </div>
</template>

<script>
// In the future this will be dynamically charged
import { newFormatDate } from '../../../../mobile/common/Utils'
import { isMobileViewport } from '@/common/UseBreakpoints'

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
  name: 'AreaMap',
  data () {
    return {
      ready: false,
      shape: null,
      mousePosition: { x: 0, y: 0 },
      mouseStartPosition: { x: 0, y: 0 },
      viewboxPosition: { x: 0, y: 0 },
      viewboxScale: 1.0,
      viewboxSize: { x: 900, y: 900 },
      svg: null,
      // mouseDown: false,
      bookings: [],
      mode: null,
      seatMode: null,
      position: null,
      maxAllowedPreBooks: null,
      map: '',
      siteCountriesAllowQuickBook: ['Malaysia'],
      isMobileViewport: isMobileViewport()
    }
  },
  computed: {
    area () {
      return this.$store.getters['floor/getSelectedAreaBooking']
    },
    seats () {
      return this.$store.getters['seat/getSeats']
    },
    selectedSite () {
      return this.$store.getters['site/getSelectedSiteBooking']
    }
  },
  watch: {
    async area (area) {
      if (area) {
        this.map = await this.$api.area.getMap(area.id)
      } else {
        this.map = ''
      }
    },
    map (_value) {
      this.loadMap()
    },
    bookings (_value) {
      this.paint()
    },
    ready (_value) {
      this.paint()
    },
    seatMode (_value) {
      this.loadMap()
    }
  },
  async mounted () {
    if (this.area) {
      this.map = await this.$api.area.getMap(this.area.id)
    }
    this.$nuxt.$on('setBookings', this.setBookings)
    this.$nuxt.$on('cleanArea', this.cleanBookings)
    this.loadMap()
  },
  methods: {
    async setBookings (data) {
      this.bookings = data.seatsGrouped
      this.mode = data.mode
      this.seatMode = data.seatMode
      if (this.mode === 'preBooks') {
        this.maxAllowedPreBooks = await this.$api.booking.getMaxAllowedPreBooks(newFormatDate(data.startDate), newFormatDate(data.endDate))
      }
    },
    cleanBookings () {
      this.bookings = []
    },
    resetValues () {
      this.ready = false
      this.shape = null
      this.mousePosition = { x: 0, y: 0 }
      this.mouseStartPosition = { x: 0, y: 0 }
      this.viewboxPosition = { x: 0, y: 0 }
      this.viewboxScale = 1
      this.viewboxSize = { x: 900, y: 900 }
      this.svg = null
      // this.mouseDown = false
    },
    loadMap () {
      if (!this.seatMode) { return }
      this.ready = false
      const mapDOM = document.getElementById('area-map')
      mapDOM.innerHTML = this.map
      if (!this.map || !this.map.length) {
        return
      }
      const seats = document.getElementsByClassName('seat')
      for (const seat of seats) {
        seat.style.opacity = opacity
        seat.style.fill = COLORS.notInUse
        seat.style.cursor = cursor
        const seatCode = seat.id.replace('seat-', '')
        if (this.seatMode !== 'random') {
          seat.addEventListener('click', () => {
            this.selectSeat(seatCode)
          })
        }
        seat.addEventListener('mouseover', (e) => {
          this.show({ seatCode, x: e.clientX, y: e.clientY })
        })
        seat.addEventListener('mouseleave', () => {
          this.hide()
        })
      }
      this.resetValues()
      this.svg = mapDOM.getElementsByTagName('svg')[0]
      this.svg.removeAttribute('width')
      this.svg.removeAttribute('height')
      this.svg.style.width = '100%'
      this.svg.style.height = '500px'
      // this.zoomFct()
      // this.setZoomEvents()

      if (!this.isMobileViewport) {
        this.$svgPanZoom(this.svg, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          mouseWheelZoomEnabled: false,
          dblClickZoomEnabled: false
        })
      }

      this.ready = true
    },
    paint () {
      if (!this.bookings) {
        return
      }
      if (!this.ready) {
        return
      }
      for (const seatKey in this.seats) {
        const seat = this.seats[seatKey]
        const seatCode = seat.buildingMindsID ? seat.buildingMindsID : seat.code
        const seatDOM = document.getElementById(`seat-${seatCode}`)
        if (seatDOM !== null) {
          const bookingSeat = Object.values(this.bookings).filter(s => s.seatId === seat.id)
          seatDOM.style.fill = this.paintSeat(bookingSeat)
        }
      }
    },
    paintSeat (bookingSeat) {
      if (bookingSeat.length) {
        bookingSeat = bookingSeat[0]
        if (bookingSeat.isFirstAider) {
          return COLORS.firstAider
        } else if (bookingSeat.isBooked) {
          return COLORS.booked
        } else if (bookingSeat.hide) {
          return COLORS.booked
        } else if (bookingSeat.selected) {
          return COLORS.selected
        } else if (bookingSeat.isReserved) {
          return COLORS.reserved
        } else if (bookingSeat.isAvailable) {
          return COLORS.available
        } else {
          return COLORS.notInUse
        }
      } else {
        return COLORS.notInUse
      }
    },
    // zoomFct (move) {
    //   this.mousePosition.x = 0
    //   this.mousePosition.y = 0
    //   this.viewboxStartPosition = { x: 0, y: 0 }
    //   if (move) {
    //     const scale = (move === 'in') ? 0.9 : 1.1
    //     if ((this.viewboxScale * scale < 8.0) && (this.viewboxScale * scale > 1.0 / 256.0)) {
    //       const mpos = { x: this.mousePosition.x * this.viewboxScale, y: this.mousePosition.y * this.viewboxScale }
    //       const vpos = { x: this.viewboxPosition.x, y: this.viewboxPosition.y }
    //       const cpos = { x: mpos.x + vpos.x, y: mpos.y + vpos.y }
    //       this.viewboxPosition.x = (this.viewboxPosition.x - cpos.x) * scale + cpos.x
    //       this.viewboxPosition.y = (this.viewboxPosition.y - cpos.y) * scale + cpos.y
    //       this.viewboxScale *= scale
    //       this.setviewbox('in')
    //     }
    //   }
    //   this.mouseDown = false
    //   // this.svg.addEventListener('mousemove', this.mousemove)
    //   // this.svg.addEventListener('mousedown', this.mousedown)
    // },
    // setZoomEvents () {
    //   this.svg.addEventListener('mousemove', this.mousemove)
    //   this.svg.addEventListener('mousedown', this.mousedown)
    // },
    // setviewbox (zoom) {
    //   const vp = { x: 0, y: 0 }
    //   const vs = { x: 0, y: 0 }
    //   if (zoom) {
    //     vp.x = zoom === 'in'
    //       ? ((this.viewboxPosition.x + this.viewboxSize.x - this.viewboxSize.x * this.viewboxScale) / 2)
    //       : ((this.viewboxPosition.x + this.viewboxSize.x - this.viewboxSize.x * this.viewboxScale) / 2)
    //     vp.y = zoom === 'in'
    //       ? ((this.viewboxPosition.y + this.viewboxSize.y - this.viewboxSize.y * this.viewboxScale) / 2)
    //       : ((this.viewboxPosition.y + this.viewboxSize.y - this.viewboxSize.y * this.viewboxScale) / 2)
    //   } else {
    //     vp.x = this.viewboxPosition.x
    //     vp.y = this.viewboxPosition.y
    //   }
    //   vs.x = (this.viewboxSize.x * this.viewboxScale)
    //   vs.y = (this.viewboxSize.y * this.viewboxScale)
    //   this.svg.setAttribute('viewBox', vp.x + ' ' + vp.y + ' ' + vs.x + ' ' + vs.y)
    // },
    // mouseup (_e) {
    //   window.removeEventListener('mouseup', this.mouseup)
    //   // this.mouseDown = false
    // },
    // mousedown (e) {
    //   this.mouseStartPosition.x = e.pageX
    //   this.mouseStartPosition.y = e.pageY
    //   this.viewboxStartPosition.x = this.viewboxPosition.x
    //   this.viewboxStartPosition.y = this.viewboxPosition.y
    //   window.addEventListener('mouseup', this.mouseup)
    //   // this.mouseDown = true
    // },
    // mousemove (e) {
    //   this.mousePosition.x = e.offsetX
    //   this.mousePosition.y = e.offsetY
    //   if (this.mouseDown) {
    //     this.viewboxPosition.x = this.viewboxStartPosition.x + (this.mouseStartPosition.x - e.pageX) * this.viewboxScale
    //     this.viewboxPosition.y = this.viewboxStartPosition.y + (this.mouseStartPosition.y - e.pageY) * this.viewboxScale
    //     this.setviewbox()
    //   }
    // },
    show ({ seatCode, x, y }) {
      const seat = this.$store.getters['seat/getSeats'][seatCode]
      if (seat) {
        const bookings = this.bookings[seat.id]
        // TODO check when the seats is not configured
        if (bookings !== undefined) {
          const newSeat = { ...seat }
          newSeat.isFirstAider = bookings.isFirstAider !== undefined ? bookings.isFirstAider : null
          newSeat.hide = bookings.hide !== undefined ? bookings.hide : null
          newSeat.isBooked = bookings.isBooked !== undefined ? bookings.isBooked : null
          newSeat.selected = bookings.selected !== undefined ? bookings.selected : null
          newSeat.isReserved = bookings.isReserved !== undefined ? bookings.isReserved : null
          newSeat.isAvailable = bookings.isAvailable !== undefined ? bookings.isAvailable : null
          newSeat.details = []

          if (bookings.books !== undefined) {
            for (const booking of bookings.books) {
              if (booking.user) {
                newSeat.details.push({ fullName: booking.user.full_name, date: booking.calendar.date })
              } else if (booking.reserverUser) {
                newSeat.details.push({ fullName: booking.reserverUser.full_name, date: booking.calendar.date })
              }
            }
          }
          if (!newSeat.details.length) {
            delete newSeat.details
          }
          if (!newSeat.amenities.length) {
            delete newSeat.amenities
          }
          this.$nuxt.$emit('seatPosition', [{ x, y }, newSeat])
        }
      }
    },
    hide () {
      this.$nuxt.$emit('seatPosition', [null, null])
    },
    selectSeat (seatCode) {
      const seat = this.seats[seatCode]
      if (!seat) {
        return
      }
      const bookings = JSON.parse(JSON.stringify(this.bookings))
      const booking = bookings[seat.id]
      if (((booking.isReserved || booking.isAvailable) && !booking.hide) && (!booking.isBooked || booking.isBooked === undefined)) {
        const selected = Object.values(bookings).filter(b => b.selected)
        if (!bookings[seat.id].selected) {
          if (this.mode === 'self' || this.mode === 'onBehalfOf') {
            selected.forEach((s) => {
              bookings[s.seatId].selected = false
            })
          } else if (selected.length === this.maxAllowedPreBooks) {
            this.$console.warn(this.$dk('searchbox.maxPrebooksReached'))
            return
          }
        }
        bookings[seat.id].selected = !bookings[seat.id].selected
        const selectedSeats = Object.values(bookings).filter(b => b.selected).map(b => this.seats[b.buildingMindsID ? b.buildingMindsID : b.seatCode])
        this.$store.dispatch('seat/setSelectedSeatsBooking', selectedSeats)
        this.bookings = bookings
      }
    }
  }
}

</script>

<style lang="scss">

#area-map {
  width: 100%;
  max-height: 100%;
  margin-top: 15px;
  background-color: #f0f0f0;
}

.helper {
  width: 260px
}

@media (min-width: 500px) {
  .helper {
    width: 440px
  }
}

@media (min-width: 630px) {
  .helper {
    width: 570px
  }
}

</style>
