const { returning } = require('./common')
const startDate = '2022-09-01'
const budapestData = require('./data/20220922142300-data-Budapest-Site.json')

const fs = require('fs').promises

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Site ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Budapest',
          country: 'Hungary',
          city: 'Budapest',
          startDate,
          managerRoleId: 11382957,
          adminRoleId: 11382956,
          feedbackContact: 'adrienn.erki@basf.com',
          buildingMindsID: '4a48c97a-8de6-4a0b-8039-82b50358b884',
        },
      ],
      options
    )

    /** * Amenity ***/
    const oneMonitorAmenity = (
      await queryInterface.bulkInsert(
        'amenities',
        [
          {
            type: 'MULTI',
            filterable: true,
            key: '1 Monitor',
            siteId: sites[0].id,
          },
        ],
        options
      )
    )[0].id

    /** * Amenity values ***/
    const oneMonitorAmenityValue = await queryInterface.bulkInsert(
      'amenityValues',
      [{ amenityId: oneMonitorAmenity, value: '1 Monitor' }],
      options
    )

    /** * Building ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Nordic Light Uno',
          address: '1133 Budapest, Váci út 96-98',
          reservationDays: 30,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +2,
          buildingMindsID: '9d16b87d-24f8-4dbf-9aa2-341d25574ede',
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '1',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '4a48c97a-8de6-4a0b-8039-82b50358b884',
        },
      ],
      options
    )

    /** * Areas ***/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/bul/nordic/1.svg', 'utf8'),
          floorId: floors[0].id,
          startDate,
          buildingMindsID: '4a48c97a-8de6-4a0b-8039-82b50358b884',
        },
      ],
      options
    )

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      budapestData.map(({ seat, buildingMindsID }) => {
        return { code: seat, areaId: areas[0].id, buildingMindsID, startDate, endDate: null }
      }),
      options
    )
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      seats.map(({ id }) => {
        return { seatId: id, amenityId: oneMonitorAmenity }
      }),
      options
    )
    await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      seatAmenities.map(({ id }) => {
        return { seatAmenityId: id, amenityValueId: oneMonitorAmenityValue[0].id }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
