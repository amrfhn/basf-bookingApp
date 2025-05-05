const { returning } = require('./common')

const EndDate = '2024-01-03'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const SiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'Colombia'`, options)
    )[0][0].id

    /** update Sites */
    const site = await queryInterface.bulkUpdate(
      'sites',
      { endDate: EndDate },
      { id: SiteId },
      options
    )


    const building = await queryInterface.bulkUpdate (
      'buildings',
      { endDate: EndDate },
      { siteId: SiteId },
      options
    )

    const BuildingId = (
      await queryInterface.sequelize.query(`SELECT id FROM buildings WHERE "siteId" = ${SiteId}`, options)
    )[0][0].id

    const floorsInfo = (
      await queryInterface.sequelize.query(
        `SELECT id FROM floors WHERE "buildingId" = ${BuildingId} AND "typeId" = 1`,
        options
      )
    )[0]

    for (const f of floorsInfo) {
      const floors = await queryInterface.bulkUpdate(
        'floors',
        { endDate: EndDate },
        { id: f.id },
        options
      )

      const AreaId = (
        await queryInterface.sequelize.query(
          `SELECT id FROM areas WHERE "floorId" = ${f.id}`, options
        )
      )[0][0].id

      const areas = await queryInterface.bulkUpdate(
        'areas',
        { endDate: EndDate },
        { id: AreaId },
        options
      )

      const seatsId = (
        await queryInterface.sequelize.query(
          `SELECT id FROM seats WHERE "areaId" = ${AreaId}`, options
        )
      )[0]

      for (const s of seatsId) {
        const seat = await queryInterface.bulkUpdate(
          'seats',
          { endDate: EndDate },
          { id: s.id },
          options
        )
      }

    }

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {},
};
