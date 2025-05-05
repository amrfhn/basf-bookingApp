module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'checkInStatuses',
      [
        {
          id: 0,
          status: 'Not available',
        },
        {
          id: 1,
          status: 'Pending',
        },
        {
          id: 2,
          status: 'Success',
        }
      ]
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('checkInStatuses', null, {})
  },
}
