const HoodDAO = require('../model/dao/HoodDAO')
const SeatHoodDAO = require('../model/dao/SeatHoodDAO')
const HoodOrgCodeDAO = require('../model/dao/HoodOrgCodeDAO')
const LDAPClient = require('basf-gtu-utils/client/LDAP')

module.exports = {
  getAll: HoodDAO.getAll,
  get: HoodDAO.get,
  create: HoodDAO.create,
  update: HoodDAO.update,
  getOrgCodes: HoodDAO.getOrgCodes,
  async delete(id) {
    await SeatHoodDAO.batchDelete({ hoodId: id })
    await HoodOrgCodeDAO.batchDelete({ hoodId: id })
    await HoodDAO.delete(id)
  },
  async getLocations(id) {
    return HoodDAO.getLocationsByHood(id)
  },
  async removeOrgCodes(id, body) {
    for (const item of body) {
      const hoodOrgCodeId = await HoodOrgCodeDAO.getAll({ hoodId: id, orgCode: item })
      HoodOrgCodeDAO.delete(hoodOrgCodeId[0].id)
    }
  },
  async addOrgCodes(id, body) {
    body.forEach((orgCode) => {
      return HoodOrgCodeDAO.create({ hoodId: id, orgCode: orgCode })
    })
  },
  validateOrgCode(name) {
    return LDAPClient.validateOrgCode(name)
  },
}
