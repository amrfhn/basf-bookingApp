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

    const areaMap1 = await fs.readFile('./model/migrations/maps/ar/republica/18/zona1.svg', 'utf8')

    const areas1Update = queryInterface.bulkUpdate('areas', { map: areaMap1 }, { id: area1Id }, { options })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
