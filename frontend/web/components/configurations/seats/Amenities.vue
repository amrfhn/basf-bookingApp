<template>
  <div>
    <ui-table>
      <thead>
        <tr>
          <th>{{ $t('configuration.seats_config.selectedSeats') }} </th>
          <th v-for="amenity of amenitiesBySite" :key="amenity.key">
            {{ dk(amenity.key) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(amenities, sCode) in matrix" :key="sCode">
          <td>{{ sCode }}</td>
          <td v-for="(_, aKey) in amenities" :key="aKey">
            <dropdown
              v-if="amenitiesBySite[aKey].type === 'MULTI'"
              v-model="matrix[sCode][aKey]"
              nullable
              :non-selected="$t('configuration.seats_config.selectOption')"
              :options="amenitiesBySite[aKey].values"
            />
            <input
              v-else-if="amenitiesBySite[aKey].type === 'BOOLEAN'"
              v-model="matrix[sCode][aKey]"
              class="cancelCheckbox"
              type="checkbox"
            >
            <input
              v-else-if="amenitiesBySite[aKey].type === 'NUMERIC'"
              v-model.number="matrix[sCode][aKey]"
              type="number"
              class="form-control"
              min="0"
            >
          </td>
        </tr>
        <tr>
          <td>{{ $t('configuration.seats_config.all') }}</td>
          <td v-for="(a, aKey) in amenitiesBySite" :key="aKey">
            <dropdown
              v-if="a.type === 'MULTI'"
              v-model="all[aKey]"
              nullable
              :non-selected="$t('configuration.seats_config.selectOption')"
              :options="a.values"
              @change="changeAll(aKey)"
            />
            <input
              v-else-if="a.type === 'BOOLEAN'"
              v-model="all[aKey]"
              class="cancelCheckbox"
              type="checkbox"
              @change="changeAll(aKey)"
            >
            <input
              v-else-if="a.type === 'NUMERIC'"
              v-model.number="all[aKey]"
              type="number"
              class="form-control"
              min="0"
              @change="changeAll(aKey)"
            >
          </td>
        </tr>
      </tbody>
    </ui-table>
    <button class="ui golden button" @click="openCreateAmenityModal">
      <i class="edit icon" />
      {{ $t('configuration.seats_config.createAmenity') }}
    </button>
    <seat-create-new-amenity-modal v-if="showCreateAmenitiesModal" @close="closeModal" @ok="okNew" />
  </div>
</template>

<script>
import SeatCreateNewAmenityModal from '@/components/configurations/seats/modals/SeatCreateNewAmenityModal'
export default {
  name: 'Amenities',
  components: { SeatCreateNewAmenityModal },
  data () {
    return {
      matrix: {},
      all: {},
      showCreateAmenitiesModal: false,
      amenitiesBySite: {},
      amenitiesTypes: []
    }
  },
  computed: {
    selectedSite () { return this.$store.getters['site/getSelectedSiteConfiguration'] },
    selectedSeats () { return this.$store.getters['seat/getSelectedSeatsConfig'] },
    seats () { return this.$store.getters['seat/getSeats'] }
  },
  watch: {
    amenitiesBySite () { this.generateMatrix() }
  },
  async mounted () {
    await this.loadAmenitiesBySite()
    this.$nuxt.$on('saveAmenities', () => {
      this.updateSeatAmenities()
    })
  },
  methods: {
    async loadAmenitiesBySite () {
      const param = {
        siteId: this.selectedSite.id
      }
      const data = await this.$api.amenities.get(param)
      const amenities = {}
      const amenitiesTypes = []
      for (const a of data) {
        amenitiesTypes.push(a.type)
        amenities[a.key] = a
      }
      this.amenitiesTypes = amenitiesTypes
      this.amenitiesBySite = amenities
    },
    okNew () {
      this.showCreateAmenitiesModal = false
      this.loadAmenitiesBySite()
    },
    closeModal () {
      this.showCreateAmenitiesModal = false
    },
    openCreateAmenityModal () {
      this.showCreateAmenitiesModal = true
    },
    dk (k) {
      const auxKey = 'amenities.' + k
      const value = this.$dk(auxKey)

      return value === auxKey ? k : value
    },
    generateMatrix () {
      this.matrix = {}
      this.all = {}
      Object.values(this.amenitiesBySite).map(a => a.key).forEach((a) => { this.all[a] = null })
      for (const selectedSeat of this.selectedSeats) {
        const seatRow = {}
        for (const amenityBySite of Object.values(this.amenitiesBySite)) {
          seatRow[amenityBySite.key] = null
        }
        const selectedSeatAmenities = Object.values(this.seats).find(x => x.code === selectedSeat).amenities
        for (const a of selectedSeatAmenities) {
          seatRow[a.key] = a.numericValue || a.booleanValue || a.multiValue
        }

        this.matrix[selectedSeat] = seatRow
      }
    },
    changeAll (aKey) {
      for (const selectedSeat of this.selectedSeats) {
        this.matrix[selectedSeat][aKey] = this.all[aKey]
      }
      this.matrix = { ...this.matrix }
    },
    async updateSeatAmenities () {
      const seatIdx = {}
      for (const seat of this.selectedSeats) {
        seatIdx[seat] = Object.values(this.seats).find(x => x.code === seat).id
      }

      const changes = []

      for (const [key, value] of Object.entries(this.matrix)) {
        const values = Object.entries(value).map(([k, v]) => { return { amenityId: this.amenitiesBySite[k].id, value: v } })
        changes.push({ seatId: seatIdx[key], values })
      }

      await this.$api.amenities.massive(changes)
    }
  }
}
</script>

<style scoped>
.golden {
  background-color: #f39501;
  color: #fff;
}
</style>
