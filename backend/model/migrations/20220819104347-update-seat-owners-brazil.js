const brasilOwnersData = require('./data/20220719012400-update-brazil-maps.json')
const ownerData = require('./data/20220819104347-data-seat-owners-brazil.json')
const { returning, indexer, getSeatId } = require('./common')

const seatsWithType = []
for (const el of brasilOwnersData) {
  seatsWithType.push(...el.filter((e) => e.status !== undefined))
}

const vip = ownerData

const seatIndexFunction = (v) => v.floorNumber + '-' + v.areaCode + '-' + v.seatCode
const reducerSeats = indexer(seatIndexFunction, getSeatId)

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    let seatsInfo = ''
    for (const seat of seatsWithType) {
      seatsInfo += `('${seat.floor}','${seat.area}','${seat.seat}'),`
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
    for (let i = 0; i < seatsWithType.length; i++) {
      seatsWithType[i].seatId =
        seatsIdx[seatsWithType[i].floor + '-' + seatsWithType[i].area + '-' + seatsWithType[i].seat]
    }

    for (let i = 0; i < seatsWithType.length; i++) {
      if (seatsWithType[i].status === 'VIP') {
        await queryInterface.bulkInsert(
          'seatOwners',
          vip.map((username) => {
            return { seatId: seatsWithType[i].seatId, userId: username }
          }),
          options
        )
      }
    }
    await transaction.commit()
  },
  down: async () => {},
}
