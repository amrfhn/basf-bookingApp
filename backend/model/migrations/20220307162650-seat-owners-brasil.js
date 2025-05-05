const { returning, indexer, getUsername, getNewSeat } = require('./common')
const seatOwnersData = require('./data/20220703172410-data-seat-owners-brasil.json')
const seatData = require('./data/20220703172410-data-update-seats-brasil.json')

const fs = require('fs').promises

const seatToUpdateFunction = (v) => v.floor + '-' + v.area + '-' + v.seat
const reducerToUpdate = indexer(seatToUpdateFunction, getNewSeat)

const seatIndexFunction = (v) => v.floor + '-' + v.area + '-' + v.seat
const reducerSeats = indexer(seatIndexFunction, getUsername)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const seatsToUpdate = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", f."number" as "floorNumber", a."code" as "areaCode"
              FROM seats s
                     INNER JOIN areas a on a.id = s."areaId"
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'Rochavera'
                AND (f."number", a."code", s."code") in
                    (
                     (9, 'b', 6),
                     (12, 'b2', 137),
                     (12, 'b2', 138),
                     (16, 'b1', 183),
                     (16, 'b1', 184),
                     (16, 'b2', 81),
                     (16, 'b2', 80),
                     (16, 'b2', 145),
                     (17, 'b1', 31),
                     (17, 'a2', 93)
                        )`,
        options
      )
    )[0]
    const seatsIdxToUpd = seatData.reduce(reducerToUpdate, {})
    for (let i = 0; i < seatsToUpdate.length; i++) {
      seatsToUpdate[i].newSeat =
        seatsIdxToUpd[seatsToUpdate[i].floorNumber + '-' + seatsToUpdate[i].areaCode + '-' + seatsToUpdate[i].seatCode]
    }
    const mappedSeats = seatsToUpdate
      .map(({ seatId, newSeat }) => {
        return { id: seatId, code: newSeat }
      })
      .map((objToUpd) => {
        return queryInterface.bulkUpdate('seats', { code: objToUpd.code }, { id: objToUpd.id }, { options })
      })
    const areaC1 = (
      await queryInterface.sequelize.query(
        `SELECT a."code" as "areaCode", a."id" as "id"
              FROM areas a
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'Rochavera'
                AND (f."number", a."code") in
                    (
                     (12, 'c1')
                        )`,
        options
      )
    )[0][0].id
    const areaC2 = (
      await queryInterface.sequelize.query(
        `SELECT a."code" as "areaCode", a."id" as "id"
              FROM areas a
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'Rochavera'
                AND (f."number", a."code") in
                    (
                     (15, 'c2')
                        )`,
        options
      )
    )[0][0].id
    const areaA2 = (
      await queryInterface.sequelize.query(
        `SELECT a."code" as "areaCode", a."id" as "id"
              FROM areas a
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'Rochavera'
                AND (f."number", a."code") in
                    (
                     (17, 'a2')
                        )`,
        options
      )
    )[0][0].id
    const newSeat = [
      { areaId: areaC1, code: 188 },
      { areaId: areaC2, code: 202 },
      { areaId: areaA2, code: 132 },
    ]
    await queryInterface.bulkInsert(
      'seats',
      newSeat.map(({ areaId, code }) => {
        return { areaId, code, startDate: '2022-03-03', endDate: null }
      }),
      options
    )
    await Promise.all(mappedSeats)
    const seatsInBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", f."number" as "floorNumber", a."code" as "areaCode"
              FROM seats s
                     INNER JOIN areas a on a.id = s."areaId"
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'Rochavera'
                AND (f."number", a."code", s."code") in
                    ((9, 'a', 1), (9, 'a', 2), (9, 'a', 3), (9, 'a', 5), (9, 'b', 17), (9, 'c', 7),
                    (9, 'c', 8), (9, 'c', 11), (9, 'c', 12), (9, 'c', 14), (9, 'c', 16), (14, 'b1', 146),
                    (14, 'b1', 148), (14, 'b1', 150), (15, 'b1', 133), (15, 'b1', 134), (15, 'b1', 136),
                    (15, 'b1', 151), (15, 'b1', 157), (15, 'b1', 161), (15, 'b1', 201), (16, 'c1', 67),
                    (16, 'c1', 69), (16, 'c1', 72), (16, 'c1', 73), (16, 'c1', 74), (16, 'c1', 76),
                    (16, 'c1', 79), (16, 'c1', 81), (16, 'b2', 82), (16, 'b2', 84), (16, 'b2', 206),
                    (16, 'b2', 116), (16, 'b2', 118), (16, 'b2', 120), (16, 'b2', 122), (16, 'b1', 112),
                    (16, 'b1', 115), (17, 'b2', 28))`,
        options
      )
    )[0]
    const seatsIdx = seatOwnersData.reduce(reducerSeats, {})
    for (let i = 0; i < seatsInBase.length; i++) {
      seatsInBase[i].username =
        seatsIdx[seatsInBase[i].floorNumber + '-' + seatsInBase[i].areaCode + '-' + seatsInBase[i].seatCode]
    }
    await queryInterface.bulkInsert(
      'seatOwners',
      seatsInBase.map(({ seatId, username }) => {
        return { seatId, userId: username }
      }),
      options
    )
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
