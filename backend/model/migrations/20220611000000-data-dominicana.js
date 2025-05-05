const { getId, indexer, returning, startDate, endDate } = require('./common')
const dominicanaData = require('./data/20220611004600-dominicana-data.json')

const fs = require('fs').promises

const floorIndexFunction = (v) => v.number
const reducerFloor = indexer(floorIndexFunction, getId)

const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Site ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'BASF Dominicana',
          country: 'República Dominicana',
          city: 'Santo Domingo',
          startDate,
          managerRoleId: 11272729,
          adminRoleId: 11272728,
          feedbackContact: 'diana.calvo@basf.com',
        },
      ],
      options
    )

    const brigadiers = await queryInterface.bulkInsert(
      'brigadiers',
      [
        { username: 'adamesjc', siteId: sites[0].id },
        { username: 'guerrep4', siteId: sites[0].id },
      ],
      options
    )

    /** * Building ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Piso 8 Spatium',
          address: 'Avenida Winston Churchill, Acrópolis Center Tower, 8vo. piso, Spatium, sector Piantini',
          reservationDays: 5,
          managerReservationDays: 5,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: -4,
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [{ number: 1, map: '', buildingId: buildings[0].id, startDate, landingZones: 'BASF Dominicana' }],
      options
    )
    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < dominicanaData.length; i++) {
      dominicanaData[i].floorId = floorIdx[dominicanaData[i].floor]
    }

    /** * Areas ***/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/do/spatium/1.svg', 'utf8'),
          floorId: floorIdx[1],
          startDate,
        },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < dominicanaData.length; i++) {
      dominicanaData[i].areaId = areasIdx[dominicanaData[i].floorId + '--']
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      dominicanaData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
