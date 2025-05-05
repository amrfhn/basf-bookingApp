

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    /** * Monitors Amenity ***/
    await queryInterface.bulkDelete('events', { type: 'LOGIN' }, { transaction }).catch((e) => {
      console.log(e)
    })
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
