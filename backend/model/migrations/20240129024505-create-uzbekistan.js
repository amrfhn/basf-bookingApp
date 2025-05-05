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
          name: 'Uzbekistan - Taschkent (Business Center)',
          country: 'Uzbekistan',
          city: 'Nairobi',
          startDate,
          managerRoleId: 11825055,
          adminRoleId: 11825054,
          feedbackContact: 'meiramgul.nurgaleyeva@basf.com',
          buildingMindsID: 'f04f8e7d-18a9-4d1f-aef0-6b5bcc63f175',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'INKONEL',
          address: 'Mustaqillik Avenue 75, 100078 Tashkent',
          reservationDays: 5,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +5,
          buildingMindsID: '2b3e155c-c2d6-41bc-8062-181c2840058e',
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
          buildingMindsID: '653bb978-8ae7-4132-9db7-b6893ff3d4ce',
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
          buildingMindsID: '653bb978-8ae7-4132-9db7-b6893ff3d4ce',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
