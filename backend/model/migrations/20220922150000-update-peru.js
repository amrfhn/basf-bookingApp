const { returning, startDate } = require('./common')
const fs = require('fs').promises
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE name = 'Callao'`, options)
    )[0][0].id

    const floorId = (
      await queryInterface.sequelize.query(
        `SELECT id FROM floors WHERE number = '2' and "buildingId" = ${buildingId}`,
        options
      )
    )[0][0].id

    const areaId = (
      await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${floorId}`, options)
    )[0][0].id

    const seatsToCreate = [{ code: '35' }]

    await queryInterface.bulkInsert(
      'seats',
      seatsToCreate.map((seat) => {
        return { code: seat.code, areaId, startDate, endDate: null }
      }),
      options
    )
    const map = await fs.readFile('./model/migrations/maps/pe/callao/2.svg', 'utf8')
    queryInterface.bulkUpdate('areas', { map }, { id: areaId }, { options })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
