const { promises: fs } = require('fs')
const { returning, startDate, endDate, indexer, getId, getSeatId } = require('./common')
const brasilData = require('./data/20220914094000-update-data-brazil.json')
const ownerData = require('./data/20220916121100-data-brazil-seat-owners.json')

const brasilFloorsData = { 14: brasilData[0], 16: brasilData[1] }

const vip = ownerData[0]
const juridico = ownerData[1]

const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

const seatIndexFunction = (v) => v.areaId + '-' + v.code
const reducerSeats = indexer(seatIndexFunction, getId)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const Op = Sequelize.Op

    for (const floor in brasilFloorsData) {
      let areasIds = await queryInterface.sequelize.query(`
          SELECT a.id
          FROM areas a
                   inner join floors f on f.id = a."floorId"
                   inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera'
            and f.number = '${floor}'`)
      areasIds = areasIds[0].map((areasIds) => {
        return areasIds.id
      })
      await queryInterface.bulkDelete('areas', { id: { [Op.in]: areasIds } }, { transaction }).catch((e) => {
        console.log(e)
      })
      const floorId = (
        await queryInterface.sequelize.query(
          `SELECT f.id
           FROM "floors" f
                    JOIN "buildings" b on b.id = f."buildingId"
           WHERE b.name = 'Rochavera'
             AND f.number = '${floor}'`
        )
      )[0][0].id

      brasilFloorsData[floor].map((s) => (s.floorId = floorId))

      const floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/' + floor + '/areas.svg', 'utf8')
      queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorId }, { options })

      const areaMaps = {
        a1: await fs.readFile('./model/migrations/maps/br/rochavera/' + floor + '/a1.svg', 'utf8'),
        a2: await fs.readFile('./model/migrations/maps/br/rochavera/' + floor + '/a2.svg', 'utf8'),
        b1: await fs.readFile('./model/migrations/maps/br/rochavera/' + floor + '/b1.svg', 'utf8'),
        b2: await fs.readFile('./model/migrations/maps/br/rochavera/' + floor + '/b2.svg', 'utf8'),
      }
      const areas = await queryInterface.bulkInsert(
        'areas',
        [
          { code: 'a1', map: areaMaps.a1, floorId: floorId, startDate },
          { code: 'a2', map: areaMaps.a2, floorId: floorId, startDate },
          { code: 'b1', map: areaMaps.b1, floorId: floorId, startDate },
          { code: 'b2', map: areaMaps.b2, floorId: floorId, startDate },
        ],
        options
      )

      const areasIdx = areas.reduce(reducerAreas, {})

      for (let i = 0; i < brasilFloorsData[floor].length; i++) {
        brasilFloorsData[floor][i].areaId =
          areasIdx[brasilFloorsData[floor][i].floorId + '-' + brasilFloorsData[floor][i].area]
      }
      const insertedSeats = await queryInterface.bulkInsert(
        'seats',
        brasilFloorsData[floor].map(({ seat, areaId, available }) => {
          return { code: seat.toString(), areaId, startDate, endDate: available ? null : endDate }
        }),
        options
      )

      const seatsIdx = insertedSeats.reduce(reducerSeats, {})

      for (let i = 0; i < brasilFloorsData[floor].length; i++) {
        brasilFloorsData[floor][i].seatId =
          seatsIdx[brasilFloorsData[floor][i].areaId + '-' + brasilFloorsData[floor][i].seat]
      }
      for (let i = 0; i < brasilFloorsData[floor].length; i++) {
        if (brasilFloorsData[floor][i].status === 'VIP') {
          await queryInterface.bulkInsert(
            'seatOwners',
            vip.map((username) => {
              return { seatId: brasilFloorsData[floor][i].seatId, userId: username }
            }),
            options
          )
        } else {
          if (brasilFloorsData[floor][i].status === 'JURIDICO') {
            await queryInterface.bulkInsert(
              'seatOwners',
              juridico.map((username) => {
                return { seatId: brasilFloorsData[floor][i].seatId, userId: username }
              }),
              options
            )
          }
        }
      }
    }
    const floor12AreaId = (
      await queryInterface.sequelize.query(`
          SELECT f.id FROM floors f
             inner join buildings b on b.id = f."buildingId"
             inner join sites s on s.id = b."siteId"
          WHERE number = '12' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
    )[0][0].id
    const areas12 = await fs.readFile('./model/migrations/maps/br/rochavera/12/areas.svg', 'utf8')
    queryInterface.bulkUpdate('floors', { map: areas12 }, { id: floor12AreaId }, { options })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
