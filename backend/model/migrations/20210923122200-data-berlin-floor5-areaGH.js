const fs = require('fs').promises

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** *  Map ***/
    const areaMap = (await fs.readFile('./model/migrations/maps/de/OBC03/5/areaGH.svg', 'utf8')).replace(/'/g, "''")

    const query = `UPDATE areas SET map = '${areaMap}' WHERE "floorId" IN ( SELECT f.id FROM floors AS f INNER JOIN buildings AS b ON b.id = f."buildingId" WHERE b.name = 'OBC03' AND f."number" = 5) AND "code" = 'G-H';`

    await queryInterface.sequelize.query(query).catch((e) => console.error(e))
  },
  down: async (queryInterface, Sequelize) => {},
}
