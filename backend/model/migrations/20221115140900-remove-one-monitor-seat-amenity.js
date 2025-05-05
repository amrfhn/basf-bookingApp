const { returning } = require('./common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const amenityIds = (
      await queryInterface.sequelize.query(`SELECT id FROM amenities WHERE key = '1 Monitor'`, options)
    )[0]

    for (const amenityId of amenityIds) {
      await queryInterface.bulkDelete('seatAmenities', { amenityId: amenityId.id }, { transaction }).catch((e) => {
        console.log(e)
      })
    }

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
