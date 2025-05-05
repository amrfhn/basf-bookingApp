module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('interopStagings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      eventSchema: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      eventSchemaInstance: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      eventTimestamp: {
        allowNull: false,
        type: Sequelize.DataTypes.BIGINT,
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('interopStagings')
  },
}
