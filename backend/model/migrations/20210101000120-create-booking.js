module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'seats', key: 'id' },
      },
      calendarId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'calendars', key: 'id' },
      },
      reserverUserId: {
        type: Sequelize.STRING(10),
      },
      userId: {
        type: Sequelize.STRING(10),
      },
      externalUserId: {
        type: Sequelize.INTEGER,
        references: { model: 'externalUsers', key: 'id' },
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bookingStatuses', key: 'id' },
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

    await queryInterface.addConstraint('bookings', {
      fields: ['seatId', 'calendarId'],
      type: 'unique',
      name: 'seatCalendar',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bookings')
  },
}
