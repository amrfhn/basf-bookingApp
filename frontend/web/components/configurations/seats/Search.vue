<template>
  <div class="searchBox">
    <div class="ui">
      <ui-grid :columns="1">
        <column class="field">
          <label>{{ $t('searchbox.sitelabel') }}</label>
          <dropdown
            v-model="selectedSite"
            :label-selector="getName"
            :non-selected="$t('searchbox.sitetitle')"
            :options="sites"
          />
        </column>

        <column v-if="showBuildingField" class="field">
          <label>{{ $t('searchbox.buildinglabel') }}</label>
          <dropdown
            v-model="selectedBuilding"
            :label-selector="getName"
            :non-selected="$t('searchbox.buildingtitle')"
            :options="buildings"
          />
        </column>

        <column class="field">
          <label>{{ $t('searchbox.floorlabel') }}</label>
          <dropdown
            v-model="selectedFloor"
            :label-selector="getNumber"
            :non-selected="$t('searchbox.floortitle')"
            :options="floors"
          />
        </column>

        <column v-if="showAreaField" class="field">
          <label>{{ $t('searchbox.arealabel') }}</label>
          <dropdown
            v-model="selectedArea"
            :label-selector="getCode"
            :non-selected="$t('searchbox.areatitle')"
            :options="areas"
          />
        </column>

        <column>
          <button class="ui primary button full" @click="search">
            <i class="icon search" />{{ $t('searchbox.search') }}
          </button>
        </column>
      </ui-grid>
    </div>
  </div>
</template>

<script>
import { getter } from 'basf-gtu-utils/utils/FunctionalUtils'

export default {
  name: 'SearchSeats',
  data () {
    return {}
  },
  computed: {
    sites () {
      return this.$store.getters['site/getConfigurationSites']
    },
    selectedSite: {
      get () {
        return this.$store.getters['site/getSelectedSiteConfiguration']
      },
      set (site) {
        this.$store.dispatch('site/selectSiteConfiguration', site)
      }
    },
    buildings () {
      return this.$store.getters['building/getBuildings']
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingConfiguration']
      },
      set (site) {
        this.$store.dispatch('building/selectBuildingConfiguration', site)
      }
    },
    floors () {
      return this.$store.getters['floor/getFloors']
    },
    selectedFloor: {
      get () {
        return this.$store.getters['floor/getSelectedFloorConfig']
      },
      set (value) {
        this.$store.dispatch('floor/selectFloorConfig', value)
      }
    },
    areas () {
      return this.$store.getters['floor/getAreas']
    },
    selectedArea: {
      get () {
        return this.$store.getters['floor/getSelectedAreaConfig']
      },
      set (value) {
        this.$store.dispatch('floor/selectAreaConfig', value)
      }
    },
    // seats () { return this.$store.getters['seat/getSeats'] },
    // selectedSeats: {
    //   get () { return this.$store.getters['seat/getSelectedSeat'] },
    //   set (value) { this.$store.dispatch('seat/selectSeat', value) }
    // },
    showBuildingField () {
      return this.buildings.length > 1
    },
    showAreaField () {
      return this.areas.length > 1
    }
  },
  watch: {
    selectedSite (site) {
      this.$store.dispatch('building/loadBuildings', site)
      this.cleanSearchBox()
    },
    buildings (buildings) {
      if (buildings.length === 1) {
        this.selectedBuilding = buildings[0]
      } else {
        this.selectedBuilding = null
      }
    },
    selectedBuilding (building) {
      if (building) {
        this.$store.dispatch('floor/loadFloors', building)
      }
    },
    floors (floors) {
      if (floors.length === 1) {
        this.selectedFloor = floors[0]
      } else {
        this.selectedFloor = null
      }
    },
    selectedFloor (floor) {
      this.$store.dispatch('floor/loadAreas')
      this.selectedArea = null
      this.$store.dispatch('seat/setSelectedSeatsConfig', [])
      if (floor) {
        this.$store.dispatch('floor/loadAreas', floor)
      }
    },
    areas (areas) {
      if (areas.length === 1) {
        this.selectedArea = areas[0]
      } else {
        this.selectedArea = null
      }
    },
    async selectedArea (area) {
      this.$store.dispatch('seat/setSelectedSeatsConfig', [])
      if (area) {
        area.configurating = true
        await this.$store.dispatch('seat/loadSeats', area)
      }
    }
  },
  mounted () {
    if (!this.sites.length) {
      this.$store.dispatch('site/loadSites')
    }
    if (this.selectedSite) {
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
    }
  },
  methods: {
    async search () {
      if (this.selectedArea) {
        this.selectedArea.configurating = true
        await this.$store.dispatch('seat/loadSeats', this.selectedArea)
      }
    },
    cleanSearchBox () {
      this.$store.dispatch('seat/setSelectedSeatsConfig', [])
      this.$store.dispatch('seat/loadSeats')
      this.selectedArea = null
      this.$store.dispatch('floor/loadAreas')
      this.selectedFloor = null
      this.$store.dispatch('floor/loadFloors')
    },
    getNumber: getter('number'),
    getName: getter('name'),
    getCode: getter('code')
  }
}
</script>

<style lang="scss" scoped>
.searchBox {
  .field {
    color: #000;

    label {
      display: block;
    }
  }

  .column {
    button:not(:first-child) {
      margin-top: 5px;
    }
  }
}
</style>
