const { returning } = require('./common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /* QUERY */
    // sites
    const SiteId = (
      await queryInterface.sequelize.query(
        `SELECT id 
            FROM sites 
            WHERE name = 'Montevideo (FSSCA at WTC 4)'`,
        options
      )
    )[0][0].id

    // building
    const BuildingId = (
      await queryInterface.sequelize.query(
        `SELECT id 
          FROM buildings 
          WHERE "siteId" = ${SiteId}`,
        options
      )
    )[0][0].id
    // floor
    const floorsIds = (
      await queryInterface.sequelize.query(
        `SELECT id 
          FROM floors
          WHERE "buildingId" = ${BuildingId}
          AND "typeId" = 1`,
        options
      )
    )[0] //[1,2,3,4,5,6,7,8]

    // area
    for (const f of floorsIds) {
      const areaId = (
        await queryInterface.sequelize.query(
          `SELECT id 
            FROM areas
                WHERE "floorId" = ${f.id}`,
          options
        )
      )[0][0].id

      const SeatId = (
        await queryInterface.sequelize.query(
          `SELECT id
            FROM seats
            WHERE "areaId" = ${areaId}`,
          options
        )
      )[0][0].id

      await queryInterface.bulkDelete('seatHoods', {seatId: SeatId}, options)
    }

    const HoodsId = (
      await queryInterface.sequelize.query(
        `SELECT id
          FROM hoods
          WHERE  "siteId" = ${SiteId}`,
        options
      )
    )[0]

    for (const h of HoodsId) {
      await queryInterface.bulkDelete('hoodOrgCodes', {hoodId: h.id}, options)
    }

    await queryInterface.bulkDelete('hoods', {siteId: SiteId}, options)

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
}