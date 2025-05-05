const WorkStreamDAO = require('../model/dao/WorkStreamDAO')

module.exports = {
  async getAll(filter) {
    const data = await WorkStreamDAO.getAll(filter)
    return data.map(fromDAO)
  },
  get: WorkStreamDAO.get,
  async create(data) {
    const created = await WorkStreamDAO.create(toDAO(data))
    return fromDAO(created)
  },
  async update(id, data) {
    const updated = await WorkStreamDAO.update(id, toDAO(data))
    return fromDAO(updated)
  },
  delete: WorkStreamDAO.delete,
}

function toDAO(workStream) {
  if (workStream.orgCodes && workStream.orgCodes.length) {
    workStream.workStreamOrgCodes = workStream.orgCodes.map((orgCode) => {
      return { orgCode }
    })
  }
  return {
    id: workStream.id,
    name: workStream.name,
    siteId: workStream.siteId,
    workStreamOrgCodes: workStream.workStreamOrgCodes,
  }
}

function fromDAO(workStream) {
  if (workStream.workStreamOrgCodes && workStream.workStreamOrgCodes.length) {
    workStream.orgCodes = workStream.workStreamOrgCodes.map((oc) => oc.orgCode)
  }
  return {
    id: workStream.id,
    name: workStream.name,
    siteId: workStream.siteId,
    orgCodes: workStream.orgCodes,
  }
}
