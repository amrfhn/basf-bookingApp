const OBC03 = {
  14: 'Cash & Masterdata',
  13: 'Cash & Masterdata | A/R',
  12: 'A/R',
  11: 'A/R  | Tax',
  9: 'Tax  | P2P',
  8: 'P2P',
  7: 'P2P',
  6: 'P2P',
  5: 'P2P              Freights | Overseas & Customs | Domestic',
  4: 'People           People | Talent & Com | HR EMEA',
  3: 'Local HR         Local HR | HR DE | HR LU | HR EMEA',
  2: 'B2R              B2R',
  1: 'B2R | GTU | Project | Site Services',
  0: 'Works Council',
}

const OBC04 = {
  5: 'Product Safety',
  4: 'Product Safety',
}

const Montevideo = {
  25: 'Financial Reporting | Legal | GTU | GD',
  24: 'Controlling | Projects | HR | People Services | Comunicación Corporativa | General Management | Facility Management',
  23: 'P2P | EHS',
  22: 'P2P',
  21: 'People Services',
  20: 'O2C',
  19: 'Supply Chain',
  18: 'Business Reporting',
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const result = await queryInterface.sequelize.query(
      `SELECT number, "buildingId" FROM floors INNER JOIN buildings b ON floors."buildingId" = b.id WHERE b.name = 'WTC Torre 4'`
    )

    const result2 = await queryInterface.sequelize.query(
      `SELECT number, "buildingId" FROM floors INNER JOIN buildings b ON floors."buildingId" = b.id WHERE b.name = 'OBC03'`
    )

    const result3 = await queryInterface.sequelize.query(
      `SELECT number, "buildingId" FROM floors INNER JOIN buildings b ON floors."buildingId" = b.id WHERE b.name = 'OBC04'`
    )

    const floors = result[0]
    const floors2 = result2[0]
    const floors3 = result3[0]

    await queryInterface.addColumn('floors', 'landingZones', { type: Sequelize.STRING }, { transaction })

    const query1 = floors
      .map(
        (floor) =>
          `UPDATE floors SET "landingZones" = '${Montevideo[floor.number]}' WHERE number = ${
            floor.number
          } AND "buildingId" = ${floor.buildingId};`
      )
      .join('\n')
    await queryInterface.sequelize.query(query1, { transaction })

    const query2 = floors2
      .map(
        (floor) =>
          `UPDATE floors SET "landingZones" = '${OBC03[floor.number]}' WHERE number = ${
            floor.number
          } AND "buildingId" = ${floor.buildingId};`
      )
      .join('\n')
    await queryInterface.sequelize.query(query2, { transaction })

    const query3 = floors3
      .map(
        (floor) =>
          `UPDATE floors SET "landingZones" = '${OBC04[floor.number]}' WHERE number = ${
            floor.number
          } AND "buildingId" = ${floor.buildingId};`
      )
      .join('\n')
    await queryInterface.sequelize.query(query3, { transaction })

    await transaction.commit()
  },
}
