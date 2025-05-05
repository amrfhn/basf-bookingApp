const { distinct, hasDock, getDock, notEmpty, getId, getSeatId, indexer, difference, returning } = require('./common')
const berlinData = require('./data/20211117123235-berlin-amenities-OBC04.json')

const docks = berlinData.filter(hasDock).map(getDock).filter(distinct).sort()

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

    /** * Dock Amenity ***/
    const dockAmenityId = (await qsq(`SELECT * FROM amenities WHERE "key" = 'dock'`))[0].id

    /** * Amenity - Value ***/
    const docksValues = "'" + docks.join("','") + "'"
    const amenityValues = await qsq(
      `SELECT * FROM "amenityValues" WHERE "amenityId" = ${dockAmenityId} AND value in (${docksValues})`
    )
    const diff = difference(
      docks,
      amenityValues.map((a) => a.value)
    )
    const amenityValuesInserted = await queryInterface.bulkInsert(
      'amenityValues',
      diff.map((value) => {
        return { amenityId: dockAmenityId, value }
      }),
      { transaction, returning }
    )
    const joinAmenityValues = [...amenityValuesInserted, ...amenityValues]

    const amenityValuesIdx = joinAmenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.dock && notEmpty(data.dock)) {
        data.dockAmenityValueId = amenityValuesIdx[dockAmenityId + '-' + data.dock]
      }
    }

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

    const seats = await qsq(querySeat)
    const seatsIdx = seats.reduce(reducerSeat, {})

    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      data.seatId = seatsIdx[data.seat + '|' + data.area + '|' + data.floor + '|' + data.building + '|' + data.site]
    }

    /** * Seats - Amenity ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      berlinData.filter(hasDock).map((data) => {
        return { seatId: data.seatId, amenityId: dockAmenityId }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.dock && data.dock.length) {
        data.seatAmenityId = seatsAmenityIdx[`${data.seatId}-${dockAmenityId}`]
      }
    }

    /** *  Seat - Amenities - Multi - Value ***/
    const seatAmenityMultiValues = await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      berlinData.filter(hasDock).map((data) => {
        return { seatAmenityId: data.seatAmenityId, amenityValueId: data.dockAmenityValueId }
      }),
      { transaction, returning }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
