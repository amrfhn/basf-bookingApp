module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.removeColumn('floors', 'image', { transaction })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'floors',
      'image',
      {
        type: Sequelize.DataTypes.BLOB,
      },
      { transaction }
    )

    await transaction.commit()
  },
}
