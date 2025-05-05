import { sortByStrAndNumFloorOrSeat } from '@/common/Utils'

export const state = () => ({
  _floors: [],
  _areas: [],
  _selectedFloorBooking: null,
  _selectedFloorConfig: null,
  _selectedAreaBooking: null,
  _selectedAreaConfig: null,
  _quantityPerFloor: [],
  _hasLandingZones: true
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setFloors (state, floors) {
    state._floors = floors
  },
  setAreas (state, areas) {
    state._areas = areas
  },
  setSelectedFloorBooking (state, selectedFloor) {
    state._selectedFloorBooking = selectedFloor
  },
  setSelectedAreaBooking (state, selectedArea) {
    state._selectedAreaBooking = selectedArea
  },
  setSelectedFloorConfig (state, selectedFloor) {
    state._selectedFloorConfig = selectedFloor
  },
  setSelectedAreaConfig (state, selectedArea) {
    state._selectedAreaConfig = selectedArea
  },
  setQuantityPerFloor (state, quantityPerFloor) {
    state._quantityPerFloor = quantityPerFloor
  },
  setLandingZones (state, hasLandingZones) {
    state._hasLandingZones = hasLandingZones
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getFloors (state) {
    return state._floors
  },
  getAreas (state) {
    return state._areas
  },
  getSelectedFloorBooking (state) {
    return state._selectedFloorBooking
  },
  getSelectedAreaBooking (state) {
    return state._selectedAreaBooking
  },
  getSelectedFloorConfig (state) {
    return state._selectedFloorConfig
  },
  getSelectedAreaConfig (state) {
    return state._selectedAreaConfig
  },
  getQuantityPerFloorBooking (state) {
    return state._quantityPerFloor || []
  },
  hasLandingZones (state) {
    return state._hasLandingZones || false
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadFloors ({ commit, dispatch, rootGetters }, building) {
    commit('setSelectedFloorBooking', null)
    commit('setFloors', [])
    if (building) {
      const floors = await this.$api.building.floors(building.id)
      commit('setFloors', sortByStrAndNumFloorOrSeat(floors, true))
      if (floors.some(f => f.landingZones === null || f.landingZones === '')) {
        commit('setLandingZones', false)
      } else {
        commit('setLandingZones', true)
      }
    }
  },
  selectFloorBooking ({ commit }, floor) {
    if (floor) {
      commit('setSelectedFloorBooking', floor)
    }
  },
  selectFloorConfig ({ commit }, floor) {
    if (floor) {
      commit('setSelectedFloorConfig', floor)
    }
  },
  async loadAreas ({ commit }, floor) {
    commit('setAreas', [])
    if (floor) {
      const areas = await this.$api.floor.areas(floor.id)
      commit('setAreas', areas)
    }
  },
  selectAreaBooking ({ commit }, area) {
    commit('setSelectedAreaBooking', area)
  },
  selectAreaConfig ({ commit }, area) {
    commit('setSelectedAreaConfig', area)
  }
}
