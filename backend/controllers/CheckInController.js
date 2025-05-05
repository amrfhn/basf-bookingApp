const { CheckInDAO, BookingDAO, CalendarDAO, SiteDAO, QuickBookingDAO} = require('../model/dao')
const Errors = require('../controllers/errors/CustomErrorTypes')
const MailController = require("./MailController");
const { getHourByGMT, formatDateToYYYYMMHH } = require("../common/Utils")
const MALAYSIA_SITE_NAME = 'Malaysia - Kuala Lumpur'
const MALAYSIA_GMT = 8

module.exports = {
  async updateCheckIn(req) {
    const today = getHourByGMT(MALAYSIA_GMT)
    const currentDate = formatDateToYYYYMMHH(today)
    const username = req.userId.toLowerCase()
    const data = { checkInStatusId: 2 }
    const calendarElem = await CalendarDAO.getAll({ date: currentDate })
    const bookings = await  BookingDAO.getAll({ userId: username, calendars: calendarElem.map((c) => c.id) })

    if(bookings.length > 0) {
      if(bookings[0].checkInStatus.id !== 2) {
        const updateCheckIn = await CheckInDAO.update(bookings[0].id, data)
        await MailController.confirmCheckIn(username)
        return updateCheckIn
      }
    } else {
      throw new Errors.NotFoundError('Booking not found.')
    }
  },
  async releaseSeat(date) {
    console.log('Running deletion on Bookings table ...')
    const todayDate = formatDateToYYYYMMHH(date)

    const [ sites, calendars] = await Promise.all([
      SiteDAO.getAll({ name: MALAYSIA_SITE_NAME }), //need to change to KL name
      CalendarDAO.getAll({ date: todayDate })
    ])

    const bookingsWithoutCheckin = await BookingDAO.getAll({
      calendars: calendars.map((c) => c.id),
      siteId: sites[0].id,
      typeId: 1,
      checkInStatusId: 1 // pending checkin
    })
    const ids = bookingsWithoutCheckin.map((b) => b.id)
    const userIds = bookingsWithoutCheckin.map((u) => u.userId)
    let quickBookingsForToday = []
    for (const u of userIds) {
      const quickBookList = await QuickBookingDAO.getAll({
        calendars: calendars.map((c) => c.id),
        statusId: 1,
        userId: u
      })
      quickBookingsForToday = quickBookingsForToday.concat(quickBookList)
    }

    const quickBookingIds = quickBookingsForToday.map((b) => b.id)

    if (!bookingsWithoutCheckin) return

    await BookingDAO.bulkDelete(ids).catch(console.error)
    await QuickBookingDAO.bulkUpdate(quickBookingIds, { statusId: 2 }).catch(console.error)
    console.log(ids.length + ' bookings without check-in have been deleted')
    console.log(ids)
    for (const b of bookingsWithoutCheckin) {
      await MailController.checkInReleaseSeat(b)
    }
    return bookingsWithoutCheckin
  },
  async checkInReminder(date) {
    const todayDate = formatDateToYYYYMMHH(date)
    console.log('Check-in reminder is running for bookings on', todayDate)
    const calendar = await CalendarDAO.getAll({ date: todayDate })
    const bookings = await BookingDAO.getAll({ calendars: calendar.map((c) => c.id), checkInStatusId: 1 })
    for (const b of bookings) {
      await MailController.checkInReminder(b.userId)
    }
  }
}
