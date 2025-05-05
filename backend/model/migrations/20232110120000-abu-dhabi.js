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
          name: 'Abu Dhabi',
          country: 'UAE',
          city: 'Abu Dhabi',
          startDate,
          managerRoleId: 11682220,
          adminRoleId: 11682219,
          feedbackContact: 'baljit.kaur@basf.com',
          buildingMindsID: 'c25f8281-f925-49ff-8997-63fd5484028f',
        },
      ],
      options
    )

    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Haibu Space x Abu Dhabi Mall',
          address: 'Al Maiyani Street 113',
          reservationDays: 7,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +4,
          buildingMindsID: '17ce10ca-eed6-4610-89ee-22efb1473684',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: 'Floor 35',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '820c965a-d537-43a9-855d-5e8bdcbc1064',
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
          buildingMindsID: '820c965a-d537-43a9-855d-5e8bdcbc1064',
          typeId: 1,
        },
      ],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
