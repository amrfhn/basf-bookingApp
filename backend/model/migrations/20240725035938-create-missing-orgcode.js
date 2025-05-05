const { returning } = require('./common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.createTable(
      'userDetails',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        orgCode: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        userId: {
          type: Sequelize.STRING(10),
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
      },
      {
        transaction
      }
    )
    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userDetails')
  },
}
