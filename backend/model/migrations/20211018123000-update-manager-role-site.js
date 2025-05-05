const reducerSites = (a, c) => {
  a[c.name] = c.id
  return a
}

const roles = {
  'HUB Berlin': 11141616,
  'HUB Montevideo': 11141617,
  Argentina: 11141618,
  'Costa Rica': 11141619,
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const result = await queryInterface.sequelize.query(`select id, name from sites`)

    const sites = result[0].reduce(reducerSites, {})

    await queryInterface.addColumn('sites', 'managerRoleId', { type: Sequelize.INTEGER }, { transaction })

    const query = Object.entries(sites)
      .map(([k, v]) => `UPDATE sites SET "managerRoleId" = ${roles[k]} WHERE id = ${v};`)
      .join('\n')

    await queryInterface.sequelize.query(query, { transaction })

    await queryInterface.sequelize.query(`ALTER TABLE sites ALTER COLUMN "managerRoleId" SET NOT NULL`, { transaction })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sites', 'managerRoleId')
  },
}
