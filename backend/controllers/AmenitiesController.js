const AmenitiesDAO = require('../model/dao/AmenitiesDAO')

module.exports = {
  async getAll(filter) {
    const data = await AmenitiesDAO.getAll(filter)
    return data.map(fromDAO)
  },
  get: AmenitiesDAO.get,
  async create(data) {
    const created = await AmenitiesDAO.create(toDAO(data))
    return fromDAO(created)
  },
  async createMassive(data) {
    await AmenitiesDAO.bulkCreate(data)
  },
  async update(id, data) {
    console.log(data)
    const updated = await AmenitiesDAO.update(id, toDAO(data))
    return fromDAO(updated)
  },
  deleteSeatAmenities: AmenitiesDAO.deleteSeatAmenities,
  delete: AmenitiesDAO.delete,
  massive: AmenitiesDAO.massive,
  async replicateAmenitiesForSite(sourceSiteId, targetSiteId) {
    const sourceSiteTargetAmenities = await AmenitiesDAO.getAll({ siteId: sourceSiteId })
    for (const amenity of sourceSiteTargetAmenities) {
      await this.create({
        type: 'MULTI',
        filtrable: true,
        key: amenity.dataValues.key,
        siteId: targetSiteId,
        values: [amenity.dataValues.key],
      })
    }
  },
}

function toDAO(value) {
  const current = JSON.parse(JSON.stringify(value))
  if (current.values && current.values.length) {
    current.amenityValues = current.values.map((v) => {
      return { value: v }
    })
  }
  delete current.values
  return current
}

function fromDAO(value) {
  const current = JSON.parse(JSON.stringify(value))
  if (current.type === 'MULTI') {
    current.values = current.amenityValues.map((av) => av.value)
  }
  delete current.amenityValues
  return current
}
