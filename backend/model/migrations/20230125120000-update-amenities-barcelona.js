// const { returning } = require('./common')
// const barcelonaData = require('./data/20230125130000-data-seat-amenits-barcelona.json')
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const transaction = await queryInterface.sequelize.transaction()
//     const options = { transaction, returning }
//
//     const siteIds = (
//       await queryInterface.sequelize.query(`SELECT id FROM sites as s WHERE s."buildingMindsID" IS NOT NULL`, options)
//     )[0]
//     const barcelonaSiteId = (
//       await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Barcelona Can Ràbia'`, options)
//     )[0][0].id
//
//     let twoMonitorAmenity
//     let twoMonitorAmenityValue
//     for (const s of siteIds) {
//       /** * Amenity ***/
//       twoMonitorAmenity = (
//         await queryInterface.bulkInsert(
//           'amenities',
//           [
//             {
//               type: 'MULTI',
//               filterable: true,
//               key: '2 Monitors',
//               siteId: s.id,
//             },
//           ],
//           options
//         )
//       )[0].id
//
//       const am = (
//         await queryInterface.sequelize.query(`SELECT id FROM amenities as a WHERE a."siteId" = ${s.id}`, options)
//       )[0]
//
//       /** * Amenity values ***/
//       twoMonitorAmenityValue = (
//         await queryInterface.bulkInsert('amenityValues', [{ amenityId: am[0].id, value: '2 Monitors' }], options)
//       )[0].id
//     }
//     const oneMonitorAmenity = (
//       await queryInterface.sequelize.query(
//         `SELECT id FROM amenities as s WHERE s."key" = '1 Monitor' AND s."siteId" = ${barcelonaSiteId} `,
//         options
//       )
//     )[0][0].id
//     const oneMonitorAmenityValue = (
//       await queryInterface.sequelize.query(
//         `SELECT id FROM "amenityValues" as s WHERE s."value" = '1 Monitor' AND s."amenityId" = ${oneMonitorAmenity} `,
//         options
//       )
//     )[0][0].id
//
//     const ids = barcelonaData.map((s) => s.buildingMindsID)
//     const seats = (
//       await queryInterface.sequelize.query(`SELECT * FROM seats as s WHERE s."buildingMindsID" IN (:ids)`, {
//         replacements: { ids },
//       })
//     )[0]
//
//     const groupBy = (array, key) => {
//       return array.reduce((result, obj) => {
//         ;(result[obj[key]] = result[obj[key]] || []).push(obj)
//         return result
//       }, {})
//     }
//     const seatsGruped = groupBy(seats, 'code')
//     const dataMap = barcelonaData.map((v) => {
//       return { ...v, id: seatsGruped[v.code][0].id }
//     })
//     const seatAmenities = await queryInterface.bulkInsert(
//       'seatAmenities',
//       dataMap.map((seat) => {
//         return { seatId: seat.id, amenityId: seat.monitors === '2' ? twoMonitorAmenity : oneMonitorAmenity }
//       }),
//       options
//     )
//     await queryInterface.bulkInsert(
//       'seatAmenityMultiValues',
//       seatAmenities.map(({ id, amenityId }) => {
//         return {
//           seatAmenityId: id,
//           amenityValueId: amenityId === oneMonitorAmenity ? oneMonitorAmenityValue : twoMonitorAmenityValue,
//         }
//       }),
//       options
//     )
//
//     await transaction.commit()
//   },
//   down: async (queryInterface, Sequelize) => {},
// }
