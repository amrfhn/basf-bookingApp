const {
  Seat,
  config,
  SeatAmenity,
  Amenity,
  SeatAmenityNumericValue,
  SeatAmenityBooleanValue,
  SeatAmenityMultiValue,
  AmenityValue,
  Hood,
  SeatHood,
  Booking,
  SeatPreferable,
  SeatOwner,
  Area,
  Floor,
  Building,
  Site,
  HoodOrgCode,
} = require('../model')
const { raw, nest, Op, sequelize } = config

const getReservationDaysPerSeatQuery = `
SELECT 
  b.id AS "buildingId",
  GREATEST (b."reservationDays", b."managerReservationDays") AS "reservationDays",
  f.id AS "floorId",
  a.id AS "areaId",
  s.id AS "seatId",
  s."typeId" AS "seatTypeId"
FROM
  buildings b
  INNER JOIN floors f ON b.id = f."buildingId"
  INNER JOIN areas a ON f.id = a."floorId"
  INNER JOIN seats s ON a.id = s."areaId"`

module.exports = {
  async getAll(filter) {
    console.log('GetAll seat')
    const where = {}
    let includeDisabled = false
    if (filter) {
      where[Op.and] = []
      if (filter.areaId) {
        where.areaId = filter.areaId
      }
      if (filter.code) {
        where.code = filter.code
      }
      if (filter.id) {
        where.id = filter.id
      }
      if (filter.ids) {
        where.id = { [Op.in]: filter.ids }
      }
      if (filter.disabled && filter.disabled === 'true') {
        includeDisabled = true
      }
      if (filter.typeId) {
        where.typeId = filter.typeId
      }
      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }
      if (filter.buildingMindsIDs) {
        where.buildingMindsID = { [Op.in]: filter.buildingMindsIDs }
      }
      if (filter.buildingId) {
        where['$area.floor.building.id$'] = { [Op.eq]: filter.buildingId }
      }
      if (filter.siteId) {
        where['$area.floor.building.site.id$'] = { [Op.eq]: filter.siteId }
      }
      if (filter.orgCode) {
        where['$seatHoods.hood.hoodOrgCodes.orgCode$'] = { [Op.eq]: filter.orgCode }
      }
    }

    if (!includeDisabled) {
      where.startDate = { [Op.not]: null }
      const val = {}
      val[Op.or] = [{ endDate: { [Op.is]: null } }, { endDate: { [Op.gte]: new Date() } }]
      where[Op.and].push(val)
    }
    const include = [
      {
        model: SeatAmenity,
        attributes: ['id'],
        include: [
          { model: Amenity, attributes: ['id', 'key', 'type', 'filterable'] },
          { model: SeatAmenityNumericValue, attributes: ['value'] },
          { model: SeatAmenityBooleanValue, attributes: ['value'] },
          { model: SeatAmenityMultiValue, include: [{ model: AmenityValue, attributes: ['value'] }] },
        ],
      },
      { model: SeatOwner, attributes: ['id', 'userId'] },
      { model: SeatHood, attributes: ['id', 'hoodId'], include: [{ model: Hood, attributes: ['id', 'name'], include: [{ model: HoodOrgCode, attributes: ['orgCode' ] }] }] },
      {
        model: Area,
        attributes: ['id', 'code'],
        include: {
          model: Floor,
          attributes: ['id', 'number'],
          include: {
            model: Building,
            attributes: ['id', 'name', 'cancellationHours', 'reservationCancellationHours', 'reservationDays'],
            include: {
              model: Site,
              attributes: ['id', 'name', 'country', 'city', 'feedbackContact'],
            },
          },
        },
      },
    ]
    const order = sequelize.col('code')
    return Seat.findAll({
      attributes: ['id', 'code', 'areaId', 'startDate', 'endDate', 'buildingMindsID', 'typeId'],
      include,
      order,
      where,
    }).then((r) => r.map((s) => s.toJSON()))
  },
  getSeatDepthID(ids) {
    console.log('Get seats in depth by ids: ', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const attributes = ['id', 'code']
    const include = [
      {
        model: Booking,
        attributes: ['id', 'reserverUserId', 'userId'],
      },
      {
        model: SeatOwner,
        attributes: ['id'],
      },
      {
        model: SeatPreferable,
        attributes: ['id'],
      },
    ]
    return Seat.findAll({ attributes, include, where })
  },
  get(id) {
    console.log('Get seat', id)
    return Seat.findByPk(id)
  },
  create(data) {
    console.log('Create seat', data)
    return Seat.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update seat', id, data)
    return Seat.update(data, { where: { id } }).then(() => Seat.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete seat', id)
    return Seat.findByPk(id, { raw, nest }).then((u) => Seat.destroy({ where: { id } }).then(() => u))
  },
  reservationDaysPerSeat() {
    return sequelize.query(getReservationDaysPerSeatQuery, { raw, nest })
  },

  getHoods(seatId) {
    console.log('Get Hoods')
    const where = {}
    where.id = seatId
    const include = [
      {
        model: SeatHood,
        attributes: ['hoodId'],
        include: [{ model: Hood, attributes: ['id', 'name'] }],
      },
    ]
    const order = sequelize.col('code')
    return Seat.findAll({ attributes: ['id', 'code', 'areaId', 'startDate', 'endDate'], include, order, where }).then(
      (r) => r.map((s) => s.toJSON())
    )
  },
  async bulkCreate(data) {
    return Seat.bulkCreate(data)
  },
  async bulkUpdate(ids, data) {
    const transaction = await Seat.sequelize.transaction()
    await Seat.update({ startDate: data.startDate, endDate: data.endDate }, { where: { id: ids } }, transaction)
    const result = await Seat.findAll({ where: data }, transaction)
    await transaction.commit()
    return result
  },
  async bulkDelete(ids) {
    console.log('Deleting seats', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const seats = await Seat.findAll({ raw, nest, where })
    const seatsIds = seats.map((b) => b.id)
    where.id = { [Op.in]: seatsIds }
    return Seat.destroy({ raw, nest, where })
  },
}
