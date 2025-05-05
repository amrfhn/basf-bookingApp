const { returning, startDate, endDate, indexer, getId } = require('./common')
const seatsToCreate = require('./data/202201041140-data-floor17-argentina.json')

const fs = require('fs').promises
const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE name = 'República'`, options)
    )[0][0].id

    /** * Floors ***/
    const floorMap = await fs.readFile('./model/migrations/maps/ar/republica/17/floor.svg', 'utf8')

    const floorId = (
      await queryInterface.bulkInsert(
        'floors',
        [{ number: 17, map: floorMap, buildingId: buildingId, startDate }],
        options
      )
    )[0].id

    for (let i = 0; i < seatsToCreate.length; i++) {
      seatsToCreate[i].floorId = floorId
    }

    /** * Areas ***/
    const areaMaps = {
      zona1: await fs.readFile('./model/migrations/maps/ar/republica/17/zona1.svg', 'utf8'),
      zona2: await fs.readFile('./model/migrations/maps/ar/republica/17/zona2.svg', 'utf8'),
      zona3: await fs.readFile('./model/migrations/maps/ar/republica/17/zona3.svg', 'utf8'),
    }

    const areas = await queryInterface.bulkInsert(
      'areas',
      [
        { code: 'Zona1', map: areaMaps.zona1, floorId: floorId, startDate },
        { code: 'Zona2', map: areaMaps.zona2, floorId: floorId, startDate },
        { code: 'Zona3', map: areaMaps.zona3, floorId: floorId, startDate },
      ],
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})
    for (let i = 0; i < seatsToCreate.length; i++) {
      seatsToCreate[i].areaId = areasIdx[seatsToCreate[i].floorId + '-' + seatsToCreate[i].area]
    }

    /** * Seats ***/
    await queryInterface.bulkInsert(
      'seats',
      seatsToCreate.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )
    await transaction.commit()
  },
  down: async () => {},
}
