export const state = () => ({
  _sites: [],
  _buildings: [],
  _selectedSite: null,
  _selectedBuilding: null
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
  },
  setBuildings (state, buildings) {
    state._buildings = buildings
  },
  setSelectedBuilding (state, selectedBuilding) {
    state._selectedBuilding = selectedBuilding
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
  },
  getBuildings (state) {
    return state._buildings || []
  },
  getSelectedBuilding (state) {
    return state._selectedBuilding || null
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadSites ({ commit, dispatch, rootGetters }) {
    const superAdminSites = await this.$api.site.get()
    const adminSites = rootGetters['auth/getAdminSites']
    if (rootGetters['auth/getRoles'].isSuperAdmin) {
      commit('setSites', superAdminSites)
    } else {
      commit('setSites', adminSites)
    }
    if (adminSites.length === 1) {
      dispatch('selectSite', adminSites[0])
    }
  },
  async selectSite ({ commit, dispatch }, site) {
    commit('setSelectedSite', site)
    await dispatch('loadBuildings')
  },
  async loadBuildings ({ commit, getters, dispatch }) {
    commit('setBuildings', [])
    if (getters.getSelectedSite) {
      const buildings = await this.$api.site.buildings(getters.getSelectedSite.id)
      commit('setBuildings', buildings)
      if (buildings.length === 1) {
        dispatch('selectBuilding', buildings[0])
      }
    }
  },
  selectBuilding ({ commit }, building) {
    commit('setSelectedBuilding', building)
  }
}
