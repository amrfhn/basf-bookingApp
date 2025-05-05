export const state = () => ({
  _bookings: [],
  _teamBookings: [],
  _preBookings: [],
  _quickBookings: [],
  _selectedBooking: null
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setBookings (state, bookings) {
    state._bookings = bookings
  },
  setTeamBookings (state, teamBookings) {
    state._teamBookings = teamBookings
  },
  setPreBookings (state, preBookings) {
    state._preBookings = preBookings
  },
  setSelectedBooking (state, selectedBooking) {
    state._selectedBooking = selectedBooking
  },
  setQuickBookings (state, quickBookings) {
    state._quickBookings = quickBookings
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getBookings (state) {
    return state._bookings
  },
  getTeamBookings (state) {
    return state._teamBookings
  },
  getPreBookings (state) {
    return state._preBookings
  },
  getSelectedBooking (state) {
    return state._selectedBooking
  },
  getQuickBookings (state) {
    return state._quickBookings
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadBookings ({ commit }) {
    let data = await this.$api.booking.mine()
    if (data) {
      data = data.map(d => ({ ...d, type: 'standard booking' }))
      commit('setBookings', data)
    }
  },
  async loadTeamBookings ({ commit }) {
    const data = await this.$api.booking.getTeamBookings()
    commit('setTeamBookings', data)
  },
  async loadPreBookings ({ commit, rootGetters }) {
    const isManager = rootGetters['auth/getRoles'].isManager
    if (isManager) {
      const data = await this.$api.booking.getPreBookings()
      commit('setPreBookings', data)
    }
  },
  async loadQuickBookings ({ commit }) {
    let data = await this.$api.booking.getMyQuickbook()
    if (data) {
      data = data.map(d => ({ ...d, type: 'quick booking' }))
      commit('setQuickBookings', data)
    }
  },
  selectBooking ({ commit }, booking) {
    commit('setSelectedBooking', booking)
  },
  async deleteBooking ({ dispatch }, bookings) {
    await Promise.all(bookings.map(b => this.$api.booking.delete(b.id)))
    await dispatch('loadBookings')
  },
  async deleteQuickBooking ({ dispatch }, quickBookings) {
    await this.$api.booking.deleteMultipleQuickBooks({ quickBookIds: quickBookings.map(q => q.id) })
    await dispatch('loadQuickBookings')
  },
  async deleteTeamBookings ({ dispatch }, teamBookings) {
    const bookIds = teamBookings.map(b => b.id)
    await this.$api.booking.deleteMultipleBooks({ bookIds }).catch(e => e)
    await dispatch('loadTeamBookings')
  },
  async deletePreBookings ({ dispatch }, preBookings) {
    await Promise.all(preBookings.map(pb => this.$api.booking.deletePreBooks(pb.id).catch(e => e)))
    await dispatch('loadPreBookings')
  }

}
