const AreaDAO = require('../model/dao/AreaDAO')

module.exports = {
  getAll: AreaDAO.getAll,
  get: AreaDAO.get,
  getMap: AreaDAO.getMap,
  create: AreaDAO.create,
  update: AreaDAO.update,
  delete: AreaDAO.delete,
  bulkDelete: AreaDAO.bulkDelete,
}
