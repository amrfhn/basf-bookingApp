const { returning, indexer, getId } = require('./common')
const startDate = '2022-09-01'
const barcelonaData = require('./data/20221220112000-barcelona-data-creation.json')

const fs = require('fs').promises

const floorIndexFunction = (v) => v.number
const reducerFloor = indexer(floorIndexFunction, getId)

const areaIndexFunction = (v) => v.floorId
const reducerAreas = indexer(areaIndexFunction, getId)

const seatIndexFunction = (v) => v.areaId
const reducerSeats = indexer(seatIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Site * **/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          name: 'Barcelona Can Ràbia',
          country: 'Spain',
          city: 'Barcelona',
          startDate,
          managerRoleId: 11445562,
          adminRoleId: 11445559,
          feedbackContact: 'rosa.casals@basf.com',
          buildingMindsID: 'd5133706-fea9-4c5c-8687-938ba1b325ff',
        },
      ],
      options
    )
    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'Can Ràbia',
          address: 'C/ Can Ràbia 3-5, 08017 - Barcelona',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +1,
          buildingMindsID: 'cab5130b-51d7-403b-b869-bafffd275728',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '5',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'e12bc81a-f2c4-42e0-bbf6-a99f3b4f46a1',
          typeId: 1,
        },
        {
          number: '6',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'ba8b3d9c-f621-44ec-939e-ad3ce43076f8',
          typeId: 1,
        },
        {
          number: '7',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'a9b2cc1d-4f54-4a18-a1ee-8bcb868c7865',
          typeId: 1,
        },
      ],
      options
    )

    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < barcelonaData.length; i++) {
      barcelonaData[i].floorId = floorIdx[barcelonaData[i].floor]
    }
    /** * Areas * **/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/sp/can-ràbia/5.svg', 'utf8'),
          floorId: floorIdx[5],
          startDate,
          buildingMindsID: 'e12bc81a-f2c4-42e0-bbf6-a99f3b4f46a1',
          typeId: 1,
        },
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/sp/can-ràbia/6.svg', 'utf8'),
          floorId: floorIdx[6],
          startDate,
          buildingMindsID: 'ba8b3d9c-f621-44ec-939e-ad3ce43076f8',
          typeId: 1,
        },
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/sp/can-ràbia/7.svg', 'utf8'),
          floorId: floorIdx[7],
          startDate,
          buildingMindsID: 'a9b2cc1d-4f54-4a18-a1ee-8bcb868c7865',
          typeId: 1,
        },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < barcelonaData.length; i++) {
      barcelonaData[i].areaId = areasIdx[barcelonaData[i].floorId]
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      barcelonaData.map(({ buildingMindsID, seat, areaId }) => {
        return { code: seat, areaId, buildingMindsID, startDate, endDate: null }
      }),
      options
    )
    /** * Amenity ***/
    const oneMonitorAmenity = (
      await queryInterface.bulkInsert(
        'amenities',
        [
          {
            type: 'MULTI',
            filterable: true,
            key: '1 Monitor',
            siteId: sites[0].id,
          },
        ],
        options
      )
    )[0].id

    /** * Amenity values ***/
    const oneMonitorAmenityValue = await queryInterface.bulkInsert(
      'amenityValues',
      [{ amenityId: oneMonitorAmenity, value: '1 Monitor' }],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
