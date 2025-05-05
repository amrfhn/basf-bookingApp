const { returning } = require('./common')
const startDate = '2022-09-01'
const izmirData = require('./data/20220905140500-data-Izmir-Site.json')

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
          name: 'İzmir Sales Office',
          country: 'Turkey',
          city: 'İzmir',
          startDate,
          managerRoleId: 11355503,
          adminRoleId: 11355504,
          feedbackContact: 'ferdi.gocturk@basf.com; yasemin.acuk@basf.com',
          buildingMindsID: 'bca6cbeb-ba06-416c-9b61-e309402270e4',
        },
      ],
      options
    )

    /** * Building ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Lotus',
          address: 'Kazimdirik Mah., Üniversite Cad., 377/2 Sokak No 2 Kapı No 94 A & 94 B, 35030 Bornova / Izmir',
          reservationDays: 30, // Necesito
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +1,
          buildingMindsID: 'db91aca1-dc9d-42f2-89b7-c065db5f4369',
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
          landingZones: 'Mining Chemicals, ECR, AP',
          buildingMindsID: 'e02c68ae-3871-4056-ae40-66ace5fe724e',
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
          map: await fs.readFile('model/migrations/maps/tr/bornova-lutus/ground.svg', 'utf8'),
          floorId: floors[0].id,
          startDate,
          buildingMindsID: 'e02c68ae-3871-4056-ae40-66ace5fe724e',
        },
      ],
      options
    )

    /** * Seats ***/
    const seats =
      (await queryInterface.bulkInsert(
        'seats',
        izmirData.map(({ seat, buildingMindsID }) => {
          return { code: seat, areaId: areas[0].id, buildingMindsID, startDate, endDate: null }
        }),
        options
      )) - (await transaction.commit())
  },
  down: async (queryInterface, Sequelize) => {},
}
