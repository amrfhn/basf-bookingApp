// const { promises: fs } = require('fs')
// const { returning, startDate } = require('./common')
// /** *
//  * THE INFO IMPORTED IN brasilData VARIABLE ARE SORTED SO THAT THE LOGIC IS ABLE TO PROCESS THEM JUST AS THEY ARE; ANY CHANGE IN THAT FILE MAY AFFECT THE PROCESSING OF THIS MIGRATION
//  * brasilData[0][0] --> floor 14 con elementos que no necesitan hacer swap previo al update
//  * brasilData[0][1] --> floor 14 con 1 swap necesario (los elementos a swappear estan ubicados consecutivamente en pares)
//  * brasilData[0][2] --> floor 14 con 2 swaps necesarios (los elementos a swappear estan ubicados consecutivamente en tripletas)
//  * brasilData[1][0] --> floor 15 con elementos que no necesitan hacer swap previo al update
//  * brasilData[1][1] --> floor 15 con 1 swap necesario (los elementos a swappear estan ubicados consecutivamente en pares)
//  * brasilData[1][2] --> floor 15 con 2 swaps necesarios (los elementos a swappear estan ubicados consecutivamente en tripletas)
//  * brasilData[1][3] --> floor 15 con 3 swaps necesarios (los elementos a swappear estan ubicados consecutivamente en cuadruplas)
//  * brasilData[2][0] --> floor 16 con elementos que no necesitan hacer swap previo al update
//  * brasilData[2][1] --> floor 16 con 1 swap necesario (los elementos a swappear estan ubicados consecutivamente en pares)
//  * ***/
// const brasilData = require('./data/20230504144200-data-Brazil-maps-update.json')
//
// module.exports = {
//   up: async (queryInterface, _Sequelize) => {
//     let transaction = await queryInterface.sequelize.transaction()
//     let options = { transaction, returning }
//
//     /** * FLOOR 12 PROCESSING ***/
//     let floorAreaId = (
//       await queryInterface.sequelize.query(`
//           SELECT f.id FROM floors f
//              inner join buildings b on b.id = f."buildingId"
//              inner join sites s on s.id = b."siteId"
//           WHERE number = '12' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
//     )[0][0].id
//
//     let areaA1Id = (
//       await queryInterface.sequelize.query(`
//         SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//         WHERE name = 'Rochavera' and f.number = '12' and a.code = 'a1'`)
//     )[0][0].id
//
//     let areaA2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '12' and a.code = 'a2'`)
//     )[0][0].id
//
//     // CREATE NEW SEATS FOR FLOOR 12 AREA A2
//     await queryInterface.bulkInsert(
//       'seats',
//       [
//         { code: '35', areaId: areaA2Id, startDate, endDate: null, typeId: 1 },
//         { code: '36', areaId: areaA2Id, startDate, endDate: null, typeId: 1 },
//       ],
//       options
//     )
//
//     await transaction.commit()
//     transaction = await queryInterface.sequelize.transaction()
//     options = { transaction, returning }
//
//     let areaB1Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '12' and a.code = 'b1'`)
//     )[0][0].id
//
//     let areaB2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '12' and a.code = 'b2'`)
//     )[0][0].id
//
//     let floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/12/areas.svg', 'utf8')
//     let areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/12/a1.svg', 'utf8')
//     let areaMapA2 = await fs.readFile('./model/migrations/maps/br/rochavera/12/a2.svg', 'utf8')
//     let areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/12/b1.svg', 'utf8')
//     let areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/12/b2.svg', 'utf8')
//
//     // UPDATE MAPS IN FLOOR 12
//     queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
//     queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
//     queryInterface.bulkUpdate('areas', { map: areaMapA2 }, { id: areaA2Id }, { options }) // update area A2
//     queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
//     queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2
//
//     await transaction.commit()
//     transaction = await queryInterface.sequelize.transaction()
//     options = { transaction, returning }
//
//     /** * FLOOR 14 PROCESSING ***/
//     floorAreaId = (
//       await queryInterface.sequelize.query(`
//           SELECT f.id FROM floors f
//              inner join buildings b on b.id = f."buildingId"
//              inner join sites s on s.id = b."siteId"
//           WHERE number = '14' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
//     )[0][0].id
//
//     areaA1Id = (
//       await queryInterface.sequelize.query(`
//         SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//         WHERE name = 'Rochavera' and f.number = '14' and a.code = 'a1'`)
//     )[0][0].id
//
//     areaA2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '14' and a.code = 'a2'`)
//     )[0][0].id
//
//     areaB1Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '14' and a.code = 'b1'`)
//     )[0][0].id
//
//     areaB2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '14' and a.code = 'b2'`)
//     )[0][0].id
//
//     let seatOwnerToDelete = []
//
//     for (const elem of brasilData[0][0]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 1 ||
//         elem.newCode === 4 ||
//         elem.newCode === 47 ||
//         elem.newCode === 75 ||
//         elem.newCode === 76 ||
//         elem.newCode === 78 ||
//         elem.newCode === 162
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       await queryInterface.bulkUpdate(
//         'seats',
//         { code: elem.newCode.toString(), areaId: newAreaId },
//         { id: seatId },
//         { options }
//       )
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//
//     let isFirstSwapper = true
//     let firstSwapperSeatId
//     for (const elem of brasilData[0][1]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 1 ||
//         elem.newCode === 4 ||
//         elem.newCode === 47 ||
//         elem.newCode === 75 ||
//         elem.newCode === 76 ||
//         elem.newCode === 78 ||
//         elem.newCode === 162
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       if (isFirstSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy', areaId: newAreaId }, { id: seatId }, { options })
//         firstSwapperSeatId = seatId
//       } else {
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: firstSwapperSeatId },
//           { options }
//         )
//         firstSwapperSeatId = null
//       }
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//
//       isFirstSwapper = !isFirstSwapper
//     }
//
//     let isSecondSwapper = false
//     let secondSwapperSeatId
//     for (const elem of brasilData[0][2]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 1 ||
//         elem.newCode === 4 ||
//         elem.newCode === 47 ||
//         elem.newCode === 75 ||
//         elem.newCode === 76 ||
//         elem.newCode === 78 ||
//         elem.newCode === 162
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       if (isFirstSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy', areaId: newAreaId }, { id: seatId }, { options })
//         firstSwapperSeatId = seatId
//         isFirstSwapper = false
//         isSecondSwapper = true
//       } else if (isSecondSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy2', areaId: newAreaId }, { id: seatId }, { options })
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         secondSwapperSeatId = seatId
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: firstSwapperSeatId },
//           { options }
//         )
//         firstSwapperSeatId = null
//         isSecondSwapper = false
//       } else {
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: secondSwapperSeatId },
//           { options }
//         )
//         secondSwapperSeatId = null
//         isFirstSwapper = true
//       }
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//
//     for (const seatId of seatOwnerToDelete) {
//       await queryInterface.bulkDelete('seatOwners', { seatId }, options)
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//     seatOwnerToDelete = []
//
//     floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/14/areas.svg', 'utf8')
//     areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/14/a1.svg', 'utf8')
//     areaMapA2 = await fs.readFile('./model/migrations/maps/br/rochavera/14/a2.svg', 'utf8')
//     areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/14/b1.svg', 'utf8')
//     areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/14/b2.svg', 'utf8')
//
//     // UPDATE MAPS IN FLOOR 14
//     queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
//     queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
//     queryInterface.bulkUpdate('areas', { map: areaMapA2 }, { id: areaA2Id }, { options }) // update area A2
//     queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
//     queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2
//
//     await transaction.commit()
//     transaction = await queryInterface.sequelize.transaction()
//     options = { transaction, returning }
//
//     /** * FLOOR 15 PROCESSING ***/
//     floorAreaId = (
//       await queryInterface.sequelize.query(`
//           SELECT f.id FROM floors f
//              inner join buildings b on b.id = f."buildingId"
//              inner join sites s on s.id = b."siteId"
//           WHERE number = '15' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
//     )[0][0].id
//
//     areaA1Id = (
//       await queryInterface.sequelize.query(`
//         SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//         WHERE name = 'Rochavera' and f.number = '15' and a.code = 'a1'`)
//     )[0][0].id
//
//     areaA2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '15' and a.code = 'a2'`)
//     )[0][0].id
//
//     areaB1Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '15' and a.code = 'b1'`)
//     )[0][0].id
//
//     areaB2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '15' and a.code = 'b2'`)
//     )[0][0].id
//
//     for (const elem of brasilData[1][0]) {
//       if (elem.oldArea !== 'b1' && elem.oldArea !== 'b2') {
//         const oldAreaId =
//           elem.oldArea === 'a1'
//             ? areaA1Id
//             : elem.oldArea === 'a2'
//             ? areaA2Id
//             : elem.oldArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//         let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//         seatId = seatId[0][0].id
//         if (
//           elem.newCode === 1 ||
//           elem.newCode === 23 ||
//           elem.newCode === 44 ||
//           elem.newCode === 51 ||
//           elem.newCode === 99 ||
//           elem.newCode === 77 ||
//           elem.newCode === 103 ||
//           elem.newCode === 126 ||
//           elem.newCode === 144
//         ) {
//           seatOwnerToDelete.push(seatId)
//         }
//         let newAreaId = oldAreaId
//         if (elem.oldArea !== elem.newArea) {
//           newAreaId =
//             elem.newArea === 'a1'
//               ? areaA1Id
//               : elem.newArea === 'a2'
//               ? areaA2Id
//               : elem.newArea === 'b1'
//               ? areaB1Id
//               : areaB2Id
//         }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//       }
//     }
//
//     for (const elem of brasilData[1][1]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 1 ||
//         elem.newCode === 23 ||
//         elem.newCode === 44 ||
//         elem.newCode === 51 ||
//         elem.newCode === 99 ||
//         elem.newCode === 77 ||
//         elem.newCode === 103 ||
//         elem.newCode === 126 ||
//         elem.newCode === 144
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       if (isFirstSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy', areaId: newAreaId }, { id: seatId }, { options })
//         firstSwapperSeatId = seatId
//       } else {
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: firstSwapperSeatId },
//           { options }
//         )
//         firstSwapperSeatId = null
//       }
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//
//       isFirstSwapper = !isFirstSwapper
//     }
//
//     for (const elem of brasilData[1][2]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 1 ||
//         elem.newCode === 23 ||
//         elem.newCode === 44 ||
//         elem.newCode === 51 ||
//         elem.newCode === 99 ||
//         elem.newCode === 77 ||
//         elem.newCode === 103 ||
//         elem.newCode === 126 ||
//         elem.newCode === 144
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       if (isFirstSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy', areaId: newAreaId }, { id: seatId }, { options })
//         firstSwapperSeatId = seatId
//         isFirstSwapper = false
//         isSecondSwapper = true
//       } else if (isSecondSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy2', areaId: newAreaId }, { id: seatId }, { options })
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         secondSwapperSeatId = seatId
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: firstSwapperSeatId },
//           { options }
//         )
//         firstSwapperSeatId = null
//         isSecondSwapper = false
//       } else {
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: secondSwapperSeatId },
//           { options }
//         )
//         secondSwapperSeatId = null
//         isFirstSwapper = true
//       }
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//
//     let isThirdSwapper = false
//     let thirdSwapperSeatId
//     for (const elem of brasilData[1][3]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 1 ||
//         elem.newCode === 23 ||
//         elem.newCode === 44 ||
//         elem.newCode === 51 ||
//         elem.newCode === 99 ||
//         elem.newCode === 77 ||
//         elem.newCode === 103 ||
//         elem.newCode === 126 ||
//         elem.newCode === 144
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       if (isFirstSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy', areaId: newAreaId }, { id: seatId }, { options })
//         firstSwapperSeatId = seatId
//         isFirstSwapper = false
//         isSecondSwapper = true
//         isThirdSwapper = false
//       } else if (isSecondSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy2', areaId: newAreaId }, { id: seatId }, { options })
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         secondSwapperSeatId = seatId
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: firstSwapperSeatId },
//           { options }
//         )
//         firstSwapperSeatId = null
//         isSecondSwapper = false
//         isThirdSwapper = true
//       } else if (isThirdSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy3', areaId: newAreaId }, { id: seatId }, { options })
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         thirdSwapperSeatId = seatId
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: secondSwapperSeatId },
//           { options }
//         )
//         secondSwapperSeatId = null
//         isThirdSwapper = false
//       } else {
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: thirdSwapperSeatId },
//           { options }
//         )
//         thirdSwapperSeatId = null
//         isFirstSwapper = true
//       }
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//
//     const seat23Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaA1Id} and code = '23'`)
//     seatOwnerToDelete.push(seat23Id[0][0].id)
//     const seat51Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaA2Id} and code = '51'`)
//     seatOwnerToDelete.push(seat51Id[0][0].id)
//     const seat77Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaB2Id} and code = '77'`)
//     seatOwnerToDelete.push(seat77Id[0][0].id)
//     const seat99Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaB2Id} and code = '99'`)
//     seatOwnerToDelete.push(seat99Id[0][0].id)
//     const seat103Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaB2Id} and code = '103'`)
//     seatOwnerToDelete.push(seat103Id[0][0].id)
//     const seat126Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaB1Id} and code = '126'`)
//     seatOwnerToDelete.push(seat126Id[0][0].id)
//     const seat144Id = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${areaB1Id} and code = '144'`)
//     seatOwnerToDelete.push(seat144Id[0][0].id)
//     for (const seatId of seatOwnerToDelete) {
//       await queryInterface.bulkDelete('seatOwners', { seatId }, options)
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//     seatOwnerToDelete = []
//
//     floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/15/areas.svg', 'utf8')
//     areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/15/a1.svg', 'utf8')
//     areaMapA2 = await fs.readFile('./model/migrations/maps/br/rochavera/15/a2.svg', 'utf8')
//     areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/15/b1.svg', 'utf8')
//     areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/15/b2.svg', 'utf8')
//
//     // UPDATE MAPS IN FLOOR 15
//     queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
//     queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
//     queryInterface.bulkUpdate('areas', { map: areaMapA2 }, { id: areaA2Id }, { options }) // update area A2
//     queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
//     queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2
//
//     await transaction.commit()
//     transaction = await queryInterface.sequelize.transaction()
//     options = { transaction, returning }
//
//     /** * FLOOR 16 PROCESSING ***/
//     floorAreaId = (
//       await queryInterface.sequelize.query(`
//           SELECT f.id FROM floors f
//              inner join buildings b on b.id = f."buildingId"
//              inner join sites s on s.id = b."siteId"
//           WHERE number = '16' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
//     )[0][0].id
//
//     areaA1Id = (
//       await queryInterface.sequelize.query(`
//         SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//         WHERE name = 'Rochavera' and f.number = '16' and a.code = 'a1'`)
//     )[0][0].id
//
//     areaA2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '16' and a.code = 'a2'`)
//     )[0][0].id
//
//     areaB1Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '16' and a.code = 'b1'`)
//     )[0][0].id
//
//     areaB2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '16' and a.code = 'b2'`)
//     )[0][0].id
//
//     await queryInterface.bulkDelete('seats', { code: '167', areaId: areaB1Id }, options)
//     await queryInterface.bulkDelete('seats', { code: '170', areaId: areaB1Id }, options)
//     await queryInterface.bulkDelete('seats', { code: '171', areaId: areaB1Id }, options)
//     await queryInterface.bulkDelete('seats', { code: '172', areaId: areaB1Id }, options)
//     await transaction.commit()
//     transaction = await queryInterface.sequelize.transaction()
//     options = { transaction, returning }
//
//     for (const elem of brasilData[2][0]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 11 ||
//         elem.newCode === 30 ||
//         elem.newCode === 31 ||
//         elem.newCode === 50 ||
//         elem.newCode === 70 ||
//         elem.newCode === 155 ||
//         elem.newCode === 163 ||
//         elem.newCode === 164 ||
//         elem.newCode === 87
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       await queryInterface.bulkUpdate(
//         'seats',
//         { code: elem.newCode.toString(), areaId: newAreaId },
//         { id: seatId },
//         { options }
//       )
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//
//     for (const elem of brasilData[2][1]) {
//       const oldAreaId =
//         elem.oldArea === 'a1'
//           ? areaA1Id
//           : elem.oldArea === 'a2'
//           ? areaA2Id
//           : elem.oldArea === 'b1'
//           ? areaB1Id
//           : areaB2Id
//       let seatId = await queryInterface.sequelize.query(`
//           SELECT s.id FROM seats s
//           WHERE "areaId" = ${oldAreaId} and code = '${elem.oldCode}'`)
//       seatId = seatId[0][0].id
//       if (
//         elem.newCode === 11 ||
//         elem.newCode === 30 ||
//         elem.newCode === 31 ||
//         elem.newCode === 50 ||
//         elem.newCode === 70 ||
//         elem.newCode === 155 ||
//         elem.newCode === 163 ||
//         elem.newCode === 164 ||
//         elem.newCode === 87
//       ) {
//         seatOwnerToDelete.push(seatId)
//       }
//       let newAreaId = oldAreaId
//       if (elem.oldArea !== elem.newArea) {
//         newAreaId =
//           elem.newArea === 'a1'
//             ? areaA1Id
//             : elem.newArea === 'a2'
//             ? areaA2Id
//             : elem.newArea === 'b1'
//             ? areaB1Id
//             : areaB2Id
//       }
//       if (isFirstSwapper) {
//         await queryInterface.bulkUpdate('seats', { code: 'tempDummy', areaId: newAreaId }, { id: seatId }, { options })
//         firstSwapperSeatId = seatId
//       } else {
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.newCode.toString(), areaId: newAreaId },
//           { id: seatId },
//           { options }
//         )
//         await transaction.commit()
//         transaction = await queryInterface.sequelize.transaction()
//         options = { transaction, returning }
//         await queryInterface.bulkUpdate(
//           'seats',
//           { code: elem.oldCode.toString(), areaId: newAreaId },
//           { id: firstSwapperSeatId },
//           { options }
//         )
//         firstSwapperSeatId = null
//       }
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//
//       isFirstSwapper = !isFirstSwapper
//     }
//
//     for (const seatId of seatOwnerToDelete) {
//       await queryInterface.bulkDelete('seatOwners', { seatId }, options)
//       await transaction.commit()
//       transaction = await queryInterface.sequelize.transaction()
//       options = { transaction, returning }
//     }
//     seatOwnerToDelete = []
//
//     floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/16/areas.svg', 'utf8')
//     areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/16/a1.svg', 'utf8')
//     areaMapA2 = await fs.readFile('./model/migrations/maps/br/rochavera/16/a2.svg', 'utf8')
//     areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/16/b1.svg', 'utf8')
//     areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/16/b2.svg', 'utf8')
//
//     // UPDATE MAPS IN FLOOR 16
//     queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
//     queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
//     queryInterface.bulkUpdate('areas', { map: areaMapA2 }, { id: areaA2Id }, { options }) // update area A2
//     queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
//     queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2
//
//     await transaction.commit()
//     transaction = await queryInterface.sequelize.transaction()
//     options = { transaction, returning }
//
//     /** * FLOOR 17 PROCESSING ***/
//     floorAreaId = (
//       await queryInterface.sequelize.query(`
//           SELECT f.id FROM floors f
//              inner join buildings b on b.id = f."buildingId"
//              inner join sites s on s.id = b."siteId"
//           WHERE number = '17' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
//     )[0][0].id
//
//     areaA1Id = (
//       await queryInterface.sequelize.query(`
//         SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//         WHERE name = 'Rochavera' and f.number = '17' and a.code = 'a1'`)
//     )[0][0].id
//
//     areaB1Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '17' and a.code = 'b1'`)
//     )[0][0].id
//
//     areaB2Id = (
//       await queryInterface.sequelize.query(`
//           SELECT a.id FROM areas a
//              inner join floors f on f.id = a."floorId"
//              inner join buildings b on b.id = f."buildingId"
//           WHERE name = 'Rochavera' and f.number = '17' and a.code = 'b2'`)
//     )[0][0].id
//
//     floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/17/areas.svg', 'utf8')
//     areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/17/a1.svg', 'utf8')
//     areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/17/b1.svg', 'utf8')
//     areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/17/b2.svg', 'utf8')
//
//     // UPDATE MAPS IN FLOOR 17
//     queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
//     queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
//     queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
//     queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2
//
//     await transaction.commit()
//   },
//   down: async (_queryInterface, _Sequelize) => {},
// }
