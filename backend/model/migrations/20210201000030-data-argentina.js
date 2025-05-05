const fs = require('fs').promises
const startDate = '2021-01-01'
const endDate = '2021-01-01'

const options = { returning: true }

const reducerAreas = (a, c) => {
  a[c.code] = c.id
  return a
}

const range = (length) => Array.from({ length }, (_, i) => i + 1)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [{ name: 'Argentina', country: 'Argentina', city: 'Buenos Aires', startDate }],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'República',
          address: '',
          reservationDays: 14,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: -5,
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [{ number: 18, map: '', buildingId: buildings[0].id, startDate }],
      options
    )

    /* Areas */
    const areas = await queryInterface.bulkInsert(
      'areas',
      ['Zona1', 'Zona2', 'Zona3'].map((code) => {
        return { code, map: '', floorId: floors[0].id, startDate }
      }),
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      [
        ['Zona1', 36, 0],
        ['Zona2', 39, 36],
        ['Zona3', 46, 75],
      ].flatMap(([areaCode, length, offset]) =>
        range(length).map((code) => {
          return { code: code + offset, areaId: areasIdx[areaCode], startDate, endDate }
        })
      ),
      options
    )

    /** * Enable seats ***/
    const toEnable = {
      Zona1: [3, 5, 9, 10, 14, 20, 21, 26, 28],
      Zona2: [41, 43, 47, 48, 54, 60, 61, 65, 67, 68, 72, 73],
      Zona3: [78, 80, 85, 91, 93, 97, 107, 108, 111],
    }

    const values = Object.entries(toEnable)
      .map(([k, v]) => "('" + k + "', " + v.join("), ('" + k + "', ") + ')')
      .join(',\n')

    await queryInterface.sequelize.query(
      'UPDATE seats s SET "endDate" = null WHERE EXISTS ( SELECT * FROM ( VALUES ' +
        values +
        ' )  AS enables (area_code, seat_code), buildings b INNER JOIN floors f ON b.id = f."buildingId" INNER JOIN areas a ON f.id = a."floorId" ' +
        ' WHERE s.code = seat_code AND a.code = area_code AND s."areaId" = a.id AND b."name" = \'República\' );'
    )

    /** *  Maps ***/
    const floorMap = (await fs.readFile('./model/migrations/maps/ar/republica/18/floor.svg', 'utf8')).replace(
      /'/g,
      "''"
    )
    const svg = {
      Zona1: await fs.readFile('./model/migrations/maps/ar/republica/18/zona1.svg', 'utf8'),
      Zona2: await fs.readFile('./model/migrations/maps/ar/republica/18/zona2.svg', 'utf8'),
      Zona3: await fs.readFile('./model/migrations/maps/ar/republica/18/zona3.svg', 'utf8'),
    }

    // Floor
    await queryInterface.sequelize.query(`UPDATE floors SET map = '${floorMap}' WHERE "id" = ${floors[0].id};`)

    // Areas
    await Promise.all(
      Object.entries(svg).map(([a, m]) => {
        const mFixed = m.replace(/'/g, "''")
        const query = `UPDATE areas SET map = '${mFixed}' WHERE "id" = ${areasIdx[a]};`
        return queryInterface.sequelize.query(query)
      })
    )
  },
  down: async (queryInterface, Sequelize) => {},
}
