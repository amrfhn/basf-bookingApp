const reducerSites = (a, c) => {
  a[c.name] = c.id
  return a
}

const mails = {
  Morumbi: "'natalia.franco@basf.com; sueli.sousa@basf.com'",
  Argentina: "'alejandro.ocampo@basf.com; guido.a.parisi@basf.com; adrian.guevara@basf.com'",
  Colombia: "'vladimir.segura@basf.com; pedro.montoya@basf.com'",
  'HUB Berlin': "'lena.disson@basf.com; yassine.el-jed@basf.com'",
  'Canada Creekbank': "'adrien.desventes@basf.com'",
  'Costa Rica': "'diana.calvo@basf.com'",
  México: "'xavier.gutierrez@basf.com; diana.calvo@basf.com'",
  Ecuador: "'vladimir.segura@basf.com; pedro.montoya@basf.com'",
  'HUB Montevideo': "'the-future-of-work-feedback@basf.com'",
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const result = await queryInterface.sequelize.query(`select id, name from sites`)
    const sites = result[0].reduce(reducerSites, {})
    await queryInterface.addColumn('sites', 'feedbackContact', { type: Sequelize.STRING }, { transaction })
    const query = Object.entries(sites)
      .map(([k, v]) => `UPDATE sites SET "feedbackContact" = ${mails[k]} WHERE id = ${v};`)
      .join('\n')
    await queryInterface.sequelize.query(query, { transaction })
    await queryInterface.sequelize.query(`ALTER TABLE sites ALTER COLUMN "feedbackContact" SET NOT NULL`, {
      transaction,
    })
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sites', 'feedbackContact')
  },
}
