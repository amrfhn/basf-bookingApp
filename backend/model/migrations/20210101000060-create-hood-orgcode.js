module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hoodOrgCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hoodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'hoods', key: 'id' },
      },
      orgCode: {
        type: Sequelize.STRING(50),
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

    await queryInterface.addConstraint('hoodOrgCodes', {
      fields: ['orgCode', 'hoodId'],
      type: 'unique',
      name: 'hoodOrgCode',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hoodOrgCodes')
  },
}
