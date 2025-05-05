module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('areas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      map: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      floorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'floors', key: 'id' },
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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

    await queryInterface.addConstraint('areas', {
      fields: ['code', 'floorId'],
      type: 'unique',
      name: 'areaInFloor',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('areas')
  },
}
