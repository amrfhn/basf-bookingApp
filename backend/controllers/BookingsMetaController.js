const {
  BookingsMetaDAO,
  BookingDAO,
  CalendarDAO
} = require('../model/dao/')
const Errors = require('./errors/CustomErrorTypes')
const moment = require('moment')
const {formatDateToYYYYMMHH} = require("../common/Utils");

module.exports = {
  update: BookingsMetaDAO.update,

  async transferBookingsData () {
    let date = moment(moment().subtract(1, 'days'), moment.defaultFormat).toDate()
    date = formatDateToYYYYMMHH(date)

    const calendars = await CalendarDAO.getAll({ date })
    let bookingsData = await BookingDAO.getAll({ calendars: calendars.map((c) => c.id), typeId: 1, statusId: 2 })
    const bookingMetaData = await BookingsMetaDAO.getAll({ calendars: calendars.map((c) => c.id) })

    // Clean bookings meta table by removing cancelled bookings
    const cleanMetaData = bookingMetaData.filter((bm) => !bookingsData.some((b) => b.id === bm.bookingId))
    const cleanMetaDataIds = cleanMetaData.map((c) => c.id)
    try {
      await BookingsMetaDAO.bulkDelete(cleanMetaDataIds)
    } catch (e) {
      console.error(e)
      throw new Errors.InternalServerError('There was an error -  delete bookings meta data based on date')
    }

    bookingsData = bookingsData.filter((b) => b.seat.buildingMindsID !== null)
    bookingsData = bookingsData.filter((b) => b)

    let toInsert = []

    for (const item of bookingsData) {
      toInsert.push({
        bookingId: item.id,
        statusId: item.bookingStatus.id,
        calendarId: item.calendar.id
      })
    }

    try {
      await BookingsMetaDAO.bulkCreate(toInsert)
    } catch (e) {
      console.error(e)
      throw new Errors.InternalServerError('There was an error -  transfer bookings data based on date')
    }
  },
  async bulkUpdateBookingsMeta(bookings) {
    const bookingIds = bookings.map((b) => b.id)
    const data = { statusId: 4 }
    const bookingsMetaData = await BookingsMetaDAO.getAll({bookingIds})

    if (bookingsMetaData.length > 0) {
      await BookingsMetaDAO.bulkUpdate(bookingIds, data)
    }

  }
}

