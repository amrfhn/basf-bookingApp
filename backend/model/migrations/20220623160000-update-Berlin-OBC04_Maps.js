const { returning } = require('./common')
const { promises: fs } = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const area15Floor1Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
            inner join floors f on f.id = a."floorId"
            inner join buildings b on b.id = f."buildingId"
        WHERE name = 'OBC04' and f.number = '1' and a.code = '15'`)
    )[0][0].id

    const area15Floor5Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
            inner join floors f on f.id = a."floorId"
            inner join buildings b on b.id = f."buildingId"
        WHERE name = 'OBC04' and f.number = '5' and a.code = '15'`)
    )[0][0].id

    const seatsCode11Floor5 = (
      await queryInterface.sequelize.query(
        `SELECT s."id" as "seatId"
              FROM seats s
                     INNER JOIN areas a on a.id = s."areaId"
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
              WHERE b.name = 'OBC04' AND f."number" = '5' AND a."code" = '15' AND s."code" = 11`
      )
    )[0][0].seatId

    const seatsCode25Floor1 = (
      await queryInterface.sequelize.query(
        `SELECT s."id" as "seatId"
              FROM seats s
                     INNER JOIN areas a on a.id = s."areaId"
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
         WHERE b.name = 'OBC04' AND f."number" = '1' AND a."code" = '15' AND s."code" = 25`
      )
    )[0][0].seatId
    const seatsCode12Floor5 = (
      await queryInterface.sequelize.query(
        `SELECT s."id" as "seatId"
              FROM seats s
                     INNER JOIN areas a on a.id = s."areaId"
                     INNER JOIN floors f on f.id = a."floorId"
                     INNER JOIN buildings b on b.id = f."buildingId"
         WHERE b.name = 'OBC04' AND f."number" = '5' AND a."code" = '15' AND s."code" = 12`
      )
    )[0][0].seatId

    queryInterface.bulkUpdate('seats', { endDate: null }, { id: seatsCode11Floor5 }, { options })
    queryInterface.bulkUpdate('seats', { endDate: null }, { id: seatsCode12Floor5 }, { options })
    queryInterface.bulkUpdate('seats', { endDate: null }, { id: seatsCode25Floor1 }, { options })

    const areaMap15Floor1 = await fs.readFile('./model/migrations/maps/de/OBC04/1/15.svg', 'utf8')
    const areaMap15Floor5 = await fs.readFile('./model/migrations/maps/de/OBC04/5/15.svg', 'utf8')

    queryInterface.bulkUpdate('areas', { map: areaMap15Floor1 }, { id: area15Floor1Id }, { options }) // update area A1
    queryInterface.bulkUpdate('areas', { map: areaMap15Floor5 }, { id: area15Floor5Id }, { options }) // update area A2

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
