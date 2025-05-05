const { getId, indexer, returning, endDate } = require('./common')
const seoulData = require('./data/20220725142100-seoul-data.json')
const startDate = '2022-07-01'

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
          name: 'Seoul 서울',
          country: 'South Korea',
          city: 'Seoul',
          startDate,
          managerRoleId: 11289810,
          adminRoleId: 11289809,
          feedbackContact: 'junam.lee@basf.com',
          buildingMindsID: '80ce5b3e-f0d2-4b91-955a-ae28320a4797',
        },
      ],
      options
    )

    /** * Building ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Seoul-KCCI',
          address: '39, Sejong-daero, Jung-gu',
          reservationDays: 7,
          managerReservationDays: 7,
          cancellationHours: 0,
          reservationCancellationHours: 0,
          siteId: sites[0].id,
          startDate,
          gmt: +9,
          buildingMindsID: '12b82359-e73f-4acc-bc79-d388dac17bd4',
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: 15,
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '9b0ece7a-187a-41b7-a42f-5c1e2a9d4ab0',
        },
        {
          number: 16,
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '21896208-1050-45ac-a826-d8bd02d1c9fd',
        },
      ],
      options
    )

    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < seoulData.length; i++) {
      seoulData[i].floorId = floorIdx[seoulData[i].floor]
    }

    /** * Areas ***/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/ko/kcci/15.svg', 'utf8'),
          floorId: floorIdx[15],
          startDate,
          buildingMindsID: '9b0ece7a-187a-41b7-a42f-5c1e2a9d4ab0',
        },
        {
          code: '-',
          map: await fs.readFile('./model/migrations/maps/ko/kcci/16.svg', 'utf8'),
          floorId: floorIdx[16],
          startDate,
          buildingMindsID: '21896208-1050-45ac-a826-d8bd02d1c9fd',
        },
      ],
      options
    )

    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < seoulData.length; i++) {
      seoulData[i].areaId = areasIdx[seoulData[i].floorId + '--']
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      seoulData.map(({ seat, areaId, buildingMindsID, available }) => {
        return { code: seat, areaId, buildingMindsID, startDate, endDate: available ? null : endDate }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
