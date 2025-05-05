const {returning} = require("./common")
const argentinaTortuigitasData = require('./data/20231205015434-update-argentina-tortuigitas.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const firstLine = argentinaTortuigitasData[0]

    /* Sites */
    const SiteId = (
      await queryInterface.sequelize.query(
        `SELECT id 
            FROM sites
            WHERE name = 'Argentina'`,
        options
      )
    )[0][0].id

    const sites = await queryInterface.bulkUpdate(
      'sites',
      { buildingMindsID: firstLine.Site_BM, name: firstLine.New_Site_Name },
      { id: SiteId },
      options
    )

    /* Buildings */
    const buildings = await queryInterface.bulkUpdate(
      'buildings',
      { buildingMindsID: firstLine.Building_BM, name: firstLine.New_Building_Name },
      { siteId: SiteId },
      options
    )

    const BuildingId = (
      await queryInterface.sequelize.query(
        `SELECT id
          From buildings
          WHERE "siteId" = ${SiteId}`,
        options
      )
    )[0][0].id

    /* Floors */
    const floorsInfo = (
      await queryInterface.sequelize.query(
        `SELECT id, number
          FROM floors
          WHERE "buildingId" = ${BuildingId}
            AND "typeId" = 1`,
        options
      )
    )[0] // {1058, 1}

    for (const f of floorsInfo) {
      const thisFloorInfo = argentinaTortuigitasData.filter((a) => a.Floor_Name.toString() === f.number)

      const floors = await queryInterface.bulkUpdate(
        'floors',
        { buildingMindsID: thisFloorInfo[0].Floor_BM, number: thisFloorInfo[0].New_Floor_Name.toString(), map: '' },
        { id: f.id },
        options
      )

      /* Areas */
      const areasId = (
        await queryInterface.sequelize.query(
          `SELECT id
            FROM areas
            WHERE "floorId" = ${f.id}`,
          options
        )
      )[0]

      const areas = await queryInterface.bulkUpdate(
        'areas',
        { buildingMindsID: thisFloorInfo[0].Floor_BM, map: '' },
        { id: areasId[0].id },
        options
      )

      /* Seats */
      for (const line of thisFloorInfo) {
        const areaId = areasId[0].id

        const seatId = (
          await queryInterface.sequelize.query(
            `SELECT id
              FROM seats
              WHERE "areaId" = ${areaId} and code = '${line.Seat_Name.toString()}'`,
            options
          )
        )[0][0].id

        const seat = await queryInterface.bulkUpdate(
          'seats',
          { buildingMindsID: line.Seat_BM, endDate: null },
          { id: seatId },
          options
        )
      }

    }

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
};
