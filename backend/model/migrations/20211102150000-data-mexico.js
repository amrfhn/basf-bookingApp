const { getId, indexer, returning, startDate, endDate } = require('./common')
const mexicoData = require('./data/20211102150000-mexico-data.json')
// USEFUL regex \<switch\>(\s*)<foreignObject((?!</foreignObject>).|\s)*</foreignObject>\s*(((?!</switch>).|\s)*)</switch>

const fs = require('fs').promises

const floorIndexFunction = (v) => v.number
const reducerFloor = indexer(floorIndexFunction, getId)

const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

const amenityValueIndexFunction = (v) => v.amenityId + '-' + v.value
const reducerAmenityValue = indexer(amenityValueIndexFunction, getId)

const seatAmenityIndexFunction = (v) => v.seatId + '-' + v.amenityId
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [{ name: 'México', country: 'México', city: 'México', startDate, managerRoleId: 11153223 }],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Corporativo Insurgentes',
          address: 'Insurgentes Sur 975, 03710 Ciudad de México',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 4,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: -8,
        },
      ],
      options
    )

    /** * Floors ***/
    const floorMaps = {
      3: await fs.readFile('./model/migrations/maps/mx/insurgentes/3/PISO_3_S_GENERAL.svg', 'utf8'),
      4: await fs.readFile('./model/migrations/maps/mx/insurgentes/4/PISO_4_S_GENERAL.svg', 'utf8'),
      5: await fs.readFile('./model/migrations/maps/mx/insurgentes/5/PISO_5_S_GENERAL.svg', 'utf8'),
      6: await fs.readFile('./model/migrations/maps/mx/insurgentes/6/PISO_6_S_GENERAL.svg', 'utf8'),
    }
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        { number: 3, map: floorMaps[3], buildingId: buildings[0].id, startDate },
        { number: 4, map: floorMaps[4], buildingId: buildings[0].id, startDate },
        { number: 5, map: floorMaps[5], buildingId: buildings[0].id, startDate },
        { number: 6, map: floorMaps[6], buildingId: buildings[0].id, startDate },
      ],
      options
    )
    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < mexicoData.length; i++) {
      mexicoData[i].floorId = floorIdx[mexicoData[i].floor]
    }

    /** * Areas ***/
    const areaMaps = {
      3: {
        norte: await fs.readFile('./model/migrations/maps/mx/insurgentes/3/PISO_3_S_NORTE.svg', 'utf8'),
        poniente: await fs.readFile('./model/migrations/maps/mx/insurgentes/3/PISO_3_S_PONIENTE.svg', 'utf8'),
        sur: await fs.readFile('./model/migrations/maps/mx/insurgentes/3/PISO_3_S_SUR.svg', 'utf8'),
      },
      4: {
        norte: await fs.readFile('./model/migrations/maps/mx/insurgentes/4/PISO_4_S_NORTE.svg', 'utf8'),
        poniente: await fs.readFile('./model/migrations/maps/mx/insurgentes/4/PISO_4_S_PONIENTE.svg', 'utf8'),
        sur: await fs.readFile('./model/migrations/maps/mx/insurgentes/4/PISO_4_S_SUR.svg', 'utf8'),
      },
      5: {
        norte: await fs.readFile('./model/migrations/maps/mx/insurgentes/5/PISO_5_S_NORTE.svg', 'utf8'),
        poniente: await fs.readFile('./model/migrations/maps/mx/insurgentes/5/PISO_5_S_PONIENTE.svg', 'utf8'),
        sur: await fs.readFile('./model/migrations/maps/mx/insurgentes/5/PISO_5_S_SUR.svg', 'utf8'),
      },
      6: {
        norte: await fs.readFile('./model/migrations/maps/mx/insurgentes/6/PISO_6_S_NORTE.svg', 'utf8'),
        poniente: await fs.readFile('./model/migrations/maps/mx/insurgentes/6/PISO_6_S_PONIENTE.svg', 'utf8'),
        sur: await fs.readFile('./model/migrations/maps/mx/insurgentes/6/PISO_6_S_SUR.svg', 'utf8'),
      },
    }

    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        { code: 'norte', map: areaMaps[3].norte, floorId: floorIdx[3], startDate },
        { code: 'poniente', map: areaMaps[3].poniente, floorId: floorIdx[3], startDate },
        { code: 'sur', map: areaMaps[3].sur, floorId: floorIdx[3], startDate },
        { code: 'norte', map: areaMaps[4].norte, floorId: floorIdx[4], startDate },
        { code: 'poniente', map: areaMaps[4].poniente, floorId: floorIdx[4], startDate },
        { code: 'sur', map: areaMaps[4].sur, floorId: floorIdx[4], startDate },
        { code: 'norte', map: areaMaps[5].norte, floorId: floorIdx[5], startDate },
        { code: 'poniente', map: areaMaps[5].poniente, floorId: floorIdx[5], startDate },
        { code: 'sur', map: areaMaps[5].sur, floorId: floorIdx[5], startDate },
        { code: 'norte', map: areaMaps[6].norte, floorId: floorIdx[6], startDate },
        { code: 'poniente', map: areaMaps[6].poniente, floorId: floorIdx[6], startDate },
        { code: 'sur', map: areaMaps[6].sur, floorId: floorIdx[6], startDate },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < mexicoData.length; i++) {
      mexicoData[i].areaId = areasIdx[mexicoData[i].floorId + '-' + mexicoData[i].area]
    }

    /** * Desk Amenity ***/
    let deskAmenity = await queryInterface.bulkInsert('amenities', [{ key: 'desk-mx', type: 'MULTI' }], options)
    deskAmenity = deskAmenity[0]

    /** * Amenity - Value ***/
    const amenityValues = await queryInterface.bulkInsert(
      'amenityValues',
      ['G1', 'G2', 'G4', 'L', 'Pool'].map((value) => {
        return { amenityId: deskAmenity.id, value }
      }),
      options
    )
    const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < mexicoData.length; i++) {
      mexicoData[i].deskValueId = amenityValuesIdx[deskAmenity.id + '-' + mexicoData[i].desk]
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      mexicoData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )
    const seatsIdx = seats.reduce(reducerSeats, {})
    for (let i = 0; i < mexicoData.length; i++) {
      mexicoData[i].seatId = seatsIdx[mexicoData[i].areaId + '-' + mexicoData[i].seat]
    }

    /** *  Seat - Amenities ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      mexicoData.map(({ seatId }) => {
        return { seatId, amenityId: deskAmenity.id }
      }),
      options
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})
    for (let i = 0; i < mexicoData.length; i++) {
      mexicoData[i].seatAmenityId = seatsAmenityIdx[mexicoData[i].seatId + '-' + deskAmenity.id]
    }

    /** *  Seat - Amenities - Multi - Value ***/
    const seatAmenityMultiValues = await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      mexicoData.map((data) => {
        return { seatAmenityId: data.seatAmenityId, amenityValueId: data.deskValueId }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
