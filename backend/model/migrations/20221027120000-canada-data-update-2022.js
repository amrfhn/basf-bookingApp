const { getId, indexer, returning, startDate, endDate } = require('./common')
const canadaData = require('./data/20222710120000-canada-data-update-2022.json')
// USEFUL regex \<switch\>(\s*)<foreignObject((?!</foreignObject>).|\s)*</foreignObject>\s*(((?!</switch>).|\s)*)</switch>

const fs = require('fs').promises

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

const seatAmenityIndexFunction = (v) => v.seatId + '-' + v.amenityId
const reducerSeatsAmenity = indexer(seatAmenityIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const firstLine = canadaData[0]

    const SiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Canada Creekbank'`, options)
    )[0][0].id

    /** * Sites ***/
    const sites = await queryInterface.bulkUpdate(
      'sites',
      { buildingMindsID: firstLine.Site_id, name: firstLine.Site_name },
      { id: SiteId },
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkUpdate(
      'buildings',
      { buildingMindsID: firstLine.building_id, name: firstLine.building_name },
      { siteId: SiteId },
      options
    )

    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id

    // 1 - get floor
    const floorId = (
      await queryInterface.sequelize.query(`SELECT id FROM floors WHERE "buildingId" = ${buildingId}`, options)
    )[0][0].id

    /** * Floors ***/
    const floors = await queryInterface.bulkUpdate(
      'floors',
      { buildingMindsID: firstLine.floor_id, number: firstLine.floor_name },
      { id: floorId },
      options
    )

    /** * Area ***/
    const areaId = (
      await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${floorId}`, options)
    )[0][0].id

    // 2 - update area
    const map = await fs.readFile('./model/migrations/maps/cn/creekbank/BASF_Missasagua_v03.svg', 'utf8')
    const areas = await queryInterface.bulkUpdate(
      'areas',
      { buildingMindsID: firstLine.floor_id, map },
      { id: areaId },
      options
    )

    /** seats */
    const seatsIds = []
    canadaData.forEach(async (line) => {
      const seat = await queryInterface.bulkUpdate(
        'seats',
        { buildingMindsID: line.workspace_id, endDate: null },
        { areaId: areaId, code: line.workspace_name },
        options
      )
      seatsIds.push(seat[0].id)
    })

    await queryInterface.bulkDelete('amenities', { key: 'monitors-ec' }, options)
    const oneMonitorAmenity = (
      await queryInterface.bulkInsert(
        'amenities',
        [
          {
            type: 'MULTI',
            filterable: true,
            key: '1 Monitor',
            siteId: SiteId,
          },
        ],
        options
      )
    )[0].id

    const oneMonitorAmenityValue = await queryInterface.bulkInsert(
      'amenityValues',
      [{ amenityId: oneMonitorAmenity, value: '1 Monitor' }],
      options
    )

    const seatAmenities = await queryInterface.bulkInsert(
      'seatAmenities',
      seatsIds.map((id) => {
        return { seatId: id, amenityId: oneMonitorAmenity }
      }),
      options
    )

    await queryInterface.bulkInsert(
      'seatAmenityMultiValues',
      seatAmenities.map(({ id }) => {
        return { seatAmenityId: id, amenityValueId: oneMonitorAmenityValue[0].id }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
