const query = `
INSERT INTO seats(code, "areaId", "startDate")
VALUES (48, (SELECT a.id FROM areas a
             JOIN floors f ON f.id = a."floorId"
             JOIN buildings b ON b.id = f."buildingId"
             WHERE a.code='O' AND f.number = 2 AND b.name = 'OBC03') , '2021-01-01');`

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(query)
  },
  down: async (queryInterface, Sequelize) => {},
}
