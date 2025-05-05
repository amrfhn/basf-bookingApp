const {
  CalendarDAO,
  QuickBookingDAO,
} = require('../model/dao/')
const LDAPClient = require('basf-gtu-utils/client/LDAP')
const Errors = require("./errors/CustomErrorTypes");
const {SeatDAO, SiteDAO, BookingDAO, BuildingDAO} = require("../model/dao")
const MailController = require('./MailController')
const SmsNotificationController = require('./SmsNotificationController')
const {
  groupByUserId,
  getHourByGMT,
  createDateFromMalformedString,
  formatDateToYYYYMMHH
} = require("../common/Utils");
const { addDays } = require('basf-gtu-utils/utils/DateUtils')
const SITE_MALAYSIA_NAME = 'Malaysia - Kuala Lumpur'

module.exports = {
  create: QuickBookingDAO.create,
  get: QuickBookingDAO.get,
  async getAll(filter) {
    let quickbookings = []
    try {
      quickbookings = await QuickBookingDAO.getAll(filter)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error fetching the quick bookings')
    }
    try {
      const users = quickbookings.map((b) => b.userId)
      const usersLDAP = await LDAPClient.getUsers(users)
      return quickbookings.map((b) => {
        const u = JSON.parse(JSON.stringify(b))
        u.user = usersLDAP[u.userId]
        return u
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error fetching the bookings')
    }
  },
  async quickBooksForUser(data, userId) {
    const [ buildings, calendars, userInfo] = await Promise.all([
      BuildingDAO.getAll({ siteId: data.siteId }),
      CalendarDAO.getAll({ initialDate: data.initialDate, finalDate: data.finalDate }),
      LDAPClient.getUser(userId),
    ])
    const buildingDate = getHourByGMT(buildings[0].gmt)
    const hour = buildingDate.getHours()
    const minute = buildingDate.getMinutes()
    const currentDate = formatDateToYYYYMMHH(buildingDate)
    const yesterdayDate = formatDateToYYYYMMHH(addDays(-1)(buildingDate))

    const quickBookOnSameDate = calendars.filter((calendar) => calendar.date === currentDate || (calendar.date === yesterdayDate && (hour >=18 && minute >= 1)))
    const quickBookNotOnSameDate = calendars.filter((calendar) => calendar.date !== currentDate)

    let allUserBooks = [] // to get the bookings made by the user on selected dates
    let allUserQuickBooks = []
    try {
      allUserQuickBooks = await QuickBookingDAO.getAll({
        userId,
        statusIds: [0, 1],
        calendars: calendars.map((c) => c.id)
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - quickbooksforuser - allUserBooks QuickBookingDAO.getAll')
    }

    try {
      allUserBooks = await BookingDAO.getAll({
        userId,
        calendars: calendars.map((c) => c.id),
        statusIds: [1, 2, 3]
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksforuser - allUserBooks BookingDAO.getAll')
    }

    if ((allUserBooks && allUserBooks.length > 0) || (allUserQuickBooks && allUserQuickBooks.length > 0)) {
      throw new Errors.ForbiddenError('You already have a booking on this period.')
    }

    const toInsert = []
    for (const c of quickBookNotOnSameDate) {
      toInsert.push({
        userId,
        calendarId: c.id,
        userOrgCode: userInfo.org_code,
        statusId: 0,
        siteId: data.siteId,
        buildingId: data.buildingId
      })
    }

    if (quickBookOnSameDate.length > 0) {
      await this.instantAssignSeatForQuickBookUsers(data, quickBookOnSameDate[0].date, userId)
    }

    if(!toInsert.length) return

    let newQuickBookingIds

    try {
      newQuickBookingIds = await QuickBookingDAO.bulkCreate(toInsert)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - quickbooksforuser - newBookingIds QuickBookingDAO.bulkCreate')
    }

    if (newQuickBookingIds && newQuickBookingIds.length) {
      newQuickBookingIds = newQuickBookingIds.map((b) => b.id)
      console.log(`New quick booking created: ID ${newQuickBookingIds}`)
    }

    return newQuickBookingIds
  },
  async assignSeatForQuickbookUsers() {
    const sites = await SiteDAO.getAll( { name: SITE_MALAYSIA_NAME })
    const buildings = await BuildingDAO.getAll({ siteId: sites[0].id })

    const buildingDate = getHourByGMT(buildings[0].gmt)
    const tomorrowDate = formatDateToYYYYMMHH(addDays(1)(buildingDate))

    const calendars = await CalendarDAO.getAll({ date: tomorrowDate })
    const allSeats = await SeatDAO.getAll({ siteId: sites[0].id })
    let quickBookingsForTomorrowDate = await QuickBookingDAO.getAll({ calendars: calendars.map((c) => c.id), statusId: 0 })
    let allBookingsForTomorrowDate = await BookingDAO.getAll({ calendars: calendars.map((c) => c.id), siteId: sites[0].id })

    quickBookingsForTomorrowDate = quickBookingsForTomorrowDate
      .filter(({ userId: id1 }) => !allBookingsForTomorrowDate.some(({ userId: id2 }) => id2 === id1)) // filter if userId has made a booking on the same date
      .sort((a, b) => {
        return a.userOrgCode.localeCompare(b.userOrgCode) // sort quick booking data based on org code alphabet
      })

    const quickBookingIds = quickBookingsForTomorrowDate.map((s) => s.id)
    const bookedSeatIds = allBookingsForTomorrowDate.map((s) => s.seat.id)
    let seatsAvailableForBook = []
    let assignedSeatIds = []

    // filter available seats by checking in the booking table
    const seats = allSeats.filter(({ id }) =>
      bookedSeatIds.indexOf(id) === -1
    )
    const toInsert = [] //insert into booking table
    const usersWithoutSeatAssign = []
    quickBookingsForTomorrowDate.forEach((b) => {
      // delete assigned and filter seats based on user
      seatsAvailableForBook = seats.filter(({ id }) => assignedSeatIds.indexOf(id) === -1)
      seatsAvailableForBook = seatsAvailableForBook.filter((s) => s.seatOwners.length > 0 ? s.seatOwners.some((o) => o.userId === b.userId) : s)
      seatsAvailableForBook = seatsAvailableForBook.filter((s) => s.seatHoods.length > 0 ? s.seatHoods.some(({ hood }) => hood.hoodOrgCodes.some((o) => o.orgCode === b.userOrgCode)) : s)
      if (seatsAvailableForBook.length <= 0) {
        console.debug('No available seats left on', tomorrowDate)
        usersWithoutSeatAssign.push({
          id: b.id,
          date: calendars[0].date,
          userId: b.userId
        })
      } else {
        /* Sort seats */
        sortAvailableSeats(seatsAvailableForBook)

        toInsert.push({
          seatId: seatsAvailableForBook[0].id, // how to get seat id
          calendarId: calendars[0].id,
          userId: b.userId,
          statusId: 2,
          userOrgCode: b.userOrgCode,
          typeId: seatsAvailableForBook[0].typeId,
          checkInStatusId: 1
        })
        // delete assign seat when insert into booking table
        assignedSeatIds.push(seatsAvailableForBook[0].id)
      }
    })

    let newBookingIds = await BookingDAO.bulkCreate(toInsert).catch(console.error)
    await QuickBookingDAO.bulkUpdate(quickBookingIds, { statusId: 1 }).catch(console.error)

    let enhancedBooks = []

    if (newBookingIds.length > 0) {
      newBookingIds = newBookingIds.map((b) => b.id)
      // Update to BM
      try {
        enhancedBooks = await BookingDAO.getAll({ ids: newBookingIds })
      } catch (error) {
        if (!(error instanceof Errors.InternalServerError)) throw error
        console.error(error)
        throw new Errors.InternalServerError('There was an error in booksForOther - BookingDAO.getAll')
      }
    }

    if(enhancedBooks) {
      for (const e of enhancedBooks) {
        let bookingInfo = []
        bookingInfo.push(e)
        await notificationsForQuickBookings(bookingInfo, e.userId)
      }
    }
    if(usersWithoutSeatAssign) {
      const qbIds = usersWithoutSeatAssign.map((b) => b.id)
      for (const u of usersWithoutSeatAssign) {
        await MailController.notifyNoSeatsAvailbleOnRandomBooking(u)
        await SmsNotificationController.seatsNotAvailable(u.userId, u)
      }
      await QuickBookingDAO.bulkDelete(qbIds)
    }
    return enhancedBooks
  },
  async instantAssignSeatForQuickBookUsers(data, bookingDate, userId) {
    const [ bookings, seats, calendars, userInfo ] = await Promise.all([
      BookingDAO.getAll({ initialDate:  bookingDate, finalDate: bookingDate, buildingId: data.buildingId }),
      SeatDAO.getAll({ buildingId: data.buildingId }),
      CalendarDAO.getAll({ initialDate: data.initialDate, finalDate: data.initialDate }),
      LDAPClient.getUser(userId),
    ])

    let allUserBooks = []
    try {
      allUserBooks = await BookingDAO.getAll({
        userId,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        typeId: 1,
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksforuser - allUserBooks BookingDAO.getAll')
    }
    if (allUserBooks && allUserBooks.length > 0) {
      throw new Errors.ForbiddenError('You already have a booking for you on this period.')
    }

    /* Filter seats */
    const bookedSeatIds = bookings.map((s) => s.seat.id)

    let seatsAvailableForBook = seats.filter(({ id }) =>
      bookedSeatIds.indexOf(id) === -1
    )
    seatsAvailableForBook = seatsAvailableForBook.filter((s) => s.seatOwners.length > 0 ? s.seatOwners.some((o) => o.userId === userId) : s)
    seatsAvailableForBook = seatsAvailableForBook.filter((s) => s.seatHoods.length > 0 ? s.seatHoods.some(({ hood }) => hood.hoodOrgCodes.some(({ orgCode }) => orgCode === userInfo.org_code)) : s)
    if(seatsAvailableForBook.length <= 0) {
      throw new Errors.ForbiddenError('There are currently no available seats. Please try again later.')
    }
    /* Sort seats */
    sortAvailableSeats(seatsAvailableForBook)

    const toInsert = []
    toInsert.push({
      seatId: seatsAvailableForBook[0].id,
      calendarId: calendars[0].id,
      userId,
      statusId: 2,
      userOrgCode: userInfo.org_code,
      typeId: seatsAvailableForBook[0].typeId,
      checkInStatusId: 1
    })

    let newBookingId = await BookingDAO.bulkCreate(toInsert).catch(console.error)
    if (newBookingId.length) {
      newBookingId = newBookingId.map((b) => b.id)
    }

    // Update to BM
    let enhancedBooks = []
    try {
      enhancedBooks = await BookingDAO.getAll({ id: newBookingId })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error in instant quick booking - BookingDAO.getAll')
    }

    if (enhancedBooks.length > 0) {
      await notificationsForQuickBookings(enhancedBooks, userId)
    }
    return newBookingId
  },
  async getUserBooks(userId) {
    return await QuickBookingDAO.findAllOfUser(userId)
  },
  async cancelQuickBooking(quickBookIds, username, filter = {}) {
    let allBooks = []
    try {
      allBooks =
        filter.quickBookingStatus === 0
          ? await QuickBookingDAO.getAll({ ids: quickBookIds, statusId: filter.quickBookingStatus })
          : await QuickBookingDAO.getAll({ ids: quickBookIds })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error canceling the bookings. Check QuickBookingController')
    }

    let hasError = false
    if (
      allBooks.length &&
      (allBooks[0].userId !== null)
    ) {
      const site = allBooks[0].site
      const booksGroupByUser = allBooks.reduce(groupByUserId, {})
      for (const bookUser in booksGroupByUser) {
        const userQuickBooks = booksGroupByUser[bookUser].sort((a, b) => a.calendar.date - b.calendar.date)
        const mailData = []
        for (const quickbook of userQuickBooks) {
          if (
            (this.validateCancellationHours(quickbook) && username !== 'Admin') ||
            quickbook.quickBookingStatus.status !== 'In progress'
          ) {
            hasError = true
          } else {
            try {
              await QuickBookingDAO.delete(quickbook.id)
            } catch (error) {
              if (!(error instanceof Errors.InternalServerError)) throw error
              console.error(error)
              throw new Errors.InternalServerError(
                'There was an error canceling the quick bookings'
              )
            }
            mailData.push({
              date: quickbook.calendar.date,
              area: 'N/A',
              seat: 'N/A',
              floor: 'N/A'
            })
          }
        }

        if (mailData.length) {
          const cancelation = { site }
          cancelation.source = 'User'
          try {
            await MailController.cancelBooking(bookUser, mailData, cancelation)
          } catch (error) {
            if (!(error instanceof Errors.InternalServerError)) throw error
            console.error(error)
            throw new Errors.InternalServerError('There was an error canceling the quick bookings - MailController')
          }
        }
      }
    }
    return null
  },
  validateCancellationHours(quickbook) {
    const cancellationDate = getHourByGMT(quickbook.building.gmt)
    const cancellationPossibleDate = createDateFromMalformedString(quickbook.calendar.date)
    cancellationPossibleDate.setHours(9, 0, 0, 0)
    cancellationPossibleDate.setHours(
      cancellationPossibleDate.getHours() - quickbook.building.cancellationHours
    )
    return cancellationDate > cancellationPossibleDate
  },
}

async function notificationsForQuickBookings(enhancedBooks, userId) {
  let notificationInfo = { datesSeat: '', where: {} }
  for (const book of enhancedBooks) {
    notificationInfo = setSeatInfoForBookingConfirmation(book, notificationInfo.datesSeat, notificationInfo.where)
  }
  if (notificationInfo.where.seat) notificationInfo.where.dates = notificationInfo.datesSeat
  await MailController.confirmBooking(userId, notificationInfo.where)
  await SmsNotificationController.confirmBooking(userId, notificationInfo.where)
}

function setSeatInfoForBookingConfirmation(book, datesSeat, where) {
  if (book.typeId === 1) {
    datesSeat = book.calendar.date
    if (!where.seat)
      where = {
        site: book.seat.area.floor.building.site,
        building: book.seat.area.floor.building.name,
        floor: book.seat.area.floor.number,
        area: book.seat.area.code,
        seat: book.seat.code,
        cancellationHours: book.seat.area.floor.building.cancellationHours,
      }
  }
  return {
    datesSeat: datesSeat,
    where: { ...where, site: book.seat.area.floor.building.site },
  }
}

function sortAvailableSeats (seats) {
  seats.sort((a, b) => {
    if (b.seatOwners.length || a.seatOwners.length) {
      return b.seatOwners.length - a.seatOwners.length
    } else if (b.seatHoods.length || a.seatHoods.length) {
      return b.seatHoods.length - a.seatHoods.length
    } else {
      return a.id - b.id
    }
  })
}
