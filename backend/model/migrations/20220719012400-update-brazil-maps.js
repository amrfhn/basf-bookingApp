const { promises: fs } = require('fs')
const { returning, startDate, endDate, indexer, getId, getSeatId } = require('./common')
const ownerData = require('./data/20220613115000-data-vip-juridico-brazil.json')
const brasilData = require('./data/20220719012400-update-brazil-maps.json')

const brasilFloorsData = { 15: brasilData[0], 17: brasilData[1] }

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
      // DELETE
      // DELETE SEAT OWNERS ASSOCIATED TO SEATS IN THE FLOOR
      let seatOwnersOfFloor = await queryInterface.sequelize.query(`
          SELECT so.id FROM "seatOwners" so
                                inner join seats s on s.id = so."seatId"
                                inner join areas a on a.id = s."areaId"
                                inner join floors f on f.id = a."floorId"
                                inner join buildings bu on bu.id = f."buildingId"
                                inner join sites si on si.id = bu."siteId"
          WHERE f.number = '${floor}' and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

      seatOwnersOfFloor = seatOwnersOfFloor[0].map((seatOwnersIds) => {
        return seatOwnersIds.id
      })

      await queryInterface
        .bulkDelete('seatOwners', { id: { [Op.in]: seatOwnersOfFloor } }, { transaction })
        .catch((e) => {
          console.log(e)
        })

      // DELETE ALL BOOKINGS ASSOCIATED TO THE SEATS OF THE FLOOR
      let bookingsOfFloor = await queryInterface.sequelize.query(`
          SELECT b.id FROM bookings b
              inner join seats s on s.id = b."seatId"
              inner join areas a on a.id = s."areaId"
              inner join floors f on f.id = a."floorId"
              inner join buildings bu on bu.id = f."buildingId"
              inner join sites si on si.id = bu."siteId"
          WHERE f.number = '${floor}' and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

      bookingsOfFloor = bookingsOfFloor[0].map((bookingsIds) => {
        return bookingsIds.id
      })

      await queryInterface.bulkDelete('bookings', { id: { [Op.in]: bookingsOfFloor } }, { transaction }).catch((e) => {
        console.log(e)
      })

      // DELETE ALL SEAT AMENITIES ASSOCIATED TO THE SEATS OF THE FLOOR (AND ALL AMENITIES DEPENDENCIES)
      let seatAmenitiesInFloor = await queryInterface.sequelize.query(`
      SELECT sa.id FROM "seatAmenities" sa
                          inner join seats s on s.id = sa."seatId"
                          inner join areas a on a.id = s."areaId"
                          inner join floors f on f.id = a."floorId"
                          inner join buildings bu on bu.id = f."buildingId"
                          inner join sites si on si.id = bu."siteId"
      WHERE f.number = '${floor}' and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

      seatAmenitiesInFloor = seatAmenitiesInFloor[0].map((seatAmenitiesIds) => {
        return seatAmenitiesIds.id
      })

      await queryInterface
        .bulkDelete('seatAmenityNumericValues', { seatAmenityId: { [Op.in]: seatAmenitiesInFloor } }, { transaction })
        .catch((e) => {
          console.log(e)
        })
      await queryInterface
        .bulkDelete('seatAmenityMultiValues', { seatAmenityId: { [Op.in]: seatAmenitiesInFloor } }, { transaction })
        .catch((e) => {
          console.log(e)
        })
      await queryInterface
        .bulkDelete('seatAmenityBooleanValues', { seatAmenityId: { [Op.in]: seatAmenitiesInFloor } }, { transaction })
        .catch((e) => {
          console.log(e)
        })
      await queryInterface
        .bulkDelete('seatAmenities', { id: { [Op.in]: seatAmenitiesInFloor } }, { transaction })
        .catch((e) => {
          console.log(e)
        })

      // DELETE ALL SEATS IN THE FLOOR
      let seatsInFloor = await queryInterface.sequelize.query(`
          SELECT s.id FROM seats s
              inner join areas a on a.id = s."areaId"
              inner join floors f on f.id = a."floorId"
              inner join buildings bu on bu.id = f."buildingId"
              inner join sites si on si.id = bu."siteId"
          WHERE f.number = '${floor}' and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

      seatsInFloor = seatsInFloor[0].map((seatsIds) => {
        return seatsIds.id
      })

      await queryInterface.bulkDelete('seats', { id: { [Op.in]: seatsInFloor } }, { transaction }).catch((e) => {
        console.log(e)
      })

      // DELETE AREAS
      let areasIds = await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
        WHERE name = 'Rochavera' and f.number = '${floor}'`)

      areasIds = areasIds[0].map((areasIds) => {
        return areasIds.id
      })

      await queryInterface.bulkDelete('areas', { id: { [Op.in]: areasIds } }, { transaction }).catch((e) => {
        console.log(e)
      })

      // UPDATE
      const floorId = (
        await queryInterface.sequelize.query(
          `SELECT f.id FROM "floors" f JOIN "buildings" b on b.id = f."buildingId" WHERE b.name = 'Rochavera' AND f.number = '${floor}'`
        )
      )[0][0].id

      // map floorId to data
      brasilFloorsData[floor].map((s) => (s.floorId = floorId))

      // UPDATE MAPF LOOR
      const floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/' + floor + '/areas.svg', 'utf8')
      queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorId }, { options })

      // CREATE
      // create areas
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

      // INSERT NEW SEATS

      const insertedSeats = await queryInterface.bulkInsert(
        'seats',
        brasilFloorsData[floor].map(({ seat, areaId, available }) => {
          return { code: seat, areaId, startDate, endDate: available ? null : endDate }
        }),
        options
      )

      // INSERT SEAT OWNERS
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

    // UPDATE MAPS IN FLOOR 12
    const floorAreaId = (
      await queryInterface.sequelize.query(`
          SELECT f.id FROM floors f
             inner join buildings b on b.id = f."buildingId"
             inner join sites s on s.id = b."siteId"
          WHERE number = '12' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
    )[0][0].id

    const areaA1Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
        WHERE name = 'Rochavera' and f.number = '12' and a.code = 'a1'`)
    )[0][0].id

    const areaA2Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = '12' and a.code = 'a2'`)
    )[0][0].id

    const areaB1Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = '12' and a.code = 'b1'`)
    )[0][0].id

    const areaB2Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = '12' and a.code = 'b2'`)
    )[0][0].id

    const floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/12/areas.svg', 'utf8')
    const areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/12/a1.svg', 'utf8')
    const areaMapA2 = await fs.readFile('./model/migrations/maps/br/rochavera/12/a2.svg', 'utf8')
    const areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/12/b1.svg', 'utf8')
    const areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/12/b2.svg', 'utf8')

    // UPDATE FLOORS MAPS
    queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
    queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
    queryInterface.bulkUpdate('areas', { map: areaMapA2 }, { id: areaA2Id }, { options }) // update area A2
    queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
    queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
