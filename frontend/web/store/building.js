export const state = () => ({
  _buildings: [],
  _selectedBuildingBooking: null,
  _selectedBuildingConfiguration: null,
  _quantityPerFloor: []
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setBuildings (state, buildings) {
    state._buildings = buildings
  },
  setSelectedBuildingBooking (state, selectedBuilding) {
    state._selectedBuildingBooking = selectedBuilding
  },
  setSelectedBuildingConfiguration (state, selectedBuilding) {
    state._selectedBuildingConfiguration = selectedBuilding
  },
  setQuantityPerFloor (state, quantityPerFloor) {
    state._quantityPerFloor = quantityPerFloor
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getBuildings (state) {
    return state._buildings
  },
  getSelectedBuildingBooking (state) {
    return state._selectedBuildingBooking
  },
  getSelectedBuildingConfiguration (state) {
    return state._selectedBuildingConfiguration
  },
  getQuantityPerFloor (state) {
    return state._quantityPerFloor || []
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadBuildings ({ commit, dispatch }, site) {
    commit('setSelectedBuildingConfiguration', null)
    commit('setSelectedBuildingBooking', null)
    commit('setBuildings', [])
    if (site) {
      const buildings = await this.$api.site.buildings(site.id)
      commit('setBuildings', buildings)
    }
  },
  selectBuildingBooking ({ commit }, building) {
    commit('setSelectedBuildingBooking', building)
  },
  selectBuildingConfiguration ({ commit }, building) {
    commit('setSelectedBuildingConfiguration', building)
  },
  async updateQuantityPerFloor ({ commit, getters }) {
    commit('setQuantityPerFloor')
    const building = getters.getSelectedBuildingBooking
    const days = 5
    if (building) {
      const data = await this.$api.building.getQuantityPerFloor(building.id, days)
      commit('setQuantityPerFloor', data)
    }
  }
}
