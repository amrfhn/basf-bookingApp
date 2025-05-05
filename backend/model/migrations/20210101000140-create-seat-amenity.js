module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seatAmenities', {
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
      amenityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'amenities', key: 'id' },
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

    await queryInterface.addConstraint('seatAmenities', {
      fields: ['seatId', 'amenityId'],
      type: 'unique',
      name: 'seatAmenity',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seatAmenities')
  },
}
