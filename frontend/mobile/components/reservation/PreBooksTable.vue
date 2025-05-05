<template>
  <box3>
    <column>
      <div class="reservation">
        <ui-table class="reservations">
          <thead>
            <tr>
              <th>{{ $t('reservation.table.day') }}</th>
              <th>{{ $t('reservation.table.booksite') }}</th>
              <th>{{ $t('reservation.table.floor') }}</th>
              <th>{{ $t('reservation.table.area') }}</th>
              <th>{{ $t('reservation.table.seat') }}</th>
              <th> {{ $t('reservation.table.selection') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(preBook, i) in sortedByDatePreBooks" :key="i">
              <td> {{ preBook.calendar.date }}</td>
              <td> {{ preBook.seat.area.floor.building.site.name }} </td>
              <td> {{ preBook.seat.area.floor.number }} </td>
              <td> {{ preBook.seat.area.code }} </td>
              <td> {{ preBook.seat.code }} </td>
              <td>
                <div v-if="cancelPeriod(preBook)" class="field">
                  <input class="cancelCheckbox" type="checkbox" :checked="selectedPreBooks[preBook.id]" @change="toggleSelection(preBook)">
                </div>
              </td>
            </tr>
          </tbody>
          <ui-table />
        </ui-table>
      </div>
    </column>
  </box3>
</template>

<script>
export default {
  name: 'PreBooksTable',
  props: {
    preBooks: { type: Array, default: () => [] }
  },
  data () {
    return {
      selectedPreBooks: {}
    }
  },
  computed: {
    sortedByDatePreBooks () {
      return Object.values(this.preBooks).sort((d1, d2) => (d1.calendar.date).localeCompare(d2.calendar.date))
    }
  },
  methods: {
    toggleSelection (book) {
      if (this.selectedPreBooks[book.id]) {
        delete this.selectedPreBooks[book.id]
      } else {
        this.selectedPreBooks[book.id] = book
      }
      this.$emit('change', this.selectedPreBooks)
    },
    cancelPeriod (book) {
      const bookedDate = book.calendar.date.split('-')
      const compareDate = (new Date(bookedDate[0], bookedDate[1] - 1, bookedDate[2]))
        .setHours(9 - book.seat.area.floor.building.cancellationHours, 0, 0, 0)
      const currentDate = new Date()
      return currentDate <= compareDate
    }
  }
}
</script>

<style scoped>

</style>
