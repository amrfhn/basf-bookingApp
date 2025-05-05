module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'sites',
          'anonymizationDaysConfig',
          {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 3650, // 10 years
            allowNull: false,
          },
          { transaction: t }
        ),
      ])
    })
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('sites', 'anonymizationDaysConfig', { transaction: t })])
    })
  },
}
