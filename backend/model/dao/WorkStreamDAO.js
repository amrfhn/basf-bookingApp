const { WorkStream, WorkStreamOrgCode, config } = require('../model')
const { DataTypes } = require('../config')
const { raw, nest, Op } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll WorkStream')

    const where = {}
    const include = [{ model: WorkStreamOrgCode, attributes: ['id', 'orgCode'] }]
    const attributes = ['id', 'name', 'siteId']

    if (filter) {
      where[Op.and] = []

      if (filter.id) {
        where.id = filter.id
      }

      if (filter.name) {
        where.name = filter.name
      }

      if (filter.siteId) {
        where.siteId = filter.siteId
      }

      if (filter.orgCode) {
        where['$workStreamOrgCodes.orgCode$'] = { [Op.eq]: filter.orgCode }
      }
    }
    return WorkStream.findAll({ attributes, where, include }).then((r) => JSON.parse(JSON.stringify(r)))
  },

  get(id) {
    console.log('Get WorkStream', id)
    return WorkStream.findByPk(id)
  },

  async create(data) {
    console.log('Create WorkStream', data)

    const include = [{ model: WorkStreamOrgCode, attributes: ['id', 'orgCode'] }]
    const attributes = ['id', 'name', 'siteId']

    const transaction = await WorkStreamOrgCode.sequelize.transaction()
    const created = await WorkStream.create(data, { transaction })

    for (const workStreamOrgCode of data.workStreamOrgCodes) {
      await WorkStreamOrgCode.create({ ...workStreamOrgCode, workStreamId: created.id }, { transaction })
    }

    const result = await WorkStream.findByPk(created.id, { include, attributes, transaction })
    await transaction.commit()
    return result
  },

  async update(id, data) {
    console.log('Update WorkStream', id, data)
    const include = [{ model: WorkStreamOrgCode, attributes: ['id', 'orgCode'] }]
    const attributes = ['id', 'name', 'siteId']
    const transaction = await WorkStreamOrgCode.sequelize.transaction()
    const db = await WorkStream.findByPk(id, { include, attributes, transaction })
    const dicc = {}
    for (const oc of db.workStreamOrgCodes) {
      dicc[oc.orgCode] = true
    }
    for (const oc of data.workStreamOrgCodes) {
      if (dicc[oc.orgCode]) {
        delete dicc[oc.orgCode]
      } else {
        dicc[oc.orgCode] = false
      }
    }
    for (const orgCode in dicc) {
      if (dicc[orgCode]) {
        await WorkStreamOrgCode.destroy({ where: { workStreamId: id, orgCode }, transaction })
      } else {
        await WorkStreamOrgCode.create({ orgCode, workStreamId: id }, { transaction })
      }
    }
    await WorkStream.update(data, { where: { id } })
    const result = await WorkStream.findByPk(id, { include, attributes, transaction })
    await transaction.commit()
    return result
  },

  async delete(id) {
    console.log('Delete WorkStream', id)
    const transaction = await WorkStreamOrgCode.sequelize.transaction()
    const include = [{ model: WorkStreamOrgCode, attributes: ['id', 'orgCode'] }]
    const attributes = ['id', 'name', 'siteId']
    const elem = await WorkStream.findByPk(id, { include, attributes, transaction })
    await WorkStreamOrgCode.destroy({ where: { workStreamId: id }, transaction })
    await WorkStream.destroy({ where: { id: id }, transaction })
    await transaction.commit()
    return elem
  },
}
