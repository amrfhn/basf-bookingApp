const moment = require('moment')
const {
  Booking,
  BookingStatus,
  Calendar,
  Seat,
  Area,
  Floor,
  Building,
  Site,
  Amenity,
  SeatAmenity,
  SeatAmenityNumericValue,
  SeatAmenityBooleanValue,
  SeatAmenityMultiValue,
  SeatHood,
  SeatOwner,
  config,
  AmenityValue,
  ExternalUser,
  BookingCheckInStatus
} = require('../model')
const { raw, nest, sequelize } = config
const { Op } = require('sequelize')
const dateFormat = 'YYYY-MM-DD'
const currentDate = () => moment(new Date()).format(dateFormat)

/** * This query takes into account only typeId = 1 bookings ***/
const getMaxQuantityBooksOnPeriod = `
SELECT MAX("amountsPerDate"."amount") 
  FROM 
    (SELECT C.DATE, COUNT(B.ID) AS AMOUNT 
     FROM BOOKINGS AS B 
     INNER JOIN CALENDARS AS C ON C.ID = B."calendarId" 
     WHERE C.DATE BETWEEN :initialDate AND :finalDate 
       AND (B."userId" IN (:users) OR (B."userId" IS NULL AND B."reserverUserId" IN (:users)))
       AND b."typeId" = 1
     GROUP BY C.DATE) AS "amountsPerDate"`

const getSeatCalendarInCalendarsQuery = `SELECT b."seatId"||'|'||b."calendarId" AS key FROM bookings b WHERE b."calendarId" IN (:calendars)`

module.exports = {
  getAll(filter) {
    console.log('GetAll bookings')
    const attributes = ['id', 'externalUserId', 'reserverUserId', 'userId', 'userOrgCode', 'typeId']
    const include = [
      {
        model: Calendar,
        attributes: ['id', 'date', 'available'],
      },
      {
        model: BookingStatus,
        attributes: ['id', 'status'],
      },
      {
        model: BookingCheckInStatus,
        attributes: ['id', 'status'],
      },
      {
        model: Seat,
        attributes: ['id', 'code', 'buildingMindsID'],
        include: [
          {
            model: Area,
            attributes: ['id', 'code'],
            include: {
              model: Floor,
              attributes: ['id', 'number'],
              include: {
                model: Building,
                attributes: ['id', 'name', 'cancellationHours', 'reservationCancellationHours', 'gmt'],
                include: {
                  model: Site,
                  attributes: ['id', 'name', 'country', 'city', 'feedbackContact'],
                },
              },
            },
          },
        ],
      },
      {
        model: ExternalUser,
        attributes: ['id', 'email', 'name', 'surname'],
      },
    ]
    const where = {}
    if (filter.ids) {
      where.id = { [Op.in]: filter.ids }
    }
    if (filter.id) {
      where.id = filter.id
    }
    if (filter.userId) {
      where.userId = filter.userId
    }
    if (filter.notAnonymizedNorNullUserId) {
      where.userId = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
    }
    if (filter.seatId) {
      where.seatId = filter.seatId
    }
    if (filter.seatIds) {
      where.seatId = { [Op.in]: filter.seatIds }
    }
    if (filter.endDate || filter.endDate === null) {
      where['$seat.endDate$'] = { [Op.eq]: filter.endDate }
    }
    if (filter.userIdNull) {
      where.userId = { [Op.eq]: null }
    }
    if (filter.reserverUserIdNull) {
      where.reserverUserId = { [Op.eq]: null }
    }
    if (filter.available) {
      where['$calendar.available$'] = { [Op.eq]: true }
    }
    if (filter.future) {
      where['$calendar.date$'] = { [Op.gte]: currentDate() }
    }
    if (filter.startDate && filter.endDate === null) {
      where['$calendar.date$'] = { [Op.gte]: filter.startDate }
    }
    if (filter.deletionDate) {
      where['$calendar.date$'] = { [Op.lt]: filter.deletionDate }
    }
    if (filter.anonymizationDate) {
      where['$calendar.date$'] = { [Op.lt]: filter.anonymizationDate }
    }
    if (filter.calendars) {
      where.calendarId = { [Op.in]: filter.calendars }
    }
    if (filter.floorId) {
      where['$seat.area.floorId$'] = { [Op.eq]: filter.floorId }
    }
    if (filter.areaId) {
      where['$seat.areaId$'] = { [Op.eq]: filter.areaId }
    }
    if (filter.seatStatus) {
      where['$bookingStatus.status$'] = { [Op.eq]: filter.seatStatus }
    }
    if (filter.buildingId) {
      where['$seat.area.floor.building.id$'] = { [Op.eq]: filter.buildingId }
    }
    if (filter.siteId) {
      where['$seat.area.floor.building.site.id$'] = { [Op.eq]: filter.siteId }
    }
    if (filter.initialDate && filter.finalDate) {
      where['$calendar.date$'] = { [Op.between]: [filter.initialDate, filter.finalDate] }
    }
    if (filter.site) {
      where['$seat.area.floor.building.site.id$'] = { [Op.eq]: filter.site }
    }
    if (filter.notAnonymizedUsers) {
      const userORFilter = {}
      userORFilter.userId = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
      userORFilter.reserverUserId = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
      const extUserANDFilter = {}
      extUserANDFilter.externalUserId = { [Op.not]: null }
      extUserANDFilter['$externalUser.email$'] = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
      extUserANDFilter['$externalUser.name$'] = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
      extUserANDFilter['$externalUser.surname$'] = { [Op.and]: [{ [Op.not]: 'anonymized' }, { [Op.not]: null }] }
      userORFilter[Op.and] = extUserANDFilter
      where[Op.or] = userORFilter
    }
    if (filter.typeId) {
      where.typeId = filter.typeId
    }
    if (filter.reserverUserId) {
      where.reserverUserId = { [Op.not]: null }
    }
    if (filter.checkInStatusId) {
      where.checkInStatusId = { [Op.eq]: filter.checkInStatusId }
    }
    if (filter.statusId) {
      where.statusId = filter.statusId
    }
    if (filter.statusIds) {
      where.statusId = { [Op.in]: filter.statusIds }
    }
    return Booking.findAll({ raw, nest, where, include, attributes })
  },
  async getQuantityAvailableBookings(filter) {
    const include = [
      {
        model: Calendar,
        attributes: ['id', 'date', 'available'],
      },
      {
        model: BookingStatus,
        attributes: ['id', 'status'],
      },
      {
        model: Seat,
        attributes: ['id', 'code'],
        include: [
          {
            model: Area,
            attributes: ['id', 'code'],
            include: {
              model: Floor,
              attributes: ['id', 'number'],
              include: {
                model: Building,
                attributes: ['id', 'name', 'cancellationHours', 'reservationCancellationHours'],
              },
            },
          },
        ],
      },
    ]
    const where = {}
    if (filter.seatStatus) {
      where['$bookingStatus.status$'] = { [Op.eq]: filter.seatStatus }
    }
    if (filter.buildingId) {
      where['$seat.area.floor.building.id$'] = { [Op.eq]: filter.buildingId }
    }
    if (filter.initialDate && filter.finalDate) {
      where['$calendar.date$'] = { [Op.between]: [filter.initialDate, filter.finalDate] }
    }
    if (filter.typeId) {
      where.typeId = filter.typeId
    }
    return Booking.count({ raw, nest, where, include })
  },
  get(id) {
    console.log('Get booking', id)
    return Booking.findByPk(id)
  },
  create(data) {
    console.log('Create booking', data)
    return Booking.create(data, { raw, nest })
  },
  async bulkCreate(data) {
    console.log('Bulk Create booking')
    const transaction = await Booking.sequelize.transaction()
    const result = []
    try {
      for (const i of data) {
        const where = {}
        where.seatId = i.seatId
        where.calendarId = i.calendarId
        const foundItem = await Booking.findOne({ where, raw, nest, transaction })
        if (!foundItem) {
          const item = await Booking.create(i, { raw, nest, transaction })
          result.push(item)
        } else {
          const toUpdate = {
            userId: i.userId,
            statusId: 2,
            userOrgCode: i.userOrgCode,
            checkInStatusId: i.checkInStatusId
          }
          const item = await Booking.update(toUpdate, {
            where: { id: foundItem.id },
            raw,
            nest,
            transaction,
          }).then(() => Booking.findByPk(foundItem.id, { raw, nest, transaction }))
          result.push(item)
        }
      }
      await transaction.commit()
      return result
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }
  },
  update(id, data) {
    console.log('Update booking', id, data)
    return Booking.update(data, { where: { id } }).then(() => Booking.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete booking', id)
    return Booking.findByPk(id, { raw, nest }).then((u) => Booking.destroy({ where: { id } }).then(() => u))
  },
  async bulkDelete(ids) {
    console.log('Deleting bookings')
    const where = {}
    where.id = { [Op.in]: ids }
    const bookings = await Booking.findAll({ raw, nest, where })
    const bookingsIds = bookings.map((b) => b.id)
    where.id = { [Op.in]: bookingsIds }
    return Booking.destroy({ raw, nest, where })
  },
  // This could be refactored to be a configuration parameters of the get function
  findAllOfUser(userId) {
    console.log('GetAll bookings for user')
    const attributes = ['id', 'externalUserId', 'reserverUserId', 'userId', 'userOrgCode']
    const include = includeModelReservationTables()
    const where = {}

    where.userId = userId
    where['$calendar.date$'] = { [Op.gte]: currentDate() }
    where['$calendar.available$'] = { [Op.eq]: true }
    return Booking.findAll({ raw, nest, where, include, attributes })
  },
  findAllOfTeam(teammates) {
    console.log("GetAll bookings for user's teammates")
    const attributes = ['id', 'externalUserId', 'reserverUserId', 'userId', 'userOrgCode']
    const include = includeModelReservationTables()

    const where = {}
    where.userId = { [Op.in]: teammates } // Get all bookings boked by the user's teammates
    where['$calendar.date$'] = { [Op.gte]: currentDate() }
    where['$calendar.available$'] = { [Op.eq]: true }

    return Booking.findAll({ raw, nest, where, include, attributes })
  },
  findAllReservationsOfUser(userId) {
    console.log('GetAll bookings reserved by user')
    const attributes = ['id', 'externalUserId', 'reserverUserId', 'userId', 'userOrgCode']
    const include = includeModelReservationTables()

    const where = {}
    where.reserverUserId = userId
    where.userId = { [Op.is]: null }
    where['$calendar.date$'] = { [Op.gte]: currentDate() }
    where['$calendar.available$'] = { [Op.eq]: true }

    return Booking.findAll({ raw, nest, where, include, attributes })
  },
  getSeatsOnArea(areaId, initialDate, finalDate) {
    const attributes = ['id', 'externalUserId', 'reserverUserId', 'userId', 'userOrgCode']
    const include = [
      {
        model: Calendar,
        attributes: ['id', 'date', 'available'],
      },
      {
        model: Seat,
        attributes: ['id', 'areaId', 'code', 'startDate', 'endDate', 'buildingMindsID'],
        include: [
          {
            model: Area,
            attributes: ['id'],
            include: {
              model: Floor,
              attributes: ['id'],
              include: { model: Building, attributes: ['id'], include: { model: Site, attributes: ['id'] } },
            },
          },
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
          {
            model: SeatHood,
            attributes: ['hoodId'],
          },
          {
            model: SeatOwner,
            attributes: ['userId'],
          },
        ],
      },
      {
        model: BookingStatus,
        attributes: ['status'],
      },
    ]
    const where = {}
    where['$seat.areaId$'] = { [Op.eq]: areaId }
    where['$calendar.date$'] = { [Op.between]: [initialDate, finalDate] }

    where['$seat.area.floor.building.site.startDate$'] = { [Op.lte]: initialDate }
    where['$seat.area.floor.building.site.endDate$'] = { [Op.or]: { [Op.gte]: finalDate, [Op.is]: null } }

    where['$seat.area.floor.building.startDate$'] = { [Op.lte]: initialDate }
    where['$seat.area.floor.building.endDate$'] = { [Op.or]: { [Op.gte]: finalDate, [Op.is]: null } }

    where['$seat.area.floor.startDate$'] = { [Op.lte]: initialDate }
    where['$seat.area.floor.endDate$'] = { [Op.or]: { [Op.gte]: finalDate, [Op.is]: null } }

    where['$seat.area.startDate$'] = { [Op.lte]: initialDate }
    where['$seat.area.endDate$'] = { [Op.or]: { [Op.gte]: finalDate, [Op.is]: null } }

    where['$seat.startDate$'] = { [Op.lte]: initialDate }
    where['$seat.endDate$'] = { [Op.or]: { [Op.gte]: finalDate, [Op.is]: null } }

    return Booking.findAll({ where, include, attributes })
  },
  async findLatestBookingOfUser(userId) {
    console.log('Get latest booking for user:', userId)
    const attributes = ['id', 'externalUserId', 'reserverUserId', 'userId', 'userOrgCode', 'updatedAt']
    const limit = 1
    const include = [
      {
        model: Calendar,
        attributes: ['id', 'date', 'available'],
      },
      {
        model: BookingStatus,
        attributes: ['id', 'status'],
      },
      {
        model: Seat,
        attributes: ['id', 'code'],
        include: {
          model: Area,
          attributes: ['id', 'code'],
          include: {
            model: Floor,
            attributes: ['id', 'number'],
            include: {
              model: Building,
              attributes: [
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
              ],
              include: {
                model: Site,
                attributes: ['id', 'name', 'country', 'city', 'startDate', 'endDate'],
              },
            },
          },
        },
      },
    ]
    const where = {}
    // Requested by the user, for themself
    where.userId = userId
    where.statusId = 2
    where.externalUserId = { [Op.eq]: null }

    const order = [['updatedAt', 'DESC']]

    const books = await Booking.findAll({ raw, nest, where, include, attributes, order, limit })
    return books[0] || null
  },
  async getMaxTeamReservationsOnDates(users, initialDate, finalDate) {
    const replace = { users: users, initialDate: initialDate, finalDate: finalDate }
    const res = await sequelize.query(getMaxQuantityBooksOnPeriod, { replacements: replace, raw, nest })
    return res[0].max || 0
  },
  async getSeatCalendarInCalendars(calendars) {
    const res = await sequelize.query(getSeatCalendarInCalendarsQuery, { replacements: { calendars }, raw, nest })
    return res.map((b) => b.key)
  },
}

function includeModelReservationTables() {
  return [
    {
      model: Calendar,
      attributes: ['id', 'date', 'available'],
    },
    {
      model: BookingStatus,
      attributes: ['id', 'status'],
    },
    {
      model: Seat,
      attributes: ['id', 'code', 'typeId'],
      include: {
        model: Area,
        attributes: ['id', 'code'],
        include: {
          model: Floor,
          attributes: ['id', 'number'],
          include: {
            model: Building,
            include: {
              model: Site,
              attributes: ['id', 'name'],
            },
          },
        },
      },
    },
  ]
}
