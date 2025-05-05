import Waiter from 'basf-gtu-utils/utils/Waiter'

export const state = () => ({
  _waiter: new Waiter(),
  _user: null,
  _token: null,
  _roles: { admin: false, normalUser: false, manager: false, teamCoordinator: false, brigadista: false, visitor: true },
  _teammates: [],
  _hoods: [],
  _managedSites: []
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  waiterNotify (state, data) {
    state._waiter.notify(data)
  },
  setUser (state, user) {
    state._user = user
  },
  setRoles (state, roles) {
    state._roles = roles
  },
  setTeammates (state, teammates) {
    state._teammates = teammates
  },
  setHoods (state, hoods) {
    state._hoods = hoods
  },
  setToken (state, token) {
    state._token = token
  },
  setManagedSites (state, managedSites) {
    state._managedSites = managedSites
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getWaiter (state) {
    return state._waiter
  },
  isAuthenticated (state) {
    return state._user != null
  },
  getUser (state) {
    return state._user
  },
  getUsername (state) {
    return state._user ? state._user.username.toLowerCase() : ''
  },
  token (state) {
    return state._token
  },
  getRoles (state) {
    return state._roles
  },
  getTeammates (state) {
    return state._teammates
  },
  getHoods (state) {
    return state._hoods
  },
  getManagedSites (state) {
    return state._managedSites
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async authenticate ({ commit }, token) {
    commit('setToken', token)
    const data = await this.$api.auth()
    commit('setUser', data.user)
    commit('setRoles', data.roles)
    commit('setManagedSites', data.roles.managedSites)
    const teammates = data.teammates
    teammates.push(data.user ? data.user.username.toLowerCase() : '')
    commit('setTeammates', teammates)
    commit('setHoods', data.hoods.map(x => x.id))
  },
  waitAuth ({ getters }) {
    return getters.getWaiter.wait(30)
  }
}
