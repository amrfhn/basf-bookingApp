<template>
  <div>
    <ui-grid>
      <row>
        <column id="buttonsTop" :wide="6">
          <button id="primary" class="ui primary button inline" @click="findModal">
            <i class="icon search" />
            {{ $t("reservationTable.findColleague") }}
          </button>
        </column>
        <column id="buttonsTop" :wide="6" style="text-align: right">
          <button
            id="cancel"
            :disabled="disabled"
            class="ui primary button inline"
            @click="toggleModal"
          >
            <i class="icon fa-calendar-times-o" />
            {{ $t("reservationTable.cancelbtn") }}
          </button>
        </column>
      </row>
      <row>
        <column>
          <div class="reservation">
            <h2>{{ $t("reservationTable.pagetitle") }}</h2>
            <ui-table class="reservations">
              <thead>
                <tr>
                  <th>{{ $t("reservationTable.daytitle") }}</th>
                  <th>{{ $t("reservationTable.booksite") }}</th>
                  <th>{{ $t("app.floortitle") }}</th>
                  <th>{{ $t("app.areatitle") }}</th>
                  <th>{{ $t("app.seattitle") }}</th>
                  <th class="checkbox-header">
                    <span>{{ $t("reservationTable.selectionSeat") }}</span>
                    <input v-model="selectAllBooks" type="checkbox" class="th-checkbox">
                  </th>
                  <th v-if="bookingsHasParking || hasParkingAccess">
                    {{ $t("configuration.parking.parking") }}
                  </th>
                  <th v-if="bookingsHasParking" class="checkbox-header">
                    <span>{{ $t("reservationTable.selectionParking") }}</span>
                    <input v-model="selectAllParkingBooks" type="checkbox" class="th-checkbox">
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(book, i) in books" :key="i">
                  <td>{{ book.calendar.date }}</td>
                  <td>{{ book.seat.area.floor.building.site.name }}</td>
                  <td>
                    {{ !book.onlyParking ? book.seat.area.floor.number : "-" }}
                  </td>
                  <td>{{ !book.onlyParking ? book.seat.area.code : "-" }}</td>
                  <td>{{ !book.onlyParking ? book.seat.code : "-" }}</td>
                  <td>
                    <div v-if="!book.onlyParking && cancelPeriod(book)" class="field checkbox-container">
                      <input v-model="selectedBooks" :value="book" type="checkbox">
                    </div>
                  </td>
                  <td v-if="book.parking">
                    {{ book.parking }}
                  </td>
                  <td v-else-if="bookingsHasParking">
                    {{ "-" }}
                  </td>
                  <td v-if="book.parking && cancelPeriod(book)">
                    <div class="field checkbox-container">
                      <input
                        v-model="selectedParkingBooks"
                        :value="book"
                        type="checkbox"
                      >
                    </div>
                  </td>
                  <td v-if="(bookingsHasParking && !book.parking) || book.onlyParking" />
                </tr>
              </tbody>
            </ui-table>
          </div>
        </column>
      </row>
      <row>
        <column>
          <div class="reservation">
            <h2>{{ $t("reservationTable.teamReservationsTitle") }}</h2>
            <ui-table class="reservations">
              <thead>
                <tr>
                  <th>{{ $t("reservationTable.daytitle") }}</th>
                  <th>{{ $t("reservationTable.booksite") }}</th>
                  <th>{{ $t("app.floortitle") }}</th>
                  <th>{{ $t("app.areatitle") }}</th>
                  <th>{{ $t("app.seattitle") }}</th>
                  <th>{{ $t("reservationTable.teamMemberTitle") }}</th>
                  <th v-if="isManager" class="checkbox-header">
                    {{ $t("reservationTable.selectionSeat") }}
                    <input v-model="selectAllTeamBooks" class="inline th-checkbox" type="checkbox">
                  </th>
                  <th v-if="teamBookingsHasParking">
                    {{ $t("configuration.parking.parking") }}
                  </th>
                  <th v-if="isManager && teamBookingsHasParking" class="checkbox-header">
                    {{ $t("reservationTable.selectionParking") }}
                    <input
                      v-model="selectAllParkingTeamBooks"
                      class="inline th-checkbox"
                      type="checkbox"
                    >
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(teamBook, i) in sortedByDateTeamBooks" :key="i">
                  <td>{{ teamBook.calendar.date }}</td>
                  <td>{{ teamBook.seat.area.floor.building.site.name }}</td>
                  <td>
                    {{ !teamBook.onlyParking ? teamBook.seat.area.floor.number : "-" }}
                  </td>
                  <td>
                    {{ !teamBook.onlyParking ? teamBook.seat.area.code : "-" }}
                  </td>
                  <td>
                    {{ !teamBook.onlyParking ? teamBook.seat.code : "-" }}
                  </td>
                  <td>{{ teamBook.full_name }}</td>
                  <td v-if="isManager && teamBook.onlyParking" />
                  <td v-else-if="!teamBook.onlyParking && isManager && cancelPeriod(teamBook)">
                    <div class="field checkbox-container">
                      <input
                        v-model="selectedTeamBooks"
                        :value="teamBook"
                        type="checkbox"
                      >
                    </div>
                  </td>
                  <td v-if="teamBook.parking">
                    {{ teamBook.parking }}
                  </td>
                  <td v-else-if="teamBookingsHasParking" />
                  <td v-if="teamBook.parking && isManager && cancelPeriod(teamBook)">
                    <div class="field checkbox-container">
                      <input
                        v-model="selectedParkingTeamBooks"
                        :value="teamBook"
                        type="checkbox"
                      >
                    </div>
                  </td>
                  <td
                    v-if="
                      (teamBookingsHasParking && !teamBook.parking) ||
                        teamBook.onlyParking
                    "
                  />
                </tr>
              </tbody>
            </ui-table>
          </div>
        </column>
      </row>

      <row v-if="isManager">
        <column>
          <div class="reservation">
            <h2>{{ $t("reservationTable.preBookingTitle") }}</h2>
            <ui-table class="reservations">
              <thead>
                <tr>
                  <th>{{ $t("reservationTable.daytitle") }}</th>
                  <th>{{ $t("reservationTable.booksite") }}</th>
                  <th>{{ $t("app.floortitle") }}</th>
                  <th>{{ $t("app.areatitle") }}</th>
                  <th>{{ $t("app.seattitle") }}</th>
                  <th class="checkbox-header">
                    {{ $t("reservationTable.selectiontitle") }}
                    <input id="selectAllPreBooks" v-model="selectAllPreBooks" class="inline th-checkbox" type="checkbox">
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(preBook, i) in sortedByDatePreBooks" :key="i">
                  <td>{{ preBook.calendar.date }}</td>
                  <td>{{ preBook.seat.area.floor.building.site.name }}</td>
                  <td>{{ preBook.seat.area.floor.number }}</td>
                  <td>{{ preBook.seat.area.code }}</td>
                  <td>{{ preBook.seat.code }}</td>
                  <td>
                    <div v-if="cancelPeriod(preBook)" class="field checkbox-container">
                      <input
                        v-model="selectedPreBooks"
                        :value="preBook"
                        type="checkbox"
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
              <ui-table />
            </ui-table>
          </div>
        </column>
      </row>
    </ui-grid>
    <modal
      :show="showFindModal"
      :title="$t('reservationTable.findColleague')"
      closeable
      @close="findModal"
      @ok="findModal"
    >
      <FindColleagueModal />
    </modal>
    <modal
      v-if="loggedUser"
      id="modalOfCancellation"
      :show="showModal"
      :title="$t('reservationTable.modal.title')"
      closeable
      @close="toggleModal"
      @ok="cancelBooks"
    >
      <div id="modalOfCancellationBody">
        {{ loggedUser.full_name }} {{ $t("reservationTable.modal.body") }} <br><br>
        <span v-show="selectedBooks && selectedBooks.length > 0">
          <p>
            <strong>{{ $t("reservationTable.pagetitle") }}:</strong>
          </p>
          <ul>
            <li v-for="(b, i) in selectedBooks" :key="i">
              {{ $t("app.floortitle") }}
              <strong>{{ b.seat.area.floor.number }}</strong>, {{ $t("app.areatitle") }} <strong>{{
                b.seat.area.code
              }}</strong>, {{ $t("app.seattitle") }} <strong>{{ b.seat.code }}</strong>, {{ $t("app.datetitle") }}
              <strong>{{ b.calendar.date }}</strong>
            </li>
          </ul>
        </span>

        <span v-show="selectedParkingBooks && selectedParkingBooks.length > 0">
          <p>
            <strong>{{ $t("reservationTable.myParkingLotReservations") }}</strong>
          </p>
          <ul>
            <li v-for="(b, i) in selectedParkingBooks" :key="i">
              {{ $t("configuration.parking.parking") }}
              <strong>{{ b.parking }}</strong>, {{ $t("app.datetitle") }}
              <strong>{{ b.calendar.date }}</strong>
            </li>
          </ul>
        </span>

        <span v-show="selectedTeamBooks && selectedTeamBooks.length > 0">
          <p>
            <strong>{{ $t("reservationTable.teamReservationsTitle") }}:</strong>
          </p>
          <ul>
            <li v-for="(tb, i) in selectedTeamBooks" :key="i">
              <strong>{{ tb.full_name }}</strong>, {{ $t("app.floortitle") }}
              <strong>{{ tb.seat.area.floor.number }}</strong>, {{ $t("app.areatitle") }} <strong>{{
                tb.seat.area.code
              }}</strong>, {{ $t("app.seattitle") }} <strong>{{ tb.seat.code }}</strong>, {{ $t("app.datetitle") }}
              <strong>{{ tb.calendar.date }}</strong>
            </li>
          </ul>
        </span>
        <span
          v-show="
            selectedParkingTeamBooks &&
              selectedParkingTeamBooks.length > 0 &&
              hasParkingAccess
          "
        >
          <p>
            <strong>{{ $t("reservationTable.myTeamParkingLotReservations") }}</strong>
          </p>
          <ul>
            <li v-for="(tb, i) in selectedParkingTeamBooks" :key="i">
              <strong>{{ tb.full_name }}</strong>, {{ $t("configuration.parking.parking") }}<strong>{{
                tb.parking
              }}</strong>, {{ $t("app.datetitle") }}
              <strong>{{ tb.calendar.date }}</strong>
            </li>
          </ul>
        </span>

        <span v-show="selectedPreBooks && selectedPreBooks.length > 0">
          <p>
            <strong>{{ $t("reservationTable.preBookingTitle") }}:</strong>
          </p>
          <ul>
            <li v-for="(pb, i) in selectedPreBooks" :key="i">
              {{ $t("app.floortitle") }}
              <strong>{{ pb.seat.area.floor.number }}</strong>, {{ $t("app.areatitle") }} <strong>{{
                pb.seat.area.code
              }}</strong>, {{ $t("app.seattitle") }} <strong>{{ pb.seat.code }}</strong>, {{ $t("app.datetitle") }}
              <strong>{{ pb.calendar.date }}</strong>
            </li>
          </ul>
        </span>
        <hr>
        <p>{{ $t("reservationTable.modal.closingmessage") }}</p>
      </div>
    </modal>
  </div>
</template>

<script>
import FindColleagueModal from '@/components/modals/FindColleagueModal'

export default {
  name: 'ReservationTable',
  components: { FindColleagueModal },
  data () {
    return {
      books: [],
      preBooks: [],
      teamBooks: [],
      showModal: false,
      showFindModal: false,
      selectedBooks: [],
      selectedPreBooks: [],
      selectedTeamBooks: [],
      parkingBooks: [],
      selectedParkingBooks: [],
      parkingTeamBooks: [],
      selectedParkingTeamBooks: [],
      ready: false,
      selectedParkingBook: []
    }
  },
  computed: {
    loggedUser () {
      return this.$store.getters['auth/getUser']
    },
    disabled () {
      const books = this.selectedBooks && this.selectedBooks.length > 0
      const preBooks = this.selectedPreBooks && this.selectedPreBooks.length > 0
      const teamBooks = this.selectedTeamBooks && this.selectedTeamBooks.length > 0
      const parkingBooks =
          this.selectedParkingBooks && this.selectedParkingBooks.length > 0
      const parkingTeamBooks =
          this.selectedParkingTeamBooks && this.selectedParkingTeamBooks.length > 0
      const enableBtn =
          books || preBooks || teamBooks || parkingBooks || parkingTeamBooks
      return !enableBtn
    },
    hasParkingAccess () {
      return this.$store.getters['auth/getParkingAccesses'].hasAccess
    },
    userParkingInfo () {
      return this.$store.getters['auth/getUserParkingInfo']
    },
    selectAllBooks: {
      get () {
        return this.books ? this.selectedBooks.length === this.books.length : false
      },
      set (value) {
        this.selectedBooks = value
          ? this.books.filter(b => this.cancelPeriod(b) && b.onlyParking !== true)
          : []
      }
    },
    selectAllParkingBooks: {
      get () {
        return this.parkingBooks
          ? this.selectedParkingBooks.length === this.parkingBooks.length
          : false
      },
      set (value) {
        this.selectedParkingBooks = value
          ? this.parkingBooks.filter(b => this.cancelPeriod(b))
          : []
      }
    },
    selectAllPreBooks: {
      get () {
        return this.preBooks
          ? this.selectedPreBooks.length === this.preBooks.length
          : false
      },
      set (value) {
        this.selectedPreBooks = value
          ? this.preBooks.filter(b => this.cancelPeriod(b))
          : []
      }
    },
    selectAllTeamBooks: {
      get () {
        return this.teamBooks
          ? this.selectedTeamBooks.length === this.teamBooks.length
          : false
      },
      set (value) {
        this.selectedTeamBooks = value
          ? this.teamBooks.filter(b => this.cancelPeriod(b) && b.onlyParking !== true)
          : []
      }
    },
    selectAllParkingTeamBooks: {
      get () {
        return this.parkingTeamBooks
          ? this.selectedParkingTeamBooks.length === this.parkingTeamBooks.length
          : false
      },
      set (value) {
        this.selectedParkingTeamBooks = value
          ? this.parkingTeamBooks.filter(b => this.cancelPeriod(b))
          : []
      }
    },
    isManager () {
      const role = this.$store.getters['auth/getRoles']
      return role.isManager
    },
    teamBookingsHasParking () {
      return this.parkingTeamBooks.length
    },
    bookingsHasParking () {
      return this.parkingBooks.length
    },
    sortedByDateMyReservations () {
      return Object.values(this.books).sort((d1, d2) =>
        d1.calendar.date.localeCompare(d2.calendar.date)
      )
    },
    sortedByDateTeamBooks () {
      return Object.values(this.teamBooks).sort((d1, d2) =>
        d1.calendar.date.localeCompare(d2.calendar.date)
      )
    },
    sortedByDatePreBooks () {
      return Object.values(this.preBooks).sort((d1, d2) =>
        d1.calendar.date.localeCompare(d2.calendar.date)
      )
    }
  },
  async mounted () {
    this.loadData()
    await this.$store.dispatch('site/loadSites')
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
    },
    findModal () {
      this.showFindModal = !this.showFindModal
    },
    loadMap () {
      this.ready = false
      const mapDOM = document.getElementById('area-map')
      mapDOM.innerHTML = this.map
      if (!this.map.length) {
        return
      }
      mapDOM.firstElementChild.style.width = '100%'
      this.ready = true
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
    },
    forMyself (book) {
      return (
        book.bookingStatus.status === 'Booked' && book.userId === this.loggedUser.username
      )
    },
    async cancelBooks () {
      if (this.selectedBooks && this.selectedBooks.length > 0) {
        const quickBooks = this.selectedBooks.filter(q => q.type === 'quickbooking')
        const standardBooks = this.selectedBooks.filter(s => s.type !== 'quickbooking')

        if (quickBooks && quickBooks.length > 0) {
          await this.$api.booking
            .deleteMultipleQuickBooks({ quickBookIds: quickBooks.map(q => q.id) })
            .catch(e => e)
        }

        if (standardBooks && standardBooks.length > 0) {
          await this.$api.booking
            .deleteMultipleBooks({ bookIds: standardBooks.map(b => b.id) })
            .catch(e => e)
        }
      }
      if (this.selectedParkingBooks && this.selectedParkingBooks.length > 0) {
        await this.$api.booking
          .deleteMultipleBooks({
            bookIds: this.selectedParkingBooks.map(b => b.parkingBookId)
          })
          .catch(e => e)
      }
      if (this.selectedTeamBooks && this.selectedTeamBooks.length > 0) {
        await this.$api.booking
          .deleteMultipleBooks({ bookIds: this.selectedTeamBooks.map(b => b.id) })
          .catch(e => e)
      }
      if (this.selectedParkingTeamBooks && this.selectedParkingTeamBooks.length > 0) {
        await this.$api.booking
          .deleteMultipleBooks({
            bookIds: this.selectedParkingTeamBooks.map(b => b.parkingBookId)
          })
          .catch(e => e)
      }
      await Promise.all(
        this.selectedPreBooks.map(pb =>
          this.$api.booking.deletePreBooks(pb.id).catch(e => e)
        )
      )
      this.toggleModal()
      await this.loadData()
      this.selectedBooks = []
      this.selectedPreBooks = []
      this.selectedTeamBooks = []
      this.selectedParkingBooks = []
      this.selectedParkingTeamBooks = []
    },
    async loadData () {
      const mergedBooks = await this.$api.booking.mine()
      let quickBooks = await this.$api.booking.getMyQuickbook()
      quickBooks = quickBooks && quickBooks.filter(q => q.quickBookingStatus.status === 'In progress')
      if (this.isManager) {
        this.preBooks = await this.$api.booking.getPreBookings()
      }
      const teamBooks = await this.$api.booking.getTeamBookings()
      this.teamBooks = this.sortBooks(teamBooks)
      const parkingBooks = mergedBooks.filter(b => b.parkingBookId !== undefined)
      this.parkingBooks = this.sortBooks(parkingBooks)
      const parkingTeamBooks = teamBooks.filter(b => b.parkingBookId !== undefined)
      this.parkingTeamBooks = this.sortBooks(parkingTeamBooks)
      const quickBookToMerge = { seat: { area: { floor: { building: { site: { } } } } } }
      for (const q of quickBooks) {
        quickBookToMerge.seat.area.floor.building.name = q.building.name
        quickBookToMerge.seat.area.floor.building.site.name = q.site.name
        quickBookToMerge.seat.area.floor.building.cancellationHours = q.building.cancellationHours
        quickBookToMerge.seat.area.floor.number = '-'
        quickBookToMerge.seat.area.code = '-'
        quickBookToMerge.seat.code = '-'
        quickBookToMerge.calendar = q.calendar
        quickBookToMerge.userId = q.userId
        quickBookToMerge.userOrgCode = q.userOrgCode
        quickBookToMerge.id = q.id
        quickBookToMerge.type = 'quickbooking'
        mergedBooks.push({ ...quickBookToMerge })
      }
      this.books = this.sortBooks(mergedBooks)
    },
    sortBooks (books) {
      return books.sort((d1, d2) => d1.calendar.date.localeCompare(d2.calendar.date))
    }
  }
}
</script>

<style lang="scss" scoped>
tr input {
  cursor: pointer;
}

#cancel {
  background-color: #c70124;
}

#todo {
  text-align: right;
}

.reservations {
  .genericRow {
    cursor: pointer;
  }
}

.reservation {
  padding: 15px;
  border: 2px solid #00793a;
  background-color: #d9ebe2;
}

.hideContent {
  display: none;
}

#modalOfCancellation {
  margin-top: 0px;
  margin-bottom: 5px;
  width: 50%;
}

#modalOfCancellationBody {
  max-height: 50vh;
  overflow-y: auto;
}

.field {
  &.checkbox-container {
    vertical-align: middle;
    input {
      height: auto;
    }
  }
}

th.checkbox-header {
  .th-checkbox {
    height: auto;
    margin-left: 5px;
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
