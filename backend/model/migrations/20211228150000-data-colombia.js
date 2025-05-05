const { getId, indexer, returning, startDate, endDate } = require('./common')
const colombiaData = require('./data/20211228150000-colombia-data.json')
// USEFUL regex \<switch\>(\s*)<foreignObject((?!</foreignObject>).|\s)*</foreignObject>\s*(((?!</switch>).|\s)*)</switch>

const fs = require('fs').promises

const floorIndexFunction = (v) => v.number
const reducerFloor = indexer(floorIndexFunction, getId)

const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

const seatAmenityIndexFunction = (v) => v.seatId + '-' + v.amenityId
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Colombia',
          country: 'Colombia',
          city: 'Bogotá',
          startDate,
          managerRoleId: 11188996,
          adminRoleId: 11188997,
        },
      ],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Morato',
          address: 'Calle 99 No 69C - 32',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 48,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: -7,
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        { number: 1, map: '', buildingId: buildings[0].id, startDate },
        { number: 2, map: '', buildingId: buildings[0].id, startDate },
        { number: 3, map: '', buildingId: buildings[0].id, startDate },
      ],
      options
    )
    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < colombiaData.length; i++) {
      colombiaData[i].floorId = floorIdx[colombiaData[i].floor]
    }

    /** * Areas ***/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/col/morato/1.svg', 'utf8'),
          floorId: floorIdx[1],
          startDate,
        },
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/col/morato/2.svg', 'utf8'),
          floorId: floorIdx[2],
          startDate,
        },
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/col/morato/3.svg', 'utf8'),
          floorId: floorIdx[3],
          startDate,
        },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < colombiaData.length; i++) {
      colombiaData[i].areaId = areasIdx[colombiaData[i].floorId + '--']
    }

    /** * Monitor Amenity ***/
    let monitorAmenity = await queryInterface.bulkInsert(
      'amenities',
      [{ key: 'monitors-col', type: 'NUMERIC', siteId: sites[0].id }],
      options
    )
    monitorAmenity = monitorAmenity[0]

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      colombiaData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )
    const seatsIdx = seats.reduce(reducerSeats, {})
    for (let i = 0; i < colombiaData.length; i++) {
      colombiaData[i].seatId = seatsIdx[colombiaData[i].areaId + '-' + colombiaData[i].seat]
    }
    const seatsWithMonitors = colombiaData.filter((colData) => Boolean(colData.monitors))

    /** *  Seat - Amenities ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      seatsWithMonitors.map(({ seatId }) => {
        return { seatId, amenityId: monitorAmenity.id }
      }),
      options
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})
    for (let i = 0; i < seatsWithMonitors.length; i++) {
      seatsWithMonitors[i].seatAmenityId = seatsAmenityIdx[seatsWithMonitors[i].seatId + '-' + monitorAmenity.id]
    }

    /** *  Seat - Amenities - Numeric - Value ***/
    await queryInterface.bulkInsert(
      'seatAmenityNumericValues',
      seatsWithMonitors.map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data.monitors }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
