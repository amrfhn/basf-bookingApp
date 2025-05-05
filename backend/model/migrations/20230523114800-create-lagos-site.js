// const { returning, indexer, getId } = require('./common')
// const startDate = '2023-05-01'
//
// const fs = require('fs').promises
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const transaction = await queryInterface.sequelize.transaction()
//     const options = { transaction, returning }
//
//     /** * Site * **/
//     const sites = await queryInterface.bulkInsert(
//       'sites',
//       [
//         {
//           name: 'BASF West Africa',
//           country: 'Nigeria',
//           city: 'Lagos',
//           startDate,
//           managerRoleId: 11589590,
//           adminRoleId: 11589588,
//           feedbackContact: 'opeyemi.adebola@basf.com',
//           buildingMindsID: '6ea5a39a-047c-4f8d-b458-1aaccf8fa2e0',
//         },
//       ],
//       options
//     )
//     /** * Building * **/
//     const buildings = await queryInterface.bulkInsert(
//       'buildings',
//       [
//         {
//           name: 'Regus',
//           address: 'Plot 9 Gbagda Industrial Scheme, Gbagada',
//           reservationDays: 7,
//           managerReservationDays: 30,
//           cancellationHours: 1,
//           reservationCancellationHours: 24,
//           siteId: sites[0].id,
//           startDate,
//           gmt: 0,
//           buildingMindsID: 'bc94f721-78a1-4e9c-a84e-fb0d2d02f094',
//         },
//       ],
//       options
//     )
//
//     /** * Floors * **/
//     const floors = await queryInterface.bulkInsert(
//       'floors',
//       [
//         {
//           number: 'Ground floor',
//           map: '',
//           buildingId: buildings[0].id,
//           startDate,
//           buildingMindsID: 'ae0e8d90-4ba1-41d2-9718-ec01711a6e3f',
//           typeId: 1,
//         },
//       ],
//       options
//     )
//
//     /** * Areas * **/
//     const areas = await queryInterface.bulkInsert(
//       'areas',
//       [
//         {
//           code: '-',
//           map: '',
//           floorId: floors[0].id,
//           startDate,
//           buildingMindsID: 'ae0e8d90-4ba1-41d2-9718-ec01711a6e3f',
//           typeId: 1,
//         },
//       ],
//       options
//     )
//
//     await transaction.commit()
//   },
//   down: async (queryInterface, Sequelize) => {},
// }
