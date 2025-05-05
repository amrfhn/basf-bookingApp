const { returning } = require('./common')
const argentinaRepublicaData = require('./data/20230914072947-argentina-republica-sites.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const firstLine = argentinaRepublicaData[0]

    // Reference the old Building to the new Site
    const buildingId = (
      await queryInterface.sequelize.query(
        `SELECT id
                 FROM buildings
                 WHERE name = 'Republica Building'`,
        options
      )
    )[0][0].id

    // Get Floors [ { id: 1000, number: '18' }, { id: 1049, number: '17' } ],
    const floors = (
      await queryInterface.sequelize.query(
        `SELECT id, number
                 FROM floors
                 WHERE "buildingId" = ${buildingId}
                   AND "typeId" = 1`,
        options
      )
    )[0]

    for (const f of floors) {
      let thisFloorInfo = argentinaRepublicaData.filter((a) => a.FOW_Floor_Number.toString() === f.number)
      thisFloorInfo = thisFloorInfo.filter((b) => Object.keys(b).includes('Floor_BM'))
      console.log(thisFloorInfo.length)
      if (thisFloorInfo.length > 0) {
        // Update the Floor
        const floors = await queryInterface.bulkUpdate(
          'floors',
          {
            buildingMindsID: thisFloorInfo[0].Floor_BM,
            map: '',
            number: thisFloorInfo[0].New_Floor_number.toString(),
          },
          { id: f.id },
          options
        )

        // Update Areas
        // BM does not handle Areas
        // Delete Areas and left only one
        let areasId = (
          await queryInterface.sequelize.query(
            `SELECT id
                         FROM areas
                         WHERE "floorId" = ${f.id}`,
            options
          )
        )[0]

        let area = null
        for (const a of areasId) {
          if (areasId.length > 1) {
            // Delete Area
            await queryInterface.bulkDelete('areas', { id: a.id }, options)
            areasId = areasId.filter((ar) => ar.id !== a.id)
          } else {
            // Update Area & add the reference to the floor
            area = await queryInterface.bulkUpdate(
              'areas',
              { buildingMindsID: thisFloorInfo[0].Floor_BM, map: '' },
              { id: a.id },
              options
            )
          }
        }

        // Update Seats and reference the correct Area again
        for (const line of thisFloorInfo) {
          if (!line.BM_Seat_ID) {
            await queryInterface.bulkUpdate(
              'seats',
              {
                areaId: area[0].id,
                buildingMindsID: line.BM_Seat_ID,
                code: line.New_Seat_Code.toString(),
              },
              { id: line.FOW_Seat_Id },
              options
            )
          }
        }
      }
    }
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
