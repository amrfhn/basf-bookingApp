module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeConstraint('floors', 'numberInBuilding')
    await queryInterface.addConstraint('floors', {
      fields: ['number', 'typeId', 'buildingId'],
      type: 'unique',
      name: 'floors_unique_constraint',
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('floors', 'floors_unique_constraint')
  },
}
