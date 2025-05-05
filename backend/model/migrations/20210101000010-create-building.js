module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('buildings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(50),
      },
      extras: {
        type: Sequelize.TEXT,
      },
      reservationDays: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      managerReservationDays: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      cancellationHours: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      reservationCancelationDays: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      timeDifference: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      siteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sites', key: 'id' },
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

    await queryInterface.addConstraint('buildings', {
      fields: ['name', 'siteId'],
      type: 'unique',
      name: 'nameInSite',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('buildings')
  },
}
