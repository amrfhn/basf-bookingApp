const { returning, indexer, getId } = require('./common')
const startDate = '2023-09-01'

const fs = require('fs').promises

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Site * **/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Guatemala',
          country: 'Guatemala',
          city: 'Ciudad de guatemala',
          startDate,
          managerRoleId: 11682212,
          adminRoleId: 11682211,
          feedbackContact: 'diana.calvo@basf.com',
          buildingMindsID: '708573a6-9eb8-46d4-b44c-99c86cc55b51',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'New Office guatemala',
          address: '8va. Avenida y 15 calle esquina',
          reservationDays: 7,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: -6,
          buildingMindsID: 'b5677b3a-d905-41a7-bf36-a534e12a5205',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '00',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'e299f74a-256c-4280-9b09-ad9efa133a7f',
          typeId: 1,
        },
      ],
      options
    )

    /** * Areas * **/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
		  map: '',
          floorId: floors[0].id,
          startDate,
          buildingMindsID: 'e299f74a-256c-4280-9b09-ad9efa133a7f',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
