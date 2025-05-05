const { returning } = require('./common')
const argentinaRepublicaData = require('./data/20230914072947-argentina-republica-sites.json')
const argentinaRepublicaSeats = require('./data/20230914072948-argentina-republica-seats.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

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
      if (thisFloorInfo.length > 0) {
        const areasId = (
          await queryInterface.sequelize.query(
            `SELECT id
                         FROM areas
                         WHERE "floorId" = ${f.id}`,
            options
          )
        )[0]

        // Update Seats and reference the correct Area again
        for (const line of thisFloorInfo) {
          if (line.BM_Seat_ID !== '') {
            const seat = argentinaRepublicaSeats.find((s) => s[0] === line.FOW_Seat_Id)
            const seatOnDatabase = (
              await queryInterface.sequelize.query(
                `SELECT id
                                 FROM seats
                                 WHERE id = ${seat[0]}`,
                options
              )
            )[0][0]
            if (seatOnDatabase === undefined) {
              await queryInterface.bulkInsert(
                'seats',
                [
                  {
                    areaId: areasId[0].id,
                    buildingMindsID: line.BM_Seat_ID,
                    code: line.New_Seat_Code.toString(),
                    startDate: seat[3],
                    endDate: seat[4] === 'NULL' ? null : seat[4],
                    typeId: 1,
                  },
                ],
                options
              )
            } else {
              await queryInterface.bulkUpdate(
                'seats',
                {
                  areaId: areasId[0].id,
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
    }
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
