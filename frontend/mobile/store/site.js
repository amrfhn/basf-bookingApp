export const state = () => ({
  _sites: [],
  _selectedSite: {}
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setSites (state, sites) {
    state._sites = sites
  },
  setSelectedSite (state, selectedSite) {
    state._selectedSite = selectedSite
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getSites (state) {
    return state._sites
  },
  getSelectedSite (state) {
    return state._selectedSite
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadSites ({ commit }) {
    const data = await this.$api.site.get()
    commit('setSites', data)
  },
  async selectSite ({ commit, dispatch }, site) {
    commit('setSelectedSite', site)
    await dispatch('building/loadBuildings', null, { root: true })
  }
}
