const SiteDAO = require('../model/dao/SiteDAO')
const AmenitiesController = require('./AmenitiesController')

module.exports = {
  getAll: SiteDAO.getAll,
  get: SiteDAO.get,
  update: SiteDAO.update,
  delete: SiteDAO.delete,

  /** * This method receives the amenityKey
   * creates it for all the BM sites ***/
  async replicateAmenityForAllSites(amenityKey) {
    const allSites = await this.getAll({})
    const BMSites = allSites.filter((s) => s.buildingMindsID)
    for (const site of BMSites) {
      await AmenitiesController.create({
        type: 'MULTI',
        filtrable: true,
        key: amenityKey,
        siteId: site.id,
        values: [amenityKey],
      })
    }
  },
  async create(data) {
    const siteId = (await SiteDAO.create(data)).toJSON().id
    if (data.buildingMindsID) {
      await replicateBMAmenitiesForSite(siteId)
    }
  },
}

async function replicateBMAmenitiesForSite(siteId) {
  const allSites = await SiteDAO.getAll({})
  const BMSite = getFirstBMSiteFound(allSites)
  if (BMSite) {
    await AmenitiesController.replicateAmenitiesForSite(BMSite.id, siteId)
  }
}

function getFirstBMSiteFound(allSites) {
  try {
    return allSites.filter((s) => s.buildingMindsID)[0]
  } catch (e) {
    console.log('For some reason, no BM site could be found. Exception found: ', e)
    return null
  }
}
