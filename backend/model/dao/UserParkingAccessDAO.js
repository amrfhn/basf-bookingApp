const { UserParkingAccess, config } = require('../model')
const { raw, nest, Op, sequelize } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll userParkingAccess')
    const where = {}
    if (filter) {
      where[Op.and] = []
      if (filter.userId) {
        where.userId = filter.userId
      }
      if (filter.startDate || filter.startDate === null) {
        where.startDate = { [Op.eq]: filter.startDate }
      }
      if (filter.endDate || filter.endDate === null) {
        where.endDate = { [Op.eq]: filter.endDate }
      }
      if (filter.carBrand) {
        where.carBrand = filter.carBrand
      }
      if (filter.carModel) {
        where.carModel = filter.carModel
      }
      if (filter.carLicensePlate) {
        where.carLicensePlate = filter.carLicensePlate
      }
      // if (filter.accessCard) {
      //   where.accessCard = filter.accessCard
      // }
      if (filter.siteId) {
        where.siteId = filter.siteId
      }
    }
    const order = sequelize.col('userId')
    const attributes = [
      'id',
      'userId',
      'startDate',
      'endDate',
      'carBrand',
      'carModel',
      'carLicensePlate',
      'siteId',
      // 'accessCard',
    ]
    return UserParkingAccess.findAll({ attributes, where, order, raw, nest })
  },
  get(id) {
    console.log('Get userParkingAccess', id)
    return UserParkingAccess.findByPk(id)
  },
  create(data) {
    console.log('Create userParkingAccess', data)
    return UserParkingAccess.create(data, { raw, nest })
  },
  async update(id, data) {
    console.log('Update userParkingAccess', id, data)
    return UserParkingAccess.update(data, { where: { id } }).then(() => UserParkingAccess.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete userParkingAccess', id)
    return UserParkingAccess.findByPk(id, { raw, nest }).then((u) =>
      UserParkingAccess.destroy({ where: { id } }).then(() => u)
    )
  },
}
