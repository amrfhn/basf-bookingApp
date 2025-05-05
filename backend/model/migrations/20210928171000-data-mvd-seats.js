module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const toEnable = {
      18: [21, 23, 25, 31, 34, 38, 44, 50, 56, 62, 67, 68],
      19: [5, 6, 11, 12, 15, 21, 35, 41, 47, 59, 63],
      20: [4, 8, 12, 16, 18, 25, 31, 37, 43, 48, 50, 54, 60, 66, 72, 82, 89],
      21: [4, 8, 12, 16, 20, 25, 31, 41, 43, 47, 51, 55, 63, 65, 71, 77, 82],
      22: [4, 8, 12, 16, 20, 24, 30, 36, 41, 45, 59, 65, 71, 77, 81],
      23: [4, 8, 12, 16, 21, 25, 33, 37, 41, 47, 53, 59, 65, 69, 76],
      24: [4, 8, 12, 16, 17, 20, 23, 24, 27, 28, 29, 32, 34, 40, 51, 57, 63],
      25: [4, 8, 12, 16, 20, 21, 27, 33, 36, 42, 47, 51, 60, 66, 78, 80, 81],
    }

    const toDisable = {
      19: [13],
      20: [84],
    }

    const valuesToEnable = Object.entries(toEnable)
      .map(([k, v]) => '(' + k + ', ' + v.join('), (' + k + ', ') + ')')
      .join(',\n')

    const valuesToDisable = Object.entries(toDisable)
      .map(([k, v]) => '(' + k + ', ' + v.join('), (' + k + ', ') + ')')
      .join(',\n')

    await queryInterface.sequelize.query(
      'UPDATE seats s SET "startDate" = \'2021-10-04\',"endDate" = null WHERE EXISTS ( SELECT * FROM ( VALUES ' +
        valuesToEnable +
        ' )  AS enables (floor_number, seat_code), areas a INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" ' +
        ' WHERE s.code = seat_code AND f.number=floor_number AND s."areaId"=a.id AND b."name"=\'WTC Torre 4\'  );',
      { transaction }
    )

    await queryInterface.sequelize.query(
      'UPDATE seats s SET "endDate" = \'2021-10-03\' WHERE EXISTS ( SELECT * FROM ( VALUES ' +
        valuesToDisable +
        ' )  AS enables (floor_number, seat_code), areas a INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" ' +
        ' WHERE s.code = seat_code AND f.number=floor_number AND s."areaId"=a.id AND b."name"=\'WTC Torre 4\'  );',
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
