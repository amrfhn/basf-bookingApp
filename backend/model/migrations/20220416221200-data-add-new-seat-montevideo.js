const { returning, startDate, endDate, indexer, getId } = require('./common')
const fs = require('fs').promises

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE name = 'WTC Torre 4'`, options)
    )[0][0].id

    const floorId = (
      await queryInterface.sequelize.query(
        `SELECT id FROM floors WHERE number = 25 and "buildingId" = ${buildingId}`,
        options
      )
    )[0][0].id

    const areaId = (
      await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${floorId}`, options)
    )[0][0].id

    const seatsToCreate = [{ code: 83 }]

    const seatId = await queryInterface.bulkInsert(
      'seats',
      seatsToCreate.map((seat) => {
        return { code: seat.code, areaId, startDate, endDate: null }
      }),
      options
    )

    const userId = 'capelt'
    await queryInterface.bulkInsert('seatOwners', [{ userId, seatId: seatId[0].id }], options)

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
