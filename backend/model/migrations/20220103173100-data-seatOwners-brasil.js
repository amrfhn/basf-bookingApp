const { returning, indexer, getUsername } = require('./common')
const brasilOwnersData = require('./data/20220103203600-data-seat-owners-brasil.json')

const fs = require('fs').promises

const seatIndexFunction = (v) => v.area + '-' + v.seat
const reducerSeats = indexer(seatIndexFunction, getUsername)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const seatsInBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", a."code" as "areaCode"
         FROM seats s
                  INNER JOIN areas a on a.id = s."areaId"
                  INNER JOIN floors f on f.id = a."floorId"
                  INNER JOIN buildings b on b.id = f."buildingId"
         WHERE b.name = 'Rochavera'
           AND f.number = 14
           AND (s."code", a."code") in
               ((38, 'c1'), (39, 'c1'), (67, 'c1'), (69, 'c1'),
                (70, 'c1'), (71, 'c1'), (73, 'b2'), (74, 'b2'),
                (152, 'a2'), (153, 'a2'), (184, 'a1'),
                (185, 'a1'))`,
        options
      )
    )[0]
    const seatsIdx = brasilOwnersData.reduce(reducerSeats, {})
    for (let i = 0; i < seatsInBase.length; i++) {
      seatsInBase[i].username = seatsIdx[seatsInBase[i].areaCode + '-' + seatsInBase[i].seatCode]
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
