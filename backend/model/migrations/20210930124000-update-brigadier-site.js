module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const result = await queryInterface.sequelize.query(`select id from sites where country='Uruguay'`)
    const siteId = result[0][0].id
    await queryInterface.addColumn(
      'brigadiers',
      'siteId',
      {
        type: Sequelize.INTEGER,
        references: { model: 'sites', key: 'id' },
      },
      { transaction }
    )
    await queryInterface.sequelize.query(`UPDATE brigadiers SET "siteId" = '${siteId}'`, { transaction })

    await queryInterface.sequelize.query(`ALTER TABLE brigadiers ALTER COLUMN "siteId" SET NOT NULL`, { transaction })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('brigadiers', 'siteId')
  },
}
