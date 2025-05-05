module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seatOwners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      seatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'seats', key: 'id' },
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

    // todo: check if 0..1 or 0..n
    await queryInterface.addConstraint('seatOwners', {
      fields: ['userId', 'seatId'],
      type: 'unique',
      name: 'seatOwner',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seatOwners')
  },
}
