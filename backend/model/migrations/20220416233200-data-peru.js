const { getId, indexer, returning, startDate, endDate } = require('./common')
const peruData = require('./data/20220417001000-peru-data.json')

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
          name: 'Perú',
          country: 'Perú',
          city: 'Callao',
          startDate,
          managerRoleId: 11249411,
          adminRoleId: 11249410,
          feedbackContact: 'javier.g.canales@basf.com',
        },
      ],
      options
    )

    /** * Building ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Callao',
          address: 'Av. Óscar R. Benavides 5915',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: -5,
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
      ],
      options
    )
    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < peruData.length; i++) {
      peruData[i].floorId = floorIdx[peruData[i].floor]
    }

    /** * Areas ***/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/pe/callao/1.svg', 'utf8'),
          floorId: floorIdx[1],
          startDate,
        },
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/pe/callao/2.svg', 'utf8'),
          floorId: floorIdx[2],
          startDate,
        },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < peruData.length; i++) {
      peruData[i].areaId = areasIdx[peruData[i].floorId + '--']
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      peruData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
