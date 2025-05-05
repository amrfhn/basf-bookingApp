import Waiter from 'basf-gtu-utils/utils/Waiter'

export const state = () => ({
  _waiter: new Waiter(),
  _user: null,
  _token: null,
  _roles: { isAdmin: false, isSuperAdmin: false, isManager: false, teamCoordinator: false },
  _parkingAccess: [],
  _teammates: [],
  _hoods: [],
  _managedSites: [],
  _adminSites: []
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
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
  },
  setAdminSites (state, adminSites) {
    state._adminSites = adminSites
  },
  setParkingAccesses (state, parkingAccesses) {
    state._parkingAccess = parkingAccesses
  },
  waiterNotify (state, data) {
    state._waiter.notify(data)
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
  },
  getAdminSites (state) {
    return state._adminSites
  },
  getParkingAccesses (state) {
    return state._parkingAccess
  }
  // getUserCountryLocation (state) {
  //   console.log(state._user)
  //   return state._user ? state._user.country : ''
  // }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async authenticate ({ commit, getters }, token) {
    commit('setToken', token)
    const data = await this.$api.auth()
    const parkingAccess = await this.$api.userParkingAccess.get({ userId: data.user.username })
    commit('setUser', data.user)
    commit('setRoles', data.roles)
    //   {isSuperAdmin: false,
    //   isAdmin: true,
    //   adminSites: ['11170911'],
    //   isManager: false,
    //   managedSites: []}
    commit('setManagedSites', data.roles.managedSites)
    commit('setAdminSites', data.roles.adminSites)
    const teammates = data.teammates
    teammates.push(data.user ? data.user.username.toLowerCase() : '')
    commit('setTeammates', teammates)
    parkingAccess.hasAccess = false
    for (const u of parkingAccess) {
      if (u.startDate) {
        parkingAccess.hasAccess = true
      }
    }
    commit('setParkingAccesses', parkingAccess)
    commit('setHoods', data.hoods.map(x => x.id))
    commit('waiterNotify', data)
  },
  waitAuth ({ getters }) {
    return getters.getWaiter.wait(30)
  }
}
