const fs = require('fs').promises

const returning = true

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const buildingId = (await queryInterface.sequelize.query(`SELECT id FROM "buildings" WHERE name = 'OBC04'`))[0][0]
      .id

    /** * Floors ***/
    const floorMap = {
      floor1: await fs.readFile('./model/migrations/maps/de/OBC04/1/areas.svg', 'utf8'),
      floor4: await fs.readFile('./model/migrations/maps/de/OBC04/4/areas.svg', 'utf8'),
      floor5: await fs.readFile('./model/migrations/maps/de/OBC04/5/areas.svg', 'utf8'),
    }

    const floor1 = await queryInterface.bulkUpdate(
      'floors',
      { map: floorMap.floor1 },
      { number: 1, buildingId: buildingId },
      { transaction, returning }
    )

    const floor4 = await queryInterface.bulkUpdate(
      'floors',
      { map: floorMap.floor4 },
      { number: 4, buildingId: buildingId },
      { transaction, returning }
    )

    const floor5 = await queryInterface.bulkUpdate(
      'floors',
      { map: floorMap.floor5 },
      { number: 5, buildingId: buildingId },
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
