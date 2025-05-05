module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('floors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      map: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      buildingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'buildings', key: 'id' },
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

    await queryInterface.addConstraint('floors', {
      fields: ['number', 'buildingId'],
      type: 'unique',
      name: 'numberInBuilding',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('floors')
  },
}
