module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('floors', 'floors_buildingId_fkey')
    await queryInterface.addConstraint('floors', {
      type: 'foreign key',
      fields: ['buildingId'],
      name: 'floors_buildingId_fkey',
      references: { table: 'buildings', field: 'id' },
      onDelete: 'cascade',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('floors', 'floors_buildingId_fkey')
    await queryInterface.addConstraint('floors', {
      type: 'foreign key',
      fields: ['buildingId'],
      name: 'floors_buildingId_fkey',
      references: { table: 'buildings', field: 'id' },
    })
  },
}
