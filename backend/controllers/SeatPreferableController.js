const SeatPreferable = require('../model/dao/SeatPreferableDAO')

module.exports = {
  getAll: SeatPreferable.getAll,
  get: SeatPreferable.get,
  getMap: SeatPreferable.getMap,
  create: SeatPreferable.create,
  update: SeatPreferable.update,
  delete: SeatPreferable.delete,
  bulkDelete: SeatPreferable.bulkDelete,
}
