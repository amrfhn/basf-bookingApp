const {
  distinct,
  hasHeight,
  getHeight,
  notEmpty,
  getId,
  getSeatId,
  indexer,
  difference,
  returning,
} = require('./common')
const berlinData = require('./data/20211221150000-berlin-amenities-OBC03.json')

const heights = berlinData.filter(hasHeight).map(getHeight).filter(distinct).sort()

const amenityValueIndexFunction = (v) => v.amenityId + '-' + v.value
const reducerAmenityValue = indexer(amenityValueIndexFunction, getId)

const seatIndexFunction = (v) => `${v.seatCode}|${v.areaCode}|${v.floorNumber}|${v.buildingName}|${v.siteName}`
const reducerSeat = indexer(seatIndexFunction, getSeatId)

const seatAmenityIndexFunction = (v) => `${v.seatId}-${v.amenityId}`
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const qsq = async (q) => (await queryInterface.sequelize.query(q, { transaction, returning }))[0]

    /** * Height Amenity ***/
    const heightAmenityId = (await qsq(`SELECT * FROM amenities WHERE "key" = 'height'`))[0].id

    /** * Amenity - Value ***/
    const heightValues = "'" + heights.join("','") + "'"
    const amenityValues = await qsq(
      `SELECT * FROM "amenityValues" WHERE "amenityId" = ${heightAmenityId} AND value in (${heightValues})`
    )
    const diff = difference(
      heights,
      amenityValues.map((a) => a.value)
    )
    const amenityValuesInserted = await queryInterface.bulkInsert(
      'amenityValues',
      diff.map((value) => {
        return { amenityId: heightAmenityId, value }
      }),
      { transaction, returning }
    )
    const joinAmenityValues = [...amenityValuesInserted, ...amenityValues]

    const amenityValuesIdx = joinAmenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.height && notEmpty(data.height)) {
        data.heightAmenityValueId = amenityValuesIdx[heightAmenityId + '-' + data.height]
      }
    }

    /** * Seats ***/
    const valuesSeat = berlinData
      .filter(hasHeight)
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

    const seats = await qsq(querySeat)
    const seatsIdx = seats.reduce(reducerSeat, {})

    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      data.seatId = seatsIdx[data.seat + '|' + data.area + '|' + data.floor + '|' + data.building + '|' + data.site]
    }

    /** * UPDATE ***/
    let dataToUpdate = [...berlinData.filter(hasHeight)]
    const seatAmenitiesToUpdate = await qsq(
      `SELECT * FROM "seatAmenities" WHERE "seatId" in (${seats.map((s) => s.seatId)})`
    )
    const seatAmenitiesToUpdateIdx = seatAmenitiesToUpdate.reduce(reducerSeatsAmenity, {})
    for (let i = 0; i < dataToUpdate.length; i++) {
      const data = dataToUpdate[i]
      if (data.height && data.height.length) {
        data.seatAmenityId = seatAmenitiesToUpdateIdx[`${data.seatId}-${heightAmenityId}`]
      }
    }

    const dataToAdd = dataToUpdate.filter((data) => (data ? data.seatAmenityId === undefined : ''))

    dataToUpdate = dataToUpdate.filter((data) => (data ? data.seatAmenityId !== undefined : ''))
    for (const data of dataToUpdate) {
      await qsq(
        `UPDATE "seatAmenityMultiValues" SET "amenityValueId" = ${data.heightAmenityValueId} WHERE "seatAmenityId" = ${data.seatAmenityId}`
      )
    }
    /** * Seats - Amenity ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      dataToAdd.filter(hasHeight).map((data) => {
        return { seatId: data.seatId, amenityId: heightAmenityId }
      }),
      { transaction, returning }
    )

    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < dataToAdd.length; i++) {
      const data = dataToAdd[i]
      if (data.height && data.height.length) {
        data.seatAmenityId = seatsAmenityIdx[`${data.seatId}-${heightAmenityId}`]
      }
    }

    /** *  Seat - Amenities - Multi - Value ***/
    const seatAmenityMultiValues = await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      dataToAdd.filter(hasHeight).map((data) => {
        return { seatAmenityId: data.seatAmenityId, amenityValueId: data.heightAmenityValueId }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
