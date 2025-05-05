module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    // Table workspaceTypes creation
    await queryInterface.createTable('workspaceTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
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

    // New table data loading
    await queryInterface.bulkInsert('workspaceTypes', [{ status: 'Seat' }, { status: 'Parking' }], { transaction })

    // Add typeId column to tables Floors, Areas, Seats and Bookings

    await queryInterface.addColumn(
      'floors',
      'typeId',
      {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: { model: 'workspaceTypes', key: 'id' },
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'areas',
      'typeId',
      {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: { model: 'workspaceTypes', key: 'id' },
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'seats',
      'typeId',
      {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: { model: 'workspaceTypes', key: 'id' },
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'bookings',
      'typeId',
      {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: { model: 'workspaceTypes', key: 'id' },
      },
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('workspaceTypes')
  },
}
