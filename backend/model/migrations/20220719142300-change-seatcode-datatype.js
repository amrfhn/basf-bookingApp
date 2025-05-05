module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    await queryInterface.sequelize.query(`drop view "seatCascade";`)
    await queryInterface.changeColumn(
      'seats',
      'code',
      {
        type: Sequelize.STRING(70),
      },
      {
        transaction,
      }
    )
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    await queryInterface.changeColumn(
      'seats',
      'code',
      {
        type: Sequelize.INTEGER,
      },
      {
        transaction,
      }
    )
  },
}
