import LDAP from 'basf-gtu-utils/client/LDAP'
import { groupBy } from '../../mobile/common/Utils'

export const state = () => ({
  _seats: [],
  _selectedSeatsBooking: null,
  _selectedSeatsConfig: null,
  _seatsWithHoodsConfig: []
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setSeats (state, seats) {
    state._seats = seats
  },
  setSelectedSeatsBooking (state, selectedSeats) {
    state._selectedSeatsBooking = selectedSeats
  },
  setSelectedSeatsConfig (state, selectedSeats) {
    state._selectedSeatsConfig = selectedSeats
  },
  toggleSelectedSeatConfig (state, selectedSeat) {
    if (selectedSeat) {
      state._selectedSeatsConfig = state._selectedSeatsConfig || []
      const alreadySelected = state._selectedSeatsConfig.find(s => s === selectedSeat)
      !alreadySelected ? state._selectedSeatsConfig.push(selectedSeat) : state._selectedSeatsConfig = state._selectedSeatsConfig.filter(s => s !== selectedSeat)
    }
  },
  setSeatsWithHoodsConfig (state, seats) {
    state._seatsWithHoodsConfig = seats
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
  },
  getSelectedSeatsBooking (state) {
    return state._selectedSeatsBooking
  },
  getSelectedSeatsConfig (state) {
    return state._selectedSeatsConfig
  },
  getSeatsWithHoodsConfig (state) {
    return state._seatsWithHoodsConfig
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async loadSeats ({ commit, rootGetters }, area) {
    if (area && area.id) {
      const seatIdx = {}
      const seats = await this.$api.area.seats(area.id)
      for (const s of seats) {
        seatIdx[s.buildingMindsID ? s.buildingMindsID : s.code] = s
      }
      if (area.configurating) {
        const date = new Date().toISOString().substring(0, 10)
        const bookings = await this.$api.booking.get({
          seatStatus: 'Booked',
          areaId: area.id,
          initialDate: date,
          finalDate: date,
          userId: null
        })
        for (const s of seats) {
          const seatBooking = bookings.filter(b => b.seat.id === s.id)
          if (seatBooking.length && (seatBooking[0].userId === null && seatBooking[0].bookingStatus.status === 'Booked')) {
            s.isAvailable = false
          } else if ((s.startDate <= date && s.endDate === null) || (s.startDate <= date && s.endDate >= date)) {
            s.isAvailable = true
          }
        }
      }
      commit('setSeats', seatIdx)
    }
  },
  setSelectedSeatsBooking ({ commit, getters, dispatch }, data) {
    commit('setSelectedSeatsBooking', data)
  },
  setSelectedSeatsConfig ({ commit, getters, dispatch }, data) {
    commit('setSelectedSeatsConfig', data)
  },
  toggleSelectedSeatConfig ({ commit, getters, dispatch }, data) {
    commit('toggleSelectedSeatConfig', data)
  },
  cleanSeats ({ commit }) {
    commit('setSeats', [])
  },
  async loadSeatsWithHoodsConfig ({ commit, getters, rootGetters }, selectedSite) {
    if (selectedSite) {
      const seatHoods = await this.$api.seat.getSeatsHoods(rootGetters['seat/getSelectedSeatsConfig'].map(s => (s.id))).catch(e => console.error(e))
      commit('setSeatsWithHoodsConfig', seatHoods)
    }
  },
  async loadSeatsWithSeatOwners ({ commit, getters, rootGetters }) {
    let seatsWithSeatOwners = []
    const selectedSeatCodes = rootGetters['seat/getSelectedSeatsConfig']
    const fullInfoSeats = rootGetters['seat/getSeats']
    const seats = []
    for (const s of selectedSeatCodes) {
      seats.push(Object.entries(fullInfoSeats).find(x => (x[1].buildingMindsID != null ? x[1].buildingMindsID : x[1].code) === s)[1].id)
    }
    let seatOwners = await this.$api.seatOwner.getSeatOwners({ seats }).catch(e => console.error(e))
    const toDelete = []
    if (seatOwners.length) {
      const uniqueUsernames = new Set(seatOwners.map(o => o.userId))
      // let users = await LDAP.getUsers(Array.from(uniqueUsernames).slice(0, 99)).then(r => Object.values(r))
      let users = await LDAP.getUsers(Array.from(uniqueUsernames)).then(r => Object.values(r))
      users = groupBy(users, 'username')
      seatOwners = seatOwners.map((so) => {
        if (users[so.userId]) {
          return { ...so, full_name: users[so.userId][0].full_name }
        }
        toDelete.push(so)
        return undefined
      })
      seatOwners = seatOwners.filter((o) => {
        return o !== undefined
      })
      const ownersGroupBySeatId = groupBy(seatOwners, 'seatId')
      seatsWithSeatOwners = seats.map((s) => {
        const code = Object.entries(fullInfoSeats).find(x => x[1].id === s)[1].code
        return { code, owners: ownersGroupBySeatId[s] }
      })
      seatsWithSeatOwners = seatsWithSeatOwners.map((s) => {
        if (s.owners) {
          s.owners = s.owners.sort((a, b) => {
            const nameA = a.full_name || ''
            const nameB = b.full_name || ''
            return nameA.localeCompare(nameB)
          })
        }
        return s
      })
    } else {
      seatsWithSeatOwners = seats.map((s) => {
        return { ...s, owners: [] }
      })
    }
    seatsWithSeatOwners.toDelete = toDelete
    return seatsWithSeatOwners
  }
}
