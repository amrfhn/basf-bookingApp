import { getRangeOfDates } from '../common/Utils'

const DATE_SIZE_LIMIT = 10
const NOON_TWELVE_HOUR = 12

export const state = () => ({
  _parkings: [],
  _userParkingInfo: null,
  _parkingBooks: [],
  _selectedParkingFloor: null,
  _selectedParkingLot: null,
  _parkingFloors: [],
  _parkingLots: [],
  _userParkingAccesses: null,
  _specificParkingBooks: [],
  _parkingCkeck: true,
  _carBrand: null,
  _carModel: null,
  _carLicensePlate: null,
  _accessCard: null

})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setUserParkingInfo (state, userParkingInfo) {
    state._userParkingInfo = userParkingInfo
  },
  setParkings (state, parkings) {
    state._parkings = parkings
  },
  setParkingBooks (state, parkingBooks) {
    state._parkingBooks = parkingBooks
  },
  setSpecificParkingBooks (state, parkingBooks) {
    state._specificParkingBooks = parkingBooks
  },
  setSelectedParkingFloor (state, selectedParkingFloor) {
    state._selectedParkingFloor = selectedParkingFloor
  },
  setSelectedParkingLot (state, selectedParkingLot) {
    state._selectedParkingLot = selectedParkingLot
  },
  setParkingFloors (state, parkingFloors) {
    state._parkingFloors = parkingFloors
  },
  setParkingLots (state, parkingLots) {
    state._parkingLots = parkingLots
  },
  setUserParkingAccesses (state, userParkingAccesses) {
    state._userParkingAccesses = userParkingAccesses
  },
  setParkingCheck (state, parkingCheck) {
    state._parkingCkeck = parkingCheck
  },
  setCarBrand (state, carBrand) {
    state._carBrand = carBrand
  },
  setCarModel (state, carModel) {
    state._carModel = carModel
  },
  setCarLicensePlate (state, carLicensePlate) {
    state._carLicensePlate = carLicensePlate
  },
  setAccessCard (state, accessCard) {
    state._accessCard = accessCard
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getUserParkingInfo (state) {
    return state._userParkingInfo || null
  },
  getSelectedParkingFloor (state) {
    return state._selectedParkingFloor || null
  },
  getSelectedParkingLot (state) {
    return state._selectedParkingLot || null
  },
  getParkingFloors (state) {
    return state._parkingFloors || []
  },
  getParkingLots (state) {
    return state._parkingLots || []
  },
  getParkings (state) {
    return state._parkings || []
  },
  getParkingBooks (state) {
    return state._parkingBooks || []
  },
  getSpecificParkingBooks (state) {
    return state._specificParkingBooks || []
  },
  getUserParkingAccesses (state) {
    return state._userParkingAccesses || []
  },
  getParkingCheck (state) {
    return state._parkingCkeck
  },
  getCarBrand (state) {
    return state._carBrand || null
  },
  getCarModel (state) {
    return state._carModel || null
  },
  getCarLicensePlate (state) {
    return state._carLicensePlate || null
  },
  getAccessCard (state) {
    return state._accessCard || null
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  updateCarBrand ({ commit }, carBrand) {
    commit('setCarBrand', carBrand)
  },
  updateCarModel ({ commit }, carModel) {
    commit('setCarModel', carModel)
  },
  updateCarLicensePlate ({ commit }, carLicensePlate) {
    commit('setCarLicensePlate', carLicensePlate)
  },
  updateAccessCard ({ commit }, accessCard) {
    commit('setAccessCard', accessCard)
  },
  updateParking ({ commit }, parking) {
    commit('setParkings', parking)
  },
  async loadUserParkingInfo ({ commit, getters, rootGetters }, building) {
    if (building !== undefined) {
      commit('setUserParkingInfo', null)
      const userId = rootGetters['auth/getUsername']
      const userParkingInfo = await this.$api.userParkingAccess.getUserInfo(userId, building.id)
      commit('setUserParkingInfo', userParkingInfo)
    }
  },
  async loadUserParkingAccesses ({ commit, rootGetters }) {
    commit('setUserParkingAccesses', null)
    const userId = rootGetters['auth/getUsername']
    const userParkingAccess = await this.$api.userParkingAccess.get({ userId })
    userParkingAccess.hasAccess = false
    for (const u of userParkingAccess) {
      if (u.startDate) {
        userParkingAccess.hasAccess = true
      }
    }
    commit('setUserParkingAccesses', userParkingAccess)
  },
  async selectParkingFloor ({ commit, dispatch }, parkingFloor) {
    commit('setSelectedParkingFloor', parkingFloor)
    await dispatch('loadParkingLots')
  },
  selectParkingLot ({ commit, _dispatch }, parkingLot) {
    commit('setSelectedParkingLot', parkingLot)
  },
  async loadParkingBooks ({ commit, getters, dispatch }, { buildingId, initialDate, finalDate, user }) {
    commit('setParkingCheck', true)
    // parkings
    const rangeInitial = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate(), 12)
    const rangeFinal = new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate(), 12)
    let parkings = getRangeOfDates(rangeInitial, rangeFinal)
    parkings = parkings.map((date) => { return { date: date.date, floor: null, parkingLot: null, floors: [], parkingLots: [], seatOwner: false, authorized: true, available: true } })
    // seatOwner & seatPreferable
    const parkingInfo = user
    const preSelect = getPreSelect(parkingInfo)
    const parkingInfoStartDate = new Date(parkingInfo.startDate).toISOString().slice(0, 10)
    const parkingInfoEndDate = new Date(parkingInfo.endDate).toISOString().slice(0, 10)
    const parkingFloors = await this.$api.floor.getParking({ buildingId })
    let parkingLots = []
    parkingFloors.map((f) => {
      return f.areas[0].seats
    }).forEach((seats) => {
      parkingLots = [...parkingLots].concat([...seats.map((s) => { return { id: s.id, code: s.code } })])
    })
    for (const parking of parkings) {
      const date = parking.date.toISOString().slice(0, 10)
      const availableAccess = date >= parkingInfoStartDate && (parkingInfo.endDate ? date <= parkingInfoEndDate : true)
      if (availableAccess) {
        let possibleParkingFloors = JSON.parse(JSON.stringify(parkingFloors))
        for (const seat of parkingLots) {
          const bookings = await this.$api.booking.get({ seatId: seat.id, initialDate: parking.date, finalDate: parking.date, typeId: 2 })
          if (bookings.length) {
            possibleParkingFloors.forEach((floor) => {
              let seats = floor.areas[0].seats
              if (seats.filter(s => s.id === seat.id)) {
                floor.areas[0].seats = seats.filter(s => s.id !== seat.id)
                seats = seats.filter(s => s.id !== seat.id)
                if (!seats.length) {
                  possibleParkingFloors = possibleParkingFloors.filter(f => f.id !== floor.id)
                }
              }
            })
          }
        }
        if (!possibleParkingFloors.length) {
          parking.available = false
        } else {
          parking.floors = possibleParkingFloors.map((f) => { return { id: f.id, number: f.number, possibleParkingLots: f.areas[0].seats } })
        }
        if (parkingInfo.seatOwnerInfo) {
          parking.seatOwner = true
        }
        if (preSelect) {
          possibleParkingFloors.forEach((floor) => {
            const seats = floor.areas[0].seats
            const seatIsAvailable = seats.filter(s => s.id === preSelect.preferSeat.id)
            if (seatIsAvailable.length) {
              parking.parkingLots = seats.map((s) => { return { id: s.id, code: s.code } })
              parking.parkingLot = preSelect.preferSeat
              parking.floor = { ...preSelect.preferFloor, possibleParkingLots: floor.areas[0].seats }
            }
          })
        }
      } else {
        parking.authorized = false
      }
    }
    return parkings
  },
  async confirmParkings ({ commit, getters }) {
    const bookings = []
    for (const parking of getters.getParkings) {
      try {
        if (parking.authorized && parking.available) {
          const booking = await this.$api.booking.get({ seatId: parking.parkingLot.id, initialDate: new Date(parking.date.getFullYear(), parking.date.getMonth(), parking.date.getDate(), NOON_TWELVE_HOUR).toISOString().substring(0, DATE_SIZE_LIMIT), finalDate: new Date(parking.date.getFullYear(), parking.date.getMonth(), parking.date.getDate(), NOON_TWELVE_HOUR).toISOString().substring(0, DATE_SIZE_LIMIT) })
          bookings.push(booking[0])
        }
      } catch (e) {
        console.log(e)
      }
    }
    commit('setParkingBooks', bookings)
  },
  updateParkingCheck ({ commit, getters }, _value) {
    commit('setParkingCheck', !getters.getParkingCheck)
  },
  cleanParkingBooks ({ commit }) {
    commit('setParkingBooks', [])
  }
}

function getPreSelect (parkingInfo) {
  let preferFloor = null
  let preferSeat = null
  if (parkingInfo.seatOwnerInfo) {
    preferFloor = { id: parkingInfo.seatOwnerInfo.floor.id, number: parkingInfo.seatOwnerInfo.floor.number }
    preferSeat = { id: parkingInfo.seatOwnerInfo.seat.id, code: parkingInfo.seatOwnerInfo.seat.code }
    return { preferFloor, preferSeat }
  }
  if (parkingInfo.seatPrefereable) {
    preferFloor = { id: parkingInfo.seatPrefereable.floor.id, number: parkingInfo.seatPrefereable.floor.number }
    preferSeat = { id: parkingInfo.seatPrefereable.seat.seatId, code: parkingInfo.seatPrefereable.seat.code }
    return { preferFloor, preferSeat }
  }
  return null
}

// function isParkingAccessAvailable (date, startDate, parkingEndDate, endDate) {
//   return date >= startDate && (parkingEndDate ? date <= endDate : true)
// }

// async function parkingAvailableAccessProcessing (buildingId, parking, parkingInfo, preSelect, date, api) {
//   const parkingBookings = await api.booking.get({
//     typeId: 2,
//     buildingId,
//     seatStatus: 'Available',
//     initialDate: parking.date,
//     finalDate: parking.date
//   })
//   const parkingFloors = await api.floor.getParking({ buildingId })
//   let possibleParkingFloors = parkingBookings.map(b => b.seat.area.floor)
//   possibleParkingFloors = Array.from(new Set(possibleParkingFloors.map(f => f.id)))
//   possibleParkingFloors = parkingFloors.filter(({ id }) => possibleParkingFloors.includes(id))
//   const selectFloors = possibleParkingFloors.map((f) => { return { id: f.id, number: f.number } })
//   if (selectFloors.length) {
//     parking.floors = selectFloors
//   } else {
//     parking.available = false
//   }
//   if (parkingInfo.seatOwnerInfo) {
//     parking.seatOwner = true
//   }
//   if (preSelect) {
//     await processParkingLotPreSelection(parkingBookings, date, preSelect, parking, parkingInfo, api)
//   }
// }
//
// async function processParkingLotPreSelection (parkingBookings, date, preSelect, parking, parkingInfo, api) {
//   const bookingExist = parkingBookings.filter(b => (b.calendar.date === date && b.seat.id === preSelect.preferSeat.id)).length
//   if (bookingExist) {
//     parking.floor = preSelect.preferFloor
//     // filter the parkingLots with only possible bookings
//     const parkingLots = await api.seat.getParkingLotsWithoutSeatOwner({ floorId: preSelect.preferFloor.id })
//     const possibleParkingLots = []
//     for (const seat of parkingLots) {
//       const seatExist = parkingBookings.filter(b => (b.calendar.date === parking.date && b.seat.id === seat.id)) ? seat.id : null
//       if (seatExist !== null) {
//         possibleParkingLots.push(seat)
//       }
//     }
//     parking.parkingLots = possibleParkingLots
//     parking.parkingLot = preSelect.preferSeat
//   } else if (parkingInfo.seatOwnerInfo || !parkingBookings.filter(b => (b.calendar.date === date)).length) {
//     parking.available = false
//   }
// }
