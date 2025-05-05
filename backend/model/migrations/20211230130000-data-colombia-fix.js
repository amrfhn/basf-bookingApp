const { returning } = require('./common')

const fs = require('fs').promises

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const buildingId = (await queryInterface.sequelize.query(`SELECT id FROM "buildings" WHERE name = 'Morato'`))[0][0]
      .id

    const floorId = (
      await queryInterface.sequelize.query(`SELECT id FROM "floors" WHERE "buildingId" = ${buildingId} AND number = 1`)
    )[0][0].id

    const areaId = (await queryInterface.sequelize.query(`SELECT id FROM "areas" WHERE "floorId" = ${floorId}`))[0][0]
      .id

    await queryInterface.bulkUpdate(
      'areas',
      { map: await fs.readFile('./model/migrations/maps/col/morato/1.svg', 'utf8') },
      { id: areaId },
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
