<template>
  <box3>
    <ui-table class="reservations">
      <thead>
        <tr>
          <th v-if="!disabledColumnDate">
            {{ $t('reservation.table.day') }}
          </th>
          <th>{{ $t('reservation.table.booksite') }}</th>
          <th>{{ $t('reservation.table.floor') }}</th>
          <th>{{ $t('reservation.table.area') }}</th>
          <th>{{ $t('reservation.table.seat') }}</th>
          <th v-if="hasParkings">
            {{ $t("reservation.table.parking") }}
          </th>
          <th v-if="hasParkings">
            {{ $t("reservation.table.parkingSelection") }}
          </th>
          <th>{{ $t('reservation.table.selection') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="books.length === 0">
          <td colspan="6">
            {{ $t('reservation.table.noBookings') }}
          </td>
        </tr>
        <tr v-for="(book, key) in books" :key="key">
          <td v-if="!disabledColumnDate">
            {{ book.calendar.date }}
          </td>
          <td>{{ book.seat ? book.seat.area.floor.building.site.name : book.site.name ? book.site.name : '-' }}</td>
          <td>{{ !book.onlyParking && book.seat ? book.seat.area.floor.number : "-" }}</td>
          <td>{{ !book.onlyParking && book.seat ? book.seat.area.code : "-" }}</td>
          <td>{{ !book.onlyParking && book.seat ? book.seat.code : "-" }}</td>
          <td v-if="book.parking">
            {{ book.parking }}
          </td>
          <td v-else-if="hasParkings" />
          <td v-if="book.parking && cancelPeriod(book)">
            <div class="field">
              <input
                :checked="selectedBooks[book.parkingBookId]"
                class="cancelCheckbox"
                type="checkbox"
                @change="toggleSelection(book,true)"
              >
            </div>
          </td>
          <td v-if="(hasParkings && !book.parking) || book.onlyParking" />
          <td>
            <div v-if="cancelPeriod(book) && forMyself(book)" class="field">
              <input
                :checked="selectedBooks[book.id]"
                class="cancelCheckbox"
                type="checkbox"
                @change="toggleSelection(book)"
              >
            </div>
          </td>
        </tr>
      </tbody>
    </ui-table>
  </box3>
</template>

<script>
export default {
  name: 'ReservationTable',
  props: {
    disabledColumnDate: { type: Boolean, default: () => false },
    disabledColumns: { type: Boolean, default: () => false },
    books: { type: Array, default: () => [] }
  },
  data () {
    return {
      selectedBooks: {}
    }
  },
  computed: {
    loggedUser () {
      return this.$store.getters['auth/getUsername']
    },
    hasParkings () {
      return this.books.filter(b => b.parking).length
    }
  },
  methods: {
    toggleSelection (bookings, parking) {
      const book = JSON.parse(JSON.stringify(bookings))
      if (parking) {
        book.showParking = true
        book.id = book.parkingBookId
      }
      if (this.selectedBooks[book.id]) {
        delete this.selectedBooks[book.id]
      } else {
        this.selectedBooks[book.id] = book
      }
      this.$emit('change', this.selectedBooks)
    },
    forMyself (book) {
      if (book.seat && book.seat.typeId === 1) {
        return book.bookingStatus.status === 'Booked' && book.userId === this.loggedUser
      } else if (book.quickBookingStatus.id === 0) {
        return true
      } else {
        return false
      }
    },
    cancelPeriod (book) {
      const cancellationHours = book.seat?.area.floor.building.cancellationHours || book.building.cancellationHours
      const bookedDate = book.calendar.date.split('-')
      const compareDate = (new Date(bookedDate[0], bookedDate[1] - 1, bookedDate[2]))
        .setHours(9 - cancellationHours, 0, 0, 0)
      const currentDate = new Date()
      return currentDate <= compareDate
    }
  }
}
</script>

<style lang="scss" scoped>
.cancelCheckbox {
  cursor: pointer;
  margin-top: 0;
}
.table {
  tr {
    td {
      vertical-align: middle;
    }
  }
}
</style>
