const { distinct, hasDesk, getDesk, notEmpty, getId, getSeatId, indexer, returning } = require('./common')
const berlinData = require('./data/20211221150000-berlin-amenities-OBC03.json')

const desks = berlinData.filter(hasDesk).map(getDesk).filter(distinct).sort()

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

    /** * Desk Amenity ***/
    const deskAmenityId = (await qsq(`SELECT * FROM amenities WHERE "key" = 'desk'`))[0].id

    /** * Amenity - Value ***/
    const desksValues = "'" + desks.join("','") + "'"
    const amenityValues = await qsq(
      `SELECT * FROM "amenityValues" WHERE "amenityId" = ${deskAmenityId} AND value in (${desksValues})`
    )
    const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.desk && notEmpty(data.desk)) {
        data.deskAmenityValueId = amenityValuesIdx[deskAmenityId + '-' + data.desk]
      }
    }

    /** * Seats ***/
    const valuesSeat = berlinData
      .filter(hasDesk)
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
    let dataToUpdate = [...berlinData.filter(hasDesk)]
    const seatAmenitiesToUpdate = await qsq(
      `SELECT * FROM "seatAmenities" WHERE "seatId" in (${seats.map((s) => s.seatId)})`
    )
    const seatAmenitiesToUpdateIdx = seatAmenitiesToUpdate.reduce(reducerSeatsAmenity, {})
    for (let i = 0; i < dataToUpdate.length; i++) {
      const data = dataToUpdate[i]
      if (data.desk) {
        data.seatAmenityId = seatAmenitiesToUpdateIdx[`${data.seatId}-${deskAmenityId}`]
      }
    }

    const dataToAdd = dataToUpdate.filter((data) => (data ? data.seatAmenityId === undefined : ''))
    dataToUpdate = dataToUpdate.filter((data) => (data ? data.seatAmenityId !== undefined : ''))

    for (const data of dataToUpdate) {
      await qsq(
        `UPDATE "seatAmenityMultiValues" SET "amenityValueId" = ${data.deskAmenityValueId} WHERE "seatAmenityId" = ${data.seatAmenityId}`
      )
    }

    /** * Seats - Amenity ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      dataToAdd.filter(hasDesk).map((data) => {
        return { seatId: data.seatId, amenityId: deskAmenityId }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < dataToAdd.length; i++) {
      const data = dataToAdd[i]
      if (data.desk && data.desk.length) {
        data.seatAmenityId = seatsAmenityIdx[`${data.seatId}-${deskAmenityId}`]
      }
    }
    /** *  Seat - Amenities - Multi - Value ***/
    const seatAmenityMultiValues = await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      dataToAdd.filter(hasDesk).map((data) => {
        return { seatAmenityId: data.seatAmenityId, amenityValueId: data.deskAmenityValueId }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
