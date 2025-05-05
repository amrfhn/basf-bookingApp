const { returning, indexer, getId } = require('./common')
const startDate = '2024-02-01'

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
          name: 'Malaysia - Kuala Lumpur',
          country: 'Malaysia',
          city: 'Kuala Lumpur',
          startDate,
          managerRoleId: 11843052,
          adminRoleId: 11843053,
          feedbackContact: 'jessie.chiew@basf.com',
          buildingMindsID: '5a06018c-7e49-4a75-9324-9f3961aad611',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Aspire Tower',
          address: 'Jalan Pantai Baharu, 59200, Kuala Lumpur',
          reservationDays: 7,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +8,
          buildingMindsID: 'b3804665-7a60-4fe9-9e90-9ab338db1c63',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '25',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'db00adc0-fafd-4e89-b034-e860d402bc4d',
          typeId: 1,
        },
        {
          number: '26',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'a8245191-aa5a-44f4-ac95-440a76dfe37c',
          typeId: 1,
        },
        {
          number: '27',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '48ca985f-3b56-4fe9-a6a6-9658103711a1',
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
          buildingMindsID: 'db00adc0-fafd-4e89-b034-e860d402bc4d',
          typeId: 1,
        },
        {
          code: '-',
          map: '',
          floorId: floors[1].id,
          startDate,
          buildingMindsID: 'a8245191-aa5a-44f4-ac95-440a76dfe37c',
          typeId: 1,
        },
        {
          code: '-',
          map: '',
          floorId: floors[2].id,
          startDate,
          buildingMindsID: '48ca985f-3b56-4fe9-a6a6-9658103711a1',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
