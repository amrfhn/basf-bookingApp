module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TYPE enum_amenities_type ADD VALUE 'MULTI'`)
  },
  down: async (queryInterface, Sequelize) => {},
}
