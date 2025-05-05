module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'seats',
      'buildingMindsID',
      {
        type: Sequelize.STRING(50),
      },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('seats', 'buildingMindsID')
  },
}
