const { returning, indexer, getId } = require('./common')
const startDate = '2024-05-06'

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
          name: 'Turkey - Istanbul, Nidakule Kuzey',
          country: 'Turkey',
          city: 'Istanbul',
          startDate,
          managerRoleId: 11954397,
          adminRoleId: 11954396,
          feedbackContact: 'yasemin.acku@basf.com',
          buildingMindsID: '2b2f1900-5e43-463b-8123-40a6c7f72cb4',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Nidakule Ataşehir Bate Office',
          address: 'Begonya Sokak 1, 4746 Istanbul',
          reservationDays: 7,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: 3,
          buildingMindsID: 'f5993fa1-ccbd-4062-a472-c804400b0b48',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '5',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '8a462a28-333c-443d-8eab-a6e5783ff425',
          typeId: 1,
        },
        {
          number: '6',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '22de442b-592c-4ac9-a9fe-06f008caed6a',
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
          buildingMindsID: '8a462a28-333c-443d-8eab-a6e5783ff425',
          typeId: 1,
        },
        {
          code: '-',
          map: '',
          floorId: floors[1].id,
          startDate,
          buildingMindsID: '22de442b-592c-4ac9-a9fe-06f008caed6a',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
