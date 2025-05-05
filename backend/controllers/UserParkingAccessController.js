const UserParkingAccessDAO = require('../model/dao/UserParkingAccessDAO')
const SeatOwnerController = require('./SeatOwnerController')
const SeatPreferableController = require('./SeatPreferableController')
const MailController = require('./MailController')
const BuildingController = require('./BuildingController')
const FloorController = require('./FloorController')
const LDAPClient = require('basf-gtu-utils/client/LDAP')
const BookingController = require('./BookingController')

module.exports = {
  get: UserParkingAccessDAO.get,
  delete: UserParkingAccessDAO.delete,
  async update(id, body) {
    if (body.updatedByUser) {
      await UserParkingAccessDAO.update(id, body)
      if (body.carBrand) {
        await MailController.notifyVehicleCreation(body)
      }
    } else if (body.updatedByAdmin) {
      await UserParkingAccessDAO.update(id, {
        startDate: body.startDate,
        carBrand: body.carBrand ? body.carBrand : null,
        carModel: body.carModel ? body.carModel : null,
        carLicensePlate: body.carLicensePlate ? body.carLicensePlate : null,
        // accessCard: body.accessCard ? body.accessCard : null,
      })
      if (body.startDate) {
        await MailController.notifyUserParkingAccess(body)
      }
      if (!body.startDate) {
        const accesses = (await UserParkingAccessDAO.getAll({ userId: body.userId })).filter(
          (a) => a.startDate !== null
        )
        if (accesses.length === 0) {
          const bookingsId = (await BookingController.getAll({ userId: body.userId, typeId: 2, future: true })).map(
            (b) => b.id
          )
          const filter = { bookingStatus: 'Booked' }
          await BookingController.cancelBooking(bookingsId, 'Admin', filter)
        }
      }
    }
  },
  async getAll(filter) {
    const parkingAccess = await UserParkingAccessDAO.getAll(filter)
    const users = parkingAccess.map((pa) => pa.userId)
    const usersLDAP = await LDAPClient.getUsers(users)

    return parkingAccess.map((pa) => {
      const u = JSON.parse(JSON.stringify(pa))
      u.user = usersLDAP[u.userId]
      return u
    })
  },
  async updateByEdit(id, body) {
    const userSeatOId = await SeatOwnerController.getAll({ userId: body.userId, seatId: body.parkingLotId })
    if (body.carBrand !== undefined) {
      await UserParkingAccessDAO.update(id, {
        endDate: body.endDate,
        carBrand: body.carBrand ? body.carBrand : null,
        carModel: body.carModel ? body.carModel : null,
        carLicensePlate: body.carLicensePlate ? body.carLicensePlate : null,
        // accessCard: body.accessCard ? body.accessCard : null,
      })
    } else {
      await UserParkingAccessDAO.update(id, {
        endDate: body.endDate,
      })
    }
    const userSeatPId = await SeatPreferableController.getAll({ userId: body.userId, seatId: body.parkingLotId })
    const seatPId = await SeatPreferableController.getAll({ userId: body.userId })
    const seatOId = await SeatOwnerController.getAll({ userId: body.userId })
    if (body.parkingLotOwner) {
      if (userSeatOId.length) {
        await SeatOwnerController.update(userSeatOId[0].id, { userId: body.userId, seatId: body.parkingLotId })
      } else {
        await SeatOwnerController.create({ userId: body.userId, seatId: body.parkingLotId })
      }
      // All SeatPreferables associated to this seatOwners must be removed
      const seatPreferableSeatId = await SeatPreferableController.getAll({ seatId: body.parkingLotId })
      if (seatPreferableSeatId) await SeatPreferableController.bulkDelete(seatPreferableSeatId.map((sp) => sp.id))
    } else if (body.parkingLotId) {
      // A SeatPreferable must be set to the user
      if (seatOId.length) {
        await SeatOwnerController.delete(seatOId[0].id)
      }
      if (userSeatPId.length) {
        await SeatPreferableController.update(userSeatPId[0].id, { userId: body.userId, seatId: body.parkingLotId })
      } else {
        await SeatPreferableController.create({ userId: body.userId, seatId: body.parkingLotId })
      }
    }
    if (seatOId.length) {
      await SeatOwnerController.delete(seatOId[0].id)
    }
  },
  async create(body) {
    await UserParkingAccessDAO.create({
      userId: body.userId,
      endDate: body.endDate,
      siteId: body.siteId,
      carBrand: body.carBrand ? body.carBrand : null,
      carModel: body.carModel ? body.carModel : null,
      carLicensePlate: body.carLicensePlate ? body.carLicensePlate : null,
      // accessCard: body.accessCard ? body.accessCard : null,
    })
    if (body.parkingLotOwner) {
      await SeatOwnerController.create({ userId: body.userId, seatId: body.parkingLotId })
      // All SeatPreferables associated to this seatOwners must be removed
      const seatPreferableSeatId = await SeatPreferableController.getAll({ seatId: body.parkingLotId })
      if (seatPreferableSeatId) await SeatPreferableController.bulkDelete(seatPreferableSeatId.map((sp) => sp.id))
    } else if (body.parkingLotId) {
      // A SeatPreferable must be set to the user
      await SeatPreferableController.create({ userId: body.userId, seatId: body.parkingLotId })
    }
    await MailController.notifyUserParkingCreation(body.userMail)
  },
  async createByUser(body) {
    await UserParkingAccessDAO.create({
      userId: body.userId,
      startDate: body.startDate,
      endDate: body.endDate,
      carBrand: body.carBrand,
      carModel: body.carModel,
      carLicensePlate: body.carLicensePlate,
      siteId: body.siteId,
    })
    await MailController.notifyVehicleCreation(body)
  },
  async getUserInfo(userId, buildingId) {
    userId = userId.toLowerCase()
    const user = await UserParkingAccessDAO.getAll({ userId })
    if (user.length === 0) return { userRegisteredForParkingAccess: false }
    const res = { userRegisteredForParkingAccess: true }
    res.startDate = getEarliestStartDate(user) // this assignment has to be done this way because if the user has more than one car registered, the date to take into account has to be the earliest
    if (res.startDate === null)
      // User not authorized to book parking lot yet
      return { userRegisteredForParkingAccess: false }
    res.siteParkingAccess = user[0].siteId
    res.endDate = getLastEndDate(user) // this assignment has to be done this way because if the user has more than one car registered, the date to take into account has to be the lastest
    res.seatOwnerInfo = await isUserParkingLotSeatOwner(userId, buildingId) // returns seatId of the parking lot if it has one, null if not
    if (res.seatOwnerInfo) {
      res.seatPrefereable = null
      return res
    }
    res.userId = userId
    res.seatPrefereable = await isUserParkingLotSeatPreferable(userId) // returns seatId of the parking lot if it has one, null if not
    return res
  },
  async deleteUserInfo(body) {
    await UserParkingAccessDAO.delete(body.id)
    const userAccesses = (await UserParkingAccessDAO.getAll({ userId: body.userId })).filter(
      (a) => a.startDate !== null
    )
    const seatOwnerId = (
      await SeatOwnerController.getAll({
        userId: body.userId,
        seatId: body.seatId,
      })
    ).map((so) => so.id)
    const seatPreferableId = (
      await SeatPreferableController.getAll({
        userId: body.userId,
        seatId: body.seatId,
      })
    ).map((sp) => sp.id)
    const bookingsId = (
      await BookingController.getAll({
        userId: body.userId,
        typeId: 2,
        future: true,
      })
    ).map((b) => b.id)
    if (seatOwnerId.length) {
      await SeatOwnerController.bulkDelete(seatOwnerId)
    }
    if (seatPreferableId.length) {
      await SeatPreferableController.bulkDelete(seatPreferableId)
    }
    if (bookingsId.length && userAccesses.length === 0) {
      const filter = { bookingStatus: 'Booked' }
      await BookingController.cancelBooking(bookingsId, 'Admin', filter)
    }
  },
}

function getEarliestStartDate(user) {
  if (user.length === 1) return user[0].startDate
  let currentDate = user[0].startDate
  for (let i = 1; i < user.length; i++) {
    if ((!currentDate && user[i].startDate) || (currentDate && user[i].startDate && currentDate > user[i].startDate))
      currentDate = user[i].startDate
  }
  return currentDate
}

function getLastEndDate(user) {
  if (user.length === 1) return user[0].endDate
  let currentDate = user[0].endDate
  for (let i = 1; i < user.length; i++) {
    if ((!currentDate && user[i].endDate) || (currentDate && user[i].endDate && currentDate > user[i].endDate))
      currentDate = user[i].endDate
  }
  return currentDate
}

async function isUserParkingLotSeatOwner(userId, buildingId) {
  const ownedSeats = await SeatOwnerController.getAll({ userId })
  if (ownedSeats.length === 0) return null
  const seatIds = ownedSeats.map((s) => s.seatId)
  const res = await require('./SeatController').getAll({ ids: seatIds, typeId: 2 })
  if (res.length === 0) return null
  const isParkingLotInBuilding = await BuildingController.isSeatInBuilding(buildingId, res[0]) // validation that the seat is in the building
  if (!isParkingLotInBuilding) return null
  const floorInfo = await FloorController.getParking({ seatId: res[0].id })
  return { seat: { id: res[0].id, code: res[0].code }, floor: floorInfo[0].dataValues }
}

async function isUserParkingLotSeatPreferable(userId) {
  const preferredSeat = await SeatPreferableController.getAll({ userId })
  if (preferredSeat.length === 0) return null
  const res = await require('./SeatController').getAll({ id: preferredSeat[0].seatId, typeId: 2 })
  if (res.length === 0) return null
  const floorInfo = await FloorController.getParking({ seatId: res[0].id })
  return { seat: { seatId: preferredSeat[0].seatId, code: res[0].code }, floor: floorInfo[0].dataValues }
}
