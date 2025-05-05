module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seatAmenityNumericValues', {
      seatAmenityId: {
        type: Sequelize.SMALLINT,
        primaryKey: true,
        references: { model: 'seatAmenities', key: 'id' },
      },
      value: {
        type: Sequelize.INTEGER,
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
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seatAmenityNumericValues')
  },
}
