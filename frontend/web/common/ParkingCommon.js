import { newFormatDate } from '../../mobile/common/Utils'
import { getRangeOfDates, sortByStrAndNumFloorOrSeat } from './Utils'

export async function loadParkings ({ buildingId, initialDate, finalDate, user }, context) {
  const rangeInitial = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate(), 12)
  const rangeFinal = new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate(), 12)
  const parkings = getRangeOfDates(rangeInitial, rangeFinal).map((date) => {
    return {
      date: date.date,
      floor: null,
      parkingLot: null,
      floors: [],
      parkingLots: [],
      seatOwner: user.seatOwnerInfo,
      booked: false,
      available: true,
      authorized: false
    }
  })

  let parkingFloors = await context.$api.floor.getParking({ buildingId })
  parkingFloors = parkingFloors.filter(f => f.areas.length)
  parkingFloors = parkingFloors.filter(f => f.areas[0].seats.length)

  parkingFloors.forEach((floor) => {
    floor.areas[0].seats = floor.areas[0].seats.filter(s => s.seatOwners.length ? s.seatOwners.find(ow => ow.userId !== user.userId) : !s.seatOwners.length)
  })
  const parkingLots = parkingFloors.flatMap(floor => floor.areas[0].seats.map(seat => ({
    id: seat.id,
    code: seat.code
  })))

  const p = parkingLots.map(seat => seat.id)

  const bookings = await context.$api.booking.get({
    seatIds: p,
    initialDate,
    finalDate,
    typeId: 2
  })

  parkings.forEach((parking) => {
    let possibleParkingFloors = JSON.parse(JSON.stringify(parkingFloors))

    const hasEndDate = user.endDate != null
    if (newFormatDate(parking.date) >= user.startDate && !hasEndDate) {
      parking.authorized = true
    }
    if (newFormatDate(parking.date) >= user.startDate && newFormatDate(parking.date) <= user.endDate) {
      parking.authorized = true
    }

    parkingLots.forEach((seat) => {
      const bookingsForSeat = bookings.filter(booking => booking.seat.id === seat.id && booking.calendar.date === newFormatDate(parking.date))

      if (bookingsForSeat.length) {
        bookingsForSeat.forEach((b) => {
          if (b.userId === user.userId) {
            parking.booked = 1
          }
        })
        possibleParkingFloors.forEach((floor) => {
          let seats = floor.areas[0].seats
          if (seats.filter(s => s.id === seat.id).length) {
            floor.areas[0].seats = seats.filter(s => s.id !== seat.id)
            seats = seats.filter(s => s.id !== seat.id)
            if (!seats.length) {
              possibleParkingFloors = possibleParkingFloors.filter(f => f.id !== floor.id)
            }
          }
        })
      }
    })

    if (!possibleParkingFloors.length) {
      parking.available = false
    } else {
      parking.floors = possibleParkingFloors.map(floor => ({
        id: floor.id,
        number: floor.number,
        map: floor.map,
        possibleParkingLots: floor.areas[0].seats.map(seat => ({ id: seat.id, code: seat.code }))
      }))

      if (parking.floors.length === 1) {
        parking.floor = parking.floors[0]
        loadParkingLots(parking)
      }
    }
  })

  const preSelect = getPreSelect(user)
  if (preSelect) {
    parkings.forEach((parking) => {
      parking.floors.forEach((floor) => {
        const seat = floor.possibleParkingLots.find(s => s.id === preSelect.preferSeat.id)

        if (seat) {
          parking.parkingLot = { ...preSelect.preferSeat }
          parking.floor = { ...preSelect.preferFloor, possibleParkingLots: floor.possibleParkingLots }
          parking.parkingLots = floor.possibleParkingLots
        }
      })
    })
  }
  return parkings
}

function getPreSelect (parkingInfo) {
  let preferFloor = null
  let preferSeat = null
  if (parkingInfo.seatOwnerInfo) {
    preferFloor = {
      id: parkingInfo.seatOwnerInfo.floor.id,
      number: parkingInfo.seatOwnerInfo.floor.number,
      map: parkingInfo.seatOwnerInfo.floor.map
    }
    preferSeat = { id: parkingInfo.seatOwnerInfo.seat.id, code: parkingInfo.seatOwnerInfo.seat.code }
    return { preferFloor, preferSeat }
  }
  if (parkingInfo.seatPrefereable) {
    preferFloor = {
      id: parkingInfo.seatPrefereable.floor.id,
      number: parkingInfo.seatPrefereable.floor.number,
      map: parkingInfo.seatPrefereable.floor.map
    }
    preferSeat = { id: parkingInfo.seatPrefereable.seat.seatId, code: parkingInfo.seatPrefereable.seat.code }
    return { preferFloor, preferSeat }
  }
  return null
}

export function loadParkingLots (parking) {
  const selectedFloor = parking.floors.filter(f => f.id === parking.floor.id)
  parking.parkingLot = null
  const possibleParkingLots = selectedFloor[0].possibleParkingLots
  parking.parkingLots = sortByStrAndNumFloorOrSeat(possibleParkingLots, false)
}

export function userAllowedForParkingReservation (selectedStartDate, selectedEndDate, user, siteId) {
  let isAllowed = false
  const hasEndDate = user.endDate != null
  if (user.userRegisteredForParkingAccess && user.siteParkingAccess === siteId) {
    if (selectedStartDate >= user.startDate && !hasEndDate) {
      isAllowed = true
    }
    if (selectedStartDate >= user.startDate && selectedEndDate <= user.endDate) {
      isAllowed = true
    }
  }
  return isAllowed
}

export async function loadParkingsForAdmin ({ buildingId, initialDate, finalDate }, context) {
  const rangeInitial = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate(), 12)
  const rangeFinal = new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate(), 12)
  const parkings = getRangeOfDates(rangeInitial, rangeFinal).map((date) => {
    return {
      date: date.date,
      floor: null,
      parkingLot: null,
      floors: [],
      parkingLots: [],
      available: true
    }
  })

  let parkingFloors = await context.$api.floor.getParking({ buildingId })
  parkingFloors = parkingFloors.filter(f => f.areas.length)
  parkingFloors = parkingFloors.filter(f => f.areas[0].seats.length)

  const parkingLots = parkingFloors.flatMap(floor => floor.areas[0].seats.map(seat => ({
    id: seat.id,
    code: seat.code
  })))
  const bookings = await context.$api.booking.get({
    seatIds: parkingLots.map(seat => seat.id),
    initialDate,
    finalDate,
    typeId: 2
  })

  parkings.forEach((parking) => {
    let possibleParkingFloors = JSON.parse(JSON.stringify(parkingFloors))

    parkingLots.forEach((seat) => {
      const bookingsForSeat = bookings.filter(booking => booking.seat.id === seat.id && booking.calendar.date === newFormatDate(parking.date))

      if (bookingsForSeat.length) {
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
    })
    if (!possibleParkingFloors.length) {
      parking.available = false
    } else {
      parking.floors = possibleParkingFloors.map(floor => ({
        id: floor.id,
        number: floor.number,
        map: floor.map,
        possibleParkingLots: floor.areas[0].seats.map(seat => ({ id: seat.id, code: seat.code }))
      }))
    }
  })
  return parkings
}
