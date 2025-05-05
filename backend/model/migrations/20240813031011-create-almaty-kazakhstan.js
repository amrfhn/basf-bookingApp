const { returning, indexer, getId } = require('./common')
const startDate = '2024-08-12'

const fs = require('fs').promises

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Site * **/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Kazakhstan - Almaty Office',
          country: 'Kazakhstan',
          city: 'Almaty',
          startDate,
          managerRoleId: 12094665,
          adminRoleId: 12094818,
          feedbackContact: 'meiramgul.nurgaleyeva@basf.com',
          buildingMindsID: '3ba2690b-3e6a-4368-b2b6-7a3248d9ea8d',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Park View Office Center',
          address: 'Kunaev St 77, 050000 Almaty',
          reservationDays: 5,
          managerReservationDays: 14,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          parkingReservationDays: 5,
          siteId: sites[0].id,
          startDate,
          gmt: +5,
          buildingMindsID: '471dbf53-12e0-4fc2-a1fb-34d8fa528f04',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '07',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '56effeb8-3912-49b5-acf2-ce10366c028d',
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
          buildingMindsID: '56effeb8-3912-49b5-acf2-ce10366c028d',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },

  async down(queryInterface, Sequelize) {},
}
