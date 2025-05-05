// const { returning } = require('./common')
// const costaRicaData = require('./data/20230807150600-costa-rica-data-update.json')
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const transaction = await queryInterface.sequelize.transaction()
//     const options = { transaction, returning }
//
//     const SiteId = (
//       await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Costa Rica'`, options)
//     )[0][0].id
//
//     const firstLine = costaRicaData[0]
//     /** * Sites ***/
//     const sites = await queryInterface.bulkUpdate(
//       'sites',
//       { buildingMindsID: firstLine.Site_BM, name: firstLine.New_Site_name },
//       { id: SiteId },
//       options
//     )
//
//     /** * Buildings ***/
//     const buildings = await queryInterface.bulkUpdate(
//       'buildings',
//       { buildingMindsID: firstLine.Bldg_BM, name: firstLine.New_Bldg_name },
//       { siteId: SiteId },
//       options
//     )
//
//     const buildingId = (
//       await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
//     )[0][0].id
//
//     // 1 - get floor
//     const floorsInfo = (
//       await queryInterface.sequelize.query(
//         `SELECT id, number FROM floors WHERE "buildingId" = ${buildingId} AND "typeId" = 1`,
//         options
//       )
//     )[0]
//
//     /** * Floors ***/
//     for (const f of floorsInfo) {
//       const thisFloorInfo = costaRicaData.filter((a) => a.Floor_number.toString() === f.number)
//       const floors = await queryInterface.bulkUpdate(
//         'floors',
//         { buildingMindsID: thisFloorInfo[0].Floor_BM, map: '', number: thisFloorInfo[0].New_Floor_number.toString() },
//         { id: f.id },
//         options
//       )
//
//       /** * Area ***/
//       const areasId = (
//         await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${f.id}`, options)
//       )[0]
//
//       const areas = await queryInterface.bulkUpdate(
//         'areas',
//         { buildingMindsID: thisFloorInfo[0].Floor_BM },
//         { id: areasId[0].id },
//         options
//       )
//
//       /** seats */
//       for (const line of thisFloorInfo) {
//         const areaId = line.Area_Code === 'A' ? areasId[0].id : areasId[1].id
//         const seatId = (
//           await queryInterface.sequelize.query(
//             `SELECT id FROM seats WHERE "areaId" = ${areaId} and code = '${line.Seat_Code.toString()}'`,
//             options
//           )
//         )[0][0].id
//         const seat = await queryInterface.bulkUpdate(
//           'seats',
//           { buildingMindsID: line.Seat_BM, code: line.New_Seat_Code, endDate: null, areaId: areasId[0].id },
//           { id: seatId },
//           options
//         )
//       }
//
//       await queryInterface.bulkDelete('areas', { id: areasId[1].id }, options)
//     }
//
//     await queryInterface.bulkDelete('amenities', { siteId: SiteId }, options)
//
//     await transaction.commit()
//   },
//   down: async (queryInterface, Sequelize) => {},
// }
