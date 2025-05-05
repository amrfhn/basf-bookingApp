/*
@author: JefriAF
**/
const { returning } = require('./common')
const peruData = require('./data/20230905115700-peru-data-update.json')

module.exports = {
  // 'up' - for transforming into the new state
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const firstLine = peruData[0]

    const SiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Perú'`, options)
    )[0][0].id //return 10

    /** update Sites */
    const updateSites = await queryInterface.bulkUpdate( // bulkUpdate(tableName: string, values: object, identifier: object, options: object, attributes: object): Promise
      'sites',
      { buildingMindsID: firstLine.Site_BM, name: firstLine.New_Site_name },
      { id: SiteId },
      options
    )

    /** update Buildings */
    const updateBuildings = await queryInterface.bulkUpdate(
      'buildings',
      { buildingMindsID: firstLine.Bldg_BM, name: firstLine.New_Bldg_name},
      { siteId: SiteId },
      options
    )

    /** get BuildingId */
    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id //return 11

    /** get Floors */
    const floorsInfo = (
      await queryInterface.sequelize.query(
        `SELECT id, number FROM floors WHERE "buildingId" = ${buildingId} AND "typeId" = 1`,
        options
      )
    )[0] //return [{id: 46, number: 1}, {id: 47, number: 2}]

    /** Floors */
    for (const f of floorsInfo) {
      const thisFloorInfo = peruData.filter((a) => a.Floor_number.toString() === f.number)

      /** update Floors */
      const updateFloors = await queryInterface.bulkUpdate(
        'floors',
        { buildingMindsID: thisFloorInfo[0].Floor_BM, number: thisFloorInfo[0].New_Floor_number.toString() },
        { id: f.id },
        options
      )

      /** get Areas */
      const areasId = (
        await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${f.id}`, options)
      )[0] // return [120, 121]

      /** update Areas */
      const updateAreas = await queryInterface.bulkUpdate(
        'areas',
        { buildingMindsID: thisFloorInfo[0].Floor_BM },
        { id: areasId[0].id },
        options
      )

      /** Seats */
      for (const line of thisFloorInfo ) {
        const seatId = (
          await queryInterface.sequelize.query(
            `SELECT id FROM seats WHERE "areaId" = ${areasId[0].id} and code = '${line.Seat_Code.toString()}'`,
            options
          ) //return seat id example 4857
        )[0][0].id

        /** update Seats */
        const updateSeats = await queryInterface.bulkUpdate(
          'seats',
          { buildingMindsID: line.Seat_BM, code: line.Seat_Code, id: line.Seat_ID },
          { id: seatId },
          options
        )

        /** delete Seats */
        // seats #8284 #8285
        if (line.Seat_BM === 'Delete') {
          await queryInterface.bulkDelete(
            'seats',
            {id: line.Seat_ID },
            options
          )
        }
      }
    }

    await transaction.commit()
  },

  //for reverting the changes
  down: async (queryInterface, Sequelize) => {},
}