export const state = () => ({
  _floors: [],
  _selectedFloor: {}
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
  setSelectedFloor (state, selectedFloor) {
    state._selectedFloor = selectedFloor
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
  getSelectedFloor (state) {
    return state._selectedFloor
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadFloors ({ commit, rootGetters }) {
    const buildingId = rootGetters['building/getSelectedBuilding'].id
    const data = await this.$api.building.floors(buildingId)
    commit('setFloors', data)
  },
  async selectFloor ({ commit, dispatch }, floor) {
    if (floor) {
      floor.map = await this.$api.floor.getMap(floor.id)
    }
    commit('setSelectedFloor', floor)
    dispatch('area/loadAreas', null, { root: true })
  }
}
