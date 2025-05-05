const { returning, endDate } = require('./common')
const fs = require('fs').promises

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const SiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Canada Creekbank'`, options)
    )[0][0].id

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id
    
    const floorId = (
      await queryInterface.sequelize.query(`SELECT id FROM floors WHERE "buildingId" = ${buildingId}`, options)
    )[0][0].id

    const map = await fs.readFile('./model/migrations/maps/cn/creekbank/BASF_Missasagua_v06.svg', 'utf8')

    const areaId = (
      await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${floorId}`, options)
    )[0][0].id

    await queryInterface.bulkUpdate('areas', { buildingMindsID: floorId, map }, { id: areaId }, options)

    await transaction.commit()
  },
  down: async () => {},
}
