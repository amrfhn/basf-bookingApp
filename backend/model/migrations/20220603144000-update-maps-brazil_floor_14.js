const { promises: fs } = require('fs')
const { returning, startDate, endDate } = require('./common')
const brasilDataFourteenFloor = require('./data/20220603101600-update-seats-brazil-floor-14.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const Op = Sequelize.Op

    // DELETE SEAT OWNERS ASSOCIATED TO SEATS IN THE FLOOR
    let seatOwnersOfFloor = await queryInterface.sequelize.query(`
          SELECT so.id FROM "seatOwners" so
                                inner join seats s on s.id = so."seatId"
                                inner join areas a on a.id = s."areaId"
                                inner join floors f on f.id = a."floorId"
                                inner join buildings bu on bu.id = f."buildingId"
                                inner join sites si on si.id = bu."siteId"
          WHERE f.number = 14 and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

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
          WHERE f.number = 14 and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

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
        WHERE f.number = 14 and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

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
          WHERE f.number = 14 and bu.name = 'Rochavera' and si.name = 'Morumbi'`)

    seatsInFloor = seatsInFloor[0].map((seatsIds) => {
      return seatsIds.id
    })

    await queryInterface.bulkDelete('seats', { id: { [Op.in]: seatsInFloor } }, { transaction }).catch((e) => {
      console.log(e)
    })

    // DELETE AREAS C1 AND C2
    let areasC1AndC2Ids = await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
        WHERE name = 'Rochavera' and f.number = 14 and (a.code = 'c1' or a.code = 'c2')`)

    areasC1AndC2Ids = areasC1AndC2Ids[0].map((areasIds) => {
      return areasIds.id
    })

    await queryInterface.bulkDelete('areas', { id: { [Op.in]: areasC1AndC2Ids } }, { transaction }).catch((e) => {
      console.log(e)
    })

    // QUERIES TO UPDATE MAPS IN FLOOR 14
    const floorAreaId = (
      await queryInterface.sequelize.query(`
          SELECT f.id FROM floors f
                               inner join buildings b on b.id = f."buildingId"
                               inner join sites s on s.id = b."siteId"
          WHERE number = 14 and b.name = 'Rochavera' and s.name = 'Morumbi'`)
    )[0][0].id

    const areaA1Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = 14 and a.code = 'a1'`)
    )[0][0].id

    const areaA2Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = 14 and a.code = 'a2'`)
    )[0][0].id

    const areaB1Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = 14 and a.code = 'b1'`)
    )[0][0].id

    const areaB2Id = (
      await queryInterface.sequelize.query(`
          SELECT a.id FROM areas a
             inner join floors f on f.id = a."floorId"
             inner join buildings b on b.id = f."buildingId"
          WHERE name = 'Rochavera' and f.number = 14 and a.code = 'b2'`)
    )[0][0].id

    const floorArea = await fs.readFile('./model/migrations/maps/br/rochavera/14/areas.svg', 'utf8')
    const areaMapA1 = await fs.readFile('./model/migrations/maps/br/rochavera/14/a1.svg', 'utf8')
    const areaMapA2 = await fs.readFile('./model/migrations/maps/br/rochavera/14/a2.svg', 'utf8')
    const areaMapB1 = await fs.readFile('./model/migrations/maps/br/rochavera/14/b1.svg', 'utf8')
    const areaMapB2 = await fs.readFile('./model/migrations/maps/br/rochavera/14/b2.svg', 'utf8')

    queryInterface.bulkUpdate('floors', { map: floorArea }, { id: floorAreaId }, { options }) // update floor areas
    queryInterface.bulkUpdate('areas', { map: areaMapA1 }, { id: areaA1Id }, { options }) // update area A1
    queryInterface.bulkUpdate('areas', { map: areaMapA2 }, { id: areaA2Id }, { options }) // update area A2
    queryInterface.bulkUpdate('areas', { map: areaMapB1 }, { id: areaB1Id }, { options }) // update area B1
    queryInterface.bulkUpdate('areas', { map: areaMapB2 }, { id: areaB2Id }, { options }) // update area B2

    // INSERT NEW SEATS
    for (let i = 0; i < brasilDataFourteenFloor.length; i++) {
      switch (brasilDataFourteenFloor[i].area) {
        case 'a1':
          brasilDataFourteenFloor[i].areaId = areaA1Id
          break
        case 'a2':
          brasilDataFourteenFloor[i].areaId = areaA2Id
          break
        case 'b1':
          brasilDataFourteenFloor[i].areaId = areaB1Id
          break
        case 'b2':
          brasilDataFourteenFloor[i].areaId = areaB2Id
          break
      }
    }

    await queryInterface.bulkInsert(
      'seats',
      brasilDataFourteenFloor.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
