const { Brigadier, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll Brigadiers')
    const where = {}

    if (filter) {
      where[Op.and] = []

      if (filter.id) {
        where.id = filter.id
      }
      if (filter.username) {
        where.username = filter.username
      }
      if (filter.siteId) {
        where.siteId = filter.siteId
      }
    }

    return Brigadier.findAll({ attributes: ['id', 'siteId', 'username'], raw, where })
  },
  get(id) {
    console.log('Get Brigadier', id)
    return Brigadier.findByPk(id)
  },
  create(data) {
    console.log('Create Brigadier', data)
    data.username = data.username ? data.username.toLowerCase() : null
    return Brigadier.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update Brigadier', id, data)
    data.username = data.username ? data.username.toLowerCase() : null
    return Brigadier.update(data, { where: { id } }).then(() => Brigadier.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete Brigadier', id)
    return Brigadier.findByPk(id, { raw, nest }).then((u) => Brigadier.destroy({ where: { id } }).then(() => u))
  },
}
