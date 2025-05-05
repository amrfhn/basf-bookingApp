module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'sites',
          'previousAnonymizationDaysValue',
          {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: null, // initially created null so as to show the anonymizationDaysConfig has never been changed before
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'sites',
          'prevAnonDaysValueChangedDate',
          {
            type: Sequelize.DataTypes.DATEONLY,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t }
        ),
      ])
    })
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('sites', 'previousAnonymizationDaysValue', { transaction: t }),
        queryInterface.removeColumn('sites', 'prevAnonDaysValueChangedDate', { transaction: t }),
      ])
    })
  },
}
