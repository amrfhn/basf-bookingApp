const { returning, indexer, getId } = require('./common')
const startDate = '2022-09-01'
const ecullyData = require('./data/20221129110000-data-ecully.json')

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
          name: 'Ecully AGROPOLE',
          country: 'France',
          city: 'Ecully',
          startDate,
          managerRoleId: 11428751,
          adminRoleId: 11428752,
          feedbackContact: 'nicolas.nominet-belinchon@basf.com',
          buildingMindsID: '6fce039c-32e3-4721-92e9-bd03a02bc092',
        },
      ],
      options
    )
    /** * Building * **/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'AGROPOLE',
          address: '21 chemin de la Sauvegarde, 69134 ECULLY',
          reservationDays: 15,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancellationHours: 24,
          siteId: sites[0].id,
          startDate,
          gmt: +1,
          buildingMindsID: 'd3026084-f7d9-42bc-b6dd-94bdbaca2266',
        },
      ],
      options
    )

    /** * Floors * **/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        {
          number: '0',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'e12bc81a-f2c4-42e0-bbf6-a99f3b4f46a1',
          typeId: 1,
        },
        {
          number: '1',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '5c547ed0-ba55-47ce-b5b6-c6b760c65a85',
          typeId: 1,
        },
        {
          number: '2',
          map: '',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: '98946358-9482-496e-87f0-83a1b1b73133',
          typeId: 1,
        },
        {
          number: 'UG',
          map: '-',
          buildingId: buildings[0].id,
          startDate,
          buildingMindsID: 'f24a15ad-8e4f-4ca1-b207-cf6876e1a914',
          typeId: 2,
        },
      ],
      options
    )

    const floorIdx = floors.reduce(reducerFloor, {})
    for (let i = 0; i < ecullyData.length; i++) {
      ecullyData[i].floorId = floorIdx[ecullyData[i].floor]
    }
    /** * Areas * **/
    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/fr/agropole/0.svg', 'utf8'),
          floorId: floorIdx[0],
          startDate,
          buildingMindsID: 'e12bc81a-f2c4-42e0-bbf6-a99f3b4f46a1',
          typeId: 1,
        },
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/fr/agropole/1.svg', 'utf8'),
          floorId: floorIdx[1],
          startDate,
          buildingMindsID: '5c547ed0-ba55-47ce-b5b6-c6b760c65a85',
          typeId: 1,
        },
        {
          code: '-',
          map: await fs.readFile('model/migrations/maps/fr/agropole/2.svg', 'utf8'),
          floorId: floorIdx[2],
          startDate,
          buildingMindsID: '98946358-9482-496e-87f0-83a1b1b73133',
          typeId: 1,
        },
        {
          code: '-',
          map: '-',
          floorId: floorIdx.UG,
          startDate,
          buildingMindsID: 'f24a15ad-8e4f-4ca1-b207-cf6876e1a914',
          typeId: 2,
        },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < ecullyData.length; i++) {
      ecullyData[i].areaId = areasIdx[ecullyData[i].floorId]
    }

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      ecullyData.map(({ buildingMindsID, seat, areaId }) => {
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
