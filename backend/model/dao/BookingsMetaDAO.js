const {
  Booking,
  BookingStatus,
  Calendar, config, BookingsMeta, Seat,
} = require('../model')
const {raw, nest, sequelize} = config
const {Op} = require('sequelize')
const moment = require("moment");
const dateFormat = 'YYYY-MM-DD'
const currentDate = () => moment(new Date()).format(dateFormat)

module.exports = {
  getAll(filter) {
    console.log('Get All BookingsMeta')
    const attributes = ['id', 'bookingId', 'statusId']
    const include = [
      {
        model: Booking,
        attributes: ['id', 'calendarId', 'statusId']
      },
      {
        model: Calendar,
        attributes: ['id', 'date', 'available'],
      },
    ]

    const where = {}
    if (filter.ids) {
      where.id = {[Op.in]: filter.ids}
    }
    if (filter.id) {
      where.id = filter.id
    }
    if (filter.bookingId) {
      where.bookingId = filter.bookingId
    }
    if (filter.bookingIds) {
      where.bookingId = {[Op.in]: filter.bookingIds}
    }
    if (filter.calendars) {
      where.calendarId = {[Op.in]: filter.calendars}
    }
    if (filter.statusId) {
      where.statusId = filter.statusId
    }

    return BookingsMeta.findAll({raw, nest, where, include, attributes})
  },
  create(data) {
    console.log('Create BookingsMeta')
    return BookingsMeta.create(data, {raw, nest})
  },
  async bulkCreate(data) {
    console.log('Bulk Create BookingsMeta')
    const transaction = await BookingsMeta.sequelize.transaction()
    const result = []

    try {
      for (const i of data) {
        const where = {}
        where.bookingId = i.bookingId

        const foundItem = await BookingsMeta.findOne({where, raw, nest, transaction})
        if (!foundItem) {
          const item = await BookingsMeta.create(i, {raw, nest, transaction})
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
    console.log('Update booking meta', id)
    return BookingsMeta.update(data, {where: {id}}).then(() => BookingsMeta.findByPk(id, {raw, nest}))
  },
  async bulkUpdate(bookingIds, data) {
    const transaction = await BookingsMeta.sequelize.transaction()
    await BookingsMeta.update(data, { where: { bookingId: bookingIds }}, transaction)
    const result = await BookingsMeta.findAll({ where: data }, transaction)
    await transaction.commit()
    return result
  },
  delete(id) {
    console.log('Delete booking meta', id)
    return BookingsMeta.findByPk(id, { raw, nest }).then((u) => BookingsMeta.destroy({ where: { id } }).then(() => u))
  },
  async bulkDelete(ids) {
    console.log('Deleting bookings meta')
    const where = {}
    where.id = { [Op.in]: ids }
    const bookingsMeta = await BookingsMeta.findAll({ raw, nest, where })
    const bookingsIds = bookingsMeta.map((b) => b.id)
    where.id = { [Op.in]: bookingsIds }
    return BookingsMeta.destroy({ raw, nest, where })
  },
}