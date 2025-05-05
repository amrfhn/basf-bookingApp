const { HoodOrgCode, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  async getAll(filter) {
    console.log('GetAll HoodOrgCodes')
    const where = {}

    if (filter) {
      if (filter.orgCode) {
        where.orgCode = filter.orgCode
      }
      if (filter.hoodId) {
        where.hoodId = filter.hoodId
      }
    }

    return HoodOrgCode.findAll({ where, raw, nest })
  },
  get(id) {
    console.log('Get HoodOrgCodes', id)
    return HoodOrgCode.findByPk(id)
  },
  create(data) {
    console.log('Create HoodOrgCodes', data)
    return HoodOrgCode.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update HoodOrgCodes', id, data)
    return HoodOrgCode.update(data, { where: { id } }).then(() => HoodOrgCode.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete HoodOrgCodes', id)
    return HoodOrgCode.findByPk(id, { raw, nest }).then((u) => HoodOrgCode.destroy({ where: { id } }).then(() => u))
  },
  getByHoodId(hoodId) {
    console.log('Get orgCode by hood', hoodId)
    return HoodOrgCode.findAll({ where: { hoodId: hoodId }, raw })
  },
  getHoodsByOrgCode(orgCode) {
    console.log('Get all hoods that have this Org Code', orgCode)
    return HoodOrgCode.findAll({ where: { orgCode: orgCode }, raw })
  },
  batchDelete(filter) {
    const where = {}
    if (filter.hoodId) {
      where.hoodId = filter.hoodId
    }
    return HoodOrgCode.destroy({ where })
  },
}
