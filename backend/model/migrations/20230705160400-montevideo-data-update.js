// const { returning } = require('./common')
// const montevideoData = require('./data/20230705160400-montevideo-data-update.json')
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const transaction = await queryInterface.sequelize.transaction()
//     const options = { transaction, returning }
//
//     const SiteId = (
//       await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'HUB Montevideo'`, options)
//     )[0][0].id
//
//     const firstLine = montevideoData[0]
//     /** * Sites ***/
//     const sites = await queryInterface.bulkUpdate(
//       'sites',
//       { buildingMindsID: firstLine.site_id, name: firstLine.site_name },
//       { id: SiteId },
//       options
//     )
//
//     /** * Buildings ***/
//     const buildings = await queryInterface.bulkUpdate(
//       'buildings',
//       { buildingMindsID: firstLine.building_id, name: firstLine.building_name },
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
//       const thisFloorInfo = montevideoData.filter((a) => a.floor_name.toString() === f.number)
//       const floors = await queryInterface.bulkUpdate(
//         'floors',
//         { buildingMindsID: thisFloorInfo[0].floor_id },
//         { id: f.id },
//         options
//       )
//
//       /** * Area ***/
//       const areaId = (
//         await queryInterface.sequelize.query(`SELECT id FROM areas WHERE "floorId" = ${f.id}`, options)
//       )[0][0].id
//       // 2 - update area
//       const areas = await queryInterface.bulkUpdate(
//         'areas',
//         { buildingMindsID: thisFloorInfo[0].floor_id },
//         { id: areaId },
//         options
//       )
//       if (f.number === '18') await queryInterface.bulkDelete('seats', { code: '41', areaId: areaId }, options)
//       if (f.number === '19') await queryInterface.bulkDelete('seats', { code: '1', areaId: areaId }, options)
//       if (f.number === '20') await queryInterface.bulkDelete('seats', { code: '45', areaId: areaId }, options)
//       if (f.number === '21') await queryInterface.bulkDelete('seats', { code: '85', areaId: areaId }, options)
//       if (f.number === '23') await queryInterface.bulkDelete('seats', { code: '77', areaId: areaId }, options)
//       if (f.number === '25') await queryInterface.bulkDelete('seats', { code: '83', areaId: areaId }, options)
//
//       /** seats */
//       for (const line of thisFloorInfo) {
//         const workspaceNameFixedToCurrent = line.workspace_name.substring(3).startsWith('0')
//           ? line.workspace_name.substring(4).toString()
//           : line.workspace_name.substring(3).toString()
//         const seatId = (
//           await queryInterface.sequelize.query(
//             `SELECT id FROM seats WHERE "areaId" = ${areaId} and code = '${workspaceNameFixedToCurrent}'`,
//             options
//           )
//         )[0][0].id
//         const seat = await queryInterface.bulkUpdate(
//           'seats',
//           { buildingMindsID: line.workspace_id, code: line.workspace_name, endDate: null },
//           { id: seatId },
//           options
//         )
//       }
//     }
//
//     await queryInterface.bulkDelete('amenities', { key: 'Dock' }, options)
//
//     await transaction.commit()
//   },
//   down: async (queryInterface, Sequelize) => {},
// }
