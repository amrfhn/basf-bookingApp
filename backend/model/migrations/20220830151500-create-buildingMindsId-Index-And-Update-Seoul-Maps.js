const { promises: fs } = require('fs')
const { returning } = require('./common')
module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Index generation ***/
    await queryInterface.addIndex('sites', {
      fields: ['buildingMindsID'],
    })
    await queryInterface.addIndex('buildings', {
      fields: ['buildingMindsID'],
    })
    await queryInterface.addIndex('floors', {
      fields: ['buildingMindsID'],
    })
    await queryInterface.addIndex('areas', {
      fields: ['buildingMindsID'],
    })
    await queryInterface.addIndex('seats', {
      fields: ['buildingMindsID'],
    })

    /** * Seoul maps update ***/
    const areaFloor15Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
            inner join floors f on f.id = a."floorId"
            inner join buildings b on b.id = f."buildingId"
        WHERE name = 'Seoul-KCCI' and f.number = '15'`)
    )[0][0].id
    const areaFloor16Id = (
      await queryInterface.sequelize.query(`
        SELECT a.id FROM areas a
            inner join floors f on f.id = a."floorId"
            inner join buildings b on b.id = f."buildingId"
        WHERE name = 'Seoul-KCCI' and f.number = '16'`)
    )[0][0].id
    const areaMapFloor15 = await fs.readFile('./model/migrations/maps/ko/kcci/15.svg', 'utf8')
    const areaMapFloor16 = await fs.readFile('./model/migrations/maps/ko/kcci/16.svg', 'utf8')

    queryInterface.bulkUpdate('areas', { map: areaMapFloor15 }, { id: areaFloor15Id }, { options }) // update area A1
    queryInterface.bulkUpdate('areas', { map: areaMapFloor16 }, { id: areaFloor16Id }, { options }) // update area A2

    await transaction.commit()
  },
  down: async (queryInterface) => {
    await queryInterface.removeIndex('sites', 'sites_building_minds_i_d')
    await queryInterface.removeIndex('buildings', 'buildings_building_minds_i_d')
    await queryInterface.removeIndex('floors', 'floors_building_minds_i_d')
    await queryInterface.removeIndex('areas', 'areas_building_minds_i_d')
    await queryInterface.removeIndex('seats', 'seats_building_minds_i_d')
  },
}
