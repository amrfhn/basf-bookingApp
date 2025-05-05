module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'sites',
      'buildingMindsID',
      {
        type: Sequelize.STRING(50),
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'buildings',
      'buildingMindsID',
      {
        type: Sequelize.STRING(50),
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'floors',
      'buildingMindsID',
      {
        type: Sequelize.STRING(50),
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'areas',
      'buildingMindsID',
      {
        type: Sequelize.STRING(50),
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'hoods',
      'buildingMindsID',
      {
        type: Sequelize.STRING(50),
      },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sites', 'buildingMindsID')
    await queryInterface.removeColumn('buildings', 'buildingMindsID')
    await queryInterface.removeColumn('floors', 'buildingMindsID')
    await queryInterface.removeColumn('areas', 'buildingMindsID')
    await queryInterface.removeColumn('hoods', 'buildingMindsID')
  },
}
