module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.sequelize.query(
    //   `create view public."seatCascade" as
    //   select ss.id as "seatId",s.name as site, b.name as building, f.number as floor, a.code as area, ss.code as seat
    //   from sites s
    //      inner join buildings b on b."siteId" = s.id
    //      inner join floors f on f."buildingId" = b.id
    //      inner join areas a on a."floorId" = f.id
    //      inner join seats ss on ss."areaId" = a.id;`
    // )
  },
  down: async (queryInterface, Sequelize) => {},
}
