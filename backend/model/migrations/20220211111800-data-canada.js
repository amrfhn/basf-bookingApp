const { getId, indexer, returning, startDate, endDate } = require('./common')
const canadaData = require('./data/20220211113500-canada-data.json')
// USEFUL regex \<switch\>(\s*)<foreignObject((?!</foreignObject>).|\s)*</foreignObject>\s*(((?!</switch>).|\s)*)</switch>

const fs = require('fs').promises

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

const seatAmenityIndexFunction = (v) => v.seatId + '-' + v.amenityId
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Canada Creekbank',
          country: 'Canada',
          city: 'Mississauga',
          startDate,
          managerRoleId: 11231858,
          adminRoleId: 11231857,
        },
      ],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Building A',
          address: 'Fill 5025 Creekbank Road Floor 2, Mississauga ON L4W 0B6',
          reservationDays: 30,
          managerReservationDays: 30,
          cancellationHours: 48,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: -7,
        },
      ],
      options
    )

    /** * Floors ***/

    const floors = await queryInterface.bulkInsert(
      'floors',
      [{ number: 2, map: '', buildingId: buildings[0].id, startDate }],
      options
    )
    for (let i = 0; i < canadaData.length; i++) {
      canadaData[i].floorId = floors[0].id
    }

    /** * Areas ***/
    const areaMap = await fs.readFile('./model/migrations/maps/cn/creekbank/floor2.svg', 'utf8')

    const areas = await queryInterface.bulkInsert(
      'areas',
      [{ code: '-', map: areaMap, floorId: floors[0].id, startDate }],
      options
    )
    for (let i = 0; i < canadaData.length; i++) {
      canadaData[i].areaId = areas[0].id
    }

    /** * Monitor Amenity ***/
    let monitorAmenity = await queryInterface.bulkInsert(
      'amenities',
      [{ key: 'monitors-ec', type: 'NUMERIC', siteId: sites[0].id }],
      options
    )
    monitorAmenity = monitorAmenity[0]

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      canadaData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )
    const seatsIdx = seats.reduce(reducerSeats, {})
    for (let i = 0; i < canadaData.length; i++) {
      canadaData[i].seatId = seatsIdx[canadaData[i].areaId + '-' + canadaData[i].seat]
    }

    const seatsWithMonitors = canadaData.filter((ecData) => Boolean(ecData.monitors))

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
