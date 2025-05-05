const { returning, endDate } = require('./common')
const canadaData = require('./data/202211141328-canada-creek.json')

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const SiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Mississauga, 5025 Creekbank'`, options)
    )[0][0].id

    /** * Sites ***/
    const sites = await queryInterface.bulkUpdate('sites', { name: 'Canada Creekbank' }, { id: SiteId }, options)

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id

    // 1 - get floor
    const floorId = (
      await queryInterface.sequelize.query(`SELECT id FROM floors WHERE "buildingId" = ${buildingId}`, options)
    )[0][0].id

    /** * Floors ***/
    const floors = await queryInterface.bulkUpdate('floors', { number: '2' }, { id: floorId }, options)

    const areaId = (
      await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${floorId}`, options)
    )[0][0].id
    /** seats */
    for (let i = 0; i < canadaData.length; i += 1) {
      const line = canadaData[i]
      try {
        await queryInterface.bulkUpdate(
          'seats',
          { endDate: line.workspace_bookable === true ? null : endDate },
          { areaId: areaId, code: line.workspace_name },
          options
        )
      } catch (error) {
        console.log(error)
      }
    }
    await transaction.commit()
  },
  down: async () => {},
}
