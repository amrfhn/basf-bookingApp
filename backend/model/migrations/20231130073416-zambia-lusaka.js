const { returning, indexer, getId } = require('./common')
const startDate = '2023-11-30'

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
          name: 'Zambia - Lusaka',
          country: 'Zambia',
          city: 'Lusaka',
          startDate,
          managerRoleId: 11784993,
          adminRoleId: 11784992,
          feedbackContact: 'judith.mwale@basf.com',
          buildingMindsID: '83ca0f48-b6af-4de6-8c38-b01e1c47a083',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Africaworks Coworking Zambia Limited',
          address: 'Chila Road 1, 10101, Lusaka',
          reservationDays: 5,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +2,
          buildingMindsID: 'c50069c6-574a-4bf1-bf8a-0e5603c4966b',
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
          buildingMindsID: '66fba993-902c-4ec3-98d4-caa6147ece74',
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
          buildingMindsID: '66fba993-902c-4ec3-98d4-caa6147ece74',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },

    down: async (queryInterface, Sequelize) => {},
};
