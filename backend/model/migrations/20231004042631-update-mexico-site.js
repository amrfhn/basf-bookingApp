const { returning } = require('./common')
const mexicoData = require('./data/20231004042631-update-mexico-site.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const firstLine = mexicoData[0]

    /* Sites */
    const SiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'México'`, options)
    )[0][0].id //23

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

    const BuildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id //16

    /* Floors */
    const floorsInfo = (
      await  queryInterface.sequelize.query(
        `SELECT id, number FROM floors WHERE "buildingId" = ${BuildingId} AND "typeId" = 1`, options)
    )[0]
      // [ { id: 1040, number: '3' }, { id: 1041, number: '4' },  { id: 1042, number: '5' }, { id: 1043, number: '6' }]

    for(const f of floorsInfo) {
      const thisFloorInfo = mexicoData.filter((a) => a.BM_Floor_Name.toString() === f.number)

      const floors = await queryInterface.bulkUpdate(
        'floors',
        { buildingMindsID: thisFloorInfo[0].BM_Floor_Id, map: '' },
        { id: f.id },
        options
      )

      /* Areas */
      const areasId = (
        await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${f.id}`, options)
      )[0] //[209, 210, 211]
      const areas = await queryInterface.bulkUpdate(
        'areas',
        { buildingMindsID: thisFloorInfo[0].BM_Floor_Id, map: '' },
        { id: areasId[0].id },
        options
      )

      for(const a of areasId) {
        for (const line of thisFloorInfo) {
          /* Seats */
          const seatId = (
            await  queryInterface.sequelize.query(`SELECT id FROM seats WHERE "areaId" = ${a.id} AND "id" = ${line.Fow_Seat_Id} `, options)
          )[0][0]

          if (seatId !== undefined) {
            const seats = await queryInterface.bulkUpdate(
              'seats',
              {
                buildingMindsID: line.BM_Workspace_Id,
                code: line.BM_Workspace_Code,
                endDate: line.Workspace_Bookable === "False"  ? '2023-10-09' : null,
                areaId: areasId[0].id,
              },
              { id: seatId.id },
              options
            )
          }
        }
        if(a.id !== areasId[0].id) {
          await queryInterface.bulkDelete('areas', { id: a.id }, options)
        }
      }
    }

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
};
