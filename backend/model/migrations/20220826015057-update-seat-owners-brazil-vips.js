const brasilOwnersData = require('./data/20220826015057-data-seat-owners-brazil-vips.json')
const { returning, indexer, getSeatId } = require('./common')

const vip = ['goncal3', 'mendeseg', 'bonalda', 'ramosc10', 'diasl1', 'perettra']

const seatIndexFunction = (v) => v.floorNumber + '-' + v.areaCode + '-' + v.seatCode
const reducerSeats = indexer(seatIndexFunction, getSeatId)

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    let seatsInfo = ''
    for (const seat of brasilOwnersData) {
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
    for (let i = 0; i < brasilOwnersData.length; i++) {
      brasilOwnersData[i].seatId =
        seatsIdx[brasilOwnersData[i].floor + '-' + brasilOwnersData[i].area + '-' + brasilOwnersData[i].seat]
    }

    for (const seat of brasilOwnersData) {
      for (const owner of vip) {
        const seatOwnerExist = (
          await queryInterface.sequelize.query(
            `SELECT so."seatId", so."userId" FROM "seatOwners" so
             WHERE so."seatId"  = ${seat.seatId}
                AND so."userId" = '${owner}'`,
            options
          )
        )[0]
        if (!seatOwnerExist.length) {
          const query = `INSERT INTO "seatOwners" ("seatId", "userId") VALUES (${seat.seatId}, '${owner}')`
          await queryInterface.sequelize.query(query, options)
        }
      }
    }

    await transaction.commit()
  },
  down: async () => {},
}
