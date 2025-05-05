<template>
  <box3 id="main-section">
    <button id="btn_feedback" class="ui primary button inline" @click="toggleFeedbackModal">
      <i class="comment alternate icon" /> {{ $t('mainpage.feedback') }}
    </button>
    <h1>{{ $t('book.findASeat') }}</h1>

    <ui-grid v-if="showFloorMap">
      <row>
        <column :wide="4">
          <button v-if="!area || area.code === '-'" class="ui primary button" @click="toggleFloorMap">
            <i class="chevron left icon" /> {{ $t('back') }}
          </button>
          <button v-if="!!area && area.code !== '-'" class="ui primary button" @click="backToArea">
            <i class="chevron left icon" /> {{ $t('back') }}
          </button>
        </column>
        <column :wide="4" />
        <column :wide="4">
          <button :disabled="!seat" class="ui golden button full" @click="toggleModal">
            <i class="icon bell" /> {{ $t('book.booking') }}
          </button>
        </column>
      </row>

      <row>
        <column :wide="12">
          <book-area-map
            v-if="!!area && !!floor && books"
            :max-allowed-pre-books="maxAllowedPreBooks"
            @select="selectSeat"
          />
          <book-floor-map v-else :floor="floor" @select="selectArea" />
        </column>
      </row>
    </ui-grid>

    <ui-grid v-show="!showFloorMap">
      <row>
        <column :wide="2">
          <label>{{ $t('book.siteLabel') }}</label>
        </column>
        <column :wide="10">
          <dropdown v-model="site" :label-selector="e => e.name" :non-selected="$t('book.sitetitle')" :options="sites" />
        </column>
      </row>

      <row v-if="buildings.length>1">
        <column :wide="2">
          <label>{{ $t('book.buildingLabel') }}</label>
        </column>
        <column :wide="10">
          <dropdown
            v-model="building"
            :label-selector="e => e.name"
            :non-selected="$t('book.buildingtitle')"
            :options="buildings"
          />
        </column>
      </row>

      <row>
        <column :wide="2">
          <label> {{ $t('book.floor') }}</label>
        </column>
        <column :wide="10">
          <dropdown
            v-model="floor"
            :label-selector="e => e.number"
            :non-selected="$t('book.selectFloor')"
            :options="floors"
          />
        </column>
      </row>

      <row>
        <column :wide="2">
          <label>
            {{ $t('book.from') }}
          </label>
        </column>
        <column :wide="10">
          <datepicker id="formatDateFrom" v-model="startDate" :disabled-dates="localDisabledDatesFrom" savable />
        </column>
      </row>

      <row>
        <column :wide="2">
          <label>
            {{ $t('book.to') }}
          </label>
        </column>
        <column :wide="10">
          <datepicker id="formatDateTo" v-model="endDate" :disabled-dates="localDisabledDatesTo" savable />
        </column>
      </row>

      <row v-if="areas.length > 1">
        <column :wide="2">
          <label> {{ $t('area') }}</label>
        </column>
        <column :wide="10">
          <dropdown v-model="area" :label-selector="e => e.code" :non-selected="$t('area')" :options="areas" />
        </column>
      </row>
      <row>
        <column :wide="2" />
        <column :wide="4">
          <radio v-model="seatMode" :label="$t('book.randomSeat')" name="seatMode" r-value="random" :read-only="isDisableRandomSeatMode" />
        </column>
        <column :wide="4">
          <radio v-model="seatMode" :label="$t('book.chooseSeat')" name="seatMode" r-value="manual" />
        </column>
      </row>
      <row v-if="isSiteManager && seatMode === 'manual'">
        <column :wide="2" />
        <column :wide="4">
          <radio v-model="mode" :label="$t('book.forMe')" name="mode" r-value="self" />
        </column>
        <column :wide="5">
          <radio v-model="mode" :label="$t('book.preBooks')" name="mode" r-value="preBooks" />
        </column>
        <column :wide="1" />
      </row>
      <row v-if="seatMode === 'manual'">
        <column :wide="2">
          <label> {{ $t('book.seat') }}</label>
        </column>
        <column :wide="5">
          <dropdown
            v-model="seat"
            :label-selector=" e => e.code"
            :non-selected="$t('book.chooseSeat')"
            :options="seats"
          />
        </column>
        <column :wide="5">
          <button :disabled="!floor || !startDate|| !endDate" class="ui primary button full" @click="toggleFloorMap">
            {{ $t('book.viewFloorPlan') }}
          </button>
        </column>
      </row>

      <row>
        <button v-if="seatMode === 'manual'" :disabled="!disableBookButton" class="ui golden button full" @click="toggleModal">
          <i class="icon bell" />{{ $t('book.booking') }}
        </button>
        <button v-else :disabled="!disableBookButton" class="ui golden button full" @click="toggleModal">
          <i class="icon stopwatch" />{{ $t('book.quickBook') }}
        </button>
      </row>
    </ui-grid>

    <template-modal
      v-if="showModal"
      :body="mode"
      :show="showModal"
      :title="$t('modal.confirmTitle')"
      closeable
      @close="toggleModal"
      @ok="book"
    >
      {{ loggedUser.full_name }} {{ $t('modal.selectedBook') }}<br><br>

      <ul>
        <li>{{ $t('modal.date') }} <strong>{{ startDate | formatDate }} to {{ endDate | formatDate }} </strong></li>
        <li>{{ $t('book.siteLabel') }}:<strong> {{ site.name }}</strong></li>
        <li>{{ $t('book.buildingLabel') }}:<strong> {{ building.name }}</strong></li>
        <li v-if="seatMode === 'manual'">{{ $t('modal.floor') }} <strong>{{ floor?.number }}</strong></li>
        <li v-if="seatMode === 'manual' && area?.code">
          {{ $t('modal.area') }} <strong>{{ area?.code || '-' }}</strong>
        </li>
        <template v-for="s of selectedSeats">
          <li v-if="s" :key="s?.id">
            {{ $t('modal.seat') }} <strong>{{ seat?.code }}</strong>

            <ul v-if="s?.amenities">
              <li v-for="(elem, i) in availableAmenities(s.amenities)" :key="i">
                <template v-if="(elem.type ==='BOOLEAN')">
                  {{ dk(elem.key) }}
                </template>
                <template v-if="elem.type ==='NUMERIC'">
                  {{ dk(elem.key) }}: {{ elem.numericValue }}
                </template>
                <template v-if="elem.type ==='MULTI'">
                  {{ dk(elem.key) }}: {{ dk(elem.multiValue) }}
                </template>
              </li>
            </ul>
          </li>
        </template>
      </ul>
      <div v-if="allowParkingReservation()">
        <!--Shown only if there exists at least one parking floor in the selected building-->
        <hr>
        <input id="parkingLotBooking" v-model="bookParkingCheck" type="checkbox">
        <label for="parkingLotBooking" style="font-size: 16px;">{{ $t('mainpage.wantBookParkingLot') }}</label>
        <ui-grid v-if="bookParkingCheck" :columns="4">
          <row>
            <column :wide="2">
              <label>{{ $t('modal.date') }}</label>
            </column>
            <column :wide="3">
              <label>{{ $t('modal.floor') }}</label>
            </column>
            <column :wide="3">
              <label>{{ $t('mainpage.parkingLot') }}</label>
            </column>
            <column :wide="4" />
          </row>
          <row v-for="item in parkings" :key="item.date">
            <column v-if="item.authorized && !item.seatOwner && item.floors.length" :wide="2">
              <p>{{ item.date.toISOString().slice(0, 10) }}</p>
            </column>
            <column v-if="item.authorized && !item.seatOwner && item.floors.length" :wide="3">
              <dropdown
                v-model="item.floor"
                :label-selector="e => e.number"
                :options="item.floors"
                @change="loadParkingLots(item)"
              />
            </column>
            <column :wide="3">
              <dropdown
                v-if="item.authorized && !item.seatOwner && item.floor && item.floors.length"
                v-model="item.parkingLot"
                :label-selector="e => e.code"
                :options="item.parkingLots"
                style="text-align: left"
              />
            </column>
            <column v-show="item.authorized && !item.seatOwner" :wide="4">
              <btn-positive v-if="false" @click="showMapModal(item)">
                {{ $t('configuration.parking.viewParkingMap') }}
              </btn-positive>
            </column>
            <column v-if="item.seatOwner && item.available && item.authorized" :wide="10">
              {{
                $t('configuration.parking.seatOwnerParkingLot', {
                  parkingLot: userParkingInfo.seatOwnerInfo.seat.code,
                  parkingFloor: userParkingInfo.seatOwnerInfo.floor.number
                })
              }}
            </column>
            <column v-if="!item.authorized" :wide="10">
              {{ $t('configuration.parking.NotAuthorizedParkingLot') }}
            </column>
            <column v-if="!item.available" :wide="10">
              {{ $t('configuration.parking.NoAvailableParkingLot') }}
            </column>
            <hr>
          </row>
        </ui-grid>
      </div>
    </template-modal>
    <template-modal
      :confirm-text="$t('mainpage.feedbackModal.send')"
      :show="showFeedbackModal"
      :title="$t('mainpage.feedbackModal.title')"
      closeable
      @close="toggleFeedbackModal"
      @ok="sendFeedback"
    >
      <Feedback />
    </template-modal>
    <seat-already-booked-alert
      :show="showSeatAlert"
      :title="$t('alert.title')"
      closeable
      @close="toggleAlert"
    >
      {{ $t('alert.seatTakenMessage') }} <br><br>
    </seat-already-booked-alert>
  </box3>
</template>

<script>
import { capitalize } from 'basf-gtu-utils/utils/FunctionalUtils'
import moment from 'moment'
import { availableAmenities } from '@/common/Filters'
import SeatAlreadyBookedAlert from '@/components/book/SeatAlreadyBookedAlert'
import TemplateModal from '@/components/modal/TemplateModal'
import { sortByStrAndNumFloorOrSeat } from '@/common/Utils'

const dateFormat = 'YYYY-MM-DD'
const formatDate = date => moment(date).format(dateFormat)

export default {
  name: 'Book',
  components: { TemplateModal, SeatAlreadyBookedAlert },
  filters: {
    formatDate (date) {
      if (date != null) {
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
      }
    }
  },
  data () {
    return {
      defaultBuilding: null,
      showModal: false,
      showSeatAlert: false,
      showFloorMap: false,
      showFeedbackModal: false,
      maxAllowedPreBooks: 0,
      parkings: [],
      userHood: null,
      userId: null,
      isDisableRandomSeatMode: false,
      seatMode: 'manual',
      siteCountriesAllowQuickBook: ['Malaysia']
    }
  },
  computed: {
    loggedUser () {
      return this.$store.getters['auth/getUser']
    },
    sites () {
      return this.$store.getters['book/getSites']
    },
    buildings () {
      return this.$store.getters['book/getBuildings']
    },
    floors () {
      return this.$store.getters['book/getFloors']
    },
    areas () {
      return this.$store.getters['book/getAreas']
    },
    seats () {
      let seats = this.$store.getters['book/getSeats']
      const userHood = this.userHood
      let filteredSeats = seats
      if (seats !== undefined) {
        if (seats.length) {
          seats = seats.filter(s => s.typeId !== 2)
          if (userHood !== null) {
            filteredSeats = filteredSeats.filter((s) => {
              return s ? (!s.seatHoods.length || s.seatHoods.find(h => userHood.filter(uh => h.hoodId === uh.id).length)) : false
            })
          }
          filteredSeats = filteredSeats.filter((s) => {
            return s ? (!s.seatOwners.length || s.seatOwners.find(o => o.userId === this.userId)) : false
          })
        }
        if (this.books) {
          filteredSeats = filteredSeats.filter((s) => {
            return s ? this.books[s.id] === undefined : false
          })
        }
        filteredSeats = filteredSeats.length > 0 ? filteredSeats.sort((a, b) => a.code - b.code) : []
      }
      return filteredSeats
    },
    books () {
      return this.$store.getters['book/getBookings']
    },
    selectedSeats () {
      return [...this.$store.getters['book/getSelectedSeat']]
    },
    isSiteManager () {
      return this.$store.getters['book/isSiteManager']
    },
    reservationDays () {
      return this.$store.getters['book/getReservationDays']
    },
    disableBookButton () {
      return this.checkIfSelectedItems()
    },
    userParkingInfo () {
      return this.$store.getters['parking/getUserParkingInfo']
    },
    startDate: {
      get () {
        return this.$store.getters['book/getStartDate']
      },
      set (value) {
        this.$store.dispatch('book/updateStartDate', value)
      }
    },
    endDate: {
      get () {
        return this.$store.getters['book/getEndDate']
      },
      set (value) {
        this.$store.dispatch('book/updateEndDate', value)
      }
    },
    mode: {
      get () {
        return this.$store.getters['book/getMode']
      },
      set (value) {
        this.$store.dispatch('book/updateMode', value)
      }
    },
    site: {
      get () {
        return this.$store.getters['book/getSelectedSite']
      },
      set (value) {
        this.$store.dispatch('book/selectSite', value)
      }
    },
    building: {
      get () {
        return this.$store.getters['book/getSelectedBuilding']
      },
      set (value) {
        this.$store.dispatch('book/selectBuilding', value)
      }
    },
    floor: {
      get () {
        return this.$store.getters['book/getSelectedFloor']
      },
      set (value) {
        this.$store.dispatch('book/selectFloor', value)
      }
    },
    area: {
      get () {
        return this.$store.getters['book/getSelectedArea']
      },
      set (value) {
        this.$store.dispatch('book/selectArea', value)
      }
    },
    seat: {
      get () {
        return this.$store.getters['book/getSelectedSeat']
      },
      set (value) {
        this.$store.dispatch('book/selectSeat', value)
      }
    },
    bookParkingCheck: {
      get () {
        return this.$store.getters['parking/getParkingCheck']
      },
      set (value) {
        this.$store.dispatch('parking/updateParkingCheck', value)
      }
    },
    feedbackType: {
      get () {
        return this.$store.getters['feedback/getType']
      }
    },
    feedbackText: {
      get () {
        return this.$store.getters['feedback/getText']
      }
    },
    feedbackDates: {
      get () {
        return this.$store.getters['feedback/getDates']
      }
    }
  },
  watch: {
    async endDate () {
      await this.getParkingBooks(this.userParkingInfo)
    },
    async mode () {
      await this.getParkingBooks(this.userParkingInfo)
    },
    async floor () {
      if (this.loggedUser) {
        this.userHood = await this.$api.hood.get({ orgCode: this.loggedUser.org_code })
        this.userId = await this.$store.getters['auth/getUsername']
      }
    },
    site (newValue) {
      console.log(newValue)
      if (this.siteCountriesAllowQuickBook.includes(newValue.country)) {
        this.isDisableRandomSeatMode = false
      } else {
        this.isDisableRandomSeatMode = true
      }
    }
  },
  mounted () {
    //  Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return /iphone|ipad|ipod/.test(userAgent)
    }
    // Detects if device is in standalone mode
    // const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone)

    if (isIos()) {
      document.getElementById('main-section').parentElement.style.marginLeft = 0
      document.getElementById('main-section').parentElement.style.marginRight = 0
      const style = document.createElement('style')
      style.innerHTML =
          '.vdp-datepicker__calendar {' +
          'width: 240px !important' +
          '}'
      // Get the first script tag
      const ref = document.querySelector('script')

      // Insert our new styles before the first script tag
      ref.parentNode.insertBefore(style, ref)
    }
  },
  created () {
    this.$store.dispatch('book/loadSites')
  },
  methods: {
    localDisabledDatesFrom () {
      const currentDate = new Date()
      const topDate = this.reservationDays
      return {
        to: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        from: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + topDate)
      }
    },
    localDisabledDatesTo () {
      const currentDate = new Date()
      const topDate = this.reservationDays
      return {
        to: this.startDate || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        from: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + topDate)
      }
    },
    async book () {
      this.toggleModal()
      this.showFloorMap = false
      if (this.seatMode === 'manual') {
        switch (this.mode) {
          // TODO: Add delay or valitation that the modal is closed to show the notification
          case 'self':
            if (this.allowParkingReservation() && this.bookParkingCheck) {
              await this.$store.dispatch('parking/updateParking', this.parkings)
            }
            await this.$store.dispatch('book/book')
            break
          case 'preBooks':
            this.$store.dispatch('book/book')
            break
          default:
            console.error('This mode is not a valid one. Please, check if you are doing something wrong. Received mode: ', this.mode)
        }
      } else {
        this.mode = 'self'
        await this.$store.dispatch('book/quickBook')
      }
    },
    checkIfSelectedItems () {
      if (this.seatMode === 'manual') {
        return this.site && this.building && this.floor && this.startDate && this.endDate && this.seat
      } else {
        return this.site && this.building && this.startDate && this.endDate
      }
    },
    toggleModal () {
      if (this.showModal) {
        this.showModal = false
      } else if (this.checkIfSelectedItems()) {
        this.showModal = true
      } else {
        this.$console.warn(this.$t('alert.incompleteFieldsMessage'))
      }
    },
    toggleAlert () {
      this.showSeatAlert = !this.showSeatAlert
    },
    async toggleFloorMap () {
      this.showFloorMap = !this.showFloorMap
      if (this.isSiteManager) {
        this.maxAllowedPreBooks = await this.$api.booking.getMaxAllowedPreBooks(
          formatDate(this.startDate), formatDate(this.endDate))
      }
    },
    selectArea (areaCode) {
      this.$store.dispatch('book/selectAreaByCode', areaCode)
    },
    allowParkingReservation () {
      const allow = this.userParkingInfo.siteParkingAccess === this.site.id
      return this.mode !== 'preBooks' && (this.mode === 'self' && this.userParkingInfo.userRegisteredForParkingAccess && allow)
    },
    async getParkingBooks (userInfo) {
      if (this.endDate && userInfo.userRegisteredForParkingAccess && userInfo.siteParkingAccess === this.site.id && this.mode === 'self') {
        const loadData = {
          buildingId: this.building.id,
          initialDate: this.startDate,
          finalDate: this.endDate,
          user: userInfo
        }
        this.parkings = await this.$store.dispatch('parking/loadParkingBooks', loadData)
      }
    },
    loadParkingLots (parking) {
      const selectedFloor = parking.floors.filter(f => f.id === parking.floor.id)
      parking.parkingLot = null
      const possibleParkingLots = selectedFloor[0].possibleParkingLots
      parking.parkingLots = sortByStrAndNumFloorOrSeat(possibleParkingLots, false)
    },
    selectSeat (seat) {
      if (this.mode === 'self') {
        if (!Array.isArray(seat)) {
          this.seat = seat
        }
      } else if (this.mode === 'preBooks') {
        this.seat = seat.map((s) => {
          return s.seat
        })
      } else {
        console.error('This mode is not a valid one. Please, check if you are doing something wrong. Received mode: ', this.mode)
      }
    },
    toggleFeedbackModal () {
      this.showFeedbackModal = !this.showFeedbackModal
    },
    sendFeedback () {
      if (this.feedbackType === 'SeatUnavailable') {
        if (this.feedbackDates.from <= this.feedbackDates.to) {
          this.$store.dispatch('feedback/sendFeedback')
        } else {
          this.$console.warn(this.$t('mainpage.feedbackModal.errors.onDates'))
        }
        this.showFeedbackModal = false
      } else {
        if (this.feedbackText) {
          this.$store.dispatch('feedback/sendFeedback')
        } else {
          this.$console.warn(this.$t('mainpage.feedbackModal.errors.emptyComment'))
        }
        this.showFeedbackModal = false
      }
    },
    backToArea () {
      this.$store.dispatch('book/selectArea', null)
    },
    dk (k) {
      const auxKey = 'amenities.' + k
      const value = this.$dk(auxKey)

      return value === auxKey ? k : value
    },
    capitalize,
    availableAmenities
  }
}

</script>
<style lang="scss" scoped>

h1 {
  font-weight: normal !important;
  margin-bottom: 20px;
}

label {
  font-weight: normal !important;
  margin-bottom: 0;
}

.column {
  margin: auto !important;
}

.ui.radio.checkbox label::after {
  background-color: #00793a !important;
}

.ui.radio.checkbox label::before {
  border-color: #00793a !important;
}

.ui .radio {
  &[read-only="true"] {
    pointer-events: none;
    opacity: .7;
  }
}

button.full {
  width: 100%;
}

.ui.golden {
  background-color: #f39501;
  color: #fff;
}

#btn_feedback {
  z-index: 50;
  background-color: #65AC1E;
  position: fixed;
  right: 10px;
  bottom: 50px;
}

.vdp-datepicker__calendar {
  width: 263px !important;
}

#parkingLotBooking {
  height: 11px;
  cursor: pointer;
  font-size: 18px;
}

ul {
  list-style-type: disc;
  padding-left: 15px;
  li {
    &::marker {
      background-color: #198753;
      color: #198f35;
    }
  }
}
</style>
