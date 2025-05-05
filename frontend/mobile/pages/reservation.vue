<template>
  <div class="field">
    <h1> {{ $t('reservation.myReservation') }} </h1>
    <button id="cancel" :disabled="disabledCancelReservation" class="ui primary button inline" @click="toggleModal">
      <i class="icon calendar" />
      {{ $t('reservation.cancel') }}
    </button>
    <br>
    <h3>{{ $t('reservation.today') }}</h3>
    <reservation-table :books="filterBookingByTodayDate" disabled-column-date @change="setBookToCancelToday" />
    <h3>{{ $t('reservation.nextBookings') }}</h3>
    <reservation-table :books="filterBookingByNextDates" disabled-columns @change="setBookToCancelNextDays" />
    <h3 v-if="isManager">
      {{ $t('reservation.preBookings') }}
    </h3>
    <pre-books-table v-if="isManager" :pre-books="preBooks" @change="setPreBookToCancel" />
    <cancellation-modal
      v-if="loggedUser"
      :show="showModal"
      :title="$t('modal.cancelationTitle')"
      closeable
      @close="toggleModal"
      @ok="cancelBook"
    >
      {{ loggedUser.full_name }} {{ $t('modal.selectedBook') }}<br><br>
      <ul>
        <span v-show="booksToCancelToday && booksToCancelToday.length > 0">
          <p>
            <strong>{{ $t('reservation.today') }}</strong>
          </p>
          <template v-for="book in booksToCancelToday">
            <li v-if="!book.showParking" :key="book">
              {{ $t('modal.floor') }} <strong>{{ book.seat?.area.floor.number }}</strong>,
              {{ $t('modal.site') }} <strong>{{ book.seat?.area.floor.building.site.name }}</strong>,
              {{ $t('modal.area') }} <strong>{{ book.seat?.area.code }}</strong>,
              {{ $t('modal.seat') }} <strong>{{ book.seat?.code }}</strong>,
              {{ $t('modal.date') }} <strong>{{ book.calendar.date }}</strong>
            </li>
            <li v-else :key="book">
              {{ $t('modal.seat') }} <strong>{{ book.parking }}</strong>,
              {{ $t('modal.date') }} <strong>{{ book.calendar.date }}</strong>
            </li>
          </template>
        </span><br>

        <span v-show="booksToCancelNextDays && booksToCancelNextDays.length > 0">
          <p>
            <strong>{{ $t('reservation.nextBookings') }}</strong>
          </p>
          <template v-for="book in booksToCancelNextDays">
            <!-- class="cancelation-booking-details" -->
            <ul v-if="!book.showParking" :key="book">
              <li>{{ $t('modal.floor') }} <strong>{{ book.seat?.area.floor.number || '-' }}</strong>,</li>
              <li>{{ $t('modal.site') }} <strong>{{ book.seat?.area.floor.building.site.name || book.site.name }}</strong>,</li>
              <li>{{ $t('modal.area') }} <strong>{{ book.seat?.area.code || '-' }}</strong>,</li>
              <li>{{ $t('modal.seat') }} <strong>{{ book.seat?.code || '-' }}</strong>,</li>
              <li>{{ $t('modal.date') }} <strong>{{ book.calendar.date }}</strong></li>
            </ul>
            <ul v-else :key="book">
              <li>{{ $t('modal.seat') }} <strong>{{ book.parking }}</strong>,</li>
              <li>{{ $t('modal.date') }} <strong>{{ book.calendar.date }}</strong></li>
            </ul>
          </template>
        </span><br>

        <span v-show="teamBooksToCancel && teamBooksToCancel.length > 0">
          <p>
            <strong>{{ $t('reservation.teamBookings') }}</strong>
          </p>
          <template>
            <ul v-for="(teamBook, i) in teamBooksToCancel" :key="i">
              <li><strong>{{ teamBook.full_name }}</strong>,</li>
              <li>{{ $t('modal.floor') }} <strong>{{ teamBook.seat?.area.floor.number }}</strong>,</li>
              <li>{{ $t('modal.site') }} <strong>{{ teamBook.seat?.area.floor.building.site.name }}</strong>,</li>
              <li>{{ $t('modal.area') }} <strong>{{ teamBook.seat?.area.code }}</strong>,</li>
              <li>{{ $t('modal.seat') }} <strong>{{ teamBook.seat?.code }}</strong>,</li>
              <li>{{ $t('modal.date') }} <strong>{{ teamBook.calendar.date }}</strong></li>
            </ul>
          </template>
        </span><br>

        <span v-show="preBooksToCancel && preBooksToCancel.length > 0">
          <p>
            <strong>{{ $t('reservation.preBookings') }}</strong>
          </p>
          <template>
            <ul v-for="(preBook, i) in preBooksToCancel" :key="i">
              <li>{{ $t('modal.floor') }} <strong>{{ preBook.seat?.area.floor.number }}</strong>,</li>
              <li>{{ $t('modal.site') }} <strong>{{ preBook.seat?.area.floor.building.site.name }}</strong>,</li>
              <li>{{ $t('modal.area') }} <strong>{{ preBook.seat?.area.code }}</strong>,</li>
              <li>{{ $t('modal.seat') }} <strong>{{ preBook.seat?.code }}</strong>,</li>
              <li>{{ $t('modal.date') }} <strong>{{ preBook.calendar.date }}</strong></li>
            </ul>
          </template>
        </span>
      </ul>
      <hr>
      <p>{{ $t('modal.thankMsg') }}</p>
    </cancellation-modal>
  </div>
</template>

<script>
import moment from 'moment'
import PreBooksTable from '../components/reservation/PreBooksTable'
import CancellationModal from '../components/modal/TemplateModal'
import ReservationTable from '../components/reservation/ReservationTable'

const dateFormat = 'YYYY-MM-DD'
const formatDate = date => moment(date).format(dateFormat)

export default {
  name: 'Reservation',
  components: { PreBooksTable, CancellationModal, ReservationTable },
  data () {
    return {
      booksToCancelToday: [],
      booksToCancelNextDays: [],
      teamBooksToCancel: [],
      preBooksToCancel: [],
      showModal: false
    }
  },
  computed: {
    loggedUser () {
      return this.$store.getters['auth/getUser']
    },
    books () {
      return this.$store.getters['booking/getBookings']
    },
    quickBooks () {
      return this.$store.getters['booking/getQuickBookings']
    },
    teamBooks () {
      return this.$store.getters['booking/getTeamBookings']
    },
    preBooks () {
      return this.$store.getters['booking/getPreBookings']
    },
    disabledCancelReservation () {
      return !(this.booksToCancelToday.length + this.booksToCancelNextDays.length + this.teamBooksToCancel.length + this.preBooksToCancel.length)
    },
    filterBookingByTodayDate () {
      const currentDate = formatDate(new Date())
      const todayMineReservation = this.books.filter((book) => {
        return book.calendar.date === currentDate
      })
      // const todayTeamReservations = this.teamBooks.filter((book) => { return book.calendar.date === currentDate })
      return todayMineReservation// .concat(todayTeamReservations)
    },
    filterBookingByNextDates () {
      const currentDate = formatDate(new Date())
      const nextBooks = this.books.filter(book => book.calendar.date > currentDate)
      const nextQuickBooks = this.quickBooks.filter(quickbooks => quickbooks.calendar.date > currentDate)
      const allNextBooks = nextBooks.concat(nextQuickBooks)
      return allNextBooks
    },
    filterTeamBookingByNextDates () {
      const currentDate = formatDate(new Date())
      return this.teamBooks.filter(book => book.calendar.date > currentDate)
    },
    isManager () {
      const role = this.$store.getters['auth/getRoles']
      return role.isManager
    }
  },
  created () {
    this.$store.dispatch('booking/loadBookings')
    this.$store.dispatch('booking/loadTeamBookings')
    this.$store.dispatch('booking/loadPreBookings')
    this.$store.dispatch('booking/loadQuickBookings')
  },
  methods: {
    setBookToCancelToday (bookToCancel) {
      this.booksToCancelToday = Object.values(bookToCancel)
    },
    setBookToCancelNextDays (bookToCancel) {
      this.booksToCancelNextDays = Object.values(bookToCancel)
    },
    setTeamBookToCancel (teamBookToCancel) {
      this.teamBooksToCancel = Object.values(teamBookToCancel)
    },
    setPreBookToCancel (preBookToCancel) {
      this.preBooksToCancel = Object.values(preBookToCancel)
    },
    toggleModal () {
      this.showModal = !this.showModal
    },
    cancelBook () {
      if (this.teamBooksToCancel && this.teamBooksToCancel.length > 0) {
        this.$store.dispatch('booking/deleteTeamBookings', this.teamBooksToCancel)
      }
      if (this.preBooksToCancel && this.preBooksToCancel.length > 0) {
        this.$store.dispatch('booking/deletePreBookings', this.preBooksToCancel)
      }
      const bookToCancel = [...this.booksToCancelToday, ...this.booksToCancelNextDays]
      const bookToCancelStandardBookings = bookToCancel.filter(s => s.type !== 'quick booking')
      const bookToCancelQuickBookings = bookToCancel.filter(s => s.type === 'quick booking')

      if (bookToCancelStandardBookings) {
        this.$store.dispatch('booking/deleteBooking', bookToCancelStandardBookings)
      }
      if (bookToCancelQuickBookings) {
        this.$store.dispatch('booking/deleteQuickBooking', bookToCancelQuickBookings)
      }

      this.showModal = false
      this.booksToCancelToday = []
      this.booksToCancelNextDays = []
      this.teamBooksToCancel = []
      this.preBooksToCancel = []
      this.$store.dispatch('booking/loadBookings')
      this.$store.dispatch('booking/loadTeamBookings')
      this.$store.dispatch('booking/loadPreBookings')
    }
  }
}
</script>

<style lang="scss" scoped>
#cancel {
  background-color: #c70124;
  float: right;
  margin-top: 10px;
}
ul {
  list-style-type: disc;
  padding-left: 15px;
  margin-bottom: 15px;
  li {
    &::marker {
      background-color: #198753;
      color: #198f35;
    }
  }
}
</style>
