const { distinct, hasDesk, getDesk, notEmpty, getId, getSeatId, indexer, returning } = require('./common')
const deskData = require('./data/20211028095000-berlin-desk-amenity.json')

const desks = deskData.filter(hasDesk).map(getDesk).filter(distinct).sort()

const deskAmenityToInsert = [{ key: 'desk', type: 'MULTI' }]

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

    const notAdjustableAmenityId = (await qsq(`SELECT id FROM amenities WHERE key = 'not adjustable'`))[0].id
    const manualAdjustableAmenityId = (await qsq(`SELECT id FROM amenities WHERE key = 'manual adjustable'`))[0].id
    const electricAmenityId = (await qsq(`SELECT id FROM amenities WHERE key = 'electric'`))[0].id

    const amenityIds = `(${notAdjustableAmenityId},${manualAdjustableAmenityId},${electricAmenityId})`

    const seatAmenityIds = (await qsq(`SELECT id FROM "seatAmenities" WHERE "amenityId" in ${amenityIds}`))
      .map(getId)
      .join(',')

    await qsq(`DELETE FROM "seatAmenityBooleanValues" WHERE "seatAmenityId" in (${seatAmenityIds})`)
    await qsq(`DELETE FROM "seatAmenities" WHERE "id" in (${seatAmenityIds})`)
    await qsq(`DELETE FROM "amenities" WHERE "id" in ${amenityIds}`)

    /** * Desk Amenity ***/
    let deskAmenity = await queryInterface.bulkInsert('amenities', deskAmenityToInsert, { transaction, returning })
    deskAmenity = deskAmenity[0]

    /** * Amenity - Value ***/
    const amenityValues = await queryInterface.bulkInsert(
      'amenityValues',
      desks.map((value) => {
        return { amenityId: deskAmenity.id, value }
      }),
      { transaction, returning }
    )
    const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < deskData.length; i++) {
      const data = deskData[i]
      if (data.desk && notEmpty(data.desk)) {
        data.deskAmenityValueId = amenityValuesIdx[deskAmenity.id + '-' + data.desk]
      }
    }

    /** * Seats ***/
    const valuesSeat = deskData
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

    for (let i = 0; i < deskData.length; i++) {
      const data = deskData[i]
      data.seatId = seatsIdx[data.seat + '|' + data.area + '|' + data.floor + '|' + data.building + '|' + data.site]
    }

    /** * Seats - Amenity ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      deskData.filter(hasDesk).map((data) => {
        return { seatId: data.seatId, amenityId: deskAmenity.id }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < deskData.length; i++) {
      const data = deskData[i]
      if (data.desk && data.desk.length) {
        data.seatAmenityId = seatsAmenityIdx[`${data.seatId}-${deskAmenity.id}`]
      }
    }

    /** *  Seat - Amenities - Multi - Value ***/
    const seatAmenityMultiValues = await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      deskData.filter(hasDesk).map((data) => {
        return { seatAmenityId: data.seatAmenityId, amenityValueId: data.deskAmenityValueId }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
