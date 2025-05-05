/*
@author: JefriAF
**/

const { returning } = require('./common')
const argentinaRepublicaData = require('./data/20230914072946-argentina-republica-sites.json')

module.exports = {
  up: async (queryInterface, Sequelize) =>  {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const firstLine = argentinaRepublicaData[0]

    /* Sites **/
    // create new site
    const sites = await queryInterface.bulkInsert(
      'sites',
      [
        {
          buildingMindsID: firstLine.Site_BM,
          name: firstLine.New_Site_name,
          country: 'Argentina',
          city: 'Buenos Aires',
          startDate: '2021-01-01',
          managerRoleId: '11141618',
          adminRoleId: '11170912',
          feedbackContact: 'alejandro.ocampo@basf.com; guido.a.parisi@basf.com; adrian.guevara@basf.com',
          anonymizationDaysConfig: 3650,
          deletionDays: 3650
        }
      ],
      options
    )

    /* Buildings **/
    // query building name Republica ==> buildingId = 10
    const buildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE name = 'República'`, options)
    )[0][0].id


    // update building
    const buildings = await queryInterface.bulkUpdate(
      'buildings',
      { buildingMindsID: firstLine.Building_BM, siteId: sites[0].id, name: firstLine.New_Building_Name },
      { id: buildingId },
      options
    )

    /* Floors **/
    //query each floors data
    const floorsInfo = ( //  [ { id: 1000, number: '18' }, { id: 1049, number: '17' } ],
      await queryInterface.sequelize.query(
        `SELECT id, number FROM floors WHERE "buildingId" = ${buildingId} AND "typeId" = 1`, options
      )
    )[0]

    for (const f of floorsInfo) {
      let thisFloorInfo = argentinaRepublicaData
        .filter(a => a.FOW_Floor_Number.toString() === f.number)

      thisFloorInfo = thisFloorInfo.filter(b => Object.keys(b).includes("Floor_BM"))

      if (thisFloorInfo.length > 0)  {
        const floors = await queryInterface.bulkUpdate(
          'floors',
          { buildingMindsID:  thisFloorInfo[0].Floor_BM, map: '', number: thisFloorInfo[0].New_Floor_number.toString() },
          { id: f.id },
          options
        )

        /* Seats **/
        for (const line of thisFloorInfo) {
          const seat = await queryInterface.bulkUpdate(
            'seats',
            { buildingMindsID: line.BM_Seat_ID, id: line.FOW_Seat_Id, code: line.New_Seat_Code.toString() },
            { id: line.FOW_Seat_Id },
            options
          )
        }
      }
    }
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {}
};
