export const state = () => ({
  _buildings: [],
  _hoods: [],
  _selectedSite: null
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
const setter = attr => (state, value) => { state[attr] = value }
export const mutations = {
  setBuildings: setter('_buildings'),
  setHoods: setter('_hoods'),
  setSelectedSite: setter('_selectedSite')
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
const getter = attr => state => state[attr]
export const getters = {
  getBuildings: getter('_buildings'),
  getHoods: getter('_hoods'),
  getSelectedSite: getter('_selectedSite')
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  init ({ commit, rootGetters }) {
    const managedSites = rootGetters['auth/getManagedSites']
    if (managedSites.length === 1) {
      commit('setSelectedSite', managedSites[0])
    }
  },
  async loadBuildings ({ commit }) {
    const data = await this.$api.building.get()
    commit('setBuildings', data)
  },
  async selectSite ({ commit }, site) {
    commit('setSelectedSite', site)
    const hoods = await this.$api.hood.get({ siteId: site.id })
    commit('setHoods', hoods)
  }
}
