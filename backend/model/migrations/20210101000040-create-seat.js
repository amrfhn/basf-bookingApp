module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      areaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'areas', key: 'id' },
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

    // await queryInterface.addConstraint('seats', {
    //   fields: ['code', 'areaId'],
    //   type: 'unique',
    //   name: 'seatInArea',
    // })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seats')
  },
}
