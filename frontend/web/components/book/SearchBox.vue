<template>
  <box2 class="searchBox">
    <div class="ui attached tabular menu">
      <a class="active item" style="font-size: 18px; margin-top: 1%">
        <icon id="location-icon" icon="location" />
        {{ $t("mainpage.book") }}</a>
    </div>
    <div class="ui bottom attached segment active tab d-flex">
      <div class="searchBox-inner-container">
        <div class="field site">
          <label>{{ $t("searchbox.sitelabel") }}</label>
          <dropdown
            v-model="selectedSite"
            :label-selector="(e) => e.name"
            :non-selected="$t('searchbox.sitetitle')"
            :options="sites"
          />
        </div>

        <div v-if="showBuildingField" class="field building">
          <label>{{ $t("searchbox.buildinglabel") }}</label>
          <dropdown
            v-model="selectedBuilding"
            :label-selector="(e) => e.name"
            :non-selected="$t('searchbox.buildingtitle')"
            :options="buildings"
          />
        </div>

        <div class="field floor">
          <label>{{ $t("searchbox.floorlabel") }}</label>
          <dropdown
            v-model="selectedFloor"
            :label-selector="(e) => e.number"
            :non-selected="$t('searchbox.floortitle')"
            :options="floors"
          />
        </div>

        <div class="field start-date">
          <label>{{ $t("searchbox.from") }}</label>
          <datepicker
            v-model="startDate"
            :disabled-dates="disabledDatesFrom"
            :language="$i18n.locale"
            savable
          />
        </div>

        <div class="field end-date">
          <label>{{ $t("searchbox.to") }}</label>
          <datepicker
            v-model="endDate"
            :disabled-dates="disabledDatesTo"
            :language="$i18n.locale"
            savable
          />
        </div>

        <div v-if="isSiteManager" class="field radios">
          <div class="radioTooltip-container">
            <radio
              v-model="seatMode"
              :label="$t('searchbox.randomSeat')"
              name="seatMode"
              r-value="random"
              class="seat-mode random"
              :read-only="isDisableRandomSeatMode"
            />
            <tooltip :content="isDisableRandomSeatMode ? $t('searchbox.randomSeatInfoDisabled') : $t('searchbox.randomSeatInfo')">
              <i class="icon info circle" style="color:#494040" />
            </tooltip>
          </div>

          <radio
            v-model="seatMode"
            :label="$t('searchbox.chooseSeat')"
            name="seatMode"
            r-value="manual"
            class="seat-mode"
          />

          <div v-if="seatMode === 'manual'" class="manual-seat-mode">
            <radio
              v-model="mode"
              :label="$t('searchbox.selfseat')"
              name="mode"
              r-value="self"
            />
            <radio
              v-model="mode"
              :label="$t('searchbox.preBooks')"
              name="mode"
              r-value="preBooks"
            />
            <radio
              v-model="mode"
              :label="$t('searchbox.onBehalfOf')"
              name="mode"
              r-value="onBehalfOf"
            />
          </div>
        </div>
        <div v-if="!isSiteManager" class="field radios">
          <div class="radioTooltip-container">
            <radio
              v-model="seatMode"
              :label="$t('searchbox.randomSeat')"
              name="seatMode"
              r-value="random"
              class="seat-mode random"
              :read-only="isDisableRandomSeatMode"
            />
            <tooltip :content="isDisableRandomSeatMode ? $t('searchbox.randomSeatInfoDisabled') : $t('searchbox.randomSeatInfo')">
              <i class="icon info circle" style="color:#494040" />
            </tooltip>
          </div>
          <radio
            v-model="seatMode"
            :label="$t('searchbox.chooseSeat')"
            name="seatMode"
            r-value="manual"
            class="seat-mode"
          />

          <div v-if="seatMode === 'manual'" class="manual-seat-mode">
            <radio
              v-model="mode"
              :label="$t('searchbox.selfseat')"
              name="mode"
              r-value="self"
            />
            <radio
              v-model="mode"
              :label="$t('searchbox.onBehalfOf')"
              name="mode"
              r-value="onBehalfOf"
            />
          </div>
        </div>

        <div class="btn-container">
          <!-- <label v-if="!showBookButton">.</label> -->
          <button class="ui primary button full" @click="search">
            <i class="icon search" />{{ $t("searchbox.search") }}
          </button>
          <button
            v-if="showBookButton"
            class="ui golden button full"
            @click="book"
          >
            <i class="icon calendar plus" />{{ $t("searchbox.book") }}
          </button>
          <button
            v-if="showQuickBookButton && seatMode !== 'manual'"
            class="ui golden button full"
            @click="quickbook"
          >
            <i class="icon stopwatch" />{{ $t("searchbox.quickBook") }}
          </button>
        </div>
      </div>
    </div>
  </box2>
</template>

<script>
import { addDays } from 'basf-gtu-utils/utils/DateUtils'
import { getter } from 'basf-gtu-utils/utils/FunctionalUtils'

export default {
  name: 'SearchBox',
  data () {
    return {
      mode: 'self',
      seatMode: 'manual',
      startDate: undefined,
      endDate: undefined,
      reservationDays: null,
      bookings: [],
      showBookButton: false,
      maxAllowedPreBooks: null,
      filter: {},
      disabledDatesFrom: () => {
      },
      disabledDatesTo: () => {
      },
      firstAiders: [],
      showQuickBookButton: false,
      isDisableRandomSeatMode: false,
      siteCountriesAllowQuickBook: ['Malaysia']
    }
  },
  computed: {
    sites () {
      return this.$store.getters['site/getSites']
    },
    buildings () {
      return this.$store.getters['building/getBuildings']
    },
    floors () {
      return this.$store.getters['floor/getFloors']
    },
    areas () {
      return this.$store.getters['floor/getAreas']
    },
    selectedSite: {
      get () {
        return this.$store.getters['site/getSelectedSiteBooking']
      },
      set (value) {
        this.$store.dispatch('site/selectSiteBooking', value)
      }
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingBooking']
      },
      set (value) {
        this.$store.dispatch('building/selectBuildingBooking', value)
      }
    },
    selectedFloor: {
      get () {
        return this.$store.getters['floor/getSelectedFloorBooking']
      },
      set (value) {
        this.$store.dispatch('floor/selectFloorBooking', value)
      }
    },
    selectedArea: {
      get () {
        return this.$store.getters['floor/getSelectedAreaBooking']
      },
      set (value) {
        this.$store.dispatch('floor/selectAreaBooking', value)
      }
    },
    selectedSeats () {
      return this.$store.getters['seat/getSelectedSeatsBooking']
    },
    showBuildingField () {
      return this.buildings.length > 1
    },
    managedSites () {
      return this.$store.getters['auth/getManagedSites']
    },
    isSiteManager () {
      if (this.managedSites && this.selectedSite) {
        if (this.managedSites.some(s => s.id === this.selectedSite.id)) {
          return true
        }
      }
      return false
    }
    // userCountryLocation () {
    //   return this.$store.getters['auth/getUserCountryLocation']
    // }
  },
  watch: {
    selectedSite (site) {
      this.cleanSearchBox()
      this.loadFirstAiders()
      this.$store.dispatch('building/loadBuildings', site)
      this.showBookButton = false
      this.showQuickBookButton = false

      if (this.siteCountriesAllowQuickBook.includes(site.country)) {
        this.seatMode = 'random'
        this.isDisableRandomSeatMode = false
        this.showQuickBookButton = true
      } else {
        this.seatMode = 'manual'
        this.showQuickBookButton = false
        this.showBookButton = true
        this.isDisableRandomSeatMode = true
      }
      this.mode = 'self'
    },
    buildings (buildings) {
      if (buildings.length === 1) {
        this.selectedBuilding = buildings[0]
      } else {
        this.selectedBuilding = null
      }

      if (this.selectedBuilding && this.siteCountriesAllowQuickBook.includes(this.selectedBuilding.site.country)) {
        this.seatMode = 'random'
        this.isDisableRandomSeatMode = false
      } else {
        this.seatMode = 'manual'
        this.isDisableRandomSeatMode = true
      }
    },
    selectedBuilding (building) {
      this.$store.dispatch('floor/loadFloors')
      this.selectedFloor = null
      this.$store.dispatch('floor/loadAreas')
      this.selectedArea = null
      this.$store.dispatch('seat/setSelectedSeatsBooking', [])
      if (building) {
        this.updateDisabledDates(building)
        this.$store.dispatch('building/updateQuantityPerFloor')
        this.$store.dispatch('floor/loadFloors', building)
        this.showBookButton = false
        this.showQuickBookButton = false
      }
    },
    floors (floors) {
      if (floors.length === 1) {
        this.selectedFloor = floors[0]
      } else {
        this.selectedFloor = null
      }
    },
    selectedFloor (floor) {
      this.$store.dispatch('floor/loadAreas')
      this.selectedArea = null
      this.$store.dispatch('seat/setSelectedSeatsBooking', [])
      if (floor) {
        this.$store.dispatch('floor/loadAreas', floor)
      }
    },
    areas (areas) {
      if (areas.length === 1) {
        this.selectedArea = areas[0]
      } else {
        this.selectedArea = null
      }
    },
    selectedArea (area) {
      this.$store.dispatch('seat/setSelectedSeatsBooking', [])
      if (area) {
        this.updateBookings()
      }
    },
    startDate (newDate) {
      if (this.endDate === undefined) {
        this.endDate = newDate
      }
      if (newDate > this.endDate) {
        this.endDate = newDate
      }
      this.search(false)
      if (this.siteCountriesAllowQuickBook.includes(this.selectedSite.country)) {
        this.showQuickBookButton = true
      }
    },
    endDate (newDate) {
      this.showBookButton = false
      if (newDate < this.startDate) {
        this.startDate = newDate
      }
      this.search(false)
    },
    mode (value) {
      this.mode = value
      if (this.selectedBuilding) {
        const offset = this.selectedBuilding.reservationCancellationHours
        const startDate = new Date()
        startDate.setHours(startDate.getHours() + offset)
        if (value === 'preBooks') {
          if (this.startDate < startDate) {
            this.startDate = startDate
            this.endDate = startDate
            this.search(false)
            this.updateDisabledDates()
            this.$store.dispatch('seat/setSelectedSeatsBooking', [])
            // this.showBookButton = false
            this.$console.warn(this.$dk('searchbox.preBookOverdue'))
          } else {
            this.updateDisabledDates()
          }
        // } else if (value === 'quickbook') {
        //   if (this.startDate < startDate) {
        //     this.startDate = startDate
        //     this.endDate = startDate
        //     this.search(false)
        //     this.updateDisabledDates()
        //   } else {
        //     this.updateDisabledDates()
        //   }
        } else {
          this.$store.dispatch('seat/setSelectedSeatsBooking', [])
          // this.showBookButton = false
          this.updateBookings()
          this.updateDisabledDates()
        }
      }
    },
    seatMode (value) {
      this.seatMode = value
      if (value === 'random') {
        this.mode = 'self'
        if (this.startDate && this.endDate) {
          this.showQuickBookButton = true
        }
      } else {
        this.showQuickBookButton = false
      }
      this.$store.dispatch('seat/setSelectedSeatsBooking', [])
      this.updateBookings()
      this.updateDisabledDates()
      this.search(false)
    },
    selectedSeats (seats) {
      if (seats.length > 0) {
        if (this.seatMode === 'manual') {
          this.showBookButton = true
          this.showQuickBookButton = false
        }
      } else {
        this.showBookButton = false
      }
    }
  },
  mounted () {
    this.$nuxt.$on('cleanSearchBox', this.cleanSearchBox)
    this.$nuxt.$on('setFilter', this.setFilter)
    if (this.selectedSite) {
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
    }
  },
  methods: {
    search (value) {
      if (this.selectedFloor && this.startDate && this.endDate) {
        this.$nuxt.$emit('search', true)
        this.updateBookings()
      } else if (value !== false) {
        this.$console.warn(this.$dk('searchbox.missinginfo'))
      }
    },
    book () {
      if (this.selectedSeats && this.startDate && this.endDate) {
        const data = {
          isBooking: true,
          startDate: this.startDate,
          endDate: this.endDate,
          mode: this.mode,
          seatMode: this.seatMode,
          siteName: this.selectedSite
        }
        this.$nuxt.$emit('book', data)
      }
    },
    quickbook () {
      if (this.startDate && this.endDate) {
        const data = {
          isQuickBooking: true,
          startDate: this.startDate,
          endDate: this.endDate,
          seatMode: this.seatMode,
          mode: this.mode
        }
        this.$nuxt.$emit('quickbook', data)
      }
    },
    cleanSearchBox () {
      this.startDate = null
      this.endDate = null
      this.$store.dispatch('seat/setSelectedSeatsBooking', [])
      this.showBookButton = false
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
      this.selectedBuilding = null
      this.$store.dispatch('floor/loadFloors')
      this.selectedFloor = null
      this.$store.dispatch('floor/loadAreas')
      this.selectedArea = null
      this.mode = 'self'
      this.$nuxt.$emit('search', false)
    },
    setFilter (filter) {
      this.filter = filter
      this.updateBookings()
    },
    updateDisabledDates (building) {
      if (building) {
        if (this.isSiteManager) {
          this.reservationDays = building.managerReservationDays
        } else {
          this.reservationDays = building.reservationDays
        }
      }
      if (this.reservationDays) {
        let lowestDate
        if (this.mode === 'self' || this.mode === 'onBehalfOf') {
          lowestDate = addDays(-1)(new Date())
        } else {
          const offset = this.selectedBuilding.reservationCancellationHours
          lowestDate = addDays(-1)(new Date())
          lowestDate.setHours(lowestDate.getHours() + offset)
        }
        const greatestDate = addDays(this.reservationDays - 1)(new Date())
        this.disabledDatesFrom = () => {
          return { to: lowestDate, from: greatestDate }
        }
        this.disabledDatesTo = () => {
          return { to: lowestDate, from: greatestDate }
        }
      }
    },
    async updateBookings () {
      await this.$store.dispatch('seat/loadSeats', this.selectedArea)
      if (this.selectedArea && this.startDate && this.endDate) {
        const firstAiders = this.firstAiders.map(getter('username'))
        const userInfo = this.$store.getters['auth/getUser']
        const seats = Object.values(this.$store.getters['seat/getSeats'])
        const initialDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate(), 12).toISOString().substring(0, 10)
        const finalDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate(), 12).toISOString().substring(0, 10)
        const userHood = await this.$api.hood.get({ orgCode: userInfo.org_code })
        const seatsGrouped = {}
        seats.forEach((s) => {
          seatsGrouped[s.id] = s
          seatsGrouped[s.id].books = []
        })
        const bookings = await this.$api.booking.areaOnDates(this.selectedArea.id, initialDate, finalDate)
        for (const b of bookings) {
          seatsGrouped[b.seat.id].books = []
          seatsGrouped[b.seat.id].books.push(b)
        }
        for (const seatId in seatsGrouped) {
          seatsGrouped[seatId].seatCode = seatsGrouped[seatId].code
          seatsGrouped[seatId].seatId = seatsGrouped[seatId].id
          if (seatsGrouped[seatId].books.length) {
            seatsGrouped[seatId].isFirstAider = seatsGrouped[seatId].books.filter(getter('user')).map(b => b.user.username).some(u => firstAiders.includes(u))
            seatsGrouped[seatId].status = seatsGrouped[seatId].books.map(b => b.bookingStatus.status)
          } else {
            seatsGrouped[seatId].isFirstAider = false
            seatsGrouped[seatId].isAvailable = true
            seatsGrouped[seatId].status = ''
          }
          if (seatsGrouped[seatId].seatHoods.length > 0 && (userHood !== null && !seatsGrouped[seatId].seatHoods.find(h => userHood.filter(uh => h.hoodId === uh.id).length))) {
            seatsGrouped[seatId].isBooked = true
          }
          if (seatsGrouped[seatId].status.includes('Booked')) {
            seatsGrouped[seatId].isBooked = true
          } else if (seatsGrouped[seatId].status.includes('Reserved')) {
            seatsGrouped[seatId].isReserved = true
          } else {
            if (seatsGrouped[seatId].seatOwners.length) {
              const userId = this.$store.getters['auth/getUsername']
              const tempowner = seatsGrouped[seatId].seatOwners.find(owner => owner.userId === userId)
              if (!tempowner) {
                seatsGrouped[seatId].isBooked = true
              }
            }
            seatsGrouped[seatId].isAvailable = true
          }
          if (seatsGrouped[seatId].status.includes('Booked')) {
            seatsGrouped[seatId].isBooked = true
          } else if (seatsGrouped[seatId].status.includes('Reserved')) {
            seatsGrouped[seatId].isReserved = true
          } else {
            if (seatsGrouped[seatId].seatOwners.length) {
              const userId = this.$store.getters['auth/getUsername']
              const tempowner = seatsGrouped[seatId].seatOwners.find(owner => owner.userId === userId)
              if (!tempowner) {
                seatsGrouped[seatId].isBooked = true
              }
            }
            if (!seatsGrouped[seatId].isBooked) {
              seatsGrouped[seatId].isAvailable = true
            }
          }
        }
        const amenitiesFilter = this.filter
        const getterStrategy = {
          NUMERIC: a => a.numericValue,
          BOOLEAN: a => a.booleanValue,
          MULTI: a => a.multiValue
        }
        const nullOrUndefined = v => v === undefined || v === null
        const valueGetter = a => getterStrategy[a.type](a)
        for (const seatId in seatsGrouped) {
          if (seatsGrouped[seatId].isReserved || seatsGrouped[seatId].isAvailable) {
            const seatAmenities = seatsGrouped[seatId].amenities.reduce((a, c) => {
              a[c.key] = { value: valueGetter(c), type: c.type }
              return a
            }, {})
            for (const f in amenitiesFilter) {
              if (nullOrUndefined(amenitiesFilter[f])) {
                continue
              }
              if (nullOrUndefined(seatAmenities[f]) || amenitiesFilter[f] !== seatAmenities[f].value) {
                seatsGrouped[seatId].hide = true
              }
            }
          }
        }
        this.bookings = seatsGrouped
        this.$nuxt.$emit('setBookings', {
          seatsGrouped,
          mode: this.mode,
          seatMode: this.seatMode,
          startDate: this.startDate,
          endDate: this.endDate
        })
      }
    },
    async loadFirstAiders () {
      this.firstAiders = null
      if (this.selectedSite) {
        const siteFirstAiders = (await this.$api.brigadier.get({ siteId: this.selectedSite.id })).sort((a, b) => a.username.localeCompare(b.username))
        this.firstAiders = siteFirstAiders
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchBox {
  #location-icon {
    height: 25px;
    width: 25px;
    margin-right: 5px;
  }

  .searchBox-inner-container {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    width: 100%;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .field {
      color: #000;
      flex-grow: 1;

      label {
        display: block;
      }

      &.site {
      max-width: 245px;

        @media (max-width: 768px) {
          max-width: unset;
        }
      }

      &.radios {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        margin-top: 4px;
        width: 135px;

        .radio {
          margin-top: 0;
          margin-bottom: 0;
          flex-shrink: 0;

          &.seat-mode {
            &.random {
              margin-bottom: 5px;

              &[read-only="true"] {
                pointer-events: none;
                opacity: .7;
              }

              label {
                margin-right: 5px;
              }
            }
          }
        }
        .manual-seat-mode {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-left: 10px;
          background-color: #e9e9e9;
          padding: 5px;
          border-radius: 4px;
        }

        .radioTooltip-container {
          display: flex;
        }
      }
    }
  }

  .btn-container {
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
      min-width: unset;
    }
  }

  button.full {
    width: 100%;
  }

  .golden {
    background-color: #f39501;
    color: #fff;
  }

}
</style>

<style lang="scss">
.searchBox {
  .seat-mode {
    &.random {
      label {
        margin-right: 5px;
      }
    }
  }
}
</style>
