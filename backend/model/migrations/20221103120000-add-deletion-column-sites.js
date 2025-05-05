module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'sites',
      'deletionDays',
      {
        type: Sequelize.INTEGER,
        defaultValue: 3650, // 10 years
        allowNull: false,
      },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sites', 'deletionDays')
  },
}
