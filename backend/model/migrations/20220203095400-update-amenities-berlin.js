const { getId, indexer, returning } = require('./common')
const berlinData = require('./data/20220203095400-data-amenities-berlin.json')

const reducerSeat = (a, c) => {
  a[c.seatCode + '|' + c.areaCode + '|' + c.floorNumber + '|' + c.buildingName + '|' + c.siteName] = c.seatId
  return a
}

const seatAmenityIndexFunction = (v) => v.seatId + '-' + v.amenityId
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

const amenityValueIndexFunction = (v) => v.amenityId + '-' + v.value
const reducerAmenityValue = indexer(amenityValueIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * GET AMENITY ENTRIES ***/
    const allAmenities = (
      await queryInterface.sequelize.query(
        `SELECT * FROM amenities WHERE "key" in ('monitors',  'dock', 'height', 'desk') AND "siteId" = (SELECT id FROM sites WHERE "name" = 'HUB Berlin')`,
        options
      )
    )[0]

    const amenityIdx = {}
    allAmenities.forEach((a) => (amenityIdx[a.key] = a.id))

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

    async function upsertSeatAmenity(data, amenity, amenityIdx) {
      const seats = data.filter((blData) => Boolean(blData[amenity]))
      const query =
        'INSERT INTO "seatAmenities" ("seatId", "amenityId") VALUES ' +
        seats
          .map((seat) => {
            return (
              '(' +
              seatsIdx[seat.seat + '|' + seat.area + '|' + seat.floor + '|' + seat.building + '|' + seat.site] +
              ',' +
              amenityIdx[amenity] +
              ')'
            )
          })
          .join(',') +
        ' ON CONFLICT ("seatId", "amenityId") DO UPDATE SET "seatId" = EXCLUDED."seatId", "amenityId" = EXCLUDED."amenityId" RETURNING *;'

      const seatAmenities = (await queryInterface.sequelize.query(query, { transaction }))[0]

      const seatsAmenityIdx = seatAmenities.reduce(reducerSeatsAmenity, {})
      for (let i = 0; i < seats.length; i++) {
        seats[i].seatAmenityId =
          seatsAmenityIdx[
            seatsIdx[
              seats[i].seat + '|' + seats[i].area + '|' + seats[i].floor + '|' + seats[i].building + '|' + seats[i].site
            ] +
              '-' +
              amenityIdx[amenity]
          ]
      }
      return seats
    }
    async function upsertAmenityNumericValues(data, amenityName) {
      const query =
        'INSERT INTO "seatAmenityNumericValues" ("seatAmenityId", "value") VALUES ' +
        data
          .map((seat) => {
            return '(' + seat.seatAmenityId + ',' + seat[amenityName] + ')'
          })
          .join(',') +
        ' ON CONFLICT ("seatAmenityId") DO UPDATE SET "value" = EXCLUDED."value";'
      await queryInterface.sequelize.query(query, { transaction })
    }
    async function upsertAmenityValues(data, amenityName) {
      const query =
        'INSERT INTO "amenityValues" ("amenityId", "value") VALUES ' +
        data
          .map((seat) => {
            return '(' + amenityIdx[amenityName] + ',' + `'${seat[amenityName]}'` + ')'
          })
          .join(',') +
        ' RETURNING*;'
      const amenityValues = (await queryInterface.sequelize.query(query, { transaction }))[0]

      const amenityValuesIdx = amenityValues.reduce(reducerAmenityValue, {})

      for (let i = 0; i < berlinData.length; i++) {
        berlinData[i][amenityName + 'Id'] = amenityValuesIdx[amenityIdx[amenityName] + '-' + berlinData[i][amenityName]]
      }
    }
    async function upsertAmenityMultiValues(data, amenityName) {
      const query =
        'INSERT INTO "seatAmenityMultiValues" ("seatAmenityId", "amenityValueId") VALUES ' +
        data
          .map((seat) => {
            return '(' + seat.seatAmenityId + ',' + seat[amenityName] + ')'
          })
          .join(',') +
        ' ON CONFLICT ("seatAmenityId") DO UPDATE SET "seatAmenityId" = EXCLUDED."seatAmenityId" RETURNING*;'

      await queryInterface.sequelize.query(query, { transaction })
    }

    const seatsWithMonitors = await upsertSeatAmenity(berlinData, 'monitors', amenityIdx)
    await upsertAmenityNumericValues(seatsWithMonitors, 'monitors')

    const seatsWithDock = await upsertSeatAmenity(berlinData, 'dock', amenityIdx)
    await upsertAmenityValues(seatsWithDock, 'dock')
    await upsertAmenityMultiValues(seatsWithDock, 'dockId')

    const seatsWithDesk = await upsertSeatAmenity(berlinData, 'desk', amenityIdx)
    await upsertAmenityValues(seatsWithDesk, 'desk')
    await upsertAmenityMultiValues(seatsWithDesk, 'deskId')

    // Commented until info from heights is provided
    // const seatsWithHeight = await upsertSeatAmenity(berlinData, 'height', amenityIdx)
    // await upsertAmenityValues(seatsWithHeight, 'height')
    // await upsertAmenityMultiValues(seatsWithHeight, 'heightId')

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
