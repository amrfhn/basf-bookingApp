const { returning, indexer, getId } = require('./common')
const startDate = '2024-04-30'

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
          name: 'Czech Republic - Praha',
          country: 'Czech Republic',
          city: 'Prague',
          startDate,
          managerRoleId: 11935928,
          adminRoleId: 11935929,
          feedbackContact: 'lubos.havlena@basf.com',
          buildingMindsID: 'f2a07912-1c0f-4349-b2ce-72a7dbba2f5d',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Kotelna Park II - Office',
          address: 'Radlicka 354/107b, 15500 Prague',
          reservationDays: 5,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +2,
          buildingMindsID: '9a890f66-1161-40f2-9a8f-60e77f1813e5',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '3',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '10812eac-05d9-4d74-89ad-a527d65c7ec4',
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
          buildingMindsID: '10812eac-05d9-4d74-89ad-a527d65c7ec4',
          typeId: 1,
        }
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
