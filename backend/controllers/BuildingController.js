const BuildingDAO = require('../model/dao/BuildingDAO')
const AreaController = require('./AreaController')
const FloorController = require('./FloorController')

module.exports = {
  getAll: BuildingDAO.getAll,
  get: BuildingDAO.get,
  create: BuildingDAO.create,
  update: BuildingDAO.update,
  delete: BuildingDAO.delete,

  async getQSeatsPerFloor(query) {
    const filters = {
      building: query.id,
      initialDate: query.initialDate,
      finalDate: query.finalDate,
    }
    return BuildingDAO.getQSeatsPerFloor(query.id, filters)
  },
  async isSeatInBuilding(buildingId, seat) {
    const area = await AreaController.get(seat.areaId)
    const floor = await FloorController.get(area.dataValues.floorId)
    return floor.dataValues.buildingId === Number(buildingId)
  },
}
