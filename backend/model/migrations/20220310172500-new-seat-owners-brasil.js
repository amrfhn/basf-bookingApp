const { returning, indexer, getSeatId } = require('./common')

const oldOwnerData = require('./data/20220218133200-data-vip-juridico-brasil.json')
const oldVIP = oldOwnerData[0]

const seatsData = require('./data/20220310172700-data-seat-owners-brasil.json')
const newOwnersData = require('./data/20220310172600-data-vip-juridico-brasil.json')
const vip = newOwnersData[0]
const juridico = newOwnersData[1]

const seatIndexFunction = (v) => v.floorNumber + '-' + v.areaCode + '-' + v.seatCode
const reducerSeats = indexer(seatIndexFunction, getSeatId)

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    // Add old VIPs to new seat

    const newSeatBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", f."number" as "floorNumber", a."code" as "areaCode"
         FROM seats s
                  INNER JOIN areas a on a.id = s."areaId"
                  INNER JOIN floors f on f.id = a."floorId"
                  INNER JOIN buildings b on b.id = f."buildingId"
         WHERE b.name = 'Rochavera'
           AND (f."number", a."code", s."code") in
                ( (12,'b2',189) )`,
        options
      )
    )[0][0]
    const nSeat = await queryInterface.bulkInsert(
      'seatOwners',
      oldVIP.map((username) => {
        return { seatId: newSeatBase.seatId, userId: username }
      }),
      options
    )

    // Add new seat owners to all seats
    let seatsInfo = ''
    for (const seat of seatsData) {
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
    for (let i = 0; i < seatsData.length; i++) {
      seatsData[i].seatId = seatsIdx[seatsData[i].floor + '-' + seatsData[i].area + '-' + seatsData[i].seat]
    }
    for (let i = 0; i < seatsData.length; i++) {
      if (seatsData[i].status === 'VIP') {
        await queryInterface.bulkInsert(
          'seatOwners',
          vip.map((username) => {
            return { seatId: seatsData[i].seatId, userId: username }
          }),
          options
        )
      } else {
        if (seatsData[i].status === 'JURIDICO') {
          await queryInterface.bulkInsert(
            'seatOwners',
            juridico.map((username) => {
              return { seatId: seatsData[i].seatId, userId: username }
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
