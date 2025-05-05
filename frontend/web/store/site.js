export const state = () => ({
  _sites: [],
  _configurationSites: [],
  _selectedSiteBooking: null,
  _selectedSiteConfiguration: null,
  _isSiteManager: false
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
  setConfigurationSites (state, sites) {
    state._configurationSites = sites
  },
  setSelectedSiteBooking (state, selectedSite) {
    state._selectedSiteBooking = selectedSite
  },
  setSelectedSiteConfiguration (state, selectedSite) {
    state._selectedSiteConfiguration = selectedSite
  },
  setSiteManager (state, isSiteManager) {
    state._isSiteManager = isSiteManager
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
  getConfigurationSites (state) {
    return state._configurationSites
  },
  getSelectedSiteBooking (state) {
    return state._selectedSiteBooking
  },
  getSelectedSiteConfiguration (state) {
    return state._selectedSiteConfiguration
  },
  isSiteManager (state) {
    return state._isSiteManager
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadSites ({ commit, dispatch, rootGetters }) {
    const [sites, latestSite] = await Promise.all([this.$api.site.get(), this.$api.building.userLatest(), dispatch('auth/waitAuth', null, { root: true })])
    commit('setSites', sites)
    const userInfo = rootGetters['auth/getUser']
    const userCountryLocation = await this.$api.site.get({ country: userInfo.country })

    if (userCountryLocation.length > 0) {
      const site = sites.find(site => site.country === userCountryLocation[0].country)
      await dispatch('selectSiteBooking', site)
    } else if (latestSite) {
      const site = sites.find(site => site.id === latestSite.site.id)
      await dispatch('selectSiteBooking', site)
    }
  },
  selectSiteBooking ({ commit, dispatch }, site) {
    commit('setSelectedSiteBooking', site)
  },
  selectSiteConfiguration ({ commit, dispatch }, site) {
    commit('setSelectedSiteConfiguration', site)
    // dispatch('loadFirstAiders', site)
  },
  setConfigurationSites ({ commit, dispatch }, sites) {
    commit('setConfigurationSites', sites)
  },
  updateConfigurationSite ({ commit, getters, dispatch }, site) {
    const sites = getters.getConfigurationSites
    const newSites = sites.map(x => x.id === site.id ? site : x)
    commit('setSites', newSites)
  },
  updateManager ({ commit, getters, rootGetters }) {
    const site = getters.getSelectedSiteBooking
    const managedSites = rootGetters['auth/getManagedSites']
    commit('setSiteManager', false)
    if (managedSites.some(s => s.id === site.id)) {
      commit('setSiteManager', true)
    }
  }
}
