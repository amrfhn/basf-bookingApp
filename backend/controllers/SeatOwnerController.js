const SeatOwner = require('../model/dao/SeatOwnerDAO')

module.exports = {
  getAll: SeatOwner.getAll,
  get: SeatOwner.get,
  getMap: SeatOwner.getMap,
  create: SeatOwner.create,
  update: SeatOwner.update,
  delete: SeatOwner.delete,
  bulkDelete: SeatOwner.bulkDelete,
}
