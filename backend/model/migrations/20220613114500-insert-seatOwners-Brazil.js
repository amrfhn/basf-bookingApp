const brasilOwnersData = require('./data/20220613121400-data-seatOwners-Brazil.json')
const ownerData = require('./data/20220613115000-data-vip-juridico-brazil.json')
const { returning, indexer, getSeatId } = require('./common')

const vip = ownerData[0]
const juridico = ownerData[1]

const seatIndexFunction = (v) => v.floorNumber + '-' + v.areaCode + '-' + v.seatCode
const reducerSeats = indexer(seatIndexFunction, getSeatId)

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    let seatsInfo = ''
    for (const seat of brasilOwnersData) {
      seatsInfo += `(${seat.floor},'${seat.area}',${seat.seat}),`
    }
    seatsInfo = seatsInfo.slice(0, -1)

    const seatsInBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", a."code" as "areaCode", f."number" as "floorNumber"
         FROM seats s
                  INNER JOIN areas a on a.id = s."areaId"
                  INNER JOIN floors f on f.id = a."floorId"
                  INNER JOIN buildings b on b.id = f."buildingId"
         WHERE b.name = 'Rochavera'
           AND (f."number", a."code", s."code") in (${seatsInfo})`,
        options
      )
    )[0]

    const seatsIdx = seatsInBase.reduce(reducerSeats, {})
    for (let i = 0; i < brasilOwnersData.length; i++) {
      brasilOwnersData[i].seatId =
        seatsIdx[brasilOwnersData[i].floor + '-' + brasilOwnersData[i].area + '-' + brasilOwnersData[i].seat]
    }

    for (let i = 0; i < brasilOwnersData.length; i++) {
      if (brasilOwnersData[i].status === 'VIP') {
        await queryInterface.bulkInsert(
          'seatOwners',
          vip.map((username) => {
            return { seatId: brasilOwnersData[i].seatId, userId: username }
          }),
          options
        )
      } else {
        if (brasilOwnersData[i].status === 'JURIDICO') {
          await queryInterface.bulkInsert(
            'seatOwners',
            juridico.map((username) => {
              return { seatId: brasilOwnersData[i].seatId, userId: username }
            }),
            options
          )
        }
      }
    }

    await transaction.commit()
  },
  down: async () => {},
}
