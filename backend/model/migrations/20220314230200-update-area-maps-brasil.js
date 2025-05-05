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

    const floor14Id = (
      await queryInterface.sequelize.query(
        `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = 14`
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

    /** * Floors Map ***/
    const floor9 = await fs.readFile('./model/migrations/maps/br/rochavera/9/areas.svg', 'utf8')
    const floor12 = await fs.readFile('./model/migrations/maps/br/rochavera/12/areas.svg', 'utf8')
    const floor14 = await fs.readFile('./model/migrations/maps/br/rochavera/14/areas.svg', 'utf8')
    const floor15 = await fs.readFile('./model/migrations/maps/br/rochavera/15/areas.svg', 'utf8')
    const floor16 = await fs.readFile('./model/migrations/maps/br/rochavera/16/areas.svg', 'utf8')
    const floor17 = await fs.readFile('./model/migrations/maps/br/rochavera/17/areas.svg', 'utf8')

    const f9 = await queryInterface.bulkUpdate('floors', { map: floor9 }, { id: floor9Id }, { transaction })
    const f12 = await queryInterface.bulkUpdate('floors', { map: floor12 }, { id: floor12Id }, { transaction })
    const f14 = await queryInterface.bulkUpdate('floors', { map: floor14 }, { id: floor14Id }, { transaction })
    const f15 = await queryInterface.bulkUpdate('floors', { map: floor15 }, { id: floor15Id }, { transaction })
    const f16 = await queryInterface.bulkUpdate('floors', { map: floor16 }, { id: floor16Id }, { transaction })
    const f17 = await queryInterface.bulkUpdate('floors', { map: floor17 }, { id: floor17Id }, { transaction })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
