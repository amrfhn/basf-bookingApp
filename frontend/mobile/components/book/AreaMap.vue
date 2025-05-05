<template>
  <div>
    <div class="helper" />
    <div id="area-map" />
  </div>
</template>

<script>
import { utils } from 'basf-gtu-utils'
import { groupBy } from '../../../web/common/Utils'

const { distinct } = utils.functional

export default {
  name: 'AreaMap',
  props: {
    maxAllowedPreBooks: { type: Number, required: true }
  },
  data () {
    return {
      selectedSeat: null,
      selectedManagerSeats: {}
    }
  },
  computed: {
    area () {
      return this.$store.getters['book/getSelectedArea']
    },
    mode () {
      return this.$store.getters['book/getMode']
    },
    teammates () {
      return this.$store.getters['auth/getTeammates']
    },
    brigadiers () {
      return this.$store.getters['book/getBrigadiers']
    }
  },
  mounted () {
    this.$api.area.getMap(this.area.id).then(this.mapSetting)
  },
  methods: {
    prepareSeats (map) {
      const mapDOM = document.getElementById('area-map')
      mapDOM.innerHTML = map
      const seats = document.getElementsByClassName('seat')
      for (const seat of seats) {
        seat.style.opacity = '1.0'
        seat.style.fill = 'rgb(189, 220, 225)'
        seat.style.cursor = 'pointer'
      }
      mapDOM.firstElementChild.style.width = '100%'
    },
    async mapSetting (map) {
      const processed = await this.processBooking()
      this.prepareSeats(map)
      for (const seat of Object.values(processed)) {
        const seatCode = seat.buildingMindsID ? seat.buildingMindsID : seat.code
        const seatDOM = document.getElementById(`seat-${seatCode}`)
        let notByTeammates = false
        let bookedUsers = ''
        switch (seat.status) {
          case 'Available':
            if (seat.seatOwners.length) {
              const userId = await this.$store.getters['auth/getUsername']
              if (!seat.seatOwners.find(so => so.userId === userId)) {
                seatDOM.style.fill = 'rgb(199, 1, 36)'
              } else {
                seatDOM.style.fill = 'rgb(101, 172, 30)'
              }
            } else {
              seatDOM.style.fill = 'rgb(101, 172, 30)' // In the future this will be dynamically charged
            }
            seatDOM.addEventListener('click', () => {
              if (this.mode === 'preBooks') {
                if (this.selectedManagerSeats[seatDOM.id]) {
                  delete this.selectedManagerSeats[seatDOM.id]
                  seatDOM.style.fill = 'rgb(101, 172, 30)' // In the future this will be dynamically charged
                } else if (Object.keys(this.selectedManagerSeats).length < this.maxAllowedPreBooks) {
                  seatDOM.style.fill = 'rgb(1, 74, 151)' // In the future this will be dynamically charged
                  this.selectedManagerSeats[seatDOM.id] = seat
                } else {
                  console.warn('Max allowed seats for pre-books reached.')
                }
                this.selectManagerBookings(this.selectedManagerSeats)
              } else {
                if (this.selectedSeat) {
                  if (this.selectedSeat.status === 'Available') {
                    this.selectedSeat.DOM.style.fill = 'rgb(101, 172, 30)' // In the future this will be dynamically charged
                  } else if (this.selectedSeat.status === 'Reserved') {
                    this.selectedSeat.DOM.style.fill = 'rgb(243,149,0)' // In the future this will be dynamically charged
                  }
                }
                this.selectedSeat = { DOM: seatDOM, status: 'Available' }
                this.selectSeat(seat)
                seatDOM.style.fill = 'rgb(1, 74, 151)' // In the future this will be dynamically charged
              }
            })
            break
          case 'Booked':
            seatDOM.style.fill = 'rgb(199, 1, 36)' // In the future this will be dynamically charged
            if (seat.books !== undefined) {
              bookedUsers = seat.books.map(x => x.userId ? x.userId.username : null)
              if (this.brigadiers.some(b => bookedUsers.includes(b))) {
                seatDOM.style.fill = 'rgb(13, 153, 212)' // In the future this will be dynamically charged
              }
            }
            break
          case 'Reserved':
            notByTeammates = seat.reserverUserIds.filter(x => !this.teammates.includes(x)).length > 0
            if (notByTeammates) {
              seatDOM.style.fill = 'rgb(199, 1, 36)' // In the future this will be dynamically charged
            } else {
              seatDOM.style.fill = 'rgb(243,149,0)' // In the future this will be dynamically charged
              if (this.mode === 'self') {
                seatDOM.addEventListener('click', () => {
                  if (this.selectedSeat) {
                    if (this.selectedSeat.status === 'Available') {
                      this.selectedSeat.DOM.style.fill = 'rgb(101, 172, 30)' // In the future this will be dynamically charged
                    } else if (this.selectedSeat.status === 'Reserved') {
                      this.selectedSeat.DOM.style.fill = 'rgb(243,149,0)' // In the future this will be dynamically charged
                    }
                  }
                  this.selectedSeat = { DOM: seatDOM, status: 'Reserved' }
                  this.selectSeat(seat)
                  seatDOM.style.fill = 'rgb(1, 74, 151)' // In the future this will be dynamically charged
                })
              }
            }
            break
        }
      }
    },
    async processBooking () {
      const result = {}
      const bookings = await this.$store.getters['book/getBookings']
      const seats = await this.$store.getters['book/getSeats']
      const seatsGrouped = groupBy(seats, 'id')
      const userInfo = await this.$store.getters['auth/getUser']
      const userHood = await this.$api.hood.get({ orgCode: userInfo.org_code })
      Object.entries(seatsGrouped).forEach(([seatId, seat]) => {
        let statuses = ''
        let status = 'Available'
        let reserverUserIds = ''
        if (bookings[seatId] !== undefined) {
          statuses = bookings[seatId].map(b => b.bookingStatus.status)
          status = statuses.includes('Booked') ? 'Booked' : statuses.includes('Reserved') ? 'Reserved' : 'Available'
          reserverUserIds = bookings[seatId].filter(b => b.bookingStatus.status === 'Reserved')
            .map(b => b.reserverUserId.username.toLowerCase())
            .filter(distinct)
        }
        if (seat[0].seatOwners.length && !seat[0].seatOwners.find(o => o.userId === userInfo.username)) {
          status = 'Booked'
        }
        if (seat[0].seatHoods.length && !seat[0].seatHoods.find(h => userHood.filter(uh => h.hoodId === uh.id).length)) {
          status = 'Booked'
        }

        result[seatId] = {
          ...seat[0],
          books: bookings[seatId],
          status,
          reserverUserIds
        }
      })
      return result
    },
    selectSeat (seats) {
      this.$emit('select', seats)
    },
    selectManagerBookings (managerBookings) {
      const res = []
      for (const key in managerBookings) {
        res.push({ seat: managerBookings[key], books: managerBookings[key].books })
      }
      this.$emit('select', res)
    }
  }
}
</script>

<style lang="scss" scoped>
#area-map {
  width: 100%;
}

.helper {
  width: 260px;
}

@media (min-width: 500px) {
  .helper {
    width: 440px;
  }
}

@media (min-width: 630px) {
  .helper {
    width: 570px;
  }
}

</style>
