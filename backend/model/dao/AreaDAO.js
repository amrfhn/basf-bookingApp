const { Area, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll areas')
    const where = {}
    let includeDisableds = false

    if (filter) {
      where[Op.and] = []

      if (filter.floorId) {
        where.floorId = filter.floorId
      }

      if (filter.code) {
        where.code = filter.code
      }

      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }

      if (filter.disabled && filter.disabled === 'true') {
        includeDisableds = true
      }

      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }
    }
    if (!includeDisableds) {
      where.startDate = { [Op.lte]: new Date() }
      const val = {}
      val[Op.or] = [{ endDate: { [Op.is]: null } }, { endDate: { [Op.gte]: new Date() } }]
      where[Op.and].push(val)
    }

    return Area.findAll({
      attributes: ['id', 'code', 'floorId', 'startDate', 'endDate', 'buildingMindsID'],
      raw,
      nest,
      where,
    })
  },
  get(id) {
    console.log('Get area', id)
    return Area.findByPk(id, { attributes: ['id', 'code', 'floorId', 'startDate', 'endDate', 'buildingMindsID'] })
  },
  getMap(id) {
    console.log('Get map area', id)
    return Area.findByPk(id, { attributes: ['map'] }).then((a) => a.map)
  },
  create(data) {
    console.log('Create area', data)
    return Area.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update area', id, data)
    return Area.update(data, { where: { id } }).then(() => Area.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete area', id)
    return Area.findByPk(id, { raw, nest }).then((u) => Area.destroy({ where: { id } }).then(() => u))
  },
  async bulkDelete(ids) {
    console.log('Deleting areas', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const areas = await Area.findAll({ raw, nest, where })
    const areasIds = areas.map((b) => b.id)
    where.id = { [Op.in]: areasIds }
    return Area.destroy({ raw, nest, where })
  },
}
