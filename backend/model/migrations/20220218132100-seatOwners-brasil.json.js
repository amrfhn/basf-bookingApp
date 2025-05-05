const { returning, indexer, getSeatId } = require('./common')
const brasilOwnersData = require('./data/20220218133200-data-seat-owners-brasil.json')
const ownerData = require('./data/20220218133200-data-vip-juridico-brasil.json')

const vip = ownerData[0]
const juridico = ownerData[1]
const seatOwnersToUpdate = [
  { floor: 14, area: 'c1', seat: 38, status: 'VIP', username: 'vizosos4' },
  { floor: 14, area: 'c1', seat: 69, status: 'VIP', username: 'moraesj1' },
  { floor: 14, area: 'c1', seat: 70, status: 'VIP', username: 'nerima' },
  { floor: 14, area: 'b2', seat: 74, status: 'VIP', username: 'limadu' },
  { floor: 14, area: 'a2', seat: 152, status: 'VIP', username: 'raysads' },
  { floor: 14, area: 'a1', seat: 185, status: 'VIP', username: 'barretrm' },
]

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

    const seatsWithOwnerUsername = brasilOwnersData.filter((seat) => Boolean(seat.user))

    await queryInterface.bulkInsert(
      'seatOwners',
      seatsWithOwnerUsername.map((seatOwner) => {
        return { seatId: seatOwner.seatId, userId: seatOwner.user }
      }),
      options
    )

    // Update existing seats with seat owners

    let seatsUpdateInfo = ''
    for (const seat of seatOwnersToUpdate) {
      seatsUpdateInfo += `(${seat.floor},'${seat.area}',${seat.seat}),`
    }
    seatsUpdateInfo = seatsUpdateInfo.slice(0, -1)

    const seatsToUpdateInBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", a."code" as "areaCode", f."number" as "floorNumber"
         FROM seats s
                  INNER JOIN areas a on a.id = s."areaId"
                  INNER JOIN floors f on f.id = a."floorId"
                  INNER JOIN buildings b on b.id = f."buildingId"
         WHERE b.name = 'Rochavera'
           AND (f."number", a."code", s."code") in (${seatsUpdateInfo})`,
        options
      )
    )[0]

    const seatsUpdateIdx = seatsToUpdateInBase.reduce(reducerSeats, {})

    for (let i = 0; i < seatOwnersToUpdate.length; i++) {
      const missingUsers = vip.filter((user) => user !== seatOwnersToUpdate[i].username)
      const seatId =
        seatsUpdateIdx[
          seatOwnersToUpdate[i].floor + '-' + seatOwnersToUpdate[i].area + '-' + seatOwnersToUpdate[i].seat
        ]
      await queryInterface.bulkInsert(
        'seatOwners',
        missingUsers.map((user) => {
          return { seatId, userId: user }
        }),
        options
      )
    }

    await transaction.commit()
  },
  down: async () => {},
}
