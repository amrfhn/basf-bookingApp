const { getAreaCode, indexer, returning, startDate, endDate } = require('./common')
const brasilData = require('./data/20220215095500-data-update-seats-brasil.json')

const areaIndexFunction = (v) => v.floorNumber + '-' + v.areaCode
const reducerAreas = indexer(areaIndexFunction, getAreaCode)

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    const areaFloors = await queryInterface.sequelize.query(
      'SELECT a.id as "areaId", a.code as "areaCode", f.id as "floorId", f.number as "floorNumber"\n' +
        'FROM areas a\n' +
        '         INNER JOIN floors f on f.id = a."floorId"\n' +
        '         inner join buildings b on b.id = f."buildingId"\n' +
        "WHERE b.name = 'Rochavera' AND (f.number, a.code) in ((9,'a'),(9,'c'),(15,'b1'),(15,'b2'),(16,'a2'));",
      options
    )

    const seatIds = await queryInterface.sequelize.query(
      'SELECT s.id FROM seats s INNER JOIN areas a on a.id = s."areaId" INNER JOIN floors f on f.id = a."floorId" INNER JOIN buildings b on b.id = f."buildingId"\n' +
        "WHERE b.name = 'Rochavera' AND (f.number, a.code) in ((9,'a'),(9,'c'),(15,'b1'),(15,'b2'),(16,'a2'));",
      options
    )
    let idsToDelete = ''
    seatIds[0].map((seatId) => (idsToDelete += `(${seatId.id}),`))
    idsToDelete = idsToDelete.slice(0, -1)

    await queryInterface.sequelize.query(`DELETE FROM bookings WHERE "seatId" in (${idsToDelete});`, options)

    let seatsToDelete = ''
    areaFloors[0].map((areaFloor) => (seatsToDelete += `(${areaFloor.areaId}),`))
    seatsToDelete = seatsToDelete.slice(0, -1)

    await queryInterface.sequelize.query(`DELETE FROM seats WHERE "areaId" in (${seatsToDelete});`, options)

    const areasIdx = areaFloors[0].reduce(reducerAreas, {})

    for (let i = 0; i < brasilData.length; i++) {
      brasilData[i].areaId = areasIdx[brasilData[i].floor + '-' + brasilData[i].area]
    }

    /** * Seats ***/
    await queryInterface.bulkInsert(
      'seats',
      brasilData.map(({ seat, areaId, available }) => {
        return { code: seat, areaId, startDate, endDate: available ? null : endDate }
      }),
      options
    )
    await transaction.commit()
  },

  down: async () => {},
}
