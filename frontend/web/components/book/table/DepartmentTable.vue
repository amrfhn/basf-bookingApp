<template>
  <div>
    <div id="viewButton">
      <row style="text-align: right;">
        <div id="viewFloors">
          <button class="ui primary button full" @click="seatsByFloor">
            <i class="icon search" />{{ $t('suggestionTable.seatsByFloor') }}
          </button>
        </div>
      </row>
    </div>
    <div class="suggestion">
      <ui-table>
        <thead>
          <tr>
            <th>{{ $t('suggestionTable.floor') }}</th>
            <th>{{ $t('suggestionTable.landingZones') }}</th>
            <th>
              <div>
                {{ $t('suggestionTable.seatsTomorrow') }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(floor, index) in suggestionTable" :key="index">
            <td class="floors">
              <p>{{ floor.floorNumber }}</p>
            </td>
            <td>
              <p>{{ floor.landingZones }}</p>
            </td>
            <td v-for="(quantity, date) in floor.dates" :key="date">
              <p>{{ quantity }}</p>
            </td>
          </tr>
        </tbody>
      </ui-table>
    </div>
  </div>
</template>

<script>
import { addDays } from 'basf-gtu-utils/utils/DateUtils'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DD'
const formatDate = date => moment(date).format(dateFormat)

export default {
  name: 'DepartmentTable',
  computed: {
    buildingToDisplay () { return this.$store.getters['building/getSelectedBuildingBooking'] },
    dataSuggestion () { return this.$store.getters['building/getQuantityPerFloor'] },
    suggestionTableDates () {
      const reducer = (a, c) => { a[c] = 0; return a }
      return this.dataSuggestion.map(s => s.date).sort().reduce(reducer, {})
    },
    suggestionTable () {
      const dates = this.suggestionTableDates
      const reducer = (a, c) => {
        if (!a[c.floorId]) {
          a[c.floorId] = { floorNumber: c.floorNumber, landingZones: c.landingZones, dates: { ...dates } }
        }
        a[c.floorId].dates[c.date] = c.quantity
        return a
      }
      const objects = Object.values(this.dataSuggestion.reduce(reducer, {})).sort((s1, s2) => s2.floorNumber - s1.floorNumber)
      // TODO: Review and refactor, done in a rush without considering best quality of code
      const ret = []
      const tomorrow = formatDate(addDays(1)(new Date()))
      for (const floor of objects) {
        const elem = { floorNumber: floor.floorNumber, landingZones: floor.landingZones, dates: {} }
        elem.dates[tomorrow] = floor.dates[tomorrow]
        ret.push(elem)
      }
      return ret
    }
  },
  methods: {
    filterSuggestionsPerFloor (listSuggestion) {
      return Object.values(listSuggestion.reduce((prev, next) => Object.assign(prev, { [next.floorNumber]: next }), {}))
    },
    seatsByFloor () { this.$emit('showFloorsTable') }
  }
}
</script>

<style scoped>
.suggestion {
  margin:  20px 0;
  padding: 20px;
  border: 2px solid #00793A;
  background-color: #D9EBE2;
}
.floors {
  font-weight: bolder;
}
.available{
  text-align: center;
}
#viewButton {
  margin-top: 15px;
}
</style>
