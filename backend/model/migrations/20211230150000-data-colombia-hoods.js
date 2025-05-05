const hoodsData = require('./data/20211230150000-colombia-hoods.json')

const returning = true

const reducerHoods = (a, c) => {
  a[c.name] = c.id
  return a
}

const reducerSeats = (a, c) => {
  a[c.areaId + '-' + c.seatCode] = c.seatId
  return a
}

const reducerSeatFloors = (a, c) => {
  a[c.floorNumber] = c.floorId
  return a
}
const reducerSeatAreas = (a, c) => {
  a[c.floorId] = c.areaId
  return a
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    /** *  Hoods ***/
    const hoodsRaw = hoodsData[0].hoods
    const hoods = await queryInterface.bulkInsert(
      'hoods',
      hoodsRaw.map((name) => {
        return { name }
      }),
      { transaction, returning }
    )
    const hoodIdx = hoods.reduce(reducerHoods, {})

    /** *  Hoods - OrgCodes ***/
    const hoodOrgCodesRaw = hoodsData[1].hoodOrgCodes
    const hoodOrgCodes = []
    Object.entries(hoodOrgCodesRaw).map(([h, orgCodes]) => {
      return orgCodes.forEach((orgCode) => {
        hoodOrgCodes.push({ hoodId: hoodIdx[h], orgCode })
      })
    })
    await queryInterface.bulkInsert('hoodOrgCodes', hoodOrgCodes, { transaction })

    /** * Seats ***/
    const seatHoodsData = hoodsData[2].seatHoods
    let valuesSeat = ''
    Object.entries(seatHoodsData).map(([h, v]) => {
      return Object.entries(v).map(([f, seats]) => {
        return seats.forEach((seat) => {
          valuesSeat += `('Colombia','Morato',${f},'-',${seat}),`
        })
      })
    })
    valuesSeat = valuesSeat.slice(0, -1)

    const querySeat = `
    SELECT s.id     as "seatId",
      s.code   as "seatCode",
      a.code   as "areaCode",
      a.id as "areaId",
      f.number as "floorNumber",
      f.id as "floorId",
      b.name   as "buildingName",
      si.name  as "siteName"
    FROM seats s
      JOIN areas a ON a.id = s."areaId"
      JOIN floors f ON f.id = a."floorId"
      JOIN buildings b ON b.id = f."buildingId"
      JOIN sites si ON si.id = b."siteId"
    WHERE EXISTS(SELECT *
             FROM (VALUES ${valuesSeat} ) AS aux (site_name, building_name, floor_number, area_code, seat_code)
             WHERE s.code = seat_code
               AND a.code = area_code
               AND f.number = floor_number
               AND b.name = building_name
               AND si.name = site_name);`
    const seats = (await queryInterface.sequelize.query(querySeat, { transaction, returning }))[0]

    const seatsIdx = seats.reduce(reducerSeats, {})
    const floorsIdx = seats.reduce(reducerSeatFloors, {})
    const areasIdx = seats.reduce(reducerSeatAreas, {})

    /** *  Hoods - Seat ***/
    await queryInterface.bulkInsert(
      'seatHoods',
      Object.entries(seatHoodsData).flatMap(([h, v]) => {
        return Object.entries(v).flatMap(([f, a]) => {
          return a.map((s) => {
            const hoodId = hoodIdx[h]
            const floorId = floorsIdx[f]
            const areaId = areasIdx[floorId]
            const seatId = seatsIdx[areaId + '-' + s]

            return { hoodId, seatId }
          })
        })
      }),
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
