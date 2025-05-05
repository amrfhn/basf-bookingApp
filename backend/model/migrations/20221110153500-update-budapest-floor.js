const { returning } = require('./common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const SiteId = (await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Budapest'`, options))[0][0]
      .id

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id

    // 1 - get floor
    const floorId = (
      await queryInterface.sequelize.query(`SELECT id FROM floors WHERE "buildingId" = ${buildingId}`, options)
    )[0][0].id

    await queryInterface.bulkUpdate('floors', { number: '5' }, { id: floorId }, options)
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
