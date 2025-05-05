const reducerBuildings = (a, c) => {
  a[c.name] = c.id
  return a
}

const values = {
  OBC03: 1,
  OBC04: 1,
  República: -3,
  EPIC: -6,
  'HUB Montevideo': -3,
  'Corporativo Insurgentes': -6,
  Morato: -5,
  Metropolitan: -7,
  'WTC Torre 4': -3,
  Rochavera: -3,
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn('buildings', 'gmt', { type: Sequelize.SMALLINT }, { transaction })
    await queryInterface.addColumn(
      'buildings',
      'reservationCancellationHours',
      { type: Sequelize.SMALLINT },
      { transaction }
    )

    const result = await queryInterface.sequelize.query(`select id, name from buildings`, { transaction })

    const buildings = result[0].reduce(reducerBuildings, {})

    const queryGtm = Object.entries(buildings)
      .map(([k, v]) => `UPDATE buildings SET "gmt" = ${values[k]} WHERE id = ${v};`)
      .join('\n')

    const queryCancellationHours = Object.entries(buildings)
      .map(([k, v]) => `UPDATE buildings SET "reservationCancellationHours" = 24 WHERE id = ${v};`)
      .join('\n')

    await queryInterface.sequelize.query(queryGtm, { transaction })
    await queryInterface.sequelize.query(queryCancellationHours, { transaction })

    await queryInterface.sequelize.query(`ALTER TABLE buildings ALTER COLUMN "gmt" SET NOT NULL`, { transaction })
    await queryInterface.sequelize.query(
      `ALTER TABLE buildings ALTER COLUMN "reservationCancellationHours" SET NOT NULL`,
      { transaction }
    )

    await queryInterface.removeColumn('buildings', 'timeDifference', { transaction })
    await queryInterface.removeColumn('buildings', 'reservationCancelationDays', { transaction })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
