<template>
  <div>
    <box3>
      <h3>
        {{ $t('configuration.hood.locationTitle') }}
      </h3>
      <div v-if="message" class="warn">
        {{ message }}
      </div>
      <ui-grid :columns="5">
        <row v-if="hoodLocations.length">
          <column :wide="3">
            <label>{{ $t('configuration.hood.building') }}</label>
          </column>
          <column :wide="2">
            <label>{{ $t('configuration.hood.floor') }}</label>
          </column>
          <column :wide="2">
            <label>{{ $t('configuration.hood.area') }}</label>
          </column>
          <column :wide="2">
            {{ $t('configuration.hood.colAmountSeats') }}
          </column>
          <column :wide="3">
            {{ $t('configuration.hood.colFloorMap') }}
          </column>
        </row>
        <row v-for="location in hoodLocations" :key="location.name">
          <column :wide="3">
            {{ location.building }}
          </column>
          <column :wide="2">
            {{ location.floornumber }}
          </column>
          <column :wide="2">
            {{ location.areacode }}
          </column>
          <column :wide="2">
            {{ location.count }}
          </column>
          <column :wide="3">
            <btn-positive @click="showMap(location)">
              {{ $t('configuration.hood.viewMapBtn') }}
            </btn-positive>
          </column>
        </row>
        <row v-if="addHoodSeats">
          <column :wide="3">
            <dropdown
              v-model="selectedBuilding"
              :label-selector="e => e.name"
              :non-selected="$t('searchbox.buildingtitle')"
              :options="buildings"
            />
          </column>
          <column :wide="2">
            <dropdown
              v-model="selectedFloor"
              :label-selector="e => e.number"
              :non-selected="$t('searchbox.floortitle')"
              :options="floors"
            />
          </column>
          <column :wide="2">
            <dropdown
              v-model="selectedArea"
              :disabled="areaReadOnly"
              :label-selector="e => e.code"
              :non-selected="$t('searchbox.areatitle')"
              :options="areas"
            />
          </column>
          <column :wide="2">
            0
          </column>
          <column :wide="3">
            <btn-positive @click="showNewMap">
              {{ $t('configuration.hood.viewMapBtn') }}
            </btn-positive>
          </column>
        </row>
      </ui-grid>
      <btn-positive @click="showAddNewLocation">
        <i class="icon add" />{{ $t('configuration.hood.addLocationBtn') }}
      </btn-positive>
    </box3>
    <map-modal
      v-if="showMapModal"
      :area="selectedArea"
      :hood-id="hoodId"
      @clear="removeLocation"
      @close="closeMapModal"
      @complete="addSeats"
      @delete="deleteSeats"
    />
  </div>
</template>

<script>

import MapModal from './modals/MapModal'

export default {
  name: 'HoodLocationTable',
  components: { MapModal },
  props: {
    hoodInfo: { type: Object, required: true }
  },
  data () {
    return {
      showMapModal: false,
      hoodLocations: [],
      hoodId: null,
      addHoodSeats: false,
      message: null,
      floors: [],
      areas: [],
      selectedBuilding: null,
      selectedFloor: null,
      selectedArea: null,
      selectedSeats: []
    }
  },
  computed: {
    buildings () {
      return this.$store.getters['building/getBuildings']
    },
    areaReadOnly () {
      return this.areas.length ? this.areas[0].code === '-' : false
    }
  },
  watch: {
    buildings (buildings) {
      if (buildings.length === 1) {
        this.selectedBuilding = buildings[0]
      } else {
        this.selectedBuilding = null
      }
    },
    async selectedBuilding (building) {
      this.floors = []
      this.selectedFloor = null
      this.areas = []
      this.selectedArea = null
      if (building) {
        this.floors = await this.$api.building.floors(building.id)
      }
    },
    floors (floors) {
      if (floors.length === 1) {
        this.selectedFloor = floors[0]
      } else {
        this.selectedFloor = null
      }
    },
    async selectedFloor (floor) {
      this.areas = []
      this.selectedArea = null
      if (floor) {
        this.areas = await this.$api.floor.areas(floor.id)
      }
    },
    areas (areas) {
      if (areas.length === 1) {
        this.selectedArea = areas[0]
      } else {
        this.selectedArea = null
      }
    }
  },
  async mounted () {
    this.$nuxt.$on('select-seat-hood', this.selectSeats)
    await this.loadInformation()
  },
  methods: {
    async loadInformation () {
      this.hoodLocations = await this.$api.hood.getLocations(this.hoodInfo.id)
    },
    showMap (location) {
      this.selectedArea = { code: location.areacode, id: location.areaid }
      this.hoodId = location.hoodid
      this.showMapModal = true
    },
    showNewMap () {
      if (this.selectedBuilding && this.selectedFloor && this.selectedArea) {
        this.hoodId = this.hoodInfo.id
        this.showMapModal = true
      } else {
        this.message = 'Building, floor or area are missing'
        setTimeout(() => {
          this.message = null
        }, 3500)
      }
    },
    showAddNewLocation () {
      this.addHoodSeats = true
    },
    closeMapModal () {
      this.showMapModal = false
    },
    async addSeats () {
      this.selectedSeats.forEach((seat) => {
        seat.seatHoods.push(this.hoodInfo)
      })
      await this.updateSeats()
      this.selectedSeats = []
      this.loadInformation()
      this.showMapModal = false
    },
    async deleteSeats () {
      this.selectedSeats.forEach((seat) => {
        seat.seatHoods = seat.seatHoods.filter((hood) => {
          return hood.hoodId !== this.hoodInfo.id
        })
      })
      await this.updateSeats()
      this.selectedSeats = []
      this.loadInformation()
      this.showMapModal = false
    },
    async removeLocation () {
      const seats = await this.$api.area.seats(this.selectedArea.id, { disabled: true })
      this.selectedSeats = seats
      this.selectedSeats.forEach((seat) => {
        if (seat.seatHoods.length) {
          seat.seatHoods = seat.seatHoods.filter((hood) => {
            return hood.id === this.hoodInfo.id
          })
        }
      })
      await this.updateSeats()
      this.selectedSeats = []
      this.loadInformation()
      this.showMapModal = false
    },
    selectSeats (selectedSeats) {
      this.selectedSeats = selectedSeats
    },
    async updateSeats () {
      if (this.selectedSeats.length) {
        await this.$api.seat.updateSeatHoods(this.selectedSeats).catch(e => e)
      }
    }
  }
}
</script>

<style scoped>

</style>
