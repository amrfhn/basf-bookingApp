const fs = require('fs').promises
const startDate = '2021-01-01'
const endDate = '2021-01-01'

const returning = true

const reducerAreas = (a, c) => {
  a[c.code] = c.id
  return a
}

const reducerSeats = (a, c) => {
  a[c.areaId + '-' + c.code] = c.id
  return a
}

const reducerSeatsAmenity = (a, c) => {
  a[c.seatId + '-' + c.amenityId] = c.id
  return a
}

const range = (length) => Array.from({ length }, (_, i) => i + 1)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [{ name: 'Costa Rica', country: 'Costa Rica', city: 'San José', startDate, managerRoleId: 11141619 }],
      { transaction, returning }
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'EPIC',
          address: 'Trejos Montealegre, San Rafael de Escazú',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 4,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: -8,
        },
      ],
      { transaction, returning }
    )

    /** * Floors ***/
    const floorMap = await fs.readFile('./model/migrations/maps/cr/EPIC/1/floor.svg', 'utf8')
    const floors = await queryInterface.bulkInsert(
      'floors',
      [{ number: 1, map: floorMap, buildingId: buildings[0].id, startDate }],
      { transaction, returning }
    )

    /** * Areas ***/
    const areaMaps = {
      A: await fs.readFile('./model/migrations/maps/cr/EPIC/1/A.svg', 'utf8'),
      B: await fs.readFile('./model/migrations/maps/cr/EPIC/1/B.svg', 'utf8'),
    }
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        { code: 'A', map: areaMaps.A, floorId: floors[0].id, startDate },
        { code: 'B', map: areaMaps.B, floorId: floors[0].id, startDate },
      ],
      { transaction, returning }
    )
    const areasIdx = areas.reduce(reducerAreas, {})

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      [
        ['A', 22],
        ['B', 13],
      ].flatMap(([areaCode, length]) =>
        range(length).map((code) => {
          return { code: code, areaId: areasIdx[areaCode], startDate, endDate }
        })
      ),
      { transaction, returning }
    )
    const seatsIdx = seats.reduce(reducerSeats, {})

    /** * Enable seats ***/
    const toEnable = {
      A: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
      B: [1, 3, 5, 7, 9, 11, 13],
    }

    const values = Object.entries(toEnable)
      .map(([k, v]) => "('" + k + "', " + v.join("), ('" + k + "', ") + ')')
      .join(',\n')

    await queryInterface.sequelize.query(
      `UPDATE seats s SET "endDate" = null WHERE EXISTS ( SELECT * FROM ( VALUES ${values} ) AS enables (area_code, seat_code),
        buildings b INNER JOIN floors f ON b.id = f."buildingId" INNER JOIN areas a ON f.id = a."floorId"
        WHERE s.code = seat_code AND a.code = area_code AND s."areaId" = a.id AND b."name" = 'EPIC' );`,
      { transaction, returning }
    )

    /** *  Amenities ***/
    const amenitiesData = require('./data/20211021170000-costa-rica-amenities.json')

    const monitorAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities WHERE en_name = 'monitors'`)
    )[0][0].id

    for (let i = 0; i < amenitiesData.length; i++) {
      const data = amenitiesData[i]
      data.monitorAmenityId = monitorAmenityId
      data.areaId = areasIdx[data.area]
      data.seatId = seatsIdx[data.areaId + '-' + data.seat]
    }

    /** *  Seat - Amenities ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      amenitiesData.map((data) => {
        return { seatId: data.seatId, amenityId: data.monitorAmenityId }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < amenitiesData.length; i++) {
      const data = amenitiesData[i]
      data.seatAmenityId = seatsAmenityIdx[data.seatId + '-' + data.monitorAmenityId]
    }

    /** *  Seat - Amenities - Numeric ***/
    const seatAmenityNumericValues = await queryInterface.bulkInsert(
      'seatAmenityNumericValues',
      amenitiesData.map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data.monitors }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
