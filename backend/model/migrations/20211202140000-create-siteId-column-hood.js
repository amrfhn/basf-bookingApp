module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const siteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'HUB Montevideo'`, {
        transaction,
      })
    )[0][0].id

    await queryInterface.sequelize.query(
      `ALTER TABLE hoods 
            ADD COLUMN "siteId" INTEGER NOT NULL DEFAULT ${siteId}, 
            ADD CONSTRAINT siteId FOREIGN KEY ("siteId")
                REFERENCES sites (id)`,
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('hoods', 'siteId')
  },
}
