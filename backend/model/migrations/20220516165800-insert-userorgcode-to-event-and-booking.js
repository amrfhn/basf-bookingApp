module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'bookings',
          'userOrgCode',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: '', // 10 years
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'events',
          'userOrgCode',
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: '', // 10 years
            allowNull: false,
          },
          { transaction: t }
        ),
      ])
    })
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('bookings', 'userOrgCode', { transaction: t }),
        queryInterface.removeColumn('events', 'userOrgCode', { transaction: t }),
      ])
    })
  },
}
