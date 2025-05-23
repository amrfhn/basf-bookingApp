const berlinData = require('./data/20211022140000-berlin-height-dock-amenity.json')
const returning = true

const hasStandard = (r) => r.standard

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

    /** * Standard Amenity ***/
    const standardAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities WHERE en_name = 'not adjustable'`)
    )[0][0].id

    /** * Delete seatAmenityBooleanValues & seatAmenities ***/
    let seatsToClear = await queryInterface.sequelize.query(
      `SELECT s.id FROM seats s
          INNER JOIN areas a ON a.id = s."areaId"
          INNER JOIN floors f ON a."floorId" = f.id
          INNER JOIN buildings b ON f."buildingId" = b.id
          WHERE b.name = 'OBC03';`,
      { transaction }
    )
    seatsToClear = seatsToClear[0].map((s) => {
      return s.id
    })

    let seatAmenitiesToClear = await queryInterface.sequelize.query(
      `SELECT id FROM "seatAmenities"
            WHERE "amenityId" = ${standardAmenityId} AND "seatId" IN (${seatsToClear});`,
      { transaction }
    )
    seatAmenitiesToClear = seatAmenitiesToClear[0].map((seatAmenityId) => {
      return seatAmenityId.id
    })

    const Op = Sequelize.Op
    await queryInterface
      .bulkDelete('seatAmenityBooleanValues', { seatAmenityId: { [Op.in]: seatAmenitiesToClear } }, { transaction })
      .catch((e) => {
        console.log(e)
      })
    await queryInterface
      .bulkDelete(
        'seatAmenities',
        { id: { [Op.in]: seatAmenitiesToClear }, amenityId: standardAmenityId },
        { transaction }
      )
      .catch((e) => {
        console.log(e)
      })

    /** * Seats ***/
    const valuesSeat = berlinData
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
      if (data.standard) {
        data.standardAmenityId = standardAmenityId
      }
      data.seatId = seatsIdx[data.seat + '|' + data.area + '|' + data.floor + '|' + data.building + '|' + data.site]
    }

    /** *  Seat - Amenities ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      berlinData.filter(hasStandard).map((data) => {
        return { seatId: data.seatId, amenityId: data.standardAmenityId }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.standardAmenityId) {
        data.seatAmenityId = seatsAmenityIdx[data.seatId + '-' + data.standardAmenityId]
      }
    }

    /** *  Seat - Amenities - Boolean ***/
    await queryInterface.bulkInsert(
      'seatAmenityBooleanValues',
      berlinData.filter(hasStandard).map((data) => {
        return { seatAmenityId: data.seatAmenityId, value: data.standard === 'true' }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    /** * Standard Amenity ***/
    const standardAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities WHERE en_name = 'not adjustable'`)
    )[0][0].id

    /** * Delete seatAmenityBooleanValues & seatAmenities ***/
    let seatsToClear = await queryInterface.sequelize.query(
      `SELECT s.id FROM seats s
          INNER JOIN areas a ON a.id = s."areaId"
          INNER JOIN floors f ON a."floorId" = f.id
          INNER JOIN buildings b ON f."buildingId" = b.id
          WHERE b.name = 'OBC03';`,
      { transaction }
    )
    seatsToClear = seatsToClear[0].map((s) => {
      return s.id
    })

    let seatAmenitiesToClear = await queryInterface.sequelize.query(
      `SELECT id FROM "seatAmenities"
            WHERE "amenityId" = ${standardAmenityId} AND "seatId" IN (${seatsToClear});`,
      { transaction }
    )
    seatAmenitiesToClear = seatAmenitiesToClear[0].map((seatAmenityId) => {
      return seatAmenityId.id
    })

    const Op = Sequelize.Op
    await queryInterface
      .bulkDelete('seatAmenityBooleanValues', { seatAmenityId: { [Op.in]: seatAmenitiesToClear } }, { transaction })
      .catch((e) => {
        console.log(e)
      })
    await queryInterface
      .bulkDelete(
        'seatAmenities',
        { id: { [Op.in]: seatAmenitiesToClear }, amenityId: standardAmenityId },
        { transaction }
      )
      .catch((e) => {
        console.log(e)
      })

    await transaction.commit()
  },
}
