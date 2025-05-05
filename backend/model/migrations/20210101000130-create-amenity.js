module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('amenities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      en_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      es_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      de_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('NUMERIC', 'BOOLEAN'),
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
    await queryInterface.dropTable('amenities')
  },
}
