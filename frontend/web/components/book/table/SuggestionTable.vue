<template>
  <div>
    <div id="viewButton">
      <row style="text-align: right;">
        <div id="viewFloors">
          <button class="ui primary button full" @click="seatsByDepartment">
            <i class="icon search" />{{ $t('suggestionTable.seatsByDepartment') }}
          </button>
        </div>
      </row>
    </div>
    <div id="suggestionTable">
      <h2> {{ $t('suggestionTable.title') }}</h2><br>
      <ui-table>
        <thead>
          <tr>
            <th>{{ $t('suggestionTable.date') }}</th>
            <th v-for="(quantity, date) in suggestionTableDates" :key="date" class="available">
              <div>
                {{ date | toWeekDay($i18n.locale) }}
              </div>
              <div>
                {{ date | filterDate }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(floor, id) in suggestionTable" :key="id">
            <td v-if="!showTortuguitas" class="floors">
              {{ $t('suggestionTable.floor') }} {{ floor.floorNumber }}
            </td>
            <td v-if="showTortuguitas" class="floors">
              Site móvil
            </td>
            <td v-for="(quantity, date) in floor.dates" :key="date" class="available">
              {{ quantity }}
            </td>
          </tr>
        </tbody>
      </ui-table>
    </div>
  </div>
</template>

<script>
import { dateToDay } from 'basf-gtu-utils/utils/DateUtils'

export default {
  name: 'SuggestionTable',
  filters: {
    filterDate: (date) => {
      const dateArray = date.split('-')
      return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
    },
    toWeekDay: (date, locale) => {
      const dateArray = date.split('-')
      return dateToDay(new Date(dateArray[0], dateArray[1] - 1, dateArray[2]), locale)
    }
  },
  computed: {
    dataSuggestion () { return this.$store.getters['building/getQuantityPerFloor'] },
    building () { return this.$store.getters['building/getSelectedBuildingBooking'] },
    showTortuguitas () { return this.building != null && this.building.name === 'Tortuguitas (site móvil)' },
    suggestionTableDates () {
      const reducer = (a, c) => { a[c] = 0; return a }
      return this.dataSuggestion.map(s => s.date).sort().reduce(reducer, {})
    },
    suggestionTable () {
      const dates = this.suggestionTableDates
      const reducer = (a, c) => {
        if (!a[c.floorId]) {
          a[c.floorId] = { floorNumber: c.floorNumber, dates: { ...dates } }
        }
        a[c.floorId].dates[c.date] = c.quantity
        return a
      }
      return Object.values(this.dataSuggestion.reduce(reducer, {})).sort((s1, s2) => s2.floorNumber - s1.floorNumber)
    }
  },
  methods: {
    filterSuggestionsPerFloor (listSuggestion) {
      return Object.values(listSuggestion.reduce((prev, next) => Object.assign(prev, { [next.floorNumber]: next }), {}))
    },
    seatsByDepartment () {
      this.$emit('showDepartmentTable')
    }
  }
}
</script>

<style scoped>
#suggestionTable {
  margin:  20px 0;
  padding: 20px;
  border: 2px solid #00793A;
  background-color: #D9EBE2;
}
.floors {
  font-weight: bolder;
}
#viewFloors{
  top:0;
  right:0;
}
.available{
  text-align: center;
}
#viewButton {
  margin-top: 15px;
}

</style>
