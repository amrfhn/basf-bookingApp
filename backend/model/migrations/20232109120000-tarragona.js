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
          name: 'Tarragona',
          country: 'Spain',
          city: 'La Canonja',
          startDate,
          managerRoleId: 11682222,
          adminRoleId: 11682221,
          feedbackContact: 'elia.sumoy@basf.com',
          buildingMindsID: '08f4a965-f964-407c-928c-5a49093ff8f8',
        },
      ],
      options
    )
	
    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'A-5, Logistica., Vestuarios',
          address: 'Carretera N-340 km 1.156',
          reservationDays: 7,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +2,
          buildingMindsID: '5a9e9e7b-8ab4-47a3-9b58-7b0a6c00f8c6',
        },
		{
          name: 'B-4, Oficinas',
          address: 'Carretera N-340 km 1.156',
          reservationDays: 7,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +2,
          buildingMindsID: '49c13276-3f3a-4c53-ad30-e0b3aa1e07e7',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '01',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '91537fed-71f5-45e1-81f5-30e448021ff9',
          typeId: 1,
        },
        {
          number: '02',
          map: '',
          buildingId: buildings[1].id,
          startDate,
          buildingMindsID: 'd0b741f6-e4b9-4f58-9819-504f1f5d7070',
          typeId: 1,
        },
        {
          number: '03',
          map: '',
          buildingId: buildings[1].id,
          startDate,
          buildingMindsID: 'cf91632b-62d3-4794-8434-e356f31cde9b',
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
          buildingMindsID: '91537fed-71f5-45e1-81f5-30e448021ff9',
          typeId: 1,
        },
        {
          code: '-',
          map: '',
          floorId: floors[1].id,
          startDate,
          buildingMindsID: 'd0b741f6-e4b9-4f58-9819-504f1f5d7070',
          typeId: 1,
        },
        {
          code: '-',
          map: '',
          floorId: floors[2].id,
          startDate,
          buildingMindsID: 'cf91632b-62d3-4794-8434-e356f31cde9b',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
