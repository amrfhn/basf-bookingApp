module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('areas', 'areas_floorId_fkey')
    await queryInterface.removeConstraint('seats', 'seats_areaId_fkey')
    await queryInterface.addConstraint('areas', {
      type: 'foreign key',
      fields: ['floorId'],
      name: 'areas_floorId_fkey',
      references: { table: 'floors', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.addConstraint('seats', {
      type: 'foreign key',
      fields: ['areaId'],
      name: 'seats_areaId_fkey',
      references: { table: 'areas', field: 'id' },
      onDelete: 'cascade',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('areas', 'areas_floorId_fkey')
    await queryInterface.removeConstraint('seats', 'seats_areaId_fkey')
    await queryInterface.addConstraint('areas', {
      type: 'foreign key',
      fields: ['floorId'],
      name: 'areas_floorId_fkey',
      references: { table: 'floors', field: 'id' },
    })
    await queryInterface.addConstraint('seats', {
      type: 'foreign key',
      fields: ['areaId'],
      name: 'seats_areaId_fkey',
      references: { table: 'areas', field: 'id' },
    })
  },
}
