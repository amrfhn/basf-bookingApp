module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction()

        const siteIdBerlin = (
            await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'HUB Berlin'`, {
                transaction,
            })
        )[0][0].id

        const siteIdMexico = (
            await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'México'`, {
                transaction,
            })
        )[0][0].id

        await queryInterface.addColumn('amenities', 'siteId', { type: Sequelize.INTEGER }, { transaction })

        const queryMexico = `UPDATE amenities SET "siteId" = ${siteIdMexico} WHERE key = 'desk-mx'`
        const queryBerlin = `UPDATE amenities SET "siteId" = ${siteIdBerlin} WHERE key IN ('monitors', 'height', 'dock', 'desk')`

        await queryInterface.sequelize.query(queryMexico, { transaction })
        await queryInterface.sequelize.query(queryBerlin, { transaction })

        await queryInterface.sequelize.query(`ALTER TABLE amenities ALTER COLUMN "siteId" SET NOT NULL`, { transaction })

        await queryInterface.sequelize.query(
            `ALTER TABLE amenities ADD CONSTRAINT siteId FOREIGN KEY ("siteId") REFERENCES sites (id)`, { transaction }
        )

        await transaction.commit()
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('amenities', 'siteId')
    },
}
