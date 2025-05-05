const { promises: fs } = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const floor0Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'OBC03' AND f.number = 0`
      )
    )[0][0].id

    const floor4Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id  = f."buildingId" WHERE b.name = 'OBC03' AND f.number = 4`
      )
    )[0][0].id
    /** * Floors ***/

    const floor0map = await fs.readFile('./model/migrations/maps/de/OBC03/0/floor0O.svg', 'utf8')
    const floor4map = await fs.readFile('./model/migrations/maps/de/OBC03/4/floor4O.svg', 'utf8')

    const floor0 = await queryInterface.bulkUpdate('areas', { map: floor0map }, { floorId: floor0Id }, { transaction })
    const floor4 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor4map },
      { floorId: floor4Id, code: 'O' },
      { transaction }
    )

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
}
