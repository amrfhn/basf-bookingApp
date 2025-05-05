const cron = require('node-cron')
const BookingController = require('./BookingController')
const EventController = require('./EventController')
const BMInteropController = require('./BMInteropController')
const CheckInController = require('./CheckInController')
const QuickBookingController = require('./QuickBookingController')
const BookingsMetaController = require('./BookingsMetaController')
const { formatDateToYYYYMMHH } = require("../common/Utils");

const everyOneMinute = '*/1 * * * *' // runs every five minutes
const everyThirtyMinutes = '*/30 * * * *' // runs every 30 minutes
const everyHour = '0 * * * *' // runs every hour
const everyThreeHours = '0 */3 * * *' // runs every twelve hours
const everyDay = '0 1 * * *' // runs every day at 01:00
const everyDayAtTen = '1 10 * * *' // runs every day at 10:00 KL timezone
const everyDayAtSix = '0 18 * * *' // runs every day at 18:00 KL timezone
const everyDayAtNineFortyFive = '45 9 * * *' // runs every day at 9.45 KL timezones

const schedulerTimeframeForCPIBookings = process.env.CPI_SCHEDULER_BOOKINGS || everyThirtyMinutes

cron.schedule(everyDay, async () => {
  console.log(new Date(), 'Scheduler: Running Daily')
  await BookingController.populateCalendars()
})
cron.schedule(everyHour, async () => {
  console.log(new Date(), 'Pre-book cancellation: Running Hourly')
  await BookingController.cancelPreReservation()
})

// cron.schedule(everyTenMinutes, async () => {
cron.schedule(everyOneMinute, async () => {
  // console.log(new Date(), 'Scheduler: Running every ten minutes')
  console.log(new Date(), 'Scheduler: Running every one minute')
  await BMInteropController.executeStagingUpdates()
})

cron.schedule(everyDay, async () => {
  console.log(new Date(), 'Deletion process: Running Daily ...')
  await BookingController.deleteUsersData()
  await EventController.deleteUsersData()
})

/* Run cron for KL site that bookers have not check-in after 10am everyday */
cron.schedule(everyDayAtTen, async () => {
  console.log(new Date(), 'Scheduler: Running KL site seat booking - Release Seat everyday at 10.01am')
  await CheckInController.releaseSeat(new Date())
}, {
  timezone: 'Asia/Singapore'
})

/* Run cron for KL site and create bookings based on quickbook table */
cron.schedule(everyDayAtSix, async () => {
  console.log(new Date(), 'Scheduler: Running KL site seat booking - Book seat everyday 6.00pm')
  await QuickBookingController.assignSeatForQuickbookUsers()
}, {
  timezone: 'Asia/Singapore'
})

cron.schedule(everyDayAtNineFortyFive, async () => {
  console.log(new Date(), 'Scheduler: Send mail to remind KL employees to check-in..')
  await CheckInController.checkInReminder(new Date())
}, {
  timezone: 'Asia/Singapore'
})

// cron.schedule(everyDay, async () => {
//   const today = getCurrentDateAsStringYYYYMMDD(UNIX_TIMESTAMP_SIZE_LIMIT)
//   console.log(new Date(), `Scheduler: Send completed bookings for date ${today} to CPI..`)
//   await BMInteropController.workSpaceBookingTopicBulkEvent({ type: BM_BOOKING_COMPLETED, date: today })
// },  {
//   timezone: 'Asia/Singapore'
// })

cron.schedule(everyThreeHours, async () => {
  console.log(new Date(), `Scheduler: Update bookings to bookings meta for date ${formatDateToYYYYMMHH(new Date())}..`)
  await BookingsMetaController.transferBookingsData()
})

cron.schedule(schedulerTimeframeForCPIBookings, async () => {
  console.log(new Date(), `Scheduler: Send completed bookings to CPI...`)
  await BMInteropController.workSpaceBookingTopicBulkEvent()
})
/*  // UNCOMMENT WHEN ANONYMIZATION IS NEEDED TO TAKE UP
cron.schedule(everyDay, async () => {
  console.log(new Date(), 'Anonymization process: Running Daily ...')
  await BookingController.anonymizeUsersData()
  await EventController.anonymizeUsersData()
})
*/

module.exports = { cron }
