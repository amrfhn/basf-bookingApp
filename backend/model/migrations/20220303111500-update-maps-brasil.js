const { promises: fs } = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const floor9Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = 9`
      )
    )[0][0].id

    const floor12Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = 12`
      )
    )[0][0].id

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

    const floor17Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = 17`
      )
    )[0][0].id

    /** * Floors ***/
    const floor9Bmap = await fs.readFile('./model/migrations/maps/br/rochavera/9/b.svg', 'utf8')
    const floor12B2map = await fs.readFile('./model/migrations/maps/br/rochavera/12/b2.svg', 'utf8')
    const floor12C1map = await fs.readFile('./model/migrations/maps/br/rochavera/12/c1.svg', 'utf8')
    const floor15B2map = await fs.readFile('./model/migrations/maps/br/rochavera/15/b2.svg', 'utf8')
    const floor15C2map = await fs.readFile('./model/migrations/maps/br/rochavera/15/c2.svg', 'utf8')
    const floor16B1map = await fs.readFile('./model/migrations/maps/br/rochavera/16/b1.svg', 'utf8')
    const floor16B2map = await fs.readFile('./model/migrations/maps/br/rochavera/16/b2.svg', 'utf8')
    const floor17A2map = await fs.readFile('./model/migrations/maps/br/rochavera/17/a2.svg', 'utf8')
    const floor17B1map = await fs.readFile('./model/migrations/maps/br/rochavera/17/b1.svg', 'utf8')

    const floor9b = await queryInterface.bulkUpdate(
      'areas',
      { map: floor9Bmap },
      { floorId: floor9Id, code: 'b' },
      { transaction }
    )
    const floor12B2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor12B2map },
      { floorId: floor12Id, code: 'b2' },
      { transaction }
    )
    const floor12C1 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor12C1map },
      { floorId: floor12Id, code: 'c1' },
      { transaction }
    )
    const floor15B2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor15B2map },
      { floorId: floor15Id, code: 'b2' },
      { transaction }
    )
    const floor15C2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor15C2map },
      { floorId: floor15Id, code: 'c2' },
      { transaction }
    )
    const floor16B1 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor16B1map },
      { floorId: floor16Id, code: 'b1' },
      { transaction }
    )
    const floor16B2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor16B2map },
      { floorId: floor16Id, code: 'b2' },
      { transaction }
    )
    const floor17A2 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor17A2map },
      { floorId: floor17Id, code: 'a2' },
      { transaction }
    )
    const floor17B1 = await queryInterface.bulkUpdate(
      'areas',
      { map: floor17B1map },
      { floorId: floor17Id, code: 'b1' },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
