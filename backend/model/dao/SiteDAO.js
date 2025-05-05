const { Site, config } = require('../model')
const EventDAO = require('./EventDAO')

const { raw, nest, Op, sequelize } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll sites')
    const where = {}
    let includeDisableds = false
    if (filter) {
      where[Op.and] = []
      if (filter.name) {
        where.name = filter.name
      }
      if (filter.country) {
        where.country = filter.country
      }
      if (filter.managerRoleId) {
        where.managerRoleId = filter.managerRoleId
      }
      if (filter.adminRoleId) {
        where.adminRoleId = filter.adminRoleId
      }
      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }
      if (filter.disabled && filter.disabled === 'true') {
        includeDisableds = true
      }
    }
    if (!includeDisableds) {
      where.startDate = { [Op.lte]: new Date() }
      const val = {}
      val[Op.or] = [{ endDate: { [Op.is]: null } }, { endDate: { [Op.gte]: new Date() } }]
      where[Op.and].push(val)
    }
    const order = sequelize.col('name')
    const attributes = [
      'id',
      'name',
      'country',
      'city',
      'managerRoleId',
      'adminRoleId',
      'startDate',
      'endDate',
      'feedbackContact',
      'anonymizationDaysConfig',
      'previousAnonymizationDaysValue',
      'prevAnonDaysValueChangedDate',
      'buildingMindsID',
      'deletionDays',
    ]
    return Site.findAll({ attributes, where, order, raw, nest })
  },
  get(id) {
    console.log('Get site', id)
    return Site.findByPk(id)
  },
  create(data) {
    console.log('Create site', data)
    return Site.create(data, { raw, nest })
  },
  async update(id, username, data) {
    if (
      data.anonymizationDaysConfig !== null &&
      data.anonymizationDaysConfig !== undefined &&
      (await this.get(id)).anonymizationDaysConfig !== data.anonymizationDaysConfig
    ) {
      data.previousAnonymizationDaysValue = (await this.get(id)).anonymizationDaysConfig
      data.prevAnonDaysValueChangedDate = new Date()
      EventDAO.create({
        date: new Date(),
        userId: username,
        type: 'CHANGE_ANONYMIZATION',
        data,
      })
    }

    if (
      data.deletionDays !== null &&
      data.deletionDays !== undefined &&
      (await this.get(id)).deletionDays !== data.deletionDays
    ) {
      EventDAO.create({
        date: new Date(),
        userId: username,
        type: 'CHANGE_DELETION',
        data,
      })
    }

    console.log('Update site', id, data)
    return Site.update(data, { where: { id } }).then(() => Site.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete site', id)
    return Site.findByPk(id, { raw, nest }).then((u) => Site.destroy({ where: { id } }).then(() => u))
  },
}
