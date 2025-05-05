// import moment from 'moment'

// const dateFormat = 'YYYY-MM-DD'
// const formatDate = date => moment(date).format(dateFormat)
import { newFormatDate } from '../../web/common/Utils'

const DATE_SIZE_LIMIT = 10
const NOON_TWELVE_HOUR = 12

const groupBySeatId = (a, c) => {
  if (a[c.seat.id]) {
    a[c.seat.id].push(c)
  } else {
    a[c.seat.id] = [c]
  }
  return a
}

export const state = () => ({
  _startDate: null,
  _endDate: null,
  _mode: 'self',
  _userType: 'internal',
  _sites: [],
  _selectedSite: null,

  _buildings: [],
  _selectedBuilding: null,

  _floors: [],
  _selectedFloor: null,

  _areas: [],
  _selectedArea: null,

  _seats: [],
  _selectedSeat: null,

  _bookings: null,
  _quickBookings: null,

  _reservationDays: null,

  _isSiteManager: false,

  _brigadiers: []
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setStartDate (state, startDate) {
    state._startDate = startDate
  },
  setEndDate (state, endDate) {
    state._endDate = endDate
  },
  setMode (state, mode) {
    state._mode = mode
  },
  setUserType (state, userType) {
    state._userType = userType
  },
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
  },
  setFloors (state, floors) {
    state._floors = floors
  },
  setSelectedFloor (state, selectedFloor) {
    state._selectedFloor = selectedFloor
  },
  setAreas (state, areas) {
    state._areas = areas
  },
  setSelectedArea (state, selectedArea) {
    state._selectedArea = selectedArea
  },
  setSeats (state, seats) {
    state._seats = seats
  },
  setSelectedSeat (state, selectedSeat) {
    state._selectedSeat = selectedSeat
  },
  setBookings (state, bookings) {
    state._bookings = bookings
  },
  setReservationDays (state, reservationDays) {
    state._reservationDays = reservationDays
  },
  setSiteManager (state, isSiteManager) {
    state._isSiteManager = isSiteManager
  },
  setBrigadiers (state, brigadiers) {
    state._brigadiers = brigadiers
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
  getStartDate (state) {
    return state._startDate
  },
  getEndDate (state) {
    return state._endDate
  },
  getMode (state) {
    return state._mode
  },
  getUserType (state) {
    return state._userType
  },
  getSites (state) {
    return state._sites
  },
  getSelectedSite (state) {
    return state._selectedSite
  },
  getBuildings (state) {
    return state._buildings
  },
  getSelectedBuilding (state) {
    return state._selectedBuilding
  },
  getFloors (state) {
    return state._floors
  },
  getSelectedFloor (state) {
    return state._selectedFloor
  },
  getAreas (state) {
    return state._areas
  },
  getSelectedArea (state) {
    return state._selectedArea
  },
  getSeats (state) {
    return state._seats
  },
  getSelectedSeat (state) {
    return state._selectedSeat
  },
  getBookings (state) {
    return state._bookings
  },
  getReservationDays (state) {
    return state._reservationDays
  },
  isSiteManager (state) {
    return state._isSiteManager
  },
  getBrigadiers (state) {
    return state._brigadiers
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async updateStartDate ({ commit, dispatch }, startDate) {
    commit('setStartDate', startDate)
    await dispatch('updateEndDate', startDate)
  },
  async updateEndDate ({ commit, dispatch }, endDate) {
    commit('setEndDate', endDate)
    await dispatch('loadSeats')
  },
  updateMode ({ commit, _dispatch }, mode) {
    commit('setMode', mode)
  },
  updateUserType ({ commit, _dispatch, _getters }, userType) {
    commit('setUserType', userType)
  },
  async loadSites ({ commit, dispatch }) {
    const [sites, l] = await Promise.all([this.$api.site.get(), this.$api.building.userLatest()])
    commit('setSites', sites)
    if (l) {
      const site = sites.find(site => site.id === l.site.id)
      await dispatch('selectSite', site)
      dispatch('selectBuilding', {
        id: l.id,
        name: l.name,
        address: l.address,
        image: l.image,
        extras: l.extras,
        reservationDays: l.reservationDays,
        managerReservationDays: l.managerReservationDays,
        cancellationHours: l.cancellationHours,
        reservationCancellationHours: l.reservationCancellationHours,
        siteId: l.siteId,
        gmt: l.gmt
      })
    }
  },
  async selectSite ({ commit, dispatch, rootGetters }, site) {
    commit('setSelectedSite', site)
    dispatch('selectBuilding', null)
    await dispatch('loadBuildings')

    commit('setSiteManager', false)
    const managedSites = rootGetters['auth/getManagedSites']
    if (managedSites.some(s => s.id === site.id)) {
      commit('setSiteManager', true)
    }

    const data = await this.$api.brigadier.get({ siteId: site.id })
    commit('setBrigadiers', data.map(x => x.username))
  },
  async loadBuildings ({ commit, dispatch, getters }) {
    commit('setBuildings', [])
    if (getters.getSelectedSite) {
      const buildings = await this.$api.site.buildings(getters.getSelectedSite.id)
      commit('setBuildings', buildings)
      if (buildings.length === 1) {
        dispatch('selectBuilding', buildings[0])
      }
    }
  },
  async selectBuilding ({ commit, dispatch, _rootGetters, getters }, building) {
    commit('setSelectedBuilding', building)
    dispatch('selectFloor', null)
    await dispatch('loadFloors')
    if (building) {
      await dispatch('parking/loadUserParkingInfo', building, { root: true })
      if (getters.isSiteManager) {
        commit('setReservationDays', building.managerReservationDays)
      } else {
        commit('setReservationDays', building.reservationDays)
      }
    }
  },
  async loadFloors ({ commit, dispatch, getters }) {
    commit('setFloors', [])
    if (getters.getSelectedBuilding) {
      const floors = await this.$api.building.floors(getters.getSelectedBuilding.id)
      commit('setFloors', floors)
      if (floors.length === 1) {
        dispatch('selectFloor', floors[0])
      }
    }
  },
  async selectFloor ({ commit, dispatch }, floor) {
    commit('setSelectedFloor', floor)
    dispatch('selectArea', null)
    await dispatch('loadAreas')
  },
  async loadAreas ({ commit, dispatch, getters }) {
    commit('setAreas', [])
    if (getters.getSelectedFloor) {
      const areas = await this.$api.floor.areas(getters.getSelectedFloor.id)
      commit('setAreas', areas)
      if (areas.length === 1) {
        dispatch('selectArea', areas[0])
      }
    }
  },
  async selectArea ({ commit, dispatch }, area) {
    commit('setSelectedArea', area)
    dispatch('selectSeat', null)
    await dispatch('loadSeats')
  },
  async selectAreaByCode ({ _commit, dispatch, getters }, areaCode) {
    const area = await this.$api.floor.area(getters.getSelectedFloor.id, areaCode)
    dispatch('selectArea', area)
  },
  async loadBookings ({ commit, dispatch, getters }) {
    commit('setBookings', null)
    if (getters.getSelectedArea && getters.getStartDate && getters.getEndDate) {
      const initialDate = new Date(getters.getStartDate.getFullYear(), getters.getStartDate.getMonth(), getters.getStartDate.getDate(), NOON_TWELVE_HOUR).toISOString().substring(0, DATE_SIZE_LIMIT)
      const finalDate = new Date(getters.getEndDate.getFullYear(), getters.getEndDate.getMonth(), getters.getEndDate.getDate(), NOON_TWELVE_HOUR).toISOString().substring(0, DATE_SIZE_LIMIT)
      const bookings = await this.$api.booking.areaOnDates(getters.getSelectedArea.id, initialDate, finalDate)
      const bookingsGrouped = bookings.reduce(groupBySeatId, {})
      commit('setBookings', bookingsGrouped)
    }
  },
  // async loadQuickBookings ({ commit, dispatch, getters }) {
  //   commit('setQuickBookings', null)
  //   if (getters.getSelectedArea && getters.getStartDate && getters.getEndDate) {
  //     const initialDate = new Date(getters.getStartDate.getFullYear(), getters.getStartDate.getMonth(), getters.getStartDate.getDate(), NOON_TWELVE_HOUR).toISOString().substring(0, DATE_SIZE_LIMIT)
  //     const finalDate = new Date(getters.getEndDate.getFullYear(), getters.getEndDate.getMonth(), getters.getEndDate.getDate(), NOON_TWELVE_HOUR).toISOString().substring(0, DATE_SIZE_LIMIT)
  //     // const quickBookings = await this.$api.booking.areaOnDates(getters.getSelectedArea.id, initialDate, finalDate)
  //     // const bookingsGrouped = quickBookings.reduce(groupBySeatId, {})
  //     // commit('setQuickBookings', bookingsGrouped)
  //   }
  // },
  async loadSeats ({ commit, dispatch, getters }) {
    commit('setSeats', [])
    if (getters.getSelectedArea) {
      const seats = await this.$api.area.seats(getters.getSelectedArea.id)
      commit('setSeats', seats)
      await dispatch('loadBookings')
    }
  },
  selectSeat ({ commit, _dispatch }, seat) {
    commit('setSelectedSeat', seat)
  },
  clean ({ commit }) {
    commit('setStartDate')
    commit('setMode', 'self')
    commit('setBookings')
    commit('setSelectedSeat')
    commit('setSelectedArea')
    commit('setSelectedFloor')
  },
  async book ({ getters, dispatch, rootGetters, commit }, onBehalfOfUserID = '') {
    const initialDate = new Date(getters.getStartDate.getFullYear(), getters.getStartDate.getMonth(), getters.getStartDate.getDate(), 12).toISOString().substring(0, 10)
    const finalDate = new Date(getters.getEndDate.getFullYear(), getters.getEndDate.getMonth(), getters.getEndDate.getDate(), 12).toISOString().substring(0, 10)
    let seatIds = null
    if (!Array.isArray(getters.getSelectedSeat)) {
      seatIds = [getters.getSelectedSeat.id]
    } else {
      seatIds = getters.getSelectedSeat.flatMap(s => s.id)
    }
    const parkingToBook = rootGetters['parking/getParkings']
    let data = null
    let method = ''
    switch (getters.getMode) {
      case 'self':
        method = 'create'
        data = generatePayloadForBookingConfirmation(parkingToBook, seatIds, initialDate, finalDate, getters.getSelectedBuilding.id)
        data.onBehalfOf = false
        break
      case 'preBooks':
        data = { seatIds, initialDate, finalDate }
        method = 'createPreBooks'
        break
    }
    // TODO: Add here the logic regarding the onBehalfOf and send the user to be booked for on the API call
    return await this.$api.booking[method](data).then(() => {
      dispatch('clean')
      if (method === 'create') {
        this.$console.success(this.$dk('mainpage.bookSuccess'))
      } else if (method === 'createPreBooks') {
        this.$console.success(this.$dk('mainpage.preBookSuccess'))
      }
      dispatch('parking/cleanParkingBooks', null, { root: true })
      commit('setEndDate')
    }).catch(() => {
      commit('setBookings')
    })
  },
  async quickBook ({ getters, dispatch, rootGetters, commit }) {
    const method = 'quickbook'
    const initialDate = new Date(getters.getStartDate.getFullYear(), getters.getStartDate.getMonth(), getters.getStartDate.getDate(), 12).toISOString().substring(0, 10)
    const finalDate = new Date(getters.getEndDate.getFullYear(), getters.getEndDate.getMonth(), getters.getEndDate.getDate(), 12).toISOString().substring(0, 10)
    let data = null
    data = { initialDate, finalDate, buildingId: getters.getSelectedBuilding.id, siteId: getters.getSelectedSite.id }
    console.log(data)
    return await this.$api.booking[method](data).then(() => {
      dispatch('clean')
      this.$console.success(this.$dk('mainpage.bookSuccess'))
      // dispatch('parking/cleanParkingBooks', null, { root: true })
      commit('setEndDate')
    }).catch(() => {
      commit('setBookings')
    })
  }
}

function generatePayloadForBookingConfirmation (parkingToBook, seatIds, initialDate, finalDate, buildingId) {
  let data = {}
  if (parkingToBook.length) {
    const info = []
    info.push({ seatId: seatIds[0], initialDate, finalDate, buildingId })
    for (const book of parkingToBook) {
      if (book.authorized && book.available) {
        const date = newFormatDate(book.date)
        // todo improve consecutive dates one call
        info.push({ seatId: book.parkingLot.id, initialDate: date, finalDate: date, buildingId })
      }
    }
    data = { bookings: info, parking: true, onBehalfOf: false }
  } else {
    data = {
      bookings: [{ seatId: seatIds[0], initialDate, finalDate, buildingId }],
      parking: false,
      onBehalfOf: false
    }
  }
  data.buildingId = buildingId
  return data
}
