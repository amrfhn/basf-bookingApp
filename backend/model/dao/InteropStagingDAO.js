const { InteropStaging, config } = require('../model')
const { raw, nest, Op, sequelize } = config
const { getCurrentUnixTimestamp } = require('../../common/Utils')

module.exports = {
  getAll(filter) {
    console.log('GetAll InteropStaging table data')
    const where = {}
    if (filter) {
      where[Op.and] = []
      if (filter.tenSecFromNowTimestamp) {
        where.eventTimestamp = { [Op.lte]: getCurrentUnixTimestamp() - 10 } // ten seconds
      }
      const order = sequelize.col('eventSchema')
      const attributes = ['id', 'eventSchema', 'eventSchemaInstance', 'eventTimestamp']
      return InteropStaging.findAll({ attributes, where, order, raw, nest })
    }
    return InteropStaging.findAll({ raw, nest })
  },
  get(id) {
    console.log('Get specific interop staging: ', id)
    return InteropStaging.findByPk(id)
  },
  create(data) {
    console.log('Create interop staging', data)
    return InteropStaging.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update interop staging', id, data)
    return InteropStaging.update(data, { where: { id } }).then(() => InteropStaging.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete interop staging', id)
    return InteropStaging.findByPk(id, { raw, nest }).then((u) =>
      InteropStaging.destroy({ where: { id } }).then(() => u)
    )
  },
  async bulkDelete(ids) {
    console.log('Deleting rows in InteropStaging table: ', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const interopStagings = await InteropStaging.findAll({ raw, nest, where })
    const interopStagingIds = interopStagings.map((b) => b.id)
    where.id = { [Op.in]: interopStagingIds }
    return InteropStaging.destroy({ raw, nest, where })
  },
}
