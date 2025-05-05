module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const hood = await queryInterface.sequelize.query(`SELECT id FROM hoods where name = 'People Services US & CA';`, {
      transaction,
    })
    const hoodId = hood[0][0].id
    await queryInterface.sequelize.query(
      `INSERT INTO "hoodOrgCodes" ("hoodId", "orgCode", "createdAt", "updatedAt")
        VALUES (${hoodId}, 'GBW/SHV-4', current_date, current_date);`,
      { transaction }
    )
    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    await queryInterface.sequelize.query(`DELETE FROM "hoodOrgCodes" WHERE "orgCode" = 'GBW/SHV-4';`, { transaction })
    await transaction.commit()
  },
}
