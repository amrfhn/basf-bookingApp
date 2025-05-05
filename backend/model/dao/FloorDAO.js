const {
  Floor,
  Area,
  Seat,
  Booking,
  BookingStatus,
  Calendar,
  WorkspaceType,
  config,
  SeatPreferable,
  SeatOwner,
} = require('../model')
const { raw, nest, Op, sequelize } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll floors')
    const include = [
      {
        model: Area,
        attributes: ['id', 'code'],
      },
      {
        model: WorkspaceType,
        attributes: ['id', 'status'],
      },
    ]

    const where = {}
    let includeDisableds = false

    if (filter) {
      where[Op.and] = []

      if (filter.buildingId) {
        where.buildingId = filter.buildingId
      }

      if (filter.number) {
        where.number = filter.number
      }
      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }
      if (filter.disabled && filter.disabled === 'true') {
        includeDisableds = true
      }
      if (filter.floorType === 2) {
        where['$workspaceType.status$'] = { [Op.eq]: 'Parking' }
      } else if (!filter.allTypes) {
        where['$workspaceType.status$'] = { [Op.eq]: 'Seat' }
      }
    }
    if (!includeDisableds) {
      where.startDate = { [Op.lte]: new Date() }
      const val = {}
      val[Op.or] = [{ endDate: { [Op.is]: null } }, { endDate: { [Op.gte]: new Date() } }]
      where[Op.and].push(val)
    }
    const order = sequelize.col('number')
    const attributes = [
      'id',
      'number',
      'buildingId',
      'startDate',
      'endDate',
      'landingZones',
      'buildingMindsID',
      'typeId',
    ]
    return Floor.findAll({ attributes, where, include, order })
  },
  get(id) {
    console.log('Get floor', id)
    return Floor.findByPk(id)
  },
  getMap(id) {
    console.log('Get map floor', id)
    return Floor.findByPk(id, { attributes: ['map'] }).then((f) => f.map)
  },
  create(data) {
    console.log('Create floor', data)
    return Floor.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update floor', id, data)
    return Floor.update(data, { where: { id } }).then(() => Floor.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete floor', id)
    return Floor.findByPk(id, { raw, nest }).then((u) => Floor.destroy({ where: { id } }).then(() => u))
  },
  getParking(filter) {
    console.log('Get parking floor', filter)
    const where = {}
    const attributes = ['id', 'number', 'buildingId', 'map', 'typeId']
    const include = [
      {
        model: Area,
        attributes: ['id', 'code'],
        include: {
          model: Seat,
          attributes: ['id', 'code'],
          include: [
            {
              model: SeatPreferable,
              attributes: ['seatId', 'userId'],
            },
            {
              model: SeatOwner,
              attributes: ['seatId', 'userId'],
            },
          ],
        },
      },
      {
        model: WorkspaceType,
        attributes: ['id', 'status'],
      },
    ]
    if (filter) {
      where[Op.and] = []
      where['$workspaceType.status$'] = { [Op.eq]: 'Parking' }
      where.typeId = 2
      if (filter.buildingId) {
        where.buildingId = filter.buildingId
      }
      if (filter.seatId) {
        where['$areas.seats.id$'] = filter.seatId
      }
    }
    return Floor.findAll({ attributes, where, include })
  },
  getSeatsFiltered(id, filter) {
    console.log('Get floor', id)
    const attributes = ['id', 'number', 'buildingId']
    const include = [
      {
        model: Area,
        attributes: ['id', 'code'],
        include: {
          model: Seat,
          attributes: ['id', 'code'],
          include: {
            model: Booking,
            attributes: ['id', 'reserverUserId', 'userId'],
            include: [
              {
                model: BookingStatus,
                attributes: ['status'],
              },
              { model: Calendar, attributes: ['date', 'available'] },
            ],
          },
        },
      },
    ]
    const where = {}
    if (filter.initialDate && filter.finalDate) {
      where['$calendar.date$'] = { [Op.between]: [filter.initialDate, filter.finalDate] }
    }
    return Floor.findByPk(id, { include, attributes, where })
  },
  getFloorDepthID(id, filter) {
    console.log('Get floor in depth by id: ', id)
    const where = {}
    const attributes = ['id', 'number']
    const include = [
      {
        model: Area,
        attributes: ['id', 'code'],
        include: {
          model: Seat,
          attributes: ['id', 'code'],
          include: [
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
          ],
        },
      },
    ]
    return Floor.findByPk(id, { include, attributes, where })
  },
}
