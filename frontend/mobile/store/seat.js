export const state = () => ({
  _seats: []
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setSeats (state, seats) {
    state._seats = seats
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getSeats (state) {
    return state._seats
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadSeats ({ commit, rootGetters }) {
    const area = rootGetters['area/getSelectedArea'] || null
    const seats = await this.$api.area.seats(area.id)
    const seatsToFilter = seats.length > 0 ? seats.sort((a, b) => a.code - b.code) : []

    commit('setSeats', seatsToFilter)
  }
}
