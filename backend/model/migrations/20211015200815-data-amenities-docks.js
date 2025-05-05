// Useful Excel function
// =CONCAT("{""site"":""HUB Berlin"",""building"":""OBC03"",""floor"":""";B4;""",""area"":""";C4;""",""seat"":""";D4;SI(J4<>"";CONCAT(""",""height"":""";J4);"");SI(K4<>"";CONCAT(""",""dock"":""";K4);"");"""},")

const berlinData = require('./data/20211022140000-berlin-height-dock-amenity.json')
const returning = true

const distinct = (value, index, self) => {
  return self.indexOf(value) === index
}

const hasDock = (r) => r.dock
const getDock = hasDock

const reducerAmenityValue = (a, c) => {
  a[c.amenityId + '-' + c.value] = c.id
  return a
}

const reducerSeat = (a, c) => {
  a[c.seatCode + '|' + c.areaCode + '|' + c.floorNumber + '|' + c.buildingName + '|' + c.siteName] = c.seatId
  return a
}

const reducerSeatsAmenity = (a, c) => {
  a[c.seatId + '-' + c.amenityId] = c.id
  return a
}

const dockAmenityToInsert = [{ en_name: 'dock', es_name: 'dock', de_name: 'dock', type: 'MULTI' }]

// Get all different Docks
const docks = berlinData.filter(hasDock).map(getDock).filter(distinct).sort()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

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
      data.seatId = seatsIdx[data.seat + '|' + data.area + '|' + data.floor + '|' + data.building + '|' + data.site]
    }

    /** * Dock Amenity ***/
    let dockAmenity = await queryInterface.bulkInsert('amenities', dockAmenityToInsert, { transaction, returning })
    dockAmenity = dockAmenity[0]

    /** * Seats - Amenity ***/
    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      berlinData.filter(hasDock).map((data) => {
        return { seatId: data.seatId, amenityId: dockAmenity.id }
      }),
      { transaction, returning }
    )
    const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.dock) {
        data.seatAmenityId = seatsAmenityIdx[data.seatId + '-' + dockAmenity.id]
      }
    }

    /** * Amenity - Value ***/
    const amenityValues = await queryInterface.bulkInsert(
      'amenityValues',
      docks.map((value) => {
        return { amenityId: dockAmenity.id, value }
      }),
      { transaction, returning }
    )
    const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})
    for (let i = 0; i < berlinData.length; i++) {
      const data = berlinData[i]
      if (data.dock) {
        data.dockAmenityValueId = amenityValuesIdx[dockAmenity.id + '-' + data.dock]
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
  // ################################################################################
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const qsq = async (q) => {
      return (await queryInterface.sequelize.query(q, { transaction, returning }))[0]
    }

    /** * Dock Amenity ***/
    const dockAmenity = (await qsq(`SELECT * FROM amenities WHERE en_name = 'dock';`))[0]

    /** * Amenity - Value ***/
    const amenityValues = await qsq(`SELECT id FROM "amenityValues" WHERE "amenityId"=${dockAmenity.id};`)
    const amenityValueIds = amenityValues.map((a) => a.id).join(',')

    /** *  Seat - Amenities - Multi - Value ***/
    await qsq(`DELETE FROM "seatAmenityMultiValues" WHERE "amenityValueId" IN (${amenityValueIds});`)

    /** * Seats - Amenity ***/
    await qsq(`DELETE FROM "seatAmenities" WHERE "amenityId"=${dockAmenity.id};`)

    /** * Amenity - Value ***/
    await qsq(`DELETE FROM "amenityValues" WHERE "amenityId"=${dockAmenity.id};`)

    /** * Dock Amenity ***/
    await qsq(`DELETE FROM amenities WHERE id=${dockAmenity.id};`)

    await transaction.commit()
  },
}
