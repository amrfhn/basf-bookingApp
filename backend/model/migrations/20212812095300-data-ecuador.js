const { getId, indexer, returning, startDate, endDate } = require('./common')
const ecuadorData = require('./data/20211228100300-ecuador-data.json')
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
          name: 'Ecuador',
          country: 'Ecuador',
          city: 'Quito',
          startDate,
          managerRoleId: 11188998,
          adminRoleId: 11188999,
        },
      ],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Metropolitan',
          address: 'Avenida Naciones Unidas E-230',
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
      [{ number: 1, map: '', buildingId: buildings[0].id, startDate }],
      options
    )
    for (let i = 0; i < ecuadorData.length; i++) {
      ecuadorData[i].floorId = floors[0].id
    }

    /** * Areas ***/
    const areaMap = await fs.readFile('./model/migrations/maps/ec/metropolitan/8.svg', 'utf8')

    const areas = await queryInterface.bulkInsert(
      'areas',
      [{ code: '-', map: areaMap, floorId: floors[0].id, startDate }],
      options
    )
    for (let i = 0; i < ecuadorData.length; i++) {
      ecuadorData[i].areaId = areas[0].id
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
      ecuadorData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )
    const seatsIdx = seats.reduce(reducerSeats, {})
    for (let i = 0; i < ecuadorData.length; i++) {
      ecuadorData[i].seatId = seatsIdx[ecuadorData[i].areaId + '-' + ecuadorData[i].seat]
    }

    const seatsWithMonitors = ecuadorData.filter((ecData) => Boolean(ecData.monitors))

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
