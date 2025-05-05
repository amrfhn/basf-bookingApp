const { returning, indexer, getId } = require('./common')
const startDate = '2024-01-01'

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
          name: 'Kenya - Nairobi Office',
          country: 'Kenya',
          city: 'Nairobi',
          startDate,
          managerRoleId: 11825007,
          adminRoleId: 11825006,
          feedbackContact: 'francis.kirui@basf.com',
          buildingMindsID: 'e59d526d-7fd8-445e-a8f6-f0fc3ac2504d',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'The Pavilion',
          address: 'Lower Kabete Road 00100 Nairobi',
          reservationDays: 5,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +3,
          buildingMindsID: '70ed95ab-997a-479f-b834-63c4ed8acc78',
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
          buildingMindsID: '929c7a1c-28c3-4723-a3c4-e3d74f129d0a',
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
          buildingMindsID: '929c7a1c-28c3-4723-a3c4-e3d74f129d0a',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
