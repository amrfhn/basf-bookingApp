<template>
  <box3>
    <div class="reservation">
      <ui-table class="reservations">
        <thead>
          <tr>
            <th>{{ $t('reservation.table.day') }}</th>
            <th>{{ $t('reservation.table.booksite') }}</th>
            <th>{{ $t('reservation.table.floor') }}</th>
            <th>{{ $t('reservation.table.area') }}</th>
            <th>{{ $t('reservation.table.seat') }}</th>
            <th>{{ $t('reservation.table.teamMember') }}</th>
            <th v-if="isManager">
              {{ $t('reservation.table.selection') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(teamBook, i) in sortedByDateTeamBooks" :key="i">
            <td> {{ teamBook.calendar.date }}</td>
            <td> {{ teamBook.seat.area.floor.building.site.name }} </td>
            <td> {{ teamBook.seat.area.floor.number }} </td>
            <td> {{ teamBook.seat.area.code }} </td>
            <td> {{ teamBook.seat.code }} </td>
            <td> {{ teamBook.full_name }} </td>
            <td v-if="isManager">
              <div v-if="cancelPeriod(teamBook)" class="field">
                <input class="cancelCheckbox" type="checkbox" :checked="selectedTeamBooks[teamBook.id]" @change="toggleSelection(teamBook)">
              </div>
            </td>
          </tr>
        </tbody>
      </ui-table>
    </div>
  </box3>
</template>

<script>
export default {
  name: 'TeamBookingsTable',
  props: {
    teamBooks: { type: Array, default: () => [] }
  },
  data () {
    return {
      selectedTeamBooks: {}
    }
  },
  computed: {
    sortedByDateTeamBooks () {
      return Object.values(this.teamBooks).sort((d1, d2) => (d1.calendar.date).localeCompare(d2.calendar.date))
    },
    isManager () {
      const role = this.$store.getters['auth/getRoles']
      return role.isManager
    }
  },
  methods: {
    toggleSelection (book) {
      if (this.selectedTeamBooks[book.id]) {
        delete this.selectedTeamBooks[book.id]
      } else {
        this.selectedTeamBooks[book.id] = book
      }
      this.$emit('change', this.selectedTeamBooks)
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
