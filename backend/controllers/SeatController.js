const SeatDAO = require('../model/dao/SeatDAO')
const SeatHoodDAO = require('../model/dao/SeatHoodDAO')
const SeatOwnerDAO = require('../model/dao/SeatOwnerDAO')
const BookingController = require('../controllers/BookingController')
const MailController = require('./MailController')
const FloorDAO = require('../model/dao/FloorDAO')
const { CalendarDAO } = require('../model/dao/')
const { BookingDAO } = require('../model/dao')

module.exports = {
  async getAll(filter) {
    const seats = await SeatDAO.getAll(filter)
    for (const seat of seats) {
      const amenities = seat.seatAmenities.map((x) => ({
        ...x.amenity,
        numericValue: x.seatAmenityNumericValue ? x.seatAmenityNumericValue.value : undefined,
        booleanValue: x.seatAmenityBooleanValue ? x.seatAmenityBooleanValue.value : undefined,
        multiValue: x.seatAmenityMultiValue ? x.seatAmenityMultiValue.amenityValue.value : undefined,
      }))
      delete seat.seatAmenities
      seat.amenities = amenities.sort((a, b) => a.key.localeCompare(b.key))
    }
    return seats
  },
  async getParkingLotsWithoutSeatOwner(filter) {
    const floor = (await FloorDAO.getFloorDepthID(filter.floorId, {})).toJSON() // Se llama al FloorDAO para evitar error 'circular dependency'
    const parkingLots = []
    for (const area of floor.areas) {
      for (const seat of area.seats) {
        parkingLots.push({ id: seat.id, code: seat.code })
      }
    }
    const seatOwners = await SeatOwnerDAO.getAll({ seatIds: parkingLots.map((pl) => pl.id) })
    const seatOwnersSeatIds = await seatOwners.map((elem) => elem.seatId)
    return parkingLots.filter((elem) => seatOwnersSeatIds.indexOf(elem.id) === -1)
  },
  async getParkingLotsOwners(filter) {
    const floors = (await FloorDAO.getParking({ buildingId: filter.buildingId })).map((f) => f.toJSON())
    const ownedParkingLots = floors.flatMap((f) => {
      // si el floor no tiene area se cae
      return [[f].concat(f.areas[0].seats.filter((s) => s.seatOwners.length > 0 || s.seatPreferables.length > 0))]
    })
    return ownedParkingLots
  },
  async getParkingsByBuilding(filter) {
    return await FloorDAO.getParking({ buildingId: filter.buildingId })
  },
  async getSeatsDepthID(ids) {
    return await SeatDAO.getSeatDepthID(ids)
  },
  async getSeatQuantityByHood(filter) {
    return SeatHoodDAO.getQuantity(filter)
  },
  get: SeatDAO.get,
  create: SeatDAO.create,
  update: SeatDAO.update,
  delete: SeatDAO.delete,
  bulkCreate: SeatDAO.bulkCreate,
  bulkDelete: SeatDAO.bulkDelete,
  async updateSeats(seats) {
    const seatsIds = seats.map((s) => s.id)
    const startDate = new Date(seats[0].startDate)
    const endDate = seats[0].endDate === null ? null : new Date(seats[0].endDate)
    const data = { startDate, endDate }
    const filter = { seatId: seatsIds, startDate, endDate, userId: null, seatStatus: 'Booked' }
    const bookingsAdmin = await BookingController.getAll(filter)
    if (bookingsAdmin.length > 0) {
      await BookingDAO.bulkDelete(bookingsAdmin.map((b) => b.id))
    }
    await SeatDAO.bulkUpdate(seatsIds, data)
  },
  async updateDisableSeats(seats) {
    const seatsIds = seats.map((s) => s.id)
    const startDate = new Date(seats[0].startDate)
    const endDate = new Date(seats[0].endDate)
    let filter = {}
    if (seats[0].period) {
      filter = { seatId: seatsIds, initialDate: startDate, finalDate: endDate, seatStatus: 'Booked' }
    } else {
      filter = { seatId: seatsIds, startDate: new Date(seats[0].endDate), endDate: null, seatStatus: 'Booked' }
    }
    const bookingsToCancel = await BookingController.getAll(filter)
    if (bookingsToCancel.length > 0) {
      const bookingsIds = bookingsToCancel.map((b) => b.id)
      BookingController.cancelBooking(bookingsIds, 'Admin', filter)
    }

    if (seats[0].period) {
      const calendars = await CalendarDAO.getAll({ initialDate: startDate, finalDate: endDate })
      const toInsert = []
      for (const calendar of calendars) {
        for (const seatId of seatsIds) {
          toInsert.push({
            calendarId: calendar.id,
            seatId,
            statusId: 2,
            userId: null,
            typeId: 1,
          })
        }
      }
      await BookingDAO.bulkCreate(toInsert)
    } else {
      const data = { startDate: new Date(seats[0].startDate), endDate: new Date(seats[0].endDate) }
      await SeatDAO.bulkUpdate(seatsIds, data)
    }
  },
  async getSeatsHoods(seatsIds) {
    // FIXME avoid this for, multiple DB calls
    const seatsHoods = []
    for (const seatId of seatsIds) {
      const seatWithHood = await SeatDAO.getHoods(seatId)
      seatsHoods.push(Object.values(seatWithHood))
    }
    return seatsHoods.flat()
  },
  async updateSeatsHoods(hoodId, newSeats) {
    const hoodSeat = await SeatHoodDAO.getAll({ hoodId })
    for (const newS of newSeats) {
      SeatHoodDAO.createIfNotExist({ seatId: newS.id, hoodId }).catch((e) => {
        console.error(e)
      })
    }
    for (const oldS of hoodSeat) {
      if (!newSeats.map((s) => s.id).some((ns) => ns === oldS.seatId)) {
        await SeatHoodDAO.delete(oldS.id)
      }
    }
  },
  async updateSeatHoods(seats) {
    // FIXME - resolve this in one query, performance issue, maybe in a single transaction inside the DAO
    for (const seat of seats) {
      const seatHoods = await SeatHoodDAO.getBySeatId(seat.id)
      let hoods = seat.seatHoods
      for (const item of seatHoods) {
        if (
          hoods.some((hood) => {
            return item.hoodId === hood.hoodId
          })
        ) {
          hoods = hoods.filter((hood) => {
            return hood.hoodId !== item.hoodId
          })
        } else {
          await SeatHoodDAO.delete(item.id)
        }
      }
      for (const item of hoods) {
        await SeatHoodDAO.create({ hoodId: item.id, seatId: seat.id })
      }
    }
  },
}
