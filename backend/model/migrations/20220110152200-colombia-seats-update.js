const { returning } = require('./common')
const colombiaData = require('./data/20220110152600-data-seat-colombia-update.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }
    let valuesSeatToEnable = ''
    let valuesSeatToDisable = ''
    for (const seat of colombiaData) {
      if (seat.available !== false) {
        valuesSeatToEnable += `(${seat.floor},'-',${seat.seat}),`
      }
    }
    for (const seat of colombiaData) {
      if (seat.available === false) {
        valuesSeatToDisable += `(${seat.floor},'-',${seat.seat}),`
      }
    }
    valuesSeatToEnable = valuesSeatToEnable.slice(0, -1)
    valuesSeatToDisable = valuesSeatToDisable.slice(0, -1)

    // enable
    const enableQuery =
      'UPDATE seats s SET "endDate" = null WHERE s.id IN ( SELECT s1.id FROM ( VALUES ' +
      valuesSeatToEnable +
      ')  AS enables (floor_number, area_code, seat_code), seats s1 INNER JOIN areas a ON a.id=s1."areaId" INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" WHERE s1.code = seat_code AND a.code = area_code AND f.number=floor_number AND b."name"=\'Morato\');'
    await queryInterface.sequelize.query(enableQuery, options)

    // disable
    const disableQuery =
      'UPDATE seats s SET "endDate" = \'2022-01-01\' WHERE s.id IN ( SELECT s1.id FROM ( VALUES ' +
      valuesSeatToDisable +
      ')  AS enables (floor_number, area_code, seat_code), seats s1 INNER JOIN areas a ON a.id=s1."areaId" INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" WHERE s1.code = seat_code AND a.code = area_code AND f.number=floor_number AND b."name"=\'Morato\');'
    await queryInterface.sequelize.query(disableQuery, options)

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {},
}
