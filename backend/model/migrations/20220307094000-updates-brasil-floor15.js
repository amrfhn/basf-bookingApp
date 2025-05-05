const { promises: fs } = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const floor15Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = 15`
      )
    )[0][0].id

    const floor16Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = 16`
      )
    )[0][0].id
    /** * Floors ***/

    const floor15C1map = await fs.readFile('./model/migrations/maps/br/rochavera/15/c1.svg', 'utf8')
    const floor15C2map = await fs.readFile('./model/migrations/maps/br/rochavera/15/c2.svg', 'utf8')
    const floor16B2map = await fs.readFile('./model/migrations/maps/br/rochavera/16/b2.svg', 'utf8')

    const floor15c1 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor15C1map },
      { floorId: floor15Id, code: 'c1' },
      { transaction }
    )
    const floor15c2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor15C2map },
      { floorId: floor15Id, code: 'c2' },
      { transaction }
    )
    const floor16b2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor16B2map },
      { floorId: floor16Id, code: 'b2' },
      { transaction }
    )

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
}
