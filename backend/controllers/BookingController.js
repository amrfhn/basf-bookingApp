const {
  BookingDAO,
  BuildingDAO,
  CalendarDAO,
  SeatDAO,
  SeatHoodDAO,
  HoodOrgCodeDAO,
  SeatOwnerDAO,
  SiteDAO,
  // BookingsMetaDAO
} = require('../model/dao/')
const AuthController = require('./AuthController')
const MailController = require('./MailController')
const UserController = require('./UserController')
const EventController = require('./EventController')
const BMInteropController = require('./BMInteropController')
const ExternalUserController = require('./ExternalUserController')
const moment = require('moment')
const Errors = require('./errors/CustomErrorTypes')
const { addDays, formatDate, firstTime, parseDate } = require('basf-gtu-utils/utils/DateUtils')
const { range } = require('basf-gtu-utils/utils/FunctionalUtils')
const LDAPClient = require('basf-gtu-utils/client/LDAP')
const {
  BM_BOOKING_COMPLETED,
  BM_BOOKING_CANCELATION,
  getCurrentDateAsStringYYYYMMDD,
  UNIX_TIMESTAMP_SIZE_LIMIT,
  PARKING_LOT_BOOKING_TYPE_ID,
  getHourByGMT,
  createDateFromMalformedString,
  groupByUserId,
} = require('../common/Utils')
const SmsNotificationController = require('./SmsNotificationController')
const UserDetailController = require('./UserDetailController')
const TWENTYFOUR_HOURS = 24
const SEVEN_DAYS = 7

const sitesWithCheckInFeature = ['Malaysia - Kuala Lumpur']

module.exports = {
  async getAll(filter) {
    let bookings = []
    try {
      bookings = await BookingDAO.getAll(filter)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error fetching the bookings')
    }
    try {
      const users = bookings.map((b) => b.userId)
      const usersLDAP = await LDAPClient.getUsers(users)
      return bookings.map((b) => {
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
  get: BookingDAO.get,
  create: BookingDAO.create,
  update: BookingDAO.update,
  delete: BookingDAO.delete,
  async bulkDelete(bookingIds) {
    const filter = { bookingStatus: 'Booked' }
    try {
      // TODO: this should be a promise.all
      await this.cancelBooking(bookingIds, 'Admin', filter)
      await BookingDAO.bulkDelete(bookingIds)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error deleting the bookings')
    }
  },
  async cancelBooking(bookIds, username, filter = {}) {
    let allBooks = []
    try {
      allBooks =
        filter.bookingStatus === 'Booked'
          ? await BookingDAO.getAll({ ids: bookIds, seatStatus: filter.bookingStatus })
          : await BookingDAO.getAll({ ids: bookIds })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error canceling the bookings')
    }
    let hasError = false
    const today = getCurrentDateAsStringYYYYMMDD(UNIX_TIMESTAMP_SIZE_LIMIT)
    if (
      allBooks.length &&
      (allBooks[0].userId !== null || (allBooks[0].userId === null && allBooks[0].reserverUserId === null))
    ) {
      const site = allBooks[0].seat.area.floor.building.site
      const booksGroupByUser = allBooks.reduce(groupByUserId, {})
      for (const bookUser in booksGroupByUser) {
        let manager
        try {
          if (username !== 'Admin') {
            manager = await UserController.getSupervisor(bookUser)
          }
        } catch (error) {
          if (!(error instanceof Errors.InternalServerError)) throw error
          console.error(error)
          throw new Errors.InternalServerError('There was an error canceling the bookings - getting supervisor')
        }
        const userBooks = booksGroupByUser[bookUser].sort((a, b) => a.calendar.date - b.calendar.date)
        const mailData = []
        for (const book of userBooks) {
          // let bookingsMetaData = []
          if (
            (this.validateCancellationHours(book) && username !== 'Admin') ||
            book.bookingStatus.status.toLowerCase() !== 'booked' ||
            (book.typeId !== PARKING_LOT_BOOKING_TYPE_ID && book.calendar.date < today) ||
            (bookUser !== username && manager !== username && username !== 'Admin')
          ) {
            hasError = true
          } else {
            try {
              // TODO: this should be a promise.all
              await this.makeBookAvailable({ ...book }, true)
              await EventController.cancelBook({ userId: username, payload: book })
              // bookingsMetaData = await BookingsMetaDAO.getAll({bookingId: book.id})
            } catch (error) {
              if (!(error instanceof Errors.InternalServerError)) throw error
              console.error(error)
              throw new Errors.InternalServerError(
                'There was an error canceling the bookings - make booking available/cancel booking'
              )
            }

            // if (bookingsMetaData.length > 0 && book.seat.buildingMindsID) {
            //   try {
            //     await BMInteropController.workSpaceBookingTopicSingleEvent({
            //       type: BM_BOOKING_CANCELATION,
            //       bookingPayload: [book],
            //     })
            //     // await BookingsMetaDAO.delete(bookingsMetaData[0].id)
            //
            //   } catch(error) {
            //     if (!(error instanceof Errors.InternalServerError)) throw error
            //     console.error(error)
            //     throw new Errors.InternalServerError(
            //       'There was an error canceling the bookings - BM Interop communication'
            //     )
            //   }
            // }
            // if (book.seat.buildingMindsID) {
            //   try {
            //     await BMInteropController.workSpaceBookingTopicSingleEvent({
            //       type: BM_BOOKING_CANCELATION,
            //       bookingPayload: [book],
            //     })
            //   } catch (error) {
            //     if (!(error instanceof Errors.InternalServerError)) throw error
            //     console.error(error)
            //     throw new Errors.InternalServerError(
            //       'There was an error canceling the bookings - BM Interop communication'
            //     )
            //   }
            // }
            mailData.push({
              floor: book.seat.area.floor.number,
              area: book.seat.area.code,
              seat: book.seat.code,
              date: book.calendar.date,
            })
          }
        }
        if (hasError) {
          throw new Errors.ForbiddenError(
            'At least one of the selected books could not be cancelled, please check your reservations table.'
          )
        }
        if (mailData.length) {
          const cancelation = { site }
          if (username === manager) {
            cancelation.source = 'Manager'
            cancelation.username = manager
          } else if (username === bookUser) {
            cancelation.source = 'User'
          } else {
            cancelation.source = 'Admin'
          }
          try {
            await MailController.cancelBooking(bookUser, mailData, cancelation)
          } catch (error) {
            if (!(error instanceof Errors.InternalServerError)) throw error
            console.error(error)
            throw new Errors.InternalServerError('There was an error canceling the bookings - MailController')
          }
        }
      }
    }
    return null
  },
  async getUserBooks(userId) {
    return this.mergeBookings(await BookingDAO.findAllOfUser(userId))
  },
  validateCancellationHours(book) {
    const cancellationDate = getHourByGMT(book.seat.area.floor.building.gmt)
    const cancellationPossibleDate = createDateFromMalformedString(book.calendar.date)
    cancellationPossibleDate.setHours(9, 0, 0, 0)
    cancellationPossibleDate.setHours(
      cancellationPossibleDate.getHours() - book.seat.area.floor.building.cancellationHours
    )
    return cancellationDate > cancellationPossibleDate
  },
  async getTeamBooks(userId) {
    let teammates
    let books
    try {
      teammates = await UserController.getTeammatesUsers(userId)
      books = await BookingDAO.findAllOfTeam(teammates.usernames)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error canceling the bookings - getTeamBooks')
    }
    books = books.map((b) => ({ ...b, full_name: teammates.users[b.userId].full_name }))
    return this.mergeBookings(books)
  },
  getUserReservations: BookingDAO.findAllReservationsOfUser,
  async getMaxAllowedReservations(userId, initialDate, finalDate) {
    let team = []
    let maxPreBooksMade = 0
    try {
      team = await UserController.getTeammatesUsernames(userId)
      team.push(userId)
      maxPreBooksMade = await BookingDAO.getMaxTeamReservationsOnDates(team, initialDate, finalDate)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error canceling the bookings - getMaxAllowedReservations')
    }
    return team.length - maxPreBooksMade
  },
  async getSeatsOnArea(areaId, initialDate, finalDate, username) {
    let userData
    let teamMates
    try {
      // TODO: This should be a promise.all
      userData = await LDAPClient.getUser(username)
      teamMates = await UserController.getTeammatesUsernames(username)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error canceling the bookings - LDAP user and get teammatesusernames'
      )
    }
    teamMates.push(username)
    if (userData && !userData.org_code) {
      const userEntry = await UserDetailController.getByUserId(username)
      if (userEntry) {
        userData.org_code = userEntry.orgCode
      }
    }
    const hoods = await HoodOrgCodeDAO.getHoodsByOrgCode(userData.org_code)
    const hoodIds = hoods.map((h) => h.hoodId)
    let usersNames, reserved, users, elem
    try {
      elem = await BookingDAO.getSeatsOnArea(areaId, initialDate, finalDate) // TODO: this should go in the promise.all up
      // TODO: this can be another(separated) promise.all
      usersNames = elem.map((b) => b.userId)
      reserved = elem.map((b) => b.reserverUserId)
      users = await LDAPClient.getUsers([...usersNames, ...reserved])
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error canceling the bookings - LDAP user and get reserved, users, elem, usersnames'
      )
    }
    for (const r of elem) {
      r.setDataValue('user', r.userId ? users[r.userId.toLowerCase()] : null)
      r.setDataValue('reserverUser', r.reserverUserId ? users[r.reserverUserId.toLowerCase()] : null)
      // FIXME check to delete next 2 lines of code
      r.userId = r.userId ? users[r.userId.toLowerCase()] : null
      r.reserverUserId = r.reserverUserId ? users[r.reserverUserId.toLowerCase()] : null
      const amenities = r.seat.seatAmenities.map((x) => ({
        ...x.amenity.dataValues,
        numericValue: x.seatAmenityNumericValue ? x.seatAmenityNumericValue.value : undefined,
        booleanValue: x.seatAmenityBooleanValue ? x.seatAmenityBooleanValue.value : undefined,
        multiValue: x.seatAmenityMultiValue ? x.seatAmenityMultiValue.amenityValue.value : undefined,
      }))
      // This is done because doing a setDataValue directly to seatAmenities gives error, probably due to circularity
      r.seat.setDataValue('seatAmenities', null)
      r.seat.setDataValue('amenities', amenities)
      if (r.reserverUserId) {
        if (!teamMates.includes(r.reserverUserId.username) || r.userId) {
          r.bookingStatus.status = 'Booked'
        } else {
          r.bookingStatus.status = 'Reserved'
        }
      }
      const seatHoodIds = r.seat.seatHoods ? r.seat.seatHoods.map((h) => h.hoodId) : []
      const intersection = hoodIds.filter((x) => seatHoodIds.includes(x))
      if (seatHoodIds.length > 0 && intersection.length === 0) {
        r.bookingStatus.status = 'Booked'
      }
      if (r.seat.seatOwners.length > 0) {
        if (!r.seat.seatOwners.some((owner) => owner.userId === username)) {
          r.bookingStatus.status = 'Booked'
        }
      }
    }
    return elem
  },

  async getUserLatestBooking(userId) {
    let book = null
    try {
      book = await BookingDAO.findLatestBookingOfUser(userId)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error in getUserLatestBooking - BookingDao.findLatestBookingOfUser'
      )
    }
    if (!book) {
      throw new Errors.NotFoundError('The user has not made any bookings yet.')
    }
    return book
  },
  async bookForOtherSeat(data, originUserId, onBehalfOfUserID) {
    const building = await BuildingDAO.get(data.buildingId)
    const site = await SiteDAO.getAll({ name: building.site.name })
    const siteName = site.map((s) => s.name)
    data.siteName = siteName[0]
    try {
      const enhancedBooks = await this.booksForOther(data, originUserId, onBehalfOfUserID)
      await mailSendingForBookings(enhancedBooks, originUserId, onBehalfOfUserID)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error in bookForOtherSeat - Can be because of mails or getting enhancedBooks'
      )
    }
    return null
  },
  async bookForOtherSeatAndParking(data, originUserId, onBehalfOfUserID) {
    const building = await BuildingDAO.get(data[0].buildingId)
    const site = await SiteDAO.getAll({ name: building.site.name })
    const siteName = site.map((s) => s.name)
    data.siteName = siteName[0]
    const enhancedBooks = []
    // TODO: get this parallel and add tests for this
    try {
      for (const toBook of data) {
        const booking = await this.booksForOther(toBook, originUserId, onBehalfOfUserID)
        enhancedBooks.push(...booking)
      }
      await mailSendingForBookings(enhancedBooks, originUserId, onBehalfOfUserID)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error in bookForOtherSeatAndParking - Can be because of mails or getting booksforother'
      )
    }
    return null
  },
  async bookForUserSeatOrParking(data, userId) {
    try {
      const enhancedBooks = await this.booksForUser(data, userId)
      await mailSendingForBookings(enhancedBooks, userId)

      // FIXME: Caused laggy when user submit booking - SMS notifier
      if (sitesWithCheckInFeature.indexOf(data.siteName) > -1) {
        await smsSendingForBookings(enhancedBooks, userId)
      }
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error in bookForUserSeatOrParking - Can be because of mails or getting enhancedBooks'
      )
    }
    return null
  },
  async bookForUserSeatAndParking(data, userId) {
    const enhancedBooks = []
    // TODO: get this parallel and add tests for this
    try {
      for (const toBook of data) {
        const booking = await this.booksForUser(toBook, userId)
        enhancedBooks.push(...booking)
      }
      await mailSendingForBookings(enhancedBooks, userId)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error in bookForUserSeatOrParking - Can be because of mails or getting enhancedBooks'
      )
    }
    return null
  },
  async booksForUser(data, userId) {
    const [seat, calendars, userInfo] = await Promise.all([
      SeatDAO.getAll({ id: data.seatId }),
      CalendarDAO.getAll({ initialDate: data.initialDate, finalDate: data.finalDate }),
      LDAPClient.getUser(userId),
    ])
    let checkInStatusId
    if (sitesWithCheckInFeature.indexOf(data.siteName) > -1 && seat[0].typeId === 1) {
      checkInStatusId = 1
    } else if (
      (sitesWithCheckInFeature.indexOf(data.siteName) > -1 && seat[0].typeId !== 1) ||
      !sitesWithCheckInFeature.indexOf(data.siteName) > -1
    ) {
      checkInStatusId = 0
    }

    const toInsert = []
    for (const calendar of calendars) {
      toInsert.push({
        seatId: data.seatId,
        userId,
        calendarId: calendar.id,
        userOrgCode: userInfo.org_code,
        statusId: 2,
        checkInStatusId,
        typeId: seat[0].typeId,
      })
    }

    let allUserBooks = []
    try {
      allUserBooks = await BookingDAO.getAll({
        userId,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        typeId: seat[0].typeId,
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksforuser - allUserBooks BookingDAO.getAll')
    }

    if (allUserBooks && allUserBooks.length > 0) {
      throw new Errors.ForbiddenError('You already have a booking for you on this period.')
    }

    let booksOnDate = []
    try {
      booksOnDate = await BookingDAO.getAll({
        seatId: data.seatId,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        typeId: seat[0].typeId,
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksforuser - booksOnDate BookingDAO.getAll')
    }
    const preBooks = booksOnDate.filter((b) => b.bookingStatus.status === 'Reserved')
    const books = booksOnDate.filter((b) => b.bookingStatus.status === 'Booked')

    if (books.length)
      throw new Errors.ForbiddenError(
        'The selected seat for the indicated period has already been booked, please refresh the site.'
      )
    let teammates = []
    try {
      teammates = await UserController.getTeammatesUsernames(userId)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError(
        'There was an error - booksforuser - teammates UserController.getTeammatesUsernames'
      )
    }
    teammates.push(userId)
    for (const book of preBooks) {
      if (!teammates.includes(book.reserverUserId))
        throw new Errors.ForbiddenError(
          'The selected seat for the indicated period is pre-booked for another team, please select another one.'
        )
    }

    // This is parallel, the names are good "validateMyThing" what on earth is validatesomething? is true or false? throw an exception should not be normal!
    const [isHoodValid, userIsSeatOwner] = await Promise.all([
      this.validateHoods(userId, data.seatId),
      this.validateSeatOwners(userId, data.seatId),
    ])
    // FIXME: Don't use exceptions as flow control. This is bad code, god cries when sees this
    if (!isHoodValid) {
      throw new Errors.ForbiddenError('The selected seat does not belong to your hood.')
    }
    if (!userIsSeatOwner) {
      throw new Errors.ForbiddenError('Booking could not be performed since you are not the owner of the seat')
    }
    let newBookingIds
    try {
      newBookingIds = await BookingDAO.bulkCreate(toInsert)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksforuser - newBookingIds BookingDAO.bulkCreate')
    }
    if (newBookingIds.length) {
      newBookingIds = newBookingIds.map((b) => b.id)
    }

    let enhancedBooks
    try {
      enhancedBooks = await BookingDAO.getAll({ ids: newBookingIds })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksforuser - newBookingIds BookingDAO.bulkCreate')
    }
    //TODO: Need to remove once sending in bulk
    // if (enhancedBooks[0].seat.buildingMindsID)
    //   await BMInteropController.workSpaceBookingTopicSingleEvent({ type: BM_BOOKING_COMPLETED, bookingPayload: enhancedBooks })
    return enhancedBooks
  },
  async booksForOther(data, originUserId, onBehalfOfUserID) {
    const [calendars, seat] = await Promise.all([
      CalendarDAO.getAll({ initialDate: data.initialDate, finalDate: data.finalDate }),
      SeatDAO.getAll({ id: data.seatId }),
    ])
    let checkInStatusId
    if (sitesWithCheckInFeature.indexOf(data.siteName) > -1) {
      checkInStatusId = 1
    } else {
      checkInStatusId = 0
    }
    const toInsert = []
    for (const calendar of calendars) {
      toInsert.push({
        seatId: data.seatId,
        userId: onBehalfOfUserID.username,
        calendarId: calendar.id,
        userOrgCode: onBehalfOfUserID.org_code,
        statusId: 2,
        checkInStatusId,
        typeId: seat[0].typeId,
      })
    }
    let allUserBooks = []
    try {
      allUserBooks = await BookingDAO.getAll({
        userId: onBehalfOfUserID.username,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        typeId: seat[0].typeId,
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksForOther - allUserBooks BookingDAO.getAll')
    }
    if (allUserBooks && allUserBooks.length > 0) {
      throw new Errors.ForbiddenError('User already has a booking for this period.')
    }
    let booksOnDate = []
    try {
      booksOnDate = await BookingDAO.getAll({
        seatId: data.seatId,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        typeId: seat[0].typeId,
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksForOther - booksOnDate BookingDAO.getAll')
    }
    const preBooks = booksOnDate.filter((b) => b.bookingStatus.status === 'Reserved')
    const books = booksOnDate.filter((b) => b.bookingStatus.status === 'Booked')
    if (books.length)
      throw new Errors.ForbiddenError(
        'The selected seat for the indicated period has already been booked, please refresh the site.'
      )
    let teammates
    try {
      teammates = await getTeam(originUserId)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error - booksForOther - teammates - getTeam')
    }
    teammates.push(onBehalfOfUserID.username)
    for (const book of preBooks) {
      if (!teammates.includes(book.reserverUserId))
        throw new Errors.ForbiddenError(
          'The selected seat for the indicated period is pre-booked for another team, please select another one.'
        )
    }
    const [isHoodValid, userIsSeatOwner] = await Promise.all([
      this.validateHoods(originUserId, data.seatId),
      this.validateSeatOwners(onBehalfOfUserID.username, data.seatId),
    ])
    if (!isHoodValid) {
      throw new Errors.ForbiddenError('The selected seat does not belong to your hood.')
    }
    if (!userIsSeatOwner) {
      throw new Errors.ForbiddenError('Booking could not be performed since you are not the owner of the seat')
    }
    let newBookingIds = await BookingDAO.bulkCreate(toInsert)
    if (newBookingIds.length) {
      newBookingIds = newBookingIds.map((b) => b.id)
    }
    let enhancedBooks = []
    try {
      enhancedBooks = await BookingDAO.getAll({ ids: newBookingIds })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error in booksForOther - BookingDAO.getAll')
    }
    // if (enhancedBooks[0].seat.buildingMindsID)
    //   await BMInteropController.workSpaceBookingTopicSingleEvent({ type: BM_BOOKING_COMPLETED, bookingPayload: enhancedBooks })
    return enhancedBooks
  },

  async populateCalendars() {
    const maxDates = (await BuildingDAO.getMaxReservationDates()) + 1
    const initialDate = firstTime()
    const finalDate = addDays(maxDates + SEVEN_DAYS)(initialDate) // I search more dates to deal bound issues
    const toInsert = range(maxDates)
      .map((i) => formatDate(addDays(i)(initialDate)))
      .reduce((a, c) => a.add(c), new Set())
    try {
      const inDB = await CalendarDAO.getAll({ initialDate, finalDate })
      inDB.map((c) => formatDate(c.date)).forEach((d) => toInsert.delete(d))
      await CalendarDAO.bulkCreate(
        Array.from(toInsert).map((d) => {
          return { date: parseDate(d), available: true }
        })
      )
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error in populateCalendars - Is it used?!')
    }
  },

  async populateBookings() {
    const [reservationDaysPerSeat, maxDates] = await Promise.all([
      SeatDAO.reservationDaysPerSeat(),
      BuildingDAO.getMaxReservationDates(),
    ])
    const initialDate = firstTime()
    const finalDate = addDays(maxDates + SEVEN_DAYS)(initialDate)
    const calendars = await CalendarDAO.getAll({ initialDate, finalDate })
    const groupByDate = (a, c) => {
      a[formatDate(c.date)] = c.id
      return a
    }
    const mapCalendarId = calendars.reduce(groupByDate, {})
    const reduceCache = (a, c) => {
      a[c] = true
      return a
    }
    let bookingsDB = await BookingDAO.getSeatCalendarInCalendars(Object.values(mapCalendarId))
    bookingsDB = bookingsDB.reduce(reduceCache, {})
    const toInsert = []
    for (const r of reservationDaysPerSeat) {
      const calendarIds = range(r.reservationDays + 1)
        .map((i) => formatDate(addDays(i)(initialDate)))
        .map((d) => mapCalendarId[d])
      for (const calendarId of calendarIds) {
        if (!bookingsDB[r.seatId + '|' + calendarId]) {
          toInsert.push({ seatId: r.seatId, calendarId, statusId: 1, typeId: r.seatTypeId, checkInStatusId: 0 })
        }
      }
    }
    await BookingDAO.bulkCreate(toInsert).catch(console.error)
  },

  // Method that populates bookings table with the corresponding org code of the userid (if the userid isn't null)
  async populateOrgCodes() {
    const bookings = await BookingDAO.getAll({ seatStatus: 'Booked', notAnonymizedNorNullUserId: true })
    const usersInfo = await LDAPClient.getUsers(bookings.map((b) => b.userId))
    Object.entries(bookings).forEach(([_key, value]) => {
      try {
        value.userOrgCode = usersInfo[value.userId.toLowerCase()].org_code
        BookingDAO.update(value.id, value)
      } catch (e) {
        console.warn('Exception when populating booking specific UserId. User data: ', value)
        console.warn('Specific exception thrown: ', e)
      }
    })
    EventController.populateOrgCodes()
  },

  // Method that anonymizes all personal data stored in the bookings table.
  async anonymizeUsersData() {
    console.log('Running anonymization on Bookings table ...')
    const today = new Date()
    const allSites = await SiteDAO.getAll({})
    for (const key of allSites) {
      const tempExpDate = new Date()
      tempExpDate.setDate(today.getDate() - key.anonymizationDaysConfig)
      const calendarElem = await CalendarDAO.getAll({ date: tempExpDate })
      const bookingsForSite = await BookingDAO.getAll({
        anonymizationDate: calendarElem[0].date,
        notAnonymizedUsers: true,
        siteId: key.id,
      })
      for (const booking of bookingsForSite) {
        booking.reserverUserId = booking.reserverUserId != null ? 'anonymized' : null
        booking.userId = booking.userId != null ? 'anonymized' : null
        if (booking.externalUserId != null) ExternalUserController.anonymizeExternalUser(booking.externalUserId)
        if (booking.reserverUserId != null || booking.userId != null) BookingDAO.update(booking.id, booking)
      }
    }
  },

  async deleteUsersData() {
    console.log('Running deletion on Bookings table ...')
    const today = new Date()
    const allSites = await SiteDAO.getAll({})
    let greatestDate = 1
    for (const site of allSites) {
      const tempExpDate = new Date()
      tempExpDate.setDate(today.getDate() - site.deletionDays)
      if (site.deletionDays > greatestDate) {
        greatestDate = site.deletionDays
      }
      const calendarElem = await CalendarDAO.getAll({ date: tempExpDate })
      const bookingsForSite = await BookingDAO.getAll({
        deletionDate: calendarElem[0].date,
        siteId: site.id,
      })
      const ids = bookingsForSite.map((b) => b.id)
      await BookingDAO.bulkDelete(ids)
    }
    const date = new Date()
    date.setDate(today.getDate() - greatestDate)
    const calendars = await CalendarDAO.getAll({ datePast: date })
    for (const c of calendars) {
      await CalendarDAO.delete(c.id)
    }
  },

  async reserveBooks(data, reserverUserId) {
    const [calendars, seats] = await Promise.all([
      CalendarDAO.getAll({ initialDate: data.initialDate, finalDate: data.finalDate }),
      SeatDAO.getAll({ ids: data.seatIds }),
    ])
    let checkInStatusId
    if (sitesWithCheckInFeature.indexOf(data.siteName) > -1) {
      checkInStatusId = 1
    } else {
      checkInStatusId = 0
    }
    const toInsert = []
    for (const calendar of calendars) {
      for (const seatId of data.seatIds) {
        toInsert.push({
          seatId,
          calendarId: calendar.id,
          date: calendar.date,
          reserverUserId,
          statusId: 3,
          typeId: 1,
          checkInStatusId,
        })
      }
    }
    let booksOnDate = []
    try {
      booksOnDate = await BookingDAO.getAll({
        seatIds: data.seatIds,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        typeId: 1,
      })
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error in populateCalendars - Is it used?!')
    }

    const firstDateToBook = new Date()

    // TODO: This can't be done in a parallel way, why? because the exception! (or we should change validatemanagersite in a deeper way)
    await this.validateManagerSite(reserverUserId, seats)
    const [isHoodValid] = await Promise.all([this.validateHoods(reserverUserId, data.seatIds)])
    if (!isHoodValid) {
      throw new Errors.ForbiddenError('The selected seat does not belong to your hood.')
    }

    const forbiddenBooks = booksOnDate.filter((b) => !(b.userId === null && b.reserverUserId === null))
    if (forbiddenBooks.length > 0) {
      throw new Errors.ForbiddenError(
        'At least one of the selected seats for the indicated period has already been reserved, is disabled, or booked.'
      )
    }
    const reducer = (a, c) => {
      if (!a[c.date]) {
        a[c.date] = { date: c.date, amount: 0 }
      }
      a[c.date].amount = a[c.date].amount + 1
      return a
    }
    const dates = Object.values(toInsert.reduce(reducer, {})).sort((s1, s2) => new Date(s1.date) - new Date(s2.date))
    const reservationCancellationHours = seats[0].area.floor.building.reservationCancellationHours
    firstDateToBook.setHours(firstDateToBook.getHours() + reservationCancellationHours)
    for (const d of dates) {
      if (d.date < firstDateToBook.toISOString()) {
        throw new Errors.ForbiddenError(`The pre-reserve must be after ${formatDate(firstDateToBook)}.`)
      }
    }
    let maxAllowed = []
    try {
      maxAllowed = await this.getMaxAllowedReservations(reserverUserId, dates[0].date, dates[dates.length - 1].date)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error in reserveBooks - getMaxAllowedReservations')
    }
    const maxRequested = Math.max(...dates.map((d) => d.amount))
    if (maxRequested > maxAllowed) {
      throw new Errors.ForbiddenError(
        'Request exceeds maximum allowed seats you can reserve at least for one of the selected dates.'
      )
    }
    try {
      await BookingDAO.bulkCreate(toInsert)
    } catch (error) {
      if (!(error instanceof Errors.InternalServerError)) throw error
      console.error(error)
      throw new Errors.InternalServerError('There was an error in reserveBooks - BookingDAO.bulkCreate')
    }
  },

  /** * As this is an admin reservation, it allows to have more than one resveration in the same day ***/
  async bookParkingsAdmin(data) {
    const toInsert = []
    for (const booking of data) {
      const bookings = await BookingDAO.getAll({
        seatId: booking.seat.id,
        initialDate: booking.date,
        finalDate: booking.date,
        typeId: 2,
      })
      if (bookings.length) {
        throw new Errors.ForbiddenError(
          'At least one of the selected seats for the indicated period has already been reserved, is disabled, or booked.'
        )
      }
      const calendar = await CalendarDAO.getAll({ initialDate: booking.date, finalDate: booking.date })
      toInsert.push({
        seatId: booking.seat.id,
        calendarId: calendar[0].id,
        statusId: 2,
        typeId: 2,
        reserverUserId: null,
        checkInStatusId: 0,
      })
    }
    return await BookingDAO.bulkCreate(toInsert).catch(console.error) // Not the best way... but it works
  },

  async isAdmin(userName, seats) {
    const adminSites = await AuthController.adminSites(userName)
    const user = await LDAPClient.getUser(userName)
    const adminSitesIds = adminSites.map((s) => s.id)
    for (const s of seats) {
      if (!adminSitesIds.includes(s.area.floor.building.site.id)) {
        throw new Errors.ForbiddenError(user.full_name + ' is not the admin of ' + s.area.floor.building.site.name)
      }
    }
  },

  async updateBooksData(books, updateData) {
    const booksUpdated = []
    for (const book of books) {
      const elem = await BookingDAO.update(book.id, updateData)
      booksUpdated.push(elem)
    }
    return booksUpdated
  },

  async cancelReservation(id, managerUserId) {
    const book = (await this.getAll({ id }))[0]
    await this.validateManagerSite(managerUserId, [book.seat])
    if (book) {
      const reserverUserId = (book.reserverUserId || '').toLowerCase()
      const today = getCurrentDateAsStringYYYYMMDD(UNIX_TIMESTAMP_SIZE_LIMIT)
      const status = book.bookingStatus.status.toLowerCase()
      if (book.calendar.date >= today && status === 'reserved' && reserverUserId === managerUserId) {
        return this.makeBookAvailable(book, false)
      } else {
        throw new Errors.ForbiddenError('The pre-book does not meet the requirements to be canceled.')
      }
    } else {
      throw new Errors.NotFoundError('Booking not found.')
    }
  },

  async makeBookAvailable(book, keepReserver) {
    book.userId = null
    book.externalUserId = null
    book.userOrgCode = ''
    if (keepReserver && book.reserverUserId) {
      book.statusId = 3 // ID=3 in BookingStatus = "Reserved"
      return BookingDAO.update(book.id, book)
    } else {
      return BookingDAO.delete(book.id)
    }
  },
  async deletePrebooksScheduler(book) {
    book.reserverUserId = null
    return BookingDAO.update(book.id, book)
  },

  async cancelPreReservation() {
    const buildings = await BuildingDAO.getAll({})
    for (const building of buildings) {
      const buildingDate = getHourByGMT(building.gmt)
      const buildingHour = buildingDate.getHours()
      // Hardcode 9am of the cancellation pre - reserves
      const fixedTime = 9
      const tenDaysInHours = 240
      const reservationCancellationHours = building.reservationCancellationHours
      const timeToRun = (fixedTime + tenDaysInHours - reservationCancellationHours) % TWENTYFOUR_HOURS
      if (buildingHour === timeToRun) {
        console.log(
          new Date(),
          `Cancelling Pre Books from ${building.name} at ${timeToRun} hours, with ${building.reservationCancellationHours} offset`
        )
        const initialDate = moment().format().slice(0, UNIX_TIMESTAMP_SIZE_LIMIT)
        const finalDate = moment()
          .add(reservationCancellationHours, 'hours')
          .format()
          .slice(0, UNIX_TIMESTAMP_SIZE_LIMIT)
        const enhancedBooks = await BookingDAO.getAll({
          initialDate,
          finalDate,
          seatStatus: 'Reserved',
          buildingId: building.id,
        })
        const previousReserved = await BookingDAO.getAll({
          initialDate,
          finalDate,
          seatStatus: 'Booked',
          buildingId: building.id,
          reserverUserId: true,
        })
        for (const book of enhancedBooks) {
          this.makeBookAvailable(book, false)
        }
        for (const book of previousReserved) {
          this.deletePrebooksScheduler(book)
        }
      }
    }
  },

  async validateManagerSite(userName, seats) {
    const managedSites = await AuthController.managedSites(userName)
    const user = await LDAPClient.getUser(userName)
    const managedSitesIds = managedSites.map((s) => s.id)
    for (const s of seats) {
      if (!managedSitesIds.includes(s.area.floor.building.site.id)) {
        throw new Errors.ForbiddenError(user.full_name + ' is not the manager of ' + s.area.floor.building.site.name)
      }
    }
  },

  async validateHoods(userName, seatsId) {
    const user = await LDAPClient.getUser(userName).catch(ldapError)
    const hoods = await SeatHoodDAO.getAll({ seatId: seatsId })
    if (hoods.length) {
      const hoodsId = hoods.map((sh) => sh.hoodId)
      const hoodOrgCode = await HoodOrgCodeDAO.getAll({ hoodId: hoodsId })
      const hoodOrgCodes = hoodOrgCode.map((h) => h.orgCode)
      if (!hoodOrgCodes.includes(user.org_code)) {
        return false
      }
    }
    return true
  },

  async validateSeatOwners(userId, seatId) {
    const userSeats = await SeatOwnerDAO.getAll({ seatId })
    const users = userSeats.reduce(reducerSeat, [])
    if (!users.includes(userId) && users.length > 0) {
      return false
    }
    return true
  },

  mergeBooking(booking, parkings) {
    // get the parking for a given booking
    const parking = parkings.find((p) => p.calendar.date === booking.calendar.date && p.userId === booking.userId)
    if (parking) {
      for (let i = 0; i < parkings.length; i++) {
        if (parkings[i] === parking) {
          parkings.splice(i, 1)
          break
        }
      }
      return {
        // effectively merging
        ...booking,
        parking: `${parking.seat.area.floor.number} : ${parking.seat.code}`,
        parkingBookId: parking.id,
        userId: parking.userId,
        date: parking.calendar.date,
      }
    }
    return booking
  },
  mergeBookings(bookings) {
    const books = bookings.filter((b) => b.seat.typeId !== 2)
    const parkings = bookings.filter((b) => b.seat.typeId === 2)
    const mergedBookings = books.reduce((acc, book) => {
      const mergedBooking = this.mergeBooking(book, parkings)
      acc.push(mergedBooking)
      return acc
    }, [])
    const parkingOnlyBookings = parkings.map(({ seat, id, calendar, full_name, userId }) => ({
      parking: `${seat.area.floor.number} : ${seat.code}`,
      parkingBookId: id,
      onlyParking: true,
      calendar,
      seat,
      full_name,
      userId
    }))
    return [...mergedBookings, ...parkingOnlyBookings]
  },
}

function ldapError(e) {
  console.warn('Error ldap: ', e.message)
  return null
}

async function getTeam(userId) {
  const team = await UserController.getTeammatesUsernames(userId)
  team.push(userId)
  return team
}

const reducerSeat = (a, c) => {
  a.push(c.userId)
  return a
}

function setSeatInfoForNotifyOfReservation(book, datesSeat, where) {
  if (book.typeId === 1) {
    datesSeat = book.calendar.date + ', ' + (datesSeat || '')
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

function setParkingLotInfoForMailOfReservation(book) {
  if (book.typeId === PARKING_LOT_BOOKING_TYPE_ID)
    return {
      floor: book.seat.area.floor.number,
      parkingLot: book.seat.code,
      date: book.calendar.date,
    }
  return null
}

async function mailSendingForBookings(enhancedBooks, userId, onBehalfOfUserID = null) {
  let mailInfo = { datesSeat: '', where: {} }
  let mailParkingLot
  for (const book of enhancedBooks) {
    mailInfo = setSeatInfoForNotifyOfReservation(book, mailInfo.datesSeat, mailInfo.where)
    const parkingLotInfo = setParkingLotInfoForMailOfReservation(book)
    if (parkingLotInfo) {
      if (!mailParkingLot) mailParkingLot = []
      mailParkingLot.push(parkingLotInfo)
    }
  }
  if (mailInfo.where.seat) mailInfo.where.dates = mailInfo.datesSeat
  if (mailParkingLot) mailInfo.where.parkingLots = mailParkingLot
  if (onBehalfOfUserID) {
    mailInfo.where.originUserId = userId
    await MailController.confirmBooking(onBehalfOfUserID.username, mailInfo.where)
  } else {
    await MailController.confirmBooking(userId, mailInfo.where)
  }
}

async function smsSendingForBookings(enhancedBooks, userId, onBehalfOfUserID = null) {
  let smsInfo = { datesSeat: '', where: {} }
  for (const book of enhancedBooks) {
    smsInfo = setSeatInfoForNotifyOfReservation(book, smsInfo.datesSeat, smsInfo.where)
  }
  if (smsInfo.where.seat) smsInfo.where.dates = smsInfo.datesSeat
  if (onBehalfOfUserID) {
    smsInfo.where.originUserId = userId
    await SmsNotificationController.confirmBooking(onBehalfOfUserID.username, smsInfo.where)
  } else {
    await SmsNotificationController.confirmBooking(userId, smsInfo.where)
  }
}
