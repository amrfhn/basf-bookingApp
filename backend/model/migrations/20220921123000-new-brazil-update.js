const { returning } = require('./common')
const { promises: fs } = require('fs')

const seatsToDelete = [118, 119, 120]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = {
      transaction,
      returning,
    }
    const Op = Sequelize.Op
    for (const seat of seatsToDelete) {
      let seatsInFloor = await queryInterface.sequelize.query(`
          SELECT s.id
          FROM seats s
                   inner join areas a on a.id = s."areaId"
                   inner join floors f on f.id = a."floorId"
                   inner join buildings bu on bu.id = f."buildingId"
                   inner join sites si on si.id = bu."siteId"
          WHERE s.code = '${seat}'
            and a.code = 'b2'
            and f.number = '14'
            and bu.name = 'Rochavera'
            and si.name = 'Morumbi'`)

      seatsInFloor = seatsInFloor[0].map((seatsIds) => {
        return seatsIds.id
      })
      await queryInterface.bulkDelete('seats', { id: { [Op.in]: seatsInFloor } }, { transaction }).catch((e) => {
        console.log(e)
      })
    }
    const floor12AreaId = (
      await queryInterface.sequelize.query(`
          SELECT f.id FROM floors f
             inner join buildings b on b.id = f."buildingId"
             inner join sites s on s.id = b."siteId"
          WHERE number = '12' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
    )[0][0].id
    const floor16AreaId = (
      await queryInterface.sequelize.query(`
          SELECT f.id FROM floors f
             inner join buildings b on b.id = f."buildingId"
             inner join sites s on s.id = b."siteId"
          WHERE number = '16' and b.name = 'Rochavera' and s.name = 'Morumbi'`)
    )[0][0].id
    const areas12 = await fs.readFile('./model/migrations/maps/br/rochavera/12/areas.svg', 'utf8')
    const areas16 = await fs.readFile('./model/migrations/maps/br/rochavera/16/areas.svg', 'utf8')
    queryInterface.bulkUpdate('floors', { map: areas12 }, { id: floor12AreaId }, { options })
    queryInterface.bulkUpdate('floors', { map: areas16 }, { id: floor16AreaId }, { options })
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
