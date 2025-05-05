module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `UPDATE "hoods" h SET "siteId" = (SELECT id FROM "sites" WHERE name = 'Colombia')  WHERE h."name" in ('Piso 1', 'Piso 2', 'Piso 3')`
    )
  },
  down: async () => {},
}
