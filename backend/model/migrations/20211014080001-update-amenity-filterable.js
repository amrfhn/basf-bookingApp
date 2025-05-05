module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('amenities', 'filterable', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('amenities', 'filterable')
  },
}
