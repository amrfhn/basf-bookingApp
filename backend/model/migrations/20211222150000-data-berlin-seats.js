const berlinDataOBC03 = require('./data/20211221150000-berlin-amenities-OBC03.json')
const berlinDataOBC04 = require('./data/20211221150000-berlin-amenities-OBC04.json')
const returning = true

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    let valuesSeatToEnable = ''
    let valuesSeatToDisable = ''
    for (const seat of berlinDataOBC03) {
      if (seat.available !== false) {
        valuesSeatToEnable += `(${seat.floor},'${seat.area}',${seat.seat}),`
      }
    }
    for (const seat of berlinDataOBC04) {
      if (seat.available === false) {
        valuesSeatToDisable += `(${seat.floor},'${seat.area}',${seat.seat}),`
      }
    }
    valuesSeatToEnable = valuesSeatToEnable.slice(0, -1)
    valuesSeatToDisable = valuesSeatToDisable.slice(0, -1)

    // enable
    const enableQuery =
      'UPDATE seats s SET "endDate" = null WHERE s.id IN ( SELECT s1.id FROM ( VALUES ' +
      valuesSeatToEnable +
      ')  AS enables (floor_number, area_code, seat_code), seats s1 INNER JOIN areas a ON a.id=s1."areaId" INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" WHERE s1.code = seat_code AND a.code = area_code AND f.number=floor_number AND b."name"=\'OBC03\');'
    await queryInterface.sequelize.query(enableQuery, { transaction, returning })

    // disable
    const disableQuery =
      'UPDATE seats s SET "endDate" = \'2021-10-10\' WHERE s.id IN ( SELECT s1.id FROM ( VALUES ' +
      valuesSeatToDisable +
      ')  AS enables (floor_number, area_code, seat_code), seats s1 INNER JOIN areas a ON a.id=s1."areaId" INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" WHERE s1.code = seat_code AND a.code = area_code AND f.number=floor_number AND b."name"=\'OBC04\');'
    await queryInterface.sequelize.query(disableQuery, { transaction, returning })

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
