module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'userParkingAccesses',
      'accessCard',
      {
        type: Sequelize.STRING(70),
      },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('userParkingAccesses', 'accessCard')
  },
}
