const { returning, indexer, getId } = require('./common')
const seatOwnersData = require('./data/20211230180000-data-seatOwners-colombia.json')

const fs = require('fs').promises
const seatIndexFunction = (v) => v.floorNumber + '-' + v.seatCode
const reducerSeats = indexer(seatIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const seatsInBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "id", f."number" as "floorNumber"
              FROM seats s
                     INNER JOIN areas a on a.id = s."areaId"
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'Morato'
                AND a.code = '-'
                AND (f."number", s."code") in ((1, 111),
                                               (1, 112),
                                               (2, 121),
                                               (2, 122),
                                               (2, 123),
                                               (2, 124),
                                               (2, 125),
                                               (2, 126),
                                               (3, 131),
                                               (3, 132),
                                               (3, 133),
                                               (3, 134),
                                               (3, 135))`,
        options
      )
    )[0]
    const seatsIdx = seatsInBase.reduce(reducerSeats, {})
    for (let i = 0; i < seatOwnersData.length; i++) {
      seatOwnersData[i].seatId = seatsIdx[seatOwnersData[i].floor + '-' + seatOwnersData[i].seat]
    }

    await queryInterface.bulkInsert(
      'seatOwners',
      seatOwnersData.map(({ seatId, username }) => {
        return { seatId, userId: username.toLowerCase() }
      }),
      options
    )
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
