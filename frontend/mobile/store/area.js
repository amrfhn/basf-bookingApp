export const state = () => ({
  _areas: [],
  _selectedArea: {}
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setAreas (state, areas) {
    state._areas = areas
  },
  setSelectedArea (state, selectedArea) {
    state._selectedArea = selectedArea
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getAreas (state) {
    return state._areas
  },
  getSelectedArea (state) {
    return state._selectedArea
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadAreas ({ commit, dispatch, rootGetters }) {
    const floor = rootGetters['floor/getSelectedFloor']

    const data = floor ? await this.$api.floor.areas(floor.id) : []
    commit('setAreas', data)
    if (data.length === 1) {
      commit('setSelectedArea', data[0])
    }
  },
  selectArea ({ commit, dispatch }, area) {
    commit('setSelectedArea', area)
    dispatch('seat/loadSeats', null, { root: true })
  },
  getSelectedArea ({ rootGetters }) {
    return rootGetters['area/getSelectedArea']
  }
}
