module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workStreamOrgCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orgCode: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      workStreamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'workStreams', key: 'id' },
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

    await queryInterface.addConstraint('workStreamOrgCodes', {
      fields: ['orgCode', 'workStreamId'],
      type: 'unique',
      name: 'workStreamOrgCode',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('workStreamOrgCodes')
  },
}
