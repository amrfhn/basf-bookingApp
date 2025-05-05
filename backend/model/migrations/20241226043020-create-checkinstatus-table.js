module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'checkInStatuses',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.STRING(50),
          unique: true,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('checkInStatuses')
  },
}
