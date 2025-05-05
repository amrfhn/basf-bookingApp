const FloorDAO = require('../model/dao/FloorDAO')
const AreaController = require('./AreaController')
const SeatPreferableController = require('./SeatPreferableController')
const SeatOwnerController = require('./SeatOwnerController')
const { getCurrentDateAsStringYYYYMMDD } = require('../common/Utils')

module.exports = {
  getAll: FloorDAO.getAll,
  get: FloorDAO.get,
  getMap: FloorDAO.getMap,
  create: FloorDAO.create,
  getParking: FloorDAO.getParking,
  delete: FloorDAO.delete,
  update: FloorDAO.update,
  getFloorDepthID: FloorDAO.getFloorDepthID,
  async createParking(data) {
    const parkingLots = []
    const floorId = (await FloorDAO.create(data)).toJSON().id
    const areaId = (
      await AreaController.create({
        floorId: floorId,
        code: '-',
        map: '-',
        startDate: data.startDate,
        typeId: data.typeId,
      })
    ).toJSON().id
    data.parkingLots.forEach((pl) =>
      parkingLots.push({ code: pl, areaId, startDate: data.startDate, typeId: data.typeId })
    )
    await require('./SeatController').bulkCreate(parkingLots)
  },
  async deleteParking(data) {
    const floorId = data
    const floor = (await FloorDAO.getFloorDepthID(floorId, {})).toJSON()
    const seatData = {}
    seatData.seatPIds = []
    seatData.seatOIds = []
    seatData.bookingIds = []
    seatData.seatIds = []
    const areaIds = []
    for (const area of floor.areas) {
      for (const seat of area.seats) {
        seat.seatPreferables.forEach((sp) => seatData.seatPIds.push(sp.id))
        seat.seatOwners.forEach((so) => seatData.seatOIds.push(so.id))
        seat.bookings.forEach((b) => seatData.bookingIds.push(b.id))
        seatData.seatIds.push(seat.id)
      }
      areaIds.push(area.id)
    }
    await this.deleteParkingLot(seatData)
    await AreaController.bulkDelete(areaIds)
    await FloorDAO.delete(floorId)
  },
  async updateParking(id, data) {
    await FloorDAO.update(id, data)
    // Add here update of the map in the area (it will be consumed from Azure)
    // si el floor no tiene area no la esta creando tampoco cuando crea el floor solo
    const areaId = data.areas[0].id
    const parkingLotCodesFromEdit = data.parkingLots
    const parkingLotsFromDB = await require('./SeatController').getAll({ areaId })
    const parkingLotCodesFromDB = [...parkingLotsFromDB.map((p) => p.code)]
    // new Added parkingLots
    const addedParkingLots = parkingLotCodesFromEdit.filter((p) => !parkingLotCodesFromDB.includes(p))
    const parkingLotsToAdd = []
    if (addedParkingLots.length > 0) {
      addedParkingLots.forEach((elem) =>
        parkingLotsToAdd.push({
          code: elem.toString(),
          areaId,
          startDate: getCurrentDateAsStringYYYYMMDD(10),
          typeId: 2,
        })
      )
      await require('./SeatController').bulkCreate(parkingLotsToAdd)
    }
    // Remove parkingLots
    const removedParkingLots = parkingLotCodesFromDB.filter((p) => !parkingLotCodesFromEdit.includes(p))
    if (removedParkingLots.length > 0) {
      const parkingLotId = []
      for (const parking of removedParkingLots) {
        const parkingId = parkingLotsFromDB.filter((seat) => seat.code === parking).map((seat) => seat.id)
        parkingLotId.push(parkingId[0])
      }
      const seats = await require('./SeatController').getSeatsDepthID(parkingLotId)
      const seatData = {}
      seatData.seatPIds = []
      seatData.seatOIds = []
      seatData.bookingIds = []
      seatData.seatIds = []
      for (const seat of seats) {
        seat.seatPreferables.forEach((sp) => seatData.seatPIds.push(sp.id))
        seat.seatOwners.forEach((so) => seatData.seatOIds.push(so.id))
        seat.bookings.forEach((b) => seatData.bookingIds.push(b.id))
        seatData.seatIds.push(seat.id)
      }
      await this.deleteParkingLot(seatData)
    }
  },
  async deleteParkingLot(data) {
    await SeatPreferableController.bulkDelete(data.seatPIds)
    await SeatOwnerController.bulkDelete(data.seatOIds)
    await require('./BookingController').bulkDelete(data.bookingIds)
    await require('./SeatController').bulkDelete(data.seatIds)
  },
}
