const { returning, startDate, endDate, indexer, getId } = require('./common')
const fs = require('fs').promises

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE name = 'Rochavera'`, options)
    )[0][0].id

    const floorId = (
      await queryInterface.sequelize.query(
        `SELECT id FROM floors WHERE number = 12 and "buildingId" = ${buildingId}`,
        options
      )
    )[0][0].id

    const areaId = (
      await queryInterface.sequelize.query(`SELECT id FROM areas WHERE code = 'b2' and "floorId" = ${floorId}`, options)
    )[0][0].id

    const seatsToCreate = [{ code: 137 }, { code: 138 }]
    await queryInterface.bulkInsert(
      'seats',
      seatsToCreate.map((seat) => {
        return { code: seat.code, areaId, startDate, endDate: null }
      }),
      options
    )
    await transaction.commit()
  },

  down: async () => {},
}
