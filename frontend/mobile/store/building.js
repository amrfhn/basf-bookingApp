export const state = () => ({
  _buildings: [],
  _selectedBuilding: null,
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
  setSelectedBuilding (state, selectedBuilding) {
    state._selectedBuilding = selectedBuilding
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
  getSelectedBuilding (state) {
    return state._selectedBuilding
  },
  getQuantityPerFloor (state) {
    return state._quantityPerFloor
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {

  async loadBuildings ({ commit, rootGetters }) {
    const siteId = rootGetters['site/getSelectedSite']?.id
    if (siteId) {
      const data = await this.$api.site.buildings(siteId)
      commit('setBuildings', data)
    } else {
      commit('setBuildings', [])
    }
  },
  async selectBuilding ({ commit, dispatch }, building) {
    if (building) {
      building.map = await this.$api.building.floors(building.id)
    }
    commit('setSelectedBuilding', building)
    dispatch('loadSuggestionTable')
    dispatch('floor/loadFloors', null, { root: true })
  },
  async loadSuggestionTable ({ commit, rootGetters }) {
    const building = rootGetters['building/getSelectedBuilding']
    if (building) {
      const data = await this.$api.building.getQuantityPerFloor(building.id, 2)
      commit('setQuantityPerFloor', data)
    } else {
      commit('setQuantityPerFloor', [])
    }
  },
  async loadLatestBuilding ({ dispatch }) {
    const building = await this.$api.building.userLatest()
    await dispatch('site/selectSite', building.site, { root: true })
    await dispatch('selectBuilding', building)
  }
}
