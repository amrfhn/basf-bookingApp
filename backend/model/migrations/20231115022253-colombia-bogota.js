const { returning, indexer, getId } = require('./common')
const startDate = '2023-11-01'

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
          name: 'Colombia - Bogotá',
          country: 'Colombia',
          city: 'Bogotá',
          startDate,
          managerRoleId: 11188996,
          adminRoleId: 11188997,
          feedbackContact: 'vladimir.segura@basf.com',
          buildingMindsID: '8d32ec90-8e7f-459d-96ce-8c26c6d1766f',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Morato, Bogotá',
          address: 'Calle 99 No. 69C-32, 111121 Bogota',
          reservationDays: 5,
          managerReservationDays: 15,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: -5,
          buildingMindsID: '73ff0ffc-d6b5-435e-8c27-1163',
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
          buildingMindsID: '09b19b82-af4f-4a56-b3ea-2db1b07a7985',
          typeId: 1,
        },
        {
          number: '02',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '386f6c7d-0347-4fa5-9be2-64798bea3fa5',
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
          buildingMindsID: '09b19b82-af4f-4a56-b3ea-2db1b07a7985',
          typeId: 1,
        },
        {
          code: '-',
          map: '',
          floorId: floors[1].id,
          startDate,
          buildingMindsID: '386f6c7d-0347-4fa5-9be2-64798bea3fa5',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
