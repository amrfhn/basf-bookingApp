const EventDAO = require('../model/dao/EventDAO')
const BookingDAO = require('../model/dao/BookingDAO')
const UserController = require('./UserController')
const LDAPClient = require('basf-gtu-utils/client/LDAP')
const { max, min, distinct } = require('basf-gtu-utils/utils/FunctionalUtils')
const { parseDate, formatDate, firstTime, lastTime, addDays, toDate } = require('basf-gtu-utils/utils/DateUtils')
const { BrigadierDAO, HoodDAO } = require('../model/dao')
const moment = require('moment')
const WorkStreamDAO = require('../model/dao/WorkStreamDAO')
const dateFormat = 'YYYY-MM-DD'
const ExcelJS = require('exceljs')
const fs = require('fs')
const AuthController = require('./AuthController')

module.exports = {
  async lackOfSeatList(username, mode, site, initialDate, finalDate) {
    // TODO: Add here validation for anonymized data
    let sitesNames = []
    if (!site) {
      const sites = await AuthController.managedSites(username)
      sitesNames = sites.map((s) => s.name)
    } else {
      const adminSite = JSON.parse(site)
      sitesNames.push(adminSite.name)
    }
    const payload = {
      [EventDAO.Op.and]: [
        { type: 'Seat Unavailable Feedback' },
        { site: { [EventDAO.Op.in]: sitesNames } },
        {
          [EventDAO.Op.or]: [
            { dateTo: { [EventDAO.Op.between]: [initialDate, finalDate] } },
            { dateFrom: { [EventDAO.Op.between]: [initialDate, finalDate] } },
            {
              [EventDAO.Op.and]: [
                { dateFrom: { [EventDAO.Op.lte]: initialDate } },
                { dateTo: { [EventDAO.Op.gte]: finalDate } },
              ],
            },
          ],
        },
      ],
    }
    const filters = {
      type: 'FEEDBACK',
      payload,
    }
    if (mode === 'manager') {
      const userIds = await UserController.getTeammatesUsernames(username)
      filters.userId = [...userIds, username]
    }
    const events = await EventDAO.getAll(filters)

    // Search User Data
    const usersInEvent = events.map((e) => e.userId)
    const users = await LDAPClient.getUsers(usersInEvent)

    // Process Data
    const output = {}
    for (const e of events) {
      const userFullName = users[e.userId].full_name
      const userOrgCode = users[e.userId].org_code
      output[e.userId] = output[e.userId] || { username: e.userId, userFullName, userOrgCode, q: 0, dates: new Set() }

      const lowerBound = max(initialDate, e.payload.dateFrom)
      const upperBound = min(finalDate, e.payload.dateTo)

      const lbDate = parseDate(lowerBound, dateFormat)
      const udDate = parseDate(upperBound, dateFormat)

      const days = 1 + (udDate.getTime() - lbDate.getTime()) / 86400000 // One Day

      for (let i = 0; i < days; i++) {
        let date = addDays(i)(lbDate)
        date = await this.removeTimeZoneDifference(date)
        output[e.userId].dates.add(formatDate(date, dateFormat))
      }
    }

    // Sort Values
    return Object.values(output)
      .map((r) => {
        return { ...r, q: r.dates.size, dates: Array.from(r.dates).sort() }
      })
      .sort((r1, r2) => r2.q - r1.q)
  },
  async cancellationReport(username, mode, building, initialDate, finalDate) {
    // TODO: Add here validation for anonymized data
    const filters = {
      type: 'CANCEL_BOOK',
      initialDate: initialDate,
      finalDate: finalDate,
    }
    if (mode === 'manager') {
      const userIds = await UserController.getTeammatesUsernames(username)
      filters.userId = [...userIds, username]
    } else if (mode === 'admin') {
      const buildingAdmin = JSON.parse(building)
      filters.payload = {
        seat: {
          area: {
            floor: {
              building: {
                id: buildingAdmin.id,
              },
            },
          },
        },
      }
    }
    const events = await EventDAO.getAll(filters)
    // Search User Data
    const usersInEvent = events.map((e) => e.userId)
    const users = await LDAPClient.getUsers(usersInEvent)

    // Process Data
    const output = []
    for (const e of events) {
      let userFullName = ''
      if (users[e.userId]) {
        userFullName = users[e.userId].full_name
      } else {
        userFullName = e.userId
      }
      output.push({
        username: e.userId,
        userFullName,
        reservationDate: formatDate(e.payload.calendar.date),
        floor: e.payload.seat.area.floor.number,
        seat: e.payload.seat.code,
        cancellationDate: e.date,
      })
    }
    return output
  },
  firstAidersReport: async function (username, site, initialDate, finalDate) {
    const brigadiers = await BrigadierDAO.getAll({ siteId: site })
    const brigadiersUsername = brigadiers.map((b) => b.username)
    const booksBrigadiers = await BookingDAO.getAll({
      userId: brigadiersUsername,
      available: true,
      initialDate: initialDate,
      finalDate: finalDate,
      site: site,
    })
    const users = await LDAPClient.getUsers(brigadiersUsername)

    const output = []
    for (const booksBrigadier of booksBrigadiers) {
      output.push({
        reservationDate: formatDate(booksBrigadier.calendar.date),
        username: users[booksBrigadier.userId].full_name,
        floor: booksBrigadier.seat.area.floor.number,
        area: booksBrigadier.seat.area.code,
        seat: booksBrigadier.seat.code,
      })
    }
    return output
  },
  async workStreamDashboard(username, siteId, initialDate, finalDate) {
    // Search total Bookings between Dates
    let bookings = await BookingDAO.getAll({
      siteId: siteId,
      endDate: null,
      initialDate: initialDate,
      finalDate: finalDate,
    })
    bookings = bookings.map((b) => ({ userId: b.userId, date: b.calendar.date }))

    // Search User Data
    const usersBooked = bookings.map((b) => b.userId).filter((b) => b !== null)

    if (usersBooked.length) {
      // Users data
      const usersOrgCodes = await LDAPClient.getUsers(usersBooked)

      // Calculate Occupation By Day
      const groupByDateFiltered = (a, c) => {
        if (c.userId !== null) {
          ;(a[formatDate(c.date)] = a[formatDate(c.date)] || []).push({ userId: c.userId })
        }
        return a
      }
      const mapBookingsByDate = bookings.reduce(groupByDateFiltered, {})
      const orderedMapBookingsByDate = {}
      Object.keys(mapBookingsByDate)
        .sort(function (a, b) {
          return a.split('-').reverse().join('').localeCompare(b.split('-').reverse().join(''))
        })
        .forEach(function (key) {
          orderedMapBookingsByDate[key] = mapBookingsByDate[key]
        })

      // Calculate Total Occupation By Day
      const groupByDate = (a, c) => {
        ;(a[formatDate(c.date)] = a[formatDate(c.date)] || []).push({ userId: c.userId })
        return a
      }
      const totalOccupationByDay = bookings.reduce(groupByDate, {})

      //  Process Data
      let capacityWarning = false
      const output = []
      let siteHasNoWorkStreams = true
      for (const day in orderedMapBookingsByDate) {
        // Calculate Occupation By WorkStream
        const occupation = {}
        for (const userObj of orderedMapBookingsByDate[day]) {
          if (usersOrgCodes[userObj.userId.toLowerCase()]) {
            const workStreamOrgCode = await WorkStreamDAO.getAll({
              orgCode: usersOrgCodes[userObj.userId.toLowerCase()].org_code,
              siteId: siteId,
            })
            if (workStreamOrgCode.length > 0) {
              siteHasNoWorkStreams = false
              if (occupation[workStreamOrgCode[0].name]) {
                occupation[workStreamOrgCode[0].name]++
              } else {
                occupation[workStreamOrgCode[0].name] = 1
              }
            }
          }
        }
        // Calculate (Occupation & Total) % Percentage
        let total = parseInt(0)
        for (const ws in occupation) {
          occupation[ws] = ((100 * occupation[ws]) / totalOccupationByDay[day].length).toFixed(2)
          total = total + parseFloat(occupation[ws])
        }
        // detect if the capacity change to throw a warning
        const totalChange = []
        for (const day in totalOccupationByDay) {
          if (!totalChange.includes(totalOccupationByDay[day].length)) {
            totalChange.push(totalOccupationByDay[day].length)
          }
        }
        if (totalChange.length > 1) {
          capacityWarning = true
        }

        output.push({
          day,
          occupation,
          total,
        })
      }
      if (siteHasNoWorkStreams) {
        return [{ siteHasNoWorkStreams }]
      }
      if (capacityWarning) {
        output.push({ capacityWarning })
      }
      return output
    }
  },
  async myBookingHistory(username, teammates, initialDate, finalDate, returnUserId, buildingId, isParkingOnly) {
    // TODO: Add here validation for anonymized data
    let bookings = []
    let bookingsAvailable = 0
    const parsedInitDate = parseDate(initialDate, dateFormat)
    const parsedFinalDate = parseDate(finalDate, dateFormat)
    const daysBetweenDates = await this.getBusinessDateCount(parsedInitDate, parsedFinalDate)
    let booksQuantityReserved = 0
    const isParkingOnlyBooking = isParkingOnly && JSON.parse(isParkingOnly)

    if (buildingId) {
      let filters = {
        buildingId,
        initialDate,
        finalDate,
      }
      if (isParkingOnlyBooking) {
        filters.typeId = 2
      }
      bookings = await BookingDAO.getAll({ ...filters, seatStatus: 'Booked' })
      bookingsAvailable = await BookingDAO.getQuantityAvailableBookings({ ...filters })
      if (bookings) {
        booksQuantityReserved = bookings.length
      }
    } else if (teammates && teammates.length > 0) {
      bookings = await BookingDAO.getAll({ userId: teammates, initialDate, finalDate, statusId: 2 })
      if (bookings) {
        booksQuantityReserved = bookings.length
      }
    } else {
      bookings = await BookingDAO.getAll({ userId: username, initialDate, finalDate, statusId: 2 })
    }

    const usersInEvent = bookings.map((b) => b.userId)
    const users = await LDAPClient.getUsers(usersInEvent)

    const output = []
    for (const b of bookings) {
      let fullName = ''
      if (users[b.userId]) {
        fullName = users[b.userId].full_name
      } else {
        fullName = b.userId
      }
      if (returnUserId) {
        output.push({
          reservationDate: formatDate(b.calendar.date),
          userFullName: fullName,
          userId: b.userId,
          floor: b.seat.area.floor.number,
          area: b.seat.area.code,
          seat: b.seat.code,
        })
      } else {
        output.push({
          reservationDate: formatDate(b.calendar.date),
          userFullName: fullName,
          floor: b.seat.area.floor.number,
          area: b.seat.area.code,
          seat: b.seat.code,
        })
      }
    }
    return { data: output, daysBetweenDates, booksQuantityReserved, bookingsAvailable }
  },

  async getBusinessDateCount(startDate, endDate) {
    let elapsed
    const ifThen = function (a, b, c) {
      return a === b ? c : a
    }

    elapsed = endDate - startDate
    elapsed /= 86400000

    const daysBeforeFirstSunday = (7 - startDate.getDay()) % 7
    const daysAfterLastSunday = endDate.getDay()

    elapsed -= daysBeforeFirstSunday + daysAfterLastSunday
    elapsed = (elapsed / 7) * 5
    elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5)

    return Math.ceil(elapsed)
  },
  async removeTimeZoneDifference(date) {
    return new Date(date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000))
  },
  parseLocalDateToUtc(date) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return new Date(date.setTime(date.getTime() - moment().tz(tz).utcOffset() * 60 * 1000))
  },
  parseUtcToLocalDate(date) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return new Date(date.setTime(date.getTime() + moment().tz(tz).utcOffset() * 60 * 1000))
  },

  async landingZonesOccupation(username, siteId, initialDate, finalDate) {
    // Format dates
    const parsedInitDate = firstTime(parseDate(initialDate, dateFormat))
    const parsedFinalDate = lastTime(parseDate(finalDate, dateFormat))

    // Search total Bookings between Dates
    let bookings = await BookingDAO.getAll({
      siteId: siteId,
      endDate: null,
      initialDate: parsedInitDate,
      finalDate: parsedFinalDate,
    })
    bookings = bookings.map((b) => ({ userId: b.userId, date: b.calendar.date }))

    // Search User Data
    const usersBooked = bookings.map((b) => b.userId).filter((b) => b !== null)

    if (usersBooked.length) {
      // Users data
      const usersOrgCodes = await LDAPClient.getUsers(usersBooked)

      // Calculate Occupation By Day
      const groupByDateFiltered = (a, c) => {
        if (c.userId !== null) {
          ;(a[formatDate(c.date)] = a[formatDate(c.date)] || []).push({ userId: c.userId })
        }
        return a
      }
      const mapBookingsByDate = bookings.reduce(groupByDateFiltered, {})
      const orderedMapBookingsByDate = {}
      Object.keys(mapBookingsByDate)
        .sort(function (a, b) {
          return a.split('-').reverse().join('').localeCompare(b.split('-').reverse().join(''))
        })
        .forEach(function (key) {
          orderedMapBookingsByDate[key] = mapBookingsByDate[key]
        })

      // Calculate Total Occupation By Day
      const groupByDate = (a, c) => {
        ;(a[formatDate(c.date)] = a[formatDate(c.date)] || []).push({ userId: c.userId })
        return a
      }
      const totalOccupationByDay = bookings.reduce(groupByDate, {})

      //  Process Data
      let capacityWarning = false
      const output = []
      let siteHasNoLadingZone = true
      for (const day in orderedMapBookingsByDate) {
        // Calculate Occupation By WorkStream
        const occupation = {}
        for (const userObj of orderedMapBookingsByDate[day]) {
          if (usersOrgCodes[userObj.userId.toLowerCase()]) {
            const hoodOrgCode = await HoodDAO.getAll({
              orgCode: usersOrgCodes[userObj.userId.toLowerCase()].org_code,
              siteId: siteId,
            })
            if (hoodOrgCode.length > 0) {
              siteHasNoLadingZone = false
              if (occupation[hoodOrgCode[0].name]) {
                occupation[hoodOrgCode[0].name]++
              } else {
                occupation[hoodOrgCode[0].name] = 1
              }
            }
          }
        }
        // Calculate (Occupation & Total) % Percentage
        let total = parseInt(0)
        for (const h in occupation) {
          occupation[h] = ((100 * occupation[h]) / totalOccupationByDay[day].length).toFixed(2)
          total = total + parseFloat(occupation[h])
        }
        // detect if the capacity change to throw a warning
        const totalChange = []
        for (const day in totalOccupationByDay) {
          if (!totalChange.includes(totalOccupationByDay[day].length)) {
            totalChange.push(totalOccupationByDay[day].length)
          }
        }
        if (totalChange.length > 1) {
          capacityWarning = true
        }
        output.push({
          day,
          occupation,
          total,
        })
      }
      if (siteHasNoLadingZone) {
        return [{ siteHasNoLadingZone }]
      }
      if (capacityWarning) {
        output.push({ capacityWarning })
      }
      return output
    }
  },

  async buildingOccupation(buildingId, initialDate, finalDate) {
    let capacityWarning = false
    const res = []
    // Get all bookings for the building
    let bookings = await BookingDAO.getAll({ buildingId, initialDate, finalDate, endDate: null })
    let sameDateBookings = bookings.filter((b) => b.calendar.date === finalDate)

    // Get Working Days between the date range
    const daysBetweenDates = await this.getBusinessDateCount(
      parseDate(initialDate, dateFormat),
      parseDate(finalDate, dateFormat)
    )

    // Remove weekends bookings
    bookings = bookings.filter(
      (booking) => new Date(booking.calendar.date).getDay() > 0 && new Date(booking.calendar.date).getDay() < 6
    )
    sameDateBookings = sameDateBookings.filter(
      (sb) => new Date(sb.calendar.date).getDay() > 0 && new Date(sb.calendar.date).getDay() < 6
    )

    // Add properties to the object to make it easier to group by
    bookings.forEach((booking) => {
      booking.floorId = booking.seat.area.floor.id
      booking.calendarId = booking.calendar.id
      booking.floorNumber = booking.seat.area.floor.number
    })
    sameDateBookings.forEach((sb) => {
      sb.floorId = sb.seat.area.floor.id
      sb.calendarId = sb.calendar.id
      sb.floorNumber = sb.seat.area.floor.number
    })

    // Group by bookings by floor
    const bookingsGroupedBy = this.groupBy(bookings, 'floorId')
    const sameDateBookingsGroupedBy = this.groupBy(sameDateBookings, 'floorId')
    const bookingKeys = Object.keys(bookingsGroupedBy)

    const groupByDate = (a, c) => {
      ;(a[formatDate(c.date)] = a[formatDate(c.date)] || []).push({ userId: c.userId })
      return a
    }

    // Detect if the capacity change to throw a warning
    const totalOccupationByDay = bookings.reduce(groupByDate, {})
    const totalChange = []
    for (const day in totalOccupationByDay) {
      if (!totalChange.includes(totalOccupationByDay[day].length)) {
        totalChange.push(totalOccupationByDay[day].length)
      }
    }
    if (totalChange.length > 1) {
      capacityWarning = true
    }

    // Each key is the floor, for each key(floor) get all needed info
    bookingKeys.forEach((key) => {
      res.push({
        minAndMax: this.getMaxAndMinSeatsBooked(this.groupBy(bookingsGroupedBy[key], 'calendarId')),
        totalAvailableSeats: sameDateBookingsGroupedBy[key].length,
        totalBookedSeats: bookingsGroupedBy[key].filter((booking) => booking.userId !== null).length,
        floorNumber: bookingsGroupedBy[key][0].floorNumber,
        periodDays: daysBetweenDates,
      })
    })

    if (capacityWarning) {
      res.push({ capacityWarning })
    }
    return res
  },

  // Function that groups by an array of objects by a specific parameter of the objects
  groupBy(arr, criteria) {
    const newObj = arr.reduce(function (acc, currentValue) {
      if (!acc[currentValue[criteria]]) {
        acc[currentValue[criteria]] = []
      }
      acc[currentValue[criteria]].push(currentValue)
      return acc
    }, {})
    return newObj
  },

  // Given multiple days, this function returns the highest and lowest bookings in one day.
  getMaxAndMinSeatsBooked(bookingCalendarInfo) {
    let booksPerDate = 0
    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    const calendars = Object.keys(bookingCalendarInfo)
    calendars.forEach((calendar) => {
      let bookings = bookingCalendarInfo[calendar]
      booksPerDate = bookings.length
      bookings = bookings.filter((book) => book.userId !== null)
      if (bookings.length > max) {
        max = bookings.length
      }
      if (bookings.length < min) {
        min = bookings.length
      }
    })
    return { max, min, booksPerDate }
  },

  async makeOutOfSeatReport(username, mode, site, initialDate, finalDate) {
    // TODO: Add here validation for anonymized data
    const dataOutOfSeat = await this.lackOfSeatList(username, mode, site, initialDate, finalDate)
    const columns = ['Date', 'Name', 'Org_Code']
    const data = dataOutOfSeat
      .flatMap((r) =>
        r.dates.map((d) => {
          return [d, r.userFullName, r.userOrgCode]
        })
      )
      .sort((a, b) => a[0].localeCompare(b[0]))
    const makeReport = await this.makeReport('Out_of_Seat_Report', columns, data, initialDate, finalDate)
    return makeReport
  },

  async makeCancellationReport(username, initialDate, finalDate) {
    // TODO: Add here validation for anonymized data
    const dataCancellation = await this.cancellationReport(username, initialDate, finalDate)
    const columns = ['Reservation Date', 'Name', 'Floor', 'Seat', 'Cancellation Date']
    const data = dataCancellation.map((d) => {
      return [d.reservationDate, d.userFullName, d.floor.toString(), d.seat.toString(), d.cancellationDate]
    })
    const makeReport = await this.makeReport('Cancellation_Report', columns, data, initialDate, finalDate)
    return makeReport
  },

  async makeBookingHistoryReport(username, teammates, initialDate, finalDate, buildingId, isParkingOnly) {
    const isParkingOnlyBooking = isParkingOnly && JSON.parse(isParkingOnly)

    const dataBookingHistory = await this.myBookingHistory(
      username,
      teammates,
      initialDate,
      finalDate,
      true,
      buildingId,
      isParkingOnlyBooking
    )
    const columns = ['Reservation Date', 'Name', 'User Id', 'Floor', 'Area', 'Seat']
    const data = dataBookingHistory.data.map((d) => {
      return [
        d.reservationDate,
        d.userFullName,
        d.userId.toString(),
        d.floor.toString(),
        d.area.toString(),
        d.seat.toString(),
      ]
    })
    return await this.makeReport(isParkingOnlyBooking ? 'Parking_Booking_History_Report' : 'Booking_History_Report', columns, data, initialDate, finalDate)
  },

  async makeWorkStreamDashboard(username, siteId, initialDate, finalDate) {
    const dataWorkStream = await this.workStreamDashboard(username, siteId, initialDate, finalDate)
    const workStreams = dataWorkStream
      .filter((d) => d.occupation)
      .flatMap((d) => Object.keys(d.occupation))
      .filter(distinct)
      .sort()
    const columns = ['Day', ...workStreams, 'Total']
    const data = dataWorkStream
      .filter((d) => d.occupation)
      .map((d) => {
        const partialData = workStreams.map((ws) => d.occupation[ws] || '0.00')
        return [d.day, ...partialData, d.total.toString()]
      })
    const makeReport = await this.makeReport('WorkStream_Dashboard_Report', columns, data, initialDate, finalDate)
    return makeReport
  },

  async makeLandingZonesOccupation(username, siteId, initialDate, finalDate) {
    const dataLandingZones = await this.landingZonesOccupation(username, siteId, initialDate, finalDate)
    const landingZones = dataLandingZones
      .filter((d) => d.occupation)
      .flatMap((d) => Object.keys(d.occupation))
      .filter(distinct)
      .sort()
    const columns = ['Day', ...landingZones, 'Total']
    const data = dataLandingZones
      .filter((d) => d.occupation)
      .map((d) => {
        const partialData = landingZones.map((ws) => d.occupation[ws] || '0.00')
        return [d.day, ...partialData, d.total.toString()]
      })

    const makeReport = await this.makeReport('LandingZones_Occupation_Report', columns, data, initialDate, finalDate)
    return makeReport
  },

  async makeFirstAidersReport(username, siteId, initialDate, finalDate) {
    const dataFirstAiders = await this.firstAidersReport(username, siteId, initialDate, finalDate)
    const columns = ['Date', 'Name', 'Floor', 'Area', 'Seat']
    const data = dataFirstAiders.map((d) => {
      return [d.reservationDate, d.username, d.floor.toString(), d.area.toString(), d.seat.toString()]
    })
    const makeReport = await this.makeReport('First_aiders_Report', columns, data, initialDate, finalDate)
    return makeReport
  },

  async makeSeatBookingHistoryDay(username, buildingId, initialDate, finalDate) {
    const dataBookingHistoryDay = await this.buildingOccupation(buildingId, initialDate, finalDate)
    const columns = ['Floor', 'Total of available seats', 'Seats booked', '% booked']
    const data = dataBookingHistoryDay.map((d) => {
      const percentage = ((d.totalBookedSeats / d.totalAvailableSeats) * 100).toFixed(1)
      return [
        d.floorNumber.toString(),
        d.totalAvailableSeats.toString(),
        d.totalBookedSeats.toString(),
        percentage.toString(),
      ]
    })
    const makeReport = await this.makeReport('Seat_Booking_Day_Report', columns, data, initialDate, finalDate)
    return makeReport
  },
  async makeSeatBookingHistoryPeriod(username, buildingId, initialDate, finalDate) {
    const dataBookingHistoryPeriod = await this.buildingOccupation(buildingId, initialDate, finalDate)
    const columns = [
      'Floor',
      'Total of available seats',
      '% bookings',
      'Seats booking average',
      '% max seats booked',
      'max seats booked',
      '% min seats booked',
      'min seats booked',
    ]
    const data = dataBookingHistoryPeriod.map((d) => {
      const percentage = ((d.totalBookedSeats / d.totalAvailableSeats) * 100).toFixed(1)
      const seatBookAverage = Math.round((d.totalBookedSeats / d.periodDays) * 100) / 100
      const maxSeatBooked = ((d.minAndMax.max / d.minAndMax.booksPerDate) * 100).toFixed(1)
      const minSeatBooked = ((d.minAndMax.min / d.minAndMax.booksPerDate) * 100).toFixed(1)
      return [
        d.floorNumber.toString(),
        d.totalAvailableSeats.toString(),
        percentage.toString(),
        seatBookAverage.toString(),
        maxSeatBooked.toString(),
        d.minAndMax.max.toString(),
        minSeatBooked.toString(),
        d.minAndMax.min.toString(),
      ]
    })
    const makeReport = await this.makeReport('Seat_Booking_Period_Report', columns, data, initialDate, finalDate)
    return makeReport
  },

  async makeReport(name, columns, data, initialDate, finalDate) {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet(name)
    const style = {
      name: 'Calibri',
      family: 2,
      bold: true,
      size: 12,
    }

    /* Title */
    sheet.mergeCells('A1', 'B1')
    sheet.getCell('A1').value = name
    sheet.getCell('A3').value = 'Start Date'
    sheet.getCell('B3').value = initialDate
    sheet.getCell('A4').value = 'End Date'
    sheet.getCell('B4').value = finalDate
    sheet.getRows(1, 4).forEach((row) => (row.font = style))

    /* Column headers */
    sheet.getRow(6).values = columns
    sheet.getRow(6).eachCell(function (cell, colNumber) {
      cell.font = style
    })

    /* Row data */
    const width = columns.map((c) => c.length)
    for (let i = 0; i < data.length; i++) {
      for (const j in data[i]) {
        width[j] = Math.max(width[j], data[i][j].length)
      }
      sheet.getRow(7 + i).values = data[i]
    }
    sheet.columns = width.map((w) => {
      return {
        width: w * 2.5,
      }
    })

    const now = new Date().toISOString().substring(0, 10).replace(/-/g, '_')
    await workbook.xlsx.writeFile(`/ext_data/${name}_${now}.xlsx`)
    return `${name}_${now}`
  },

  deleteOldFiles() {
    const path = '/ext_data/'
    const files = fs.readdirSync(path)

    for (const fileName of files) {
      const creationDate = createdDate(path + fileName)
      if (Math.floor(Math.abs(creationDate - new Date()) / 36e5) > 24) {
        fs.unlink(path + fileName, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }
    }
  },
}

function createdDate(file) {
  const { birthtime } = fs.statSync(file)

  return birthtime
}
