<template>
  <box3 v-if="amenities.length" class="amenitiesFilter">
    <h3> {{ $t('mapFilter.title') }}</h3>
    <ui-table class="reservations">
      <tbody>
        <tr v-for="a in amenities" :key="a.id">
          <template v-if="a.filterable">
            <!-- NUMERIC -->
            <template v-if="a.type==='NUMERIC'">
              <td>
                <label :for="a.key">{{ dk(a.key) }}</label>
              </td>
              <td>
                <input
                  :id="a.key"
                  v-model.number="filter[a.key]"
                  :max="a.max"
                  :min="a.min"
                  class="field"
                  type="number"
                >
              </td>
            </template>
            <!-- BOOLEAN -->
            <template v-else-if="a.type==='BOOLEAN'">
              <td colspan="2">
                <input :id="a.key" v-model="filter[a.key]" type="checkbox">
                <label :for="a.key">{{ dk(a.key) }}</label>
              </td>
            </template>
            <!-- MULTI -->
            <template v-if="a.type==='MULTI' && hasBmId">
              <td>
                <label :for="a.key">{{ dk(a.key) }}<input
                  :id="a.key"
                  v-model="filter[a.key]"
                  :value="a.values[0]"
                  class="multi-checkbox"
                  type="checkbox"
                ></label>
              </td>
            </template>
            <template v-else-if="a.type==='MULTI'">
              <td>
                <label :for="a.key">{{ dk(a.key) }}</label>
              </td>
              <td>
                <select :id="a.key" v-model="filter[a.key]" class="field">
                  <option :value="undefined">
                    ---
                  </option>
                  <option v-for="v in a.values" :key="v" :value="v">
                    {{ dk(v) }}
                  </option>
                </select>
              </td>
            </template>
          </template>
        </tr>
      </tbody>
    </ui-table>

    <btn-negative @click="resetFilters">
      <i class="icon trash" />
      {{ $t('modal.delete') }}
    </btn-negative>
    <btn-positive @click="searchByFilter">
      <i class="icon search" />
      {{ $t('modal.filter') }}
    </btn-positive>
  </box3>
</template>

<script>
export default {
  name: 'AmenitiesFilter',
  data () {
    return {
      filter: {},
      bookings: [],
      amenities: []
    }
  },
  computed: {
    building () {
      return this.$store.getters['building/getSelectedBuildingBooking']
    },
    hasBmId () {
      return this.building.buildingMindsID !== undefined ? this.building.buildingMindsID != null : false
    }
  },
  watch: {
    bookings () {
      this.loadAmenities()
    },
    building () {
      this.filter = {}
    }
  },
  mounted () {
    this.updateFilter({})
    this.$nuxt.$on('setBookings', this.setBookings)
  },
  methods: {
    setBookings (value) {
      this.bookings = value
    },
    resetFilters () {
      this.updateFilter({})
    },
    searchByFilter () {
      if (this.building.buildingMindsID != null) {
        for (const a in this.filter) {
          if (this.filter[a]) {
            this.filter[a] = a
          } else {
            this.filter[a] = undefined
          }
        }
      }
      this.updateFilter(this.filter)
    },
    dk (k) {
      const auxKey = 'amenities.' + k
      const value = this.$dk(auxKey)
      return value === auxKey ? k : value
    },
    loadAmenities () {
      this.amenities = []
      const seats = this.$store.getters['seat/getSeats']
      const allAmenities = Object.values(seats).flatMap(s => s.amenities)
      const dic = {}
      for (const a of allAmenities) {
        dic[a.id] = dic[a.id] || { key: a.key, type: a.type, filterable: a.filterable }

        if (a.type === 'NUMERIC') {
          dic[a.id].max = Math.max(dic[a.id].max || a.numericValue, a.numericValue)
          dic[a.id].min = Math.min(dic[a.id].min || a.numericValue, a.numericValue)
        }

        if (a.type === 'MULTI') {
          dic[a.id].values = (dic[a.id].values || [])
          if (!dic[a.id].values.includes(a.multiValue)) {
            dic[a.id].values.push(a.multiValue)
          }
        }
      }
      const amenities = Object.values(dic)
        .sort((a, b) => b.key.localeCompare(a.key))
        .sort((a, b) => b.type.localeCompare(a.type))
      this.amenities = amenities
    },
    updateFilter (filter) {
      this.filter = filter
      this.$nuxt.$emit('setFilter', filter)
      this.bookings = null
    }
  }
}
</script>

<style lang="scss" scoped>
.amenitiesFilter {
  margin-top: 10px;
  width: 100%;

  .field {
    width: 50%;
  }

  .multi-checkbox {
    height: auto;
    margin-left: 5px;
  }

  input,
  select {
    outline: none;
    border: gray 1px solid;
    border-radius: 3px;
  }

  input:focus,
  select:focus {
    border: green 1px solid;
    border-radius: 3px;
  }

  td {
    border: none;
    padding: 0;
  }
}
</style>
