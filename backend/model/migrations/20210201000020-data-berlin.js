const fs = require('fs').promises
const startDate = '2021-01-01'
const endDate = '2021-01-01'

const returning = true

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [{ name: 'HUB Berlin', country: 'Germany', city: 'Berlin', startDate }],
      { returning, transaction }
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'OBC03',
          address: 'Rotherstraße 11',
          image: '/future_of_work/img/OBC03.png',
          reservationDays: 14,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: 0,
        },
        {
          name: 'OBC04',
          address: 'Rotherstraße 11',
          image: '/future_of_work/img/OBC04.png',
          reservationDays: 14,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: 0,
        },
      ],
      { returning, transaction }
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [
        { number: 0, map: '', buildingId: buildings[0].id, startDate },
        { number: 1, map: '', buildingId: buildings[0].id, startDate },
        { number: 2, map: '', buildingId: buildings[0].id, startDate },
        { number: 3, map: '', buildingId: buildings[0].id, startDate },
        { number: 4, map: '', buildingId: buildings[0].id, startDate },
        { number: 5, map: '', buildingId: buildings[0].id, startDate },
        { number: 6, map: '', buildingId: buildings[0].id, startDate },
        { number: 7, map: '', buildingId: buildings[0].id, startDate },
        { number: 8, map: '', buildingId: buildings[0].id, startDate },
        { number: 9, map: '', buildingId: buildings[0].id, startDate },
        { number: 10, map: '', buildingId: buildings[0].id, startDate },
        { number: 11, map: '', buildingId: buildings[0].id, startDate },
        { number: 12, map: '', buildingId: buildings[0].id, startDate },
        { number: 13, map: '', buildingId: buildings[0].id, startDate },
        { number: 14, map: '', buildingId: buildings[0].id, startDate },
        { number: 15, map: '', buildingId: buildings[0].id, startDate },

        { number: 1, map: '', buildingId: buildings[1].id, startDate },
        { number: 4, map: '', buildingId: buildings[1].id, startDate },
        { number: 5, map: '', buildingId: buildings[1].id, startDate },
      ],
      { returning, transaction }
    )

    const sql = [
      '003-DML-berlin.sql',
      // '004-DML-berlin-floors-map.sql',
      '005-DML-berlin-area-L-map.sql',
      '006-DML-berlin-area-GH-map.sql',
      '015-DML-berlin-OBC04-floors-map.sql',
      '016-DML-berlin-OBC04-1floor-13area-map.sql',
      '017-DML-berlin-OBC04-1floor-14area-map.sql',
      '018-DML-berlin-OBC04-1floor-15area-map.sql',
      '019-DML-berlin-OBC04-4floor-13area-map.sql',
      '020-DML-berlin-OBC04-4floor-14area-map.sql',
      '021-DML-berlin-OBC04-4floor-15area-map.sql',
      '022-DML-berlin-OBC04-5floor-13area-map.sql',
      '023-DML-berlin-OBC04-5floor-14area-map.sql',
      '024-DML-berlin-OBC04-5floor-15area-map.sql',
      '025-DML-berlin-OBC04-5floor-16area-map.sql',
      // '026-DML-berlin-OBC04-generateSeats.sql', This script is included in 003-DML-berlin.sql
      '028-DML-berlin-OBC03-0floor-Oarea-map.sql',
      '029-DML-berlin-OBC03-1floor-Jarea-map.sql',
      '030-DML-berlin-OBC03-1floor-Karea-map.sql',
      '031-DML-berlin-OBC03-1floor-Larea-map.sql',
      '032-DML-berlin-OBC03-1floor-Marea-map.sql',
      '033-DML-berlin-OBC03-1floor-Narea-map.sql',
      '034-DML-berlin-OBC03-2floor-GHarea-map.sql',
      '035-DML-berlin-OBC03-2floor-Iarea-map.sql',
      '036-DML-berlin-OBC03-2floor-Jarea-map.sql',
      '037-DML-berlin-OBC03-2floor-Karea-map.sql',
      '038-DML-berlin-OBC03-2floor-Larea-map.sql',
      '039-DML-berlin-OBC03-2floor-Marea-map.sql',
      '040-DML-berlin-OBC03-2floor-Narea-map.sql',
      '041-DML-berlin-OBC03-2floor-Oarea-map.sql',
      '042-DML-berlin-OBC03-3floor-GHarea-map.sql',
      '043-DML-berlin-OBC03-3floor-Iarea-map.sql',
      '044-DML-berlin-OBC03-3floor-Jarea-map.sql',
      '045-DML-berlin-OBC03-3floor-Karea-map.sql',
      '046-DML-berlin-OBC03-3floor-Larea-map.sql',
      '047-DML-berlin-OBC03-3floor-Marea-map.sql',
      '048-DML-berlin-OBC03-3floor-Narea-map.sql',
      '049-DML-berlin-OBC03-3floor-Oarea-map.sql',
      '050-DML-berlin-OBC03-4floor-GHarea-map.sql',
      '051-DML-berlin-OBC03-4floor-Iarea-map.sql',
      '052-DML-berlin-OBC03-4floor-Jarea-map.sql',
      '053-DML-berlin-OBC03-4floor-Karea-map.sql',
      '054-DML-berlin-OBC03-4floor-Larea-map.sql',
      '055-DML-berlin-OBC03-4floor-Marea-map.sql',
      '056-DML-berlin-OBC03-4floor-Narea-map.sql',
      '057-DML-berlin-OBC03-4floor-Oarea-map.sql',
      '058-DML-berlin-OBC03-5floor-GHarea-map.sql',
      '059-DML-berlin-OBC03-5floor-Jarea-map.sql',
      '060-DML-berlin-OBC03-5floor-Karea-map.sql',
      '061-DML-berlin-OBC03-5floor-Larea-map.sql',
      '062-DML-berlin-OBC03-5floor-Marea-map.sql',
      '063-DML-berlin-OBC03-5floor-Narea-map.sql',
      '064-DML-berlin-OBC03-5floor-Oarea-map.sql',
      '065-DML-berlin-OBC03-6floor-GHarea-map.sql',
      '066-DML-berlin-OBC03-7floor-GHarea-map.sql',
      '067-DML-berlin-OBC03-8floor-GHarea-map.sql',
      '068-DML-berlin-OBC03-9floor-GHarea-map.sql',
      '069-DML-berlin-OBC03-11floor-GHarea-map.sql',
      '070-DML-berlin-OBC03-12floor-GHarea-map.sql',
      '071-DML-berlin-OBC03-13floor-GHarea-map.sql',
      '072-DML-berlin-OBC03-14floor-GHarea-map.sql',
      '073-DML-berlin-OBC03-floor-maps.sql',
      '074-DML-berlin-OBC04-amenities.sql',
      '075-DML-berlin-OBC03-amenities-floor1.sql',
      '076-DML-berlin-OBC03-amenities-floor2_part1.sql',
      '077-DML-berlin-OBC03-amenities-floor2_part2.sql',
      '078-DML-berlin-OBC03-amenities-floor3.sql',
      '079-DML-berlin-OBC03-amenities-floor4.sql',
      '080-DML-berlin-OBC03-amenities-floor5.sql',
      '081-DML-berlin-OBC03-amenities-floor6-14_part1.sql',
      '082-DML-berlin-OBC03-amenities-floor6-14_part2.sql',
    ]

    const queries = await Promise.all(sql.map((f) => fs.readFile('./.sql/' + f, 'utf8')))

    for (let i = 0; i < queries.length; i++) {
      await queryInterface.sequelize.query(queries[i], { returning, transaction })
    }

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
