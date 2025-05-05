const returning = true
const workStream = 'Supply Chain'
const orgCode = 'GBC/OG-CM'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const qsq = async (q) => (await queryInterface.sequelize.query(q, options))[0]

    const siteId = (await qsq(`SELECT id FROM sites WHERE country = 'Uruguay'`))[0].id
    const wsId = (await qsq(`SELECT id FROM "workStreams" WHERE name = '${workStream}' AND "siteId" = ${siteId}`))[0].id
    await queryInterface.bulkInsert('workStreamOrgCodes', [{ orgCode, workStreamId: wsId }], options)

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
