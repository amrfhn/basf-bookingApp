const { getId, indexer, returning, startDate, endDate } = require('./common')
const brasilData = require('./data/20211229160300-brasil-data.json')
// USEFUL regex \<switch\>(\s*)<foreignObject((?!</foreignObject>).|\s)*</foreignObject>\s*(((?!</switch>).|\s)*)</switch>

const fs = require('fs').promises

const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

const seatAmenityIndexFunction = (v) => v.seatId + '-' + v.amenityId
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

const amenityValueIndexFunction = (v) => v.amenityId + '-' + v.value
const reducerAmenityValue = indexer(amenityValueIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Morumbi',
          country: 'Brasil',
          city: 'São Paulo',
          startDate,
          managerRoleId: 11190954,
          adminRoleId: 11190955,
        },
      ],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Rochavera',
          address: 'Avenida das Nações Unidas, 14.171, Torre Crystal',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 24,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: -5,
        },
      ],
      options
    )

    /** * Floors ***/
    const floorMap = await fs.readFile('./model/migrations/maps/br/rochavera/14/areas.svg', 'utf8')

    const floors = await queryInterface.bulkInsert(
      'floors',
      [{ number: 14, map: floorMap, buildingId: buildings[0].id, startDate }],
      options
    )
    for (let i = 0; i < brasilData.length; i++) {
      brasilData[i].floorId = floors[0].id
    }

    /** * Areas ***/

    const areaMaps = {
      a1: await fs.readFile('./model/migrations/maps/br/rochavera/14/a1.svg', 'utf8'),
      a2: await fs.readFile('./model/migrations/maps/br/rochavera/14/a2.svg', 'utf8'),
      b1: await fs.readFile('./model/migrations/maps/br/rochavera/14/b1.svg', 'utf8'),
      b2: await fs.readFile('./model/migrations/maps/br/rochavera/14/b2.svg', 'utf8'),
      c1: await fs.readFile('./model/migrations/maps/br/rochavera/14/c1.svg', 'utf8'),
      c2: await fs.readFile('./model/migrations/maps/br/rochavera/14/c2.svg', 'utf8'),
    }

    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        { code: 'a1', map: areaMaps.a1, floorId: floors[0].id, startDate },
        { code: 'a2', map: areaMaps.a2, floorId: floors[0].id, startDate },
        { code: 'b1', map: areaMaps.b1, floorId: floors[0].id, startDate },
        { code: 'b2', map: areaMaps.b2, floorId: floors[0].id, startDate },
        { code: 'c1', map: areaMaps.c1, floorId: floors[0].id, startDate },
        { code: 'c2', map: areaMaps.c2, floorId: floors[0].id, startDate },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < brasilData.length; i++) {
      brasilData[i].areaId = areasIdx[brasilData[i].floorId + '-' + brasilData[i].area]
    }

    /** * Amenities ***/
    const amenities = await queryInterface.bulkInsert(
      'amenities',
      [
        { key: 'dock-br', type: 'MULTI', siteId: sites[0].id },
        { key: 'monitors-br', type: 'NUMERIC', siteId: sites[0].id },
        { key: 'pcdesktop-br', type: 'BOOLEAN', siteId: sites[0].id },
        { key: 'fixedphone-br', type: 'BOOLEAN', siteId: sites[0].id },
      ],
      options
    )
    const amenityIdx = {}
    amenities.forEach((a) => (amenityIdx[a.key] = a.id))

    /** * Amenity - Value ***/
    const amenityValues = await queryInterface.bulkInsert(
      'amenityValues',
      ['HP Retangular Pequena', 'HP Redonda', 'HP Retangular Comprida'].map((value) => {
        return { amenityId: amenityIdx['dock-br'], value }
      }),
      options
    )
    const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < brasilData.length; i++) {
      brasilData[i].dockValueId = amenityValuesIdx[amenityIdx['dock-br'] + '-' + brasilData[0]['dock-br']]
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      brasilData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )

    const seatsIdx = seats.reduce(reducerSeats, {})
    for (let i = 0; i < brasilData.length; i++) {
      brasilData[i].seatId = seatsIdx[brasilData[i].areaId + '-' + brasilData[i].seat]
    }

    async function createSeatAmenity(data, amenity, amenityIdx) {
      const seats = data.filter((ecData) => Boolean(ecData[amenity]))
      const seatAmenities = await queryInterface.bulkInsert(
        'seatAmenities',
        seats.map(({ seatId }) => {
          return { seatId, amenityId: amenityIdx[amenity] }
        }),
        options
      )
      const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})
      for (let i = 0; i < seats.length; i++) {
        seats[i].seatAmenityId = seatsAmenityIdx[seats[i].seatId + '-' + amenityIdx[amenity]]
      }
      return seats
    }

    const seatsWithMonitors = await createSeatAmenity(brasilData, 'monitors-br', amenityIdx)

    /** *  Seat - Amenities - Numeric - Value ***/
    await queryInterface.bulkInsert(
      'seatAmenityNumericValues',
      seatsWithMonitors.map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data['monitors-br'] }
      }),
      options
    )

    const seatsWithPhone = await createSeatAmenity(brasilData, 'fixedphone-br', amenityIdx)

    /** *  Seat - Amenities - Boolean - Value ***/
    await queryInterface.bulkInsert(
      'seatAmenityBooleanValues',
      seatsWithPhone.map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data['fixedphone-br'] }
      }),
      options
    )

    const seatsWithPcDesktop = await createSeatAmenity(brasilData, 'pcdesktop-br', amenityIdx)

    await queryInterface.bulkInsert(
      'seatAmenityBooleanValues',
      seatsWithPcDesktop.map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data['pcdesktop-br'] }
      }),
      options
    )

    const seatsWithDock = await createSeatAmenity(brasilData, 'dock-br', amenityIdx)

    /** *  Seat - Amenities - Multi - Value ***/
    await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      seatsWithDock.map((data) => {
        return { seatAmenityId: data.seatAmenityId, amenityValueId: data.dockValueId }
      }),
      options
    )
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
