const { returning } = require('./common')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    /** * Seoul ***/
    const seoulSiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites as s WHERE s.name = 'Seoul 서울'`)
    )[0][0].id

    const oneMonitorAmenitySeoul = (
      await queryInterface.bulkInsert(
        'amenities',
        [
          {
            type: 'MULTI',
            filterable: true,
            key: '1 Monitor',
            siteId: seoulSiteId,
          },
        ],
        options
      )
    )[0].id

    await queryInterface.bulkInsert(
      'amenityValues',
      [{ amenityId: oneMonitorAmenitySeoul, value: '1 Monitor' }],
      options
    )

    /** * Izmir ***/
    const izmirSiteId = (
      await queryInterface.sequelize.query(`SELECT id FROM sites as s WHERE s.name = 'İzmir Sales Office'`)
    )[0][0].id

    const oneMonitorAmenityIzmir = (
      await queryInterface.bulkInsert(
        'amenities',
        [
          {
            type: 'MULTI',
            filterable: true,
            key: '1 Monitor',
            siteId: izmirSiteId,
          },
        ],
        options
      )
    )[0].id

    await queryInterface.bulkInsert(
      'amenityValues',
      [{ amenityId: oneMonitorAmenityIzmir, value: '1 Monitor' }],
      options
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
