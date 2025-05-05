<template>
  <div class="site-reservations">
    <div style="border: 2px solid #00793A;">
      <row>
        <div class="filters">
          <div class="field site">
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown
              v-model="selectedSite"
              :label-selector="e => e.name"
              :non-selected="$t('searchbox.sitetitle')"
              :options="adminSites"
            />
          </div>
          <div v-if="showBuildingField" class="field building">
            <label>{{ $t('searchbox.buildinglabel') }}</label>
            <dropdown
              v-model="selectedBuilding"
              :label-selector="e => e.name"
              :non-selected="$t('searchbox.buildingtitle')"
              :options="buildings"
            />
          </div>

          <div class="field dates">
            <div class="mb-2">
              <label>{{ $t('searchbox.from') }}</label>
              <datepicker v-model="startDate" :language="$i18n.locale" savable />
            </div>
            <div>
              <label>{{ $t('searchbox.to') }}</label>
              <datepicker v-model="endDate" :language="$i18n.locale" savable />
            </div>
          </div>

          <div class="field radios">
            <radio class="block" v-model="mode" :label="$t('reservationTable.byfloor')" name="mode" r-value="floor" />
            <radio class="block" v-model="mode" :label="$t('reservationTable.byuser')" name="mode" r-value="user" />
          </div>

          <div class="field types">
            <div v-show="mode === 'user'" class="user-container">
              <label>{{ $t('configuration.superadmin.fullName') }}</label>
              <ldap-users v-if="!userChosen" :key="ldapKey" v-model="user" :caller="getLdap" @input="addUser" />
              <div class="flex gap-2" v-if="userChosen">
                <div class="noBorderTop">
                  {{ user.full_name }}
                </div>
                <div class="noBorderTop">
                  <btn-negative @click="removeUser()">
                    <i class="icon fa-trash" />
                  </btn-negative>
                </div>
              </div>
            </div>
            <div v-show="mode === 'floor' && selectedBuilding" class="floor-container">
              <label>{{ $t('searchbox.floorlabel') }}</label>
              <dropdown
                v-model="selectedFloor"
                :label-selector="e => e.number"
                :non-selected="$t('searchbox.floortitle')"
                :options="floors"
              />
            </div>
            <div v-show="mode === 'floor' && selectedFloor" class="floor-container">
              <label>{{ $t('app.seattitle') }}</label>
              <dropdown
                v-model="selectedSeat"
                :label-selector="e => e.code"
                :nullable="true"
                :options="seats"
                non-selected="-"
              />
            </div>
          </div>

          <div v-if="showSearch" class="search-container">
            <btn-positive @click="search()">
              <i class="icon fa-search" />
              {{ $t('searchbox.search') }}
            </btn-positive>
          </div>
        </div>
      </row>
    </div>
    <br>
    <btn-negative v-if="books.length" :disabled="disabled" style="float: right" @click="toggleModal">
      <i class="icon fa-calendar-times-o" />
      {{ $t('reservationTable.cancelbtn') }}
    </btn-negative>
    <br><br><br>
    <div
      v-if="books.length"
      class="reservation"
    >
      <h2> {{ $t('reservationTable.site') }} </h2>
      <ui-table class="reservations">
        <thead>
          <tr>
            <th>{{ $t('reservationTable.daytitle') }}</th>
            <th> {{ $t('configuration.superadmin.fullName') }}</th>
            <th>{{ $t('reservationTable.booksite') }}</th>
            <th>{{ $t('app.floortitle') }}</th>
            <th>{{ $t('app.areatitle') }}</th>
            <th>{{ $t('app.seattitle') }}</th>
            <th>
              {{ $t('configuration.parking.parking') }}
            </th>
            <th>
              {{ $t('reservationTable.selectionParking') }}
              <input v-model="selectAllParkingBooks" type="checkbox">
            </th>
            <th>
              {{ $t('reservationTable.selectionSeat') }}
              <input v-model="selectAllBooks" type="checkbox">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, i) in books" :key="i">
            <td> {{ book.calendar.date }}</td>
            <td> {{ book.user ? book.user.full_name : book.userId }}</td>
            <td> {{ book.seat.area.floor.building.site.name }}</td>
            <td> {{ !book.onlyParking ? book.seat.area.floor.number : '-' }}</td>
            <td> {{ !book.onlyParking ? book.seat.area.code : '-' }}</td>
            <td> {{ !book.onlyParking ? book.seat.code : '-' }}</td>
            <td v-if="book.parking">
              {{ book.parking }}
            </td>
            <td v-else-if="!book.parking" />
            <td v-if="book.parking && cancelPeriod(book)">
              <div class="field">
                <input v-model="selectedParkingBooks" :value="book" type="checkbox">
              </div>
            </td>
            <td v-if="!book.parking || book.onlyParking" />
            <td>
              <div v-if="!book.onlyParking && cancelPeriod(book)" class="field">
                <input v-model="selectedBooks" :value="book" type="checkbox">
              </div>
            </td>
          </tr>
        </tbody>
      </ui-table>
    </div>
    <modal
      v-if="true"
      id="modalOfCancellation"
      :show="showModal"
      :title="$t('reservationTable.modal.title')"
      closeable
      @close="toggleModal"
      @ok="cancelBooks"
    >
      <div id="modalOfCancellationBody">
        <span v-show="selectedBooks && selectedBooks.length > 0">
          <p>
            <strong>{{ $t('reservationTable.pagetitle') }}:</strong>
          </p>
          <ul>
            <li v-for="(b, i) in selectedBooks" :key="i">
              {{ $t('app.floortitle') }} <strong>{{ b.seat.area.floor.number }}</strong>,
              {{ $t('app.areatitle') }} <strong>{{ b.seat.area.code }}</strong>,
              {{ $t('app.seattitle') }} <strong>{{ b.seat.code }}</strong>,
              {{ $t('app.datetitle') }} <strong>{{ b.calendar.date }}</strong>
            </li>
          </ul>
        </span>

        <span v-show="selectedParkingBooks && selectedParkingBooks.length > 0">
          <p>
            <strong>{{ $t('reservationTable.myParkingLotReservations') }}</strong>
          </p>
          <ul>
            <li v-for="(b, i) in selectedParkingBooks" :key="i">
              {{ $t('configuration.parking.parking') }} <strong>{{ b.parking }}</strong>,
              {{ $t('app.datetitle') }} <strong>{{ b.calendar.date }}</strong>
            </li>
          </ul>
        </span>
      </div>
    </modal>
  </div>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { formatDate } from 'basf-gtu-utils/utils/DateUtils'
import { LDAPSearch } from '../common/Filters'

const dateFormat = 'YYYY-MM-DD'

export default {
  name: 'AdminReservation',
  data () {
    return {
      user: null,
      userChosen: false,
      ldapKey: 0,
      mode: null,
      startDate: null,
      endDate: null,

      showModal: false,
      books: [],
      selectedBooks: [],
      parkingBooks: [],
      selectedParkingBooks: [],

      adminSites: [],
      floors: [],
      selectedFloor: null,
      areas: [],
      selectedArea: null,
      seats: [],
      selectedSeat: null,
      selectedSeats: null
    }
  },
  computed: {
    token () {
      return this.$store.getters['auth/token']
    },
    sites () {
      return this.$store.getters['site/getSites']
    },
    selectedSite: {
      get () {
        return this.$store.getters['site/getSelectedSiteConfiguration']
      },
      set (value) {
        this.$store.dispatch('site/selectSiteConfiguration', value)
      }
    },
    buildings () {
      return this.$store.getters['building/getBuildings']
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingConfiguration']
      },
      set (value) {
        this.$store.dispatch('building/selectBuildingConfiguration', value)
      }
    },
    selectAllBooks: {
      get () {
        return this.books ? this.selectedBooks.length === this.books.length : false
      },
      set (value) {
        this.selectedBooks = value ? this.books.filter(b => b.onlyParking !== true && this.cancelPeriod(b)) : []
      }
    },
    selectAllParkingBooks: {
      get () {
        return this.parkingBooks ? this.selectedParkingBooks.length === this.parkingBooks.length : false
      },
      set (value) {
        this.selectedParkingBooks = value ? this.parkingBooks.filter(b => this.cancelPeriod(b)) : []
      }
    },
    showSearch () {
      return this.startDate && this.endDate && this.selectedBuilding && (this.mode === 'floor' ? this.selectedFloor : false || this.mode === 'user' ? this.userChosen : false)
    },
    disabled () {
      const books = this.selectedBooks && this.selectedBooks.length > 0
      const parkingBooks = this.selectedParkingBooks && this.selectedParkingBooks.length > 0
      const enableBtn = books || parkingBooks
      return !enableBtn
    },
    showBuildingField () {
      return this.buildings.length > 1
    }
  },
  watch: {
    sites (sites) {
      this.loadAdminSites(JSON.parse(JSON.stringify(sites)))
    },
    async selectedSite (site) {
      this.cleanSearchBox()
      if (site !== null) {
        await this.$store.dispatch('building/loadBuildings', site)
      }
    },
    buildings (buildings) {
      if (buildings.length) {
        if (buildings.length === 1) {
          this.selectedBuilding = buildings[0]
        } else {
          this.selectedBuilding = null
        }
      }
    },
    async selectedBuilding (building) {
      if (building !== null) {
        this.floors = []
        this.selectedFloor = null
        this.areas = []
        this.selectedArea = null
        this.selectedSeats = []
        if (this.mode === 'floor') {
          this.selectedFloor = null
          this.floors = await this.$api.floor.get({ buildingId: building.id, allTypes: true })
        }
      }
    },
    floors (floors) {
      if (floors.length) {
        if (floors.length === 1) {
          this.selectedFloor = floors[0]
        } else {
          this.selectedFloor = null
        }
      }
    },
    async selectedFloor (floor) {
      if (floor !== null) {
        this.areas = []
        this.selectedArea = null
        this.selectedSeats = null
        if (floor) {
          this.areas = await this.$api.floor.areas(floor.id)
        }
      }
    },
    areas (areas) {
      if (areas.length) {
        if (areas.length === 1) {
          this.selectedArea = areas[0]
        } else {
          this.selectedArea = null
        }
      }
    },
    async selectedArea (area) {
      if (area !== null) {
        this.selectedSeats = null
        if (area) {
          this.seats = await this.$api.area.seats(area.id, { disabled: true })
        }
      }
    },
    startDate (newDate) {
      if (newDate > this.endDate) {
        this.endDate = newDate
      }
    },
    endDate (newDate) {
      if (newDate < this.startDate) {
        this.startDate = newDate
      }
    },
    async mode (newMode) {
      if (newMode === 'floor' && this.selectedBuilding !== null) {
        this.selectedFloor = null
        this.floors = await this.$api.floor.get({ buildingId: this.selectedBuilding.id, allTypes: true })
      }
    }
  },
  async mounted () {
    LDAP.authenticate({ federation_token: this.token })
    if (this.sites.length === 0) {
      await this.$store.dispatch('site/loadSites')
    } else {
      this.loadAdminSites(this.sites)
    }
    if (this.selectedSite !== null) {
      await this.$store.dispatch('building/loadBuildings', this.selectedSite)
    }
  },
  methods: {
    async loadAdminSites (sites) {
      const adminSitesIds = await this.$store.getters['auth/getAdminSites'].map(s => s.id)
      let adminSites = []
      if (this.sites.length > 0) {
        adminSites = sites.filter(s => adminSitesIds.includes(s.id))
      }
      this.adminSites = adminSites
      this.$store.dispatch('site/setConfigurationSites', adminSites)
    },
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    toggleModal () {
      this.showModal = !this.showModal
    },
    addUser (newUser) {
      this.user = newUser
      this.ldapKey += 2
      this.userChosen = true
    },
    removeUser () {
      this.user = null
      this.userChosen = false
    },
    async search () {
      const data = {
        buildingId: this.selectedBuilding.id,
        initialDate: formatDate(this.startDate, dateFormat),
        finalDate: formatDate(this.endDate, dateFormat)
      }
      if (this.mode === 'user') {
        data.userId = this.user.username
      } else if (this.mode === 'floor') {
        data.floorId = this.selectedFloor.id
        if (this.selectedSeat) {
          data.seatId = this.selectedSeat.id
        }
      }
      let books = await this.$api.booking.get(data)
      if (!books.length) {
        this.$console.warn(` ${this.$t('reports.noData')}`)
      }
      books = this.mergeBookings(books)
      this.parkingBooks = books.filter(b => b.parkingBookId !== undefined)
      this.books = books.sort((d1, d2) => (d1.calendar.date).localeCompare(d2.calendar.date))
    },
    async cancelBooks () {
      if (this.selectedBooks && this.selectedBooks.length > 0) {
        await this.$api.booking.deleteByAdmin({ bookIds: this.selectedBooks.map(b => b.id) }).catch(e => e)
      }
      if (this.selectedParkingBooks && this.selectedParkingBooks.length > 0) {
        await this.$api.booking.deleteByAdmin({ bookIds: this.selectedParkingBooks.map(b => b.parkingBookId) }).catch(e => e)
      }
      this.toggleModal()
      this.selectedBooks = []
      this.books = []
      this.selectedParkingBooks = []
      await this.search()
    },
    cleanSearchBox () {
      this.startDate = null
      this.endDate = null
      this.$store.dispatch('seat/setSelectedSeatsConfig', [])
      this.showBookButton = false
      this.$store.dispatch('building/loadBuildings')
      this.selectedBuilding = null
      this.floors = []
      this.selectedFloor = null
      this.areas = []
      this.selectedArea = null
    },
    mergeBookings (bookings) {
      const books = bookings.filter(b => b.typeId !== 2)
      const parkings = bookings.filter(b => b.typeId === 2)
      const mergedBookings = books.reduce((acc, book) => {
        const mergedBooking = this.mergeBooking(book, parkings)
        acc.push(mergedBooking)
        return acc
      }, [])
      const parkingOnlyBookings = parkings.map(({ seat, id, calendar, user }) => ({
        parking: `${seat.area.floor.number} : ${seat.code}`,
        parkingBookId: id,
        onlyParking: true,
        calendar,
        seat,
        user
      }))
      return [...mergedBookings, ...parkingOnlyBookings]
    },
    mergeBooking (booking, parkings) {
      // get the parking for a given booking
      const parking = parkings.find(p => p.calendar.date === booking.calendar.date && p.userId === booking.userId)
      if (parking) {
        for (let i = 0; i < parkings.length; i++) {
          if (parkings[i] === parking) {
            parkings.splice(i, 1)
            break
          }
        }
        return {
          // effectively merging
          ...booking,
          parking: `${parking.seat.area.floor.number} : ${parking.seat.code}`,
          parkingBookId: parking.id,
          userId: parking.userId,
          date: parking.calendar.date
        }
      }
      return booking
    },
    cancelPeriod (book) {
      const bookedDate = book.calendar.date.split('-')
      const compareDate = new Date(
        bookedDate[0],
        bookedDate[1] - 1,
        bookedDate[2]
      ).setHours(9 - book.seat.area.floor.building.cancellationHours, 0, 0, 0)
      const currentDate = new Date()
      return currentDate <= compareDate
    }
  }
}
</script>

<style lang="scss" scoped>
.site-reservations {
  .filters {
    display: flex;
    gap: 8px;
    padding: 14px;
    justify-content: flex-start;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 14px;

      .search-container {
        button {
          width: 100%;
        }
      }
    }

    @media (min-width: 768px) {
      .field.site {
        max-width: 250px;
      }

      .field.building {
        max-width: 200px;
      }

      .field.dates {
        max-width: 200px;
      }

      .field.radios {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        gap: 0;
        justify-content: flex-start;
        padding-left: 6px !important;
        padding-right: 6px !important;

        .radio {
          margin-bottom: 0 !important;
        }
      }

      .field.types {
        display: flex;
        flex-direction: column;
        gap: 8px;
        button {
          &.negative {
            padding: 6px;
            i {
              margin: 0 2px 0 0;
            }
          }
        }
        .floor-container {
          max-width: 100px;
        }
      }

      .search-container {
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 1;
        margin-left: 24px;
        max-width: 200px;
      }
    }
  }
}

.reservations {
  .genericRow {
    cursor: pointer;
  }
}

.mb-2 {
  margin-bottom: 8px;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 8px;
}

.noBorderTop {
  border-top: none;
  padding-right: 0;
  padding-left: 0;
}

.buttonFix {
  visibility: hidden;
}

.reservation {
  width: 100%;
  padding: 15px;
  border: 2px solid #00793A;
  background-color: #D9EBE2;
}
</style>
