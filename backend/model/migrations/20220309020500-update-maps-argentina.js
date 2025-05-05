const { promises: fs } = require('fs')
const { returning } = require('./common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    const area1Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
            inner join floors f on f.id = a."floorId"
            inner join buildings b on b.id = f."buildingId"
        WHERE name = 'República' and f.number = 18 and a.code = 'Zona1'`)
    )[0][0].id

    const area2Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
            inner join floors f on f.id = a."floorId"
            inner join buildings b on b.id = f."buildingId"
        WHERE name = 'República' and f.number = 18 and a.code = 'Zona2'`)
    )[0][0].id
    const areaMap1 = await fs.readFile('./model/migrations/maps/ar/republica/18/zona1.svg', 'utf8')
    const areaMap2 = await fs.readFile('./model/migrations/maps/ar/republica/18/zona2.svg', 'utf8')

    const areas1Update = queryInterface.bulkUpdate('areas', { map: areaMap1 }, { id: area1Id }, { options })
    const areas2Update = queryInterface.bulkUpdate('areas', { map: areaMap2 }, { id: area2Id }, { options })

    const seatsInBase = (
      await queryInterface.sequelize.query(
        `SELECT s."code" as "seatCode", s."id" as "seatId", f."number" as "floorNumber", a."code" as "areaCode"
            FROM seats s
                INNER JOIN areas a on a.id = s."areaId"
                INNER JOIN floors f on f.id = a."floorId"
                INNER JOIN buildings b on b.id = f."buildingId"
            WHERE b.name = 'República'
                AND (a."id", s."code") in
                (
                (${area1Id}, 30), (${area1Id}, 31), (${area1Id}, 32), (${area1Id}, 27), (${area1Id}, 35),
                (${area2Id}, 51), (${area2Id}, 52), (${area2Id}, 53), (${area2Id}, 54), (${area2Id}, 55), (${area2Id}, 56)
                )`,
        options
      )
    )[0]
    const updatedSeats = seatsInBase.map((objToUpd) => {
      return queryInterface.bulkUpdate(
        'seats',
        { endDate: new Date().toISOString().slice(0, 10) },
        { id: objToUpd.seatId },
        { options }
      )
    })
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
