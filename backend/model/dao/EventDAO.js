const { Event, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  Op,
  getAll(filter) {
    console.log('GetAll Event', filter.payload)
    const where = {}
    if (filter) {
      where[Op.and] = []
      if (filter.type) {
        where.type = filter.type
      }
      if (filter.userId) {
        where.userId = filter.userId
      }
      if (filter.notAnonymizedNorNullUserId) {
        where.userId = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
      }
      if (filter.initialDate && filter.finalDate) {
        where.date = { [Op.between]: [filter.initialDate, filter.finalDate] }
      }
      if (filter.payload) {
        where.payload = filter.payload
      }
      if (filter.anonymizationDate) {
        where.date = { [Op.lt]: filter.anonymizationDate }
      }
      if (filter.deletionDate) {
        where.date = { [Op.lt]: filter.deletionDate }
      }
      if (filter.notAnonymizedUsers) {
        const userORFilter = {}
        userORFilter.userId = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
        userORFilter.payload = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
        where[Op.or] = userORFilter
      }
    }
    const attributes = ['id', 'date', 'userId', 'type', 'payload', 'userOrgCode']
    return Event.findAll({ attributes, where, raw, nest })
  },
  get(id) {
    console.log('Get Event', id)
    return Event.findByPk(id)
  },
  create(data) {
    console.log('Creating Event', data.type, '||', data.userId)
    return Event.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update Event', id, data)
    return Event.update(data, { where: { id } }).then(() => Event.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete Event', id)
    return Event.findByPk(id, { raw, nest }).then((u) => Event.destroy({ where: { id } }).then(() => u))
  },
}
