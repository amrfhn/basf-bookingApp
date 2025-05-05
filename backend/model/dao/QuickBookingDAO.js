const moment = require('moment')
const {
  QuickBooking,
  QuickBookingStatus,
  config,
  Calendar, Booking, Site, Building
} = require('../model')
const { raw, nest, sequelize } = config
const { Op } = require('sequelize')
const dateFormat = 'YYYY-MM-DD'
const currentDate = () => moment(new Date()).format(dateFormat)

module.exports = {
  getAll(filter) {
    console.log('GetAll quick bookings data')
    const attributes = ['id', 'userId', 'userOrgCode']
    const include = [
      {
        model: Calendar,
        attributes: ['id', 'date', 'available']
      },
      {
        model: QuickBookingStatus,
        attributes: ['id', 'status'],
      },
      {
        model: Site,
        attributes: ['id', 'name']
      },
      {
        model: Building,
        attributes: ['id', 'name', 'cancellationHours', 'gmt']
      }
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
    if (filter.endDate || filter.endDate === null) {
      where['$seat.endDate$'] = { [Op.eq]: filter.endDate }
    }
    if (filter.userIdNull) {
      where.userId = { [Op.eq]: null }
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
    if (filter.calendars) {
      where.calendarId = { [Op.in]: filter.calendars }
    }
    if (filter.siteId) {
      where['$seat.area.floor.building.site.id$'] = { [Op.eq]: filter.siteId }
    }
    if (filter.buildingId) {
      where['$seat.area.floor.building.id$'] = { [Op.eq]: filter.buildingId }
    }
    if (filter.site) {
      where['$seat.area.floor.building.site.id$'] = { [Op.eq]: filter.site }
    }
    if (filter.initialDate && filter.finalDate) {
      where['$calendar.date$'] = { [Op.between]: [filter.initialDate, filter.finalDate] }
    }
    if (filter.statusId) {
      where.statusId = { [Op.eq]: filter.statusId }
    }
    if (filter.statusIds) {
      where.statusId = { [Op.in]: filter.statusIds }
    }
    return QuickBooking.findAll({ raw, nest, where, include, attributes })
  },
  create(data) {
    console.log('Create quick booking', data)
    return QuickBooking.create(data, { raw, nest })
  },
  get(id) {
    console.log('Get quick booking', id)
    return QuickBooking.findByPk(id)
  },
  async bulkCreate(data) {
    console.log('Bulk Create quick booking')
    const transaction = await QuickBooking.sequelize.transaction()
    const result = []
    try {
      for (const i of data) {
        const where = {}
        where.calendarId = i.calendarId
        where.siteId = i.siteId
        where.buildingId = i.buildingId
        const foundItem = await QuickBooking.findOne({where, raw, nest, transaction})
        if (!foundItem) {
          const item = await QuickBooking.create(i, {raw, nest, transaction})
          result.push(item)
        } else {
          const toUpdate = {
            userId: i.userId,
            userOrgCode: i.userOrgCode,
          }
          const item = await QuickBooking.update(toUpdate, {
            where: {id: foundItem.id},
            raw,
            nest,
            transaction
          }).then(() => QuickBooking.findByPk(foundItem.id, {raw, nest, transaction}))
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
  async bulkUpdate(ids, data) {
    console.log('Bulk update quick booking ', ids, data)
    const transaction = await QuickBooking.sequelize.transaction()
    await QuickBooking.update({ statusId: data.statusId }, { where: {id: ids} }, transaction)
    const result = await QuickBooking.findAll({ where: data }, transaction)
    await transaction.commit()
    return result
    // return QuickBooking.update(data, { where: { id } }).then(() => Booking.findByPk(id, { raw, nest }))
  },
  findAllOfUser(userId) {
    console.log('GetAll quick bookings for user')
    const attributes = ['id', 'userId', 'userOrgCode']
    const include = [
      {
        model: Calendar,
        attributes: ['id', 'date', 'available']
      },
      {
        model: QuickBookingStatus,
        attributes: ['id', 'status'],
      },
      {
        model: Site,
        attributes: ['id', 'name'],
      },
      {
        model: Building,
        attributes: ['id', 'name', 'cancellationHours'],
      },
    ]
    const where = {}

    where.userId = userId
    where['$calendar.date$'] = { [Op.gte]: currentDate() }
    where['$calendar.available$'] = { [Op.eq]: true }
    return QuickBooking.findAll({ raw, nest, where, include, attributes })
  },
  delete(id) {
    console.log('Delete quick booking', id)
    return QuickBooking.findByPk(id, { raw, nest }).then((u) => QuickBooking.destroy({ where: { id } }).then(() => u))
  },
  async bulkDelete(ids) {
    console.log('Bulk delete quick bookings', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const quickBookings = await QuickBooking.findAll({ raw, nest, where })
    const quickBookingsIds = quickBookings.map((b) => b.id)
    where.id = { [Op.in]: quickBookingsIds }
    return QuickBooking.destroy({ raw, nest, where })
  },
}