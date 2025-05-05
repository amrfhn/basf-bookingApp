module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seatHoods', {
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
      hoodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'hoods', key: 'id' },
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

    await queryInterface.addConstraint('seatHoods', {
      fields: ['seatId', 'hoodId'],
      type: 'unique',
      name: 'seatHood',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seatHoods')
  },
}
