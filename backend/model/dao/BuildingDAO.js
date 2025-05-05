const { Site, Building, config } = require('../model')
const { raw, nest, sequelize, Op } = config

const getQuantityOfSeatsPerFloorPerDate = `
    SELECT f.id AS "floorId", f.number AS "floorNumber", f."landingZones" AS "landingZones",
       c.date,
       COUNT(s.id) - COUNT(bK.id) AS quantity
FROM buildings b
         INNER JOIN floors f ON b.id = f."buildingId"
         INNER JOIN areas a ON f.id = a."floorId"
         INNER JOIN seats s ON a.id = s."areaId"
         INNER JOIN calendars c ON c.date BETWEEN :initialDate AND :finalDate
         LEFT JOIN bookings bK ON s.id = bK."seatId" AND bK."calendarId" = c.id 
WHERE b.id = :id
  AND c.date > b."startDate" AND (b."endDate" IS NULL OR c.date < b."endDate")
  AND c.date > f."startDate" AND (f."endDate" IS NULL OR c.date < f."endDate")
  AND c.date > a."startDate" AND (a."endDate" IS NULL OR c.date < a."endDate")
  AND c.date > s."startDate" AND (s."endDate" IS NULL OR c.date < s."endDate")
  AND c.available
  AND f."typeId" = :typeId
GROUP BY f.id, c.date
`

const getMaxReservationDatesQuery =
  'SELECT MAX(GREATEST(b."reservationDays", b."managerReservationDays")) FROM buildings b'

module.exports = {
  getAll(filter) {
    console.log('GetAll buildings')
    const where = {}
    let includeDisableds = false

    if (filter) {
      where[Op.and] = []

      if (filter.siteId) {
        where.siteId = filter.siteId
      }
      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }
      if (filter.disabled && filter.disabled === 'true') {
        includeDisableds = true
      }
    }

    if (!includeDisableds) {
      where.startDate = { [Op.lte]: new Date() }
      const val = {}
      val[Op.or] = [{ endDate: { [Op.is]: null } }, { endDate: { [Op.gte]: new Date() } }]
      where[Op.and].push(val)
    }

    const include = [
      {
        model: Site,
        attributes: ['country']
      }
    ]

    const attributes = [
      'id',
      'name',
      'address',
      'image',
      'extras',
      'reservationDays',
      'managerReservationDays',
      'cancellationHours',
      'reservationCancellationHours',
      'siteId',
      'gmt',
      'startDate',
      'endDate',
      'buildingMindsID',
      'parkingReservationDays'
    ]
    const order = sequelize.col('name')
    return Building.findAll({ attributes, include, where, order, raw, nest })
  },
  get(id) {
    console.log('Get building', id)
    const include = [
      {
        model: Site,
        attributes: ['id', 'name', 'country', 'city', 'buildingMindsID'],
      },
    ]
    return Building.findByPk(id, { include })
  },
  create(data) {
    console.log('Create building', data)
    return Building.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update building', id, data)
    return Building.update(data, { where: { id } }).then(() => Building.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete building', id)
    return Building.findByPk(id, { raw, nest }).then((u) => Building.destroy({ where: { id } }).then(() => u))
  },
  getQSeatsPerFloor(id, filter) {
    return sequelize.query(getQuantityOfSeatsPerFloorPerDate, {
      replacements: { id: id, initialDate: filter.initialDate, finalDate: filter.finalDate, typeId: 1 },
      raw,
      nest,
    })
  },
  getMaxReservationDates() {
    return sequelize.query(getMaxReservationDatesQuery, { raw, nest }).then((r) => r[0].max)
  },
}
