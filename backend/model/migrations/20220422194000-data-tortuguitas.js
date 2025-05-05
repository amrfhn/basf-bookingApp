const { getId, indexer, returning, startDate, endDate } = require('./common')
const tortuData = require('./data/20220423185200-tortuguitas-data.json')

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
    const site = (await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Argentina'`, options))[0][0]

    /** * Building ***/
    const building = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Tortuguitas',
          address: 'Av. Constituyentes 1758',
          reservationDays: 14,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 18,
          siteId: site.id,
          startDate,
          gmt: -3,
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [{ number: 1, map: '', buildingId: building[0].id, startDate }],
      options
    )
    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < tortuData.length; i++) {
      tortuData[i].floorId = floorIdx[tortuData[i].floor]
    }

    /** * Areas ***/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/ar/tortuguitas/1.svg', 'utf8'),
          floorId: floors[0].id,
          startDate,
        },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < tortuData.length; i++) {
      tortuData[i].areaId = areasIdx[tortuData[i].floorId + '--']
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      tortuData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
