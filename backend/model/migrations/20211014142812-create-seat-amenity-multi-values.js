module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seatAmenityMultiValues', {
      seatAmenityId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'seatAmenities', key: 'id' },
      },
      amenityValueId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'amenityValues', key: 'id' },
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
    await queryInterface.dropTable('seatAmenityMultiValues')
  },
}
