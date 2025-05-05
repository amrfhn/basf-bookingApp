module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'userParkingAccesses',
      'siteId',
      {
        type: Sequelize.INTEGER,
      },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('userParkingAccesses', 'siteId')
  },
}
