const reducerSites = (a, c) => {
  a[c.name] = c.id
  return a
}

const roles = {
  'HUB Berlin': 11170910,
  'HUB Montevideo': 11170911,
  Argentina: 11170912,
  'Costa Rica': 11170913,
  México: 11170914,
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const result = await queryInterface.sequelize.query(`select id, name from sites`)

    const sites = result[0].reduce(reducerSites, {})

    await queryInterface.addColumn('sites', 'adminRoleId', { type: Sequelize.INTEGER }, { transaction })

    const query = Object.entries(sites)
      .map(([k, v]) => `UPDATE sites SET "adminRoleId" = ${roles[k]} WHERE id = ${v};`)
      .join('\n')

    await queryInterface.sequelize.query(query, { transaction })

    await queryInterface.sequelize.query(`ALTER TABLE sites ALTER COLUMN "adminRoleId" SET NOT NULL`, { transaction })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sites', 'adminRoleId')
  },
}
