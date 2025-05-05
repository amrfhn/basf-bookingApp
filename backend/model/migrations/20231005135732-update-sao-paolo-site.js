const {returning} = require("./common")
const saoPaoloData = require('./data/20231005135732-update-sao-paolo-site.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const firstLine = saoPaoloData[0]

    /* Sites */
    const SiteId = (
      await queryInterface.sequelize.query(
        `SELECT id 
            FROM sites 
            WHERE name = 'Morumbi'`,
        options
      )
    )[0][0].id //26

    const sites = await queryInterface.bulkUpdate(
      'sites',
      { buildingMindsID: firstLine.BM_Site_Id, name: firstLine.BM_Site_Name },
      { id: SiteId },
      options
    )

    /* Buildings */
    const buildings = await queryInterface.bulkUpdate(
      'buildings',
      { buildingMindsID: firstLine.BM_Building_Id, name: firstLine.BM_Building_Name },
      { siteId: SiteId },
      options
    )

    const buildingId = (
      await queryInterface.sequelize.query(
        `SELECT id 
            FROM buildings 
            WHERE "siteId" = ${SiteId}`,
        options
      )
    )[0][0].id //19

    /* Floors */
    const floorsInfo = (
      await queryInterface.sequelize.query(
        `SELECT id, number
          FROM floors
          WHERE "buildingId" = ${buildingId}
            AND "typeId" = 1`,
        options
      )
    )[0] //[{id: 1048, number: '14'}, {id: 1051, number: '9'}, {id: 1055, number: '17'}, {id: 1052, number: '12'}, {id: 1053, number: '15'}, {id: 1054, number: '16'}

    for (const f of floorsInfo) {
      const thisFloorInfo = saoPaoloData.filter((a) => a.Fow_Floor_Name.toString() === f.number)

      const floors = await queryInterface.bulkUpdate(
        'floors',
        { buildingMindsID: thisFloorInfo[0].BM_Floor_Id, map: '', number: thisFloorInfo[0].BM_Floor_Name.toString() },
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
      )[0] //[270, 272, 269, 271],
      const areas = await queryInterface.bulkUpdate(
        'areas',
        { buildingMindsID: thisFloorInfo[0].BM_Floor_Id, map: '' },
        { id: areasId[0].id },
        options
      )

      for (const thisArea of areasId) {
        for (const line of thisFloorInfo) {
          const seatId = (
            await queryInterface.sequelize.query(
              `SELECT id
                FROM seats
                WHERE "areaId" = ${thisArea.id}
                  and code = '${line.BM_Seat_Name.toString()}'`,
              options
            )
          )[0][0]

          if (seatId !== undefined) {
            const seat = await queryInterface.bulkUpdate(
              'seats',
              { buildingMindsID: line.BM_Seat_Id, areaId: areasId[0].id },
              { id: seatId.id },
              options
            )
          }
        }

        if(thisArea.id !== areasId[0].id) {
          await queryInterface.bulkDelete('areas', { id: thisArea.id }, options)
        }
      }
    }

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
};
