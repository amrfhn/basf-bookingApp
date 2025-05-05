// Useful Excel function
// =CONCAT("{""site"":""HUB Berlin"",""building"":""OBC03"",""floor"":""";B4;""",""area"":""";C4;""",""seat"":""";D4;SI(J4<>"";CONCAT(""",""height"":""";J4);"");SI(K4<>"";CONCAT(""",""dock"":""";K4);"");"""},")

const berlinData = require('./data/20211022140000-berlin-height-dock-amenity.json')
const returning = true

const distinct = (value, index, self) => {
  return self.indexOf(value) === index
}

const hasHeight = (r) => r.height
const getHeight = hasHeight

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

const heightAmenityToInsert = [{ en_name: 'height', es_name: 'altura', de_name: 'höhe', type: 'MULTI' }]

// Get all different heights
const heights = berlinData.filter(hasHeight).map(getHeight).filter(distinct).sort()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let step = ''
    try {
      const transaction = await queryInterface.sequelize.transaction()
      const options = { transaction, returning }

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
                     FROM (VALUES ${valuesSeat}) AS aux (site_name, building_name, floor_number, area_code, seat_code)
                     WHERE s.code = seat_code
                       AND a.code = area_code
                       AND f.number = floor_number
                       AND b.name = building_name
                       AND si.name = site_name);`

      const seats = (await queryInterface.sequelize.query(querySeat, options))[0]
      const seatsIdx = seats.reduce(reducerSeat, {})
      step = 'select seats'

      for (let i = 0; i < berlinData.length; i++) {
        const data = berlinData[i]
        const key = `${data.seat}|${data.area}|${data.floor}|${data.building}|${data.site}`
        data.seatId = seatsIdx[key]
      }

      /** * Height Amenity ***/
      let heightAmenity = await queryInterface.bulkInsert('amenities', heightAmenityToInsert, options)
      heightAmenity = heightAmenity[0]

      step = 'heightAmenity'

      /** * Seats - Amenity ***/
      const seatAmenities = await queryInterface.bulkInsert(
        'seatAmenities',
        berlinData.filter(hasHeight).map((data) => {
          return { seatId: data.seatId, amenityId: heightAmenity.id }
        }),
        options
      )
      const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})

      for (let i = 0; i < berlinData.length; i++) {
        const data = berlinData[i]
        if (data.height) {
          data.seatAmenityId = seatsAmenityIdx[data.seatId + '-' + heightAmenity.id]
        }
      }

      step = 'seatAmenities'

      /** * Amenity - Value ***/
      const amenityValues = await queryInterface.bulkInsert(
        'amenityValues',
        heights.map((value) => {
          return { amenityId: heightAmenity.id, value }
        }),
        options
      )
      const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})
      for (let i = 0; i < berlinData.length; i++) {
        const data = berlinData[i]
        if (data.height) {
          data.heightAmenityValueId = amenityValuesIdx[heightAmenity.id + '-' + data.height]
        }
      }

      step = 'amenityValues'

      /** *  Seat - Amenities - Multi - Value ***/
      const seatAmenityMultiValues = await queryInterface.bulkInsert(
        'seatAmenityMultiValues',
        berlinData.filter(hasHeight).map((data) => {
          return { seatAmenityId: data.seatAmenityId, amenityValueId: data.heightAmenityValueId }
        }),
        options
      )

      await transaction.commit()
    } catch (e) {
      console.error(e)
      console.log(step)
      throw e
    }
  },
  // ################################################################################
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const qsq = async (q) => {
      return (await queryInterface.sequelize.query(q, { transaction, returning }))[0]
    }

    /** * Amenity ***/
    const amenity = (await qsq(`SELECT * FROM amenities WHERE en_name = 'height';`))[0]

    /** * Amenity - Value ***/
    const amenityValues = await qsq(`SELECT id FROM "amenityValues" WHERE "amenityId"=${amenity.id};`)
    const amenityValueIds = amenityValues.map((a) => a.id).join(',')

    /** *  Seat - Amenities - Multi - Value ***/
    await qsq(`DELETE FROM "seatAmenityMultiValues" WHERE "amenityValueId" IN (${amenityValueIds});`)

    /** * Seats - Amenity ***/
    await qsq(`DELETE FROM "seatAmenities" WHERE "amenityId"=${amenity.id};`)

    /** * Amenity - Value ***/
    await qsq(`DELETE FROM "amenityValues" WHERE "amenityId"=${amenity.id};`)

    /** * Dock Amenity ***/
    await qsq(`DELETE FROM amenities WHERE id=${amenity.id};`)

    await transaction.commit()
  },
}
