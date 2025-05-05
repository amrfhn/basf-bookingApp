const berlinData = require('./data/20211117123236-berlin-amenities-OBC03.json')
const returning = true

const hasMonitors = (r) => r.monitors

const reducerSeat = (a, c) => {
  a[c.seatCode + '|' + c.areaCode + '|' + c.floorNumber + '|' + c.buildingName + '|' + c.siteName] = c.seatId
  return a
}

const reducerSeatsAmenity = (a, c) => {
  a[c.seatId + '-' + c.amenityId] = c.id
  return a
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const qsq = async (q) => (await queryInterface.sequelize.query(q, { transaction, returning }))[0]

    /** * Monitors Amenity ***/
    const monitorAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities WHERE "key" = 'monitors'`)
    )[0][0].id

    /** * Seats ***/
    const valuesSeat = berlinData
      .filter(hasMonitors)
      .map((data) => `('${data.site}','${data.building}',${data.floor},'${data.area}',${data.seat})`)
      .join(',')

    const querySeat = `
    SELECT s.id     as "seatId",
      s.code   as "seatCode",
      a.code   as "areaCode",
      f.number as "floorNumber",
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
    const seatsIdx = seats.reduce(reducerSeat, {})

    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.monitors) {
        data.monitorAmenityId = monitorAmenityId
      }
      data.seatId = seatsIdx[data.seat + '|' + data.area + '|' + data.floor + '|' + data.building + '|' + data.site]
    }

    /** *  UPDATE ***/
    let dataToUpdate = [...berlinData.filter(hasMonitors)]
    const seatAmenitiesToUpdate = await qsq(
      `SELECT * FROM "seatAmenities" WHERE "seatId" in (${seats.map((s) => s.seatId)})`
    )
    const seatAmenitiesToUpdateIdx = seatAmenitiesToUpdate.reduce(reducerSeatsAmenity, {})
    for (let i = 0; i < dataToUpdate.length; i++) {
      const data = dataToUpdate[i]
      if (data.monitors > 0) {
        data.seatAmenityId = seatAmenitiesToUpdateIdx[`${data.seatId}-${monitorAmenityId}`]
      }
    }

    const dataToAdd = dataToUpdate.filter((data) => (data ? data.seatAmenityId === undefined : ''))
    dataToUpdate = dataToUpdate.filter((data) => (data ? data.seatAmenityId !== undefined : ''))

    for (const data of dataToUpdate) {
      await qsq(
        `UPDATE "seatAmenityNumericValues" SET "value" = ${data.monitors} WHERE "seatAmenityId" = ${data.seatAmenityId}`
      )
    }
    /** *  Seat - Amenities ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      dataToAdd.filter(hasMonitors).map((data) => {
        return { seatId: data.seatId, amenityId: monitorAmenityId }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < dataToAdd.length; i++) {
      const data = dataToAdd[i]
      if (data.monitorAmenityId) {
        data.seatAmenityId = seatsAmenityIdx[data.seatId + '-' + data.monitorAmenityId]
      }
    }
    /** *  Seat - Amenities - Numeric ***/
    const seatAmenityNumericValues = await queryInterface.bulkInsert(
      'seatAmenityNumericValues',
      dataToAdd.filter(hasMonitors).map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data.monitors }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
