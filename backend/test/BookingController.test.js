/* eslint no-undef: 0 */

jest.mock('../controllers/AuthController')
jest.mock('../controllers/UserController')
jest.mock('../controllers/MailController')
jest.mock('../controllers/EventController')
jest.mock('../model/dao/BookingDAO')
jest.mock('../model/dao/SeatHoodDAO')
jest.mock('../model/dao/BuildingDAO')
jest.mock('../model/dao/CalendarDAO')
jest.mock('../model/dao/HoodOrgCodeDAO')
jest.mock('../model/dao/SeatOwnerDAO')
jest.mock('../model/dao/CalendarDAO')
jest.mock('../model/dao/SeatDAO')
jest.mock('basf-gtu-utils/client/LDAP')
const BookingController = require('../controllers/BookingController')
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const MailController = require('../controllers/MailController')
const EventController = require('../controllers/EventController')
const BookingDAO = require('../model/dao/BookingDAO')
const CalendarDAO = require('../model/dao/CalendarDAO')
const SeatHoodDAO = require('../model/dao/SeatHoodDAO')
const BuildingDAO = require('../model/dao/BuildingDAO')
const HoodOrgCodeDAO = require('../model/dao/HoodOrgCodeDAO')
const SeatOwnerDAO = require('../model/dao/SeatOwnerDAO')
const SeatDAO = require('../model/dao/SeatDAO')
const LDAPClient = require('basf-gtu-utils/client/LDAP')
const { formatDate } = require('basf-gtu-utils/utils/DateUtils')

const dateBuilder = (offset) => {
  const a = new Date()
  a.setDate(a.getDate() + offset)
  return a
}
const dateBuilderWithoutMiliSec = (offset) => {
  return dateBuilder(offset).toISOString().slice(0, 19)
}
const SEAT_BOOKING_TYPE_ID = 1
const PARKING_LOT_BOOKING_TYPE_ID = 2
const BOOKING_AVAILABLE = 'Available'
const BOOKING_BOOKED = 'Booked'
const BOOKING_PREBOOKING = 'Reserved'

const emptyArray = jest.fn().mockResolvedValue([])

const mockSites = jest.fn().mockResolvedValue([
  { id: 1, name: 'site1' },
  { id: 2, name: 'site2' },
])

const mockBooksReserved = jest.fn().mockResolvedValue([
  {
    id: 1,
    bookingStatus: { status: BOOKING_PREBOOKING },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksBooked = jest.fn().mockResolvedValue([
  {
    id: 1,
    bookingStatus: { status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksReservedByManager = jest.fn().mockResolvedValue([
  {
    id: 1,
    reserverUserId: 'user10',
    calendar: { id: 22, date: '2022-12-02', available: true },
    bookingStatus: { status: BOOKING_PREBOOKING },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksReservedByTeammate = jest.fn().mockResolvedValue([
  {
    id: 1,
    reserverUserId: 'user1',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(5), available: true },
    bookingStatus: { status: BOOKING_PREBOOKING },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksReservedByTeammateForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    reserverUserId: 'user1',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { status: BOOKING_PREBOOKING },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksReservedByTeammateFuture = jest.fn().mockResolvedValue([
  {
    id: 1,
    reserverUserId: 'user1',
    userId: null,
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(5), available: true },
    bookingStatus: { status: BOOKING_PREBOOKING },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookFromCorrectPrebookForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: 'user1',
    userId: 'JohnDoe',
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksReservedByManagerWithABook = jest.fn().mockResolvedValue([
  {
    id: 1,
    calendar: { id: 22, date: '2022-12-02', available: true },
    bookingStatus: { status: BOOKING_PREBOOKING },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },

  {
    id: 2,
    reserverUserId: 'John Doe',
    calendar: { id: 22, date: '2022-12-02', available: true },
    bookingStatus: { status: BOOKING_BOOKED },
    seat: { id: 2, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksOverdue = jest.fn().mockResolvedValue([
  {
    id: 1,
    userId: null,
    reserverUserId: null,
    calendar: { date: dateBuilder(-5) },
    bookingStatus: { status: BOOKING_AVAILABLE },
    seat: {
      id: 1,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
])

const mockBooksAvailable = jest.fn().mockResolvedValue([
  {
    id: 1,
    userId: null,
    reserverUserId: null,
    calendar: { date: dateBuilderWithoutMiliSec(5) },
    bookingStatus: { status: BOOKING_AVAILABLE },
    seat: {
      id: 1,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
])

const mockBookSeatBooked = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(5), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookSeatReserved = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: 'user1',
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(5), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookSeatBookedForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksAvailableForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    userId: null,
    reserverUserId: null,
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    bookingStatus: { status: BOOKING_AVAILABLE },
    seat: {
      id: 1,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
])

const mockBookSeatBookedForTodayOnBehalf = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: 'JohnDoeSupervisor',
    userId: 'JohnDoe',
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookSeatBookedOnBehalf = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'DummyUser',
    calendar: { date: dateBuilderWithoutMiliSec(5) },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookSeatBookedOnBehalfByNoManager = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: 'fooBar',
    userId: 'JohnDoe',
    calendar: { date: dateBuilderWithoutMiliSec(+5) },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookParkingLotBookedForTodayOnBehalf = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: 'JohnDoeSupervisor',
    userId: 'JohnDoe',
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBooksOk = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    userId: null,
    reserverUserId: null,
    calendar: { id: 1, date: dateBuilder(+5), available: true },
    bookingStatus: { status: BOOKING_AVAILABLE },
    userOrgCode: null,
    seat: {
      id: 1,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
  {
    id: 2,
    typeId: SEAT_BOOKING_TYPE_ID,
    userId: null,
    reserverUserId: null,
    calendar: { id: 1, date: dateBuilder(+5), available: true },
    bookingStatus: { status: BOOKING_AVAILABLE },
    userOrgCode: null,
    seat: {
      id: 2,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
  {
    id: 3,
    typeId: SEAT_BOOKING_TYPE_ID,
    userId: null,
    reserverUserId: null,
    calendar: { id: 1, date: dateBuilder(+5), available: true },
    bookingStatus: { status: BOOKING_AVAILABLE },
    userOrgCode: null,
    seat: {
      id: 3,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
  {
    id: 4,
    typeId: SEAT_BOOKING_TYPE_ID,
    userId: null,
    reserverUserId: null,
    calendar: { id: 1, date: dateBuilder(+5), available: true },
    bookingStatus: { status: BOOKING_AVAILABLE },
    userOrgCode: null,
    seat: {
      id: 4,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
  {
    id: 5,
    typeId: SEAT_BOOKING_TYPE_ID,
    userId: null,
    reserverUserId: null,
    calendar: { id: 1, date: dateBuilder(+5), available: true },
    bookingStatus: { status: BOOKING_AVAILABLE },
    userOrgCode: null,
    seat: {
      id: 5,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
])

const mockPreBookingForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    userId: null,
    reserverUserId: null,
    calendar: { id: 1, date: dateBuilder(0), available: true },
    bookingStatus: { status: BOOKING_AVAILABLE },
    userOrgCode: null,
    seat: {
      id: 1,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
])

const mockSitesOk = jest.fn().mockResolvedValue([{ id: 100, name: 'Utopia' }])

const mockBuildings = jest.fn().mockResolvedValue([
  {
    id: 1,
    name: 'WTC Torre 4',
    gmt: -3,
    reservationCancellationHours: 24,
  },
  {
    id: 2,
    name: 'OBC03',
    gmt: 1,
    reservationCancellationHours: 25,
  },
  {
    id: 3,
    name: 'My building',
    gmt: -3,
    reservationCancellationHours: 24 - new Date().getHours() + 9,
  },
])

const mockCancelBookedReservation = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(5), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 604, code: 76, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockCancelBookedParkingLotReservation = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(5), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 604, code: 76, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockCancelBookedReservationForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 604, code: 76, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])
const mockCancelBookedReservationForTodayHours = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: {
      id: 604,
      code: 76,
      area: { floor: { building: { cancellationHours: -12, gmt: -3, site: { id: 100, name: 'Utopia' } } } },
    },
  },
])

const mockCancelBookedParkingLotReservationForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 604, code: 76, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockParkingLotBookingWithSeatOwnerForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: null,
    calendar: { id: 1, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { id: 1, status: BOOKING_AVAILABLE },
    seat: { id: 1, code: 17, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockSeatBookingWithSeatOwner = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: null,
    calendar: { id: 1, date: dateBuilderWithoutMiliSec(+5), available: true },
    bookingStatus: { id: 1, status: BOOKING_AVAILABLE },
    seat: { id: 1, code: 17, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockBookingParkingLotWithSeatOwnerForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockParkingLotBookingAlreadyBookedWithSeatOwnerForToday = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 1, date: dateBuilderWithoutMiliSec(0), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 1, code: 17, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockSeatOwner = jest.fn().mockResolvedValue([
  {
    id: 12587,
    userId: 'JohnDoe',
    seatId: 1,
  },
])

const mockSeatOwnerNotJhonDoe = jest.fn().mockResolvedValue([
  {
    id: 12588,
    userId: 'DummyUser',
    seatId: 4,
  },
])

const mockSeatOwnerDummyUserInSeatOne = jest.fn().mockResolvedValue([
  {
    id: 12588,
    userId: 'DummyUser',
    seatId: 1,
  },
])

const mockSeatHood = jest.fn().mockResolvedValue([
  {
    id: 12587,
    hoodId: 55,
    seatId: 1,
  },
])

const mockSeatHoodOther = jest.fn().mockResolvedValue([
  {
    id: 77777,
    hoodId: 10,
    seatId: 8,
  },
])

const mockHoodOrgCodes = jest.fn().mockResolvedValue([
  {
    id: 128,
    hoodId: 55,
    orgCode: 'GB/CD',
  },
])

const mockHoodOrgCodesOther = jest.fn().mockResolvedValue([
  {
    id: 669,
    hoodId: 10,
    orgCode: 'Not matching dummy',
  },
])

const mockJohnDoeSirTestLDAPInfo = jest.fn().mockResolvedValue({
  username: 'JohnDoe',
  full_name: 'Sir Test',
  org_code: 'GB/CD',
})

const mockJohnDoeSuperSirTestLDAPInfo = jest.fn().mockResolvedValue({
  username: 'JohnDoeSupervisor',
  full_name: 'Sir Test`s boss',
  org_code: 'GB/CD',
})

const mockCancelAvailableReservation = jest.fn().mockResolvedValue([
  {
    id: 2,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: '2022-04-04', available: true },
    bookingStatus: { id: 2, status: BOOKING_AVAILABLE },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockCancelPastReservation = jest.fn().mockResolvedValue([
  {
    id: 1,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: '2022-01-15', available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockSameManagerAndUserIdReservation = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JaneDoe',
    calendar: { id: 21, date: dateBuilderWithoutMiliSec(+4), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
  {
    id: 2,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(+5), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
  {
    id: 3,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 23, date: dateBuilderWithoutMiliSec(+6), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockSameManagerAndUserIdReservationForParkingLot = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JaneDoe',
    calendar: { id: 21, date: dateBuilderWithoutMiliSec(+4), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
  {
    id: 2,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 22, date: dateBuilderWithoutMiliSec(+5), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
  {
    id: 3,
    typeId: PARKING_LOT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: null,
    userId: 'JohnDoe',
    calendar: { id: 23, date: dateBuilderWithoutMiliSec(+6), available: true },
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockSameManagerPreBooking = jest.fn().mockResolvedValue([
  {
    id: 1,
    typeId: SEAT_BOOKING_TYPE_ID,
    externalUserId: null,
    reserverUserId: 'JohnDoeSupervisor',
    userId: null,
    calendar: { id: 21, date: dateBuilderWithoutMiliSec(+5), available: true },
    bookingStatus: { id: 3, status: BOOKING_PREBOOKING },
    seat: { id: 605, code: 70, area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  },
])

const mockMailData = jest.fn().mockResolvedValue([
  {
    floor: 25,
    area: '-',
    seat: 76,
    date: '2022-02-02',
  },
])

const mockOneSeatInArrayOfSeats = jest.fn().mockResolvedValue([
  {
    id: 1,
    code: '1',
    areaId: 1,
    startDate: '2021-10-04',
    endDate: null,
    buildingMindsID: null,
    seatAmenities: [],
    seatHoods: [],
    area: {
      floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24, reservationDays: 14 } },
    },
    typeId: 1,
  },
])

const mockOneParkingLotInArrayOfSeats = jest.fn().mockResolvedValue([
  {
    id: 1,
    code: '1',
    areaId: 1,
    startDate: '2021-10-04',
    endDate: null,
    buildingMindsID: null,
    seatAmenities: [],
    seatHoods: [],
    area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    typeId: 1,
  },
])

const mockTwoSeatInArrayOfSeats = jest.fn().mockResolvedValue([
  {
    id: 1,
    code: '1',
    areaId: 1,
    startDate: '2021-10-04',
    endDate: null,
    buildingMindsID: null,
    seatAmenities: [],
    seatHoods: [],
    area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
  },
  {
    id: 2,
    code: '2',
    areaId: 1,
    startDate: '2021-10-04',
    endDate: null,
    buildingMindsID: null,
    seatAmenities: [],
    seatHoods: [],
    area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
  },
])

const mockCalendarPast = jest.fn().mockResolvedValue([{ id: 1, date: dateBuilderWithoutMiliSec(-5), available: true }])

const mockCalendarToday = jest.fn().mockResolvedValue([{ id: 1, date: dateBuilderWithoutMiliSec(0), available: true }])

const mockCalendarFuture = jest.fn().mockResolvedValue([{ id: 1, date: dateBuilderWithoutMiliSec(5), available: true }])

const mockCalendarFutureAfterLimit = jest
  .fn()
  .mockResolvedValue([{ id: 1, date: dateBuilderWithoutMiliSec(60), available: true }])

const mockCalendarPeriodFuture = jest.fn().mockResolvedValue([
  { id: 1, date: dateBuilderWithoutMiliSec(5), available: true },
  { id: 2, date: dateBuilderWithoutMiliSec(6), available: true },
])

const mockCreateCancelBookEvent = jest.fn().mockResolvedValue([])

const seats = [
  { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
  { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } } },
]

LDAPClient.getUser.mockImplementation(async (username) => {
  return { username, full_name: 'Sir Test' }
})

// #####################################################################################################################

const successfulExpectedBookingSeatForTodayForUser = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { available: true, date: dateBuilderWithoutMiliSec(0), id: 22 },
    externalUserId: null,
    id: 1,
    reserverUserId: null,
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'JohnDoe',
  },
]

const successfulExpectedBookingSeatForTodayOnBehalf = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    externalUserId: null,
    id: 1,
    reserverUserId: 'JohnDoeSupervisor',
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'JohnDoe',
  },
]

const successfulExpectedBookingParkingLotForTodayOnBehalf = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    externalUserId: null,
    id: 1,
    reserverUserId: 'JohnDoeSupervisor',
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 2,
    userId: 'JohnDoe',
  },
]

const successfulExpectedBookingWithPreBookForToday = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    externalUserId: null,
    id: 1,
    reserverUserId: 'user1',
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'JohnDoe',
  },
]

const successfulExpectedBookingWithPreBookForTheFuture = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { available: true, date: dateBuilderWithoutMiliSec(5), id: 22 },
    externalUserId: null,
    id: 1,
    reserverUserId: 'user1',
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'JohnDoe',
  },
]

const successfulExpectedParkingLotBookingWithSeatOwnerForToday = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { date: dateBuilderWithoutMiliSec(0) },
    externalUserId: null,
    id: 1,
    reserverUserId: null,
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 2,
    userId: 'JohnDoe',
  },
]

const successfulExpectedSeatBookingOnBehalf = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { date: dateBuilderWithoutMiliSec(+5) },
    externalUserId: null,
    id: 1,
    reserverUserId: 'fooBar',
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'JohnDoe',
  },
]

const successfulExpectedSeatBookingOnBehalfDummyUser = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { date: dateBuilderWithoutMiliSec(+5) },
    externalUserId: null,
    id: 1,
    reserverUserId: null,
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'DummyUser',
  },
]

const successfulExpectedSeatBooking = [
  {
    bookingStatus: { id: 2, status: BOOKING_BOOKED },
    calendar: { available: true, date: dateBuilderWithoutMiliSec(+5), id: 22 },
    externalUserId: null,
    id: 1,
    reserverUserId: null,
    seat: { area: { floor: { building: { site: { id: 100, name: 'Utopia' } } } }, id: 1 },
    typeId: 1,
    userId: 'JohnDoe',
  },
]

const successfulExpectedSeatPreBookingCancellation = [
  {
    id: 1,
    reserverUserId: null,
    userId: null,
    calendar: { date: dateBuilderWithoutMiliSec(+5) },
    bookingStatus: { status: BOOKING_AVAILABLE },
    seat: {
      id: 1,
      area: { floor: { building: { site: { id: 100, name: 'Utopia' }, reservationCancellationHours: 24 } } },
    },
  },
]

describe('Booking, pre-booking and cancellation for today', () => {
  test('All books are available and the user does not have a reservation on the same day of the books. The booking is for today', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBookedForToday)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedBookingSeatForTodayForUser)
  })
  test('Selected seat for today and it is already booked ', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockCancelBookedReservationForToday)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoe'
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period has already been booked, please refresh the site.'
    )
  })
  test('Selected seat for today and it was pre-booked for my team.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammateForToday)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookFromCorrectPrebookForToday)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedBookingWithPreBookForToday)
  })
  test('Selected parking lot for today which has seat owner (seat owner is the same that books).', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(mockSeatOwner)
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookingParkingLotWithSeatOwnerForToday)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedParkingLotBookingWithSeatOwnerForToday)
  })
  test('Selected parking lot for today which has seat owner (seat owner is the same that books) and it is already booked (parking lots can be owner just by one person).', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementation(mockBookingParkingLotWithSeatOwnerForToday)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoe'
      )
    ).rejects.toThrowError('You already have a booking for you on this period.')
  })
  test('Cancel seat booking for today - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedReservationForToday)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.delete.mockImplementation(jest.fn(() => []))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1], 'JohnDoe')).resolves.toBeNull()
  })
  test('Cancel parking lot booking for today - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedParkingLotReservationForToday)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.delete.mockImplementation(jest.fn(() => []))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1], 'JohnDoe')).resolves.toBeNull()
  })
  test('Cancel seat booking for today and user cancelling is manager - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedReservationForToday)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.delete.mockImplementation(jest.fn(() => []))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1], 'JohnDoeSupervisor')).resolves.toBeNull()
  })
  test('Cancel seat booking for today and user cancelling is manager - validate cancellation hour - error', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedReservationForTodayHours)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.delete.mockImplementation(jest.fn(() => []))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1], 'JohnDoeSupervisor')).resolves.toBeNull()
  })
  test('Cancel parking lot booking for today and user cancelling is manager - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedParkingLotReservationForToday)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.delete.mockImplementation(jest.fn(() => []))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1], 'JohnDoeSupervisor')).resolves.toBeNull()
  })
  test('Book seat for other, done by manager for today - OK', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn().mockResolvedValue([{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBookedForTodayOnBehalf)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoeSupervisor',
        { username: 'JohnDoe', org_code: 'GB/CD' }
      )
    ).resolves.toStrictEqual(successfulExpectedBookingSeatForTodayOnBehalf)
  })
  test('Book parking lot for other, done by manager for today - OK', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    SeatDAO.getAll.mockImplementation(mockOneParkingLotInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn().mockResolvedValue([{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookParkingLotBookedForTodayOnBehalf)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoeSupervisor',
        { username: 'JohnDoe', org_code: 'GB/CD' }
      )
    ).resolves.toStrictEqual(successfulExpectedBookingParkingLotForTodayOnBehalf)
  })
  test('Pre-booking for today with 24 hours pre-booking cancellation limit - Should fail', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      `The pre-reserve must be after ${formatDate(new Date().setHours(new Date().getHours() + 24))}.`
    )
  })
  test('Pre-booking for today - seat already booked', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(mockBooksBooked)
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(0) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      'At least one of the selected seats for the indicated period has already been reserved, is disabled, or booked.'
    )
  })
})
describe('Tests for the future before the limit. User books for himself and is not manager', () => {
  test('All books are available and the user does not have a reservation on the same day of the books', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBooked)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(1) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedSeatBooking)
  })
  test('User already has a book for the same day of the reservation', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    BookingDAO.getAll.mockImplementation(mockBooksReservedByManagerWithABook)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(0), finalDate: dateBuilderWithoutMiliSec(1) },
        'JohnDoe'
      )
    ).rejects.toThrow()
  })
  test('Selected seat already booked for future', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(mockBookSeatBooked)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period has already been booked, please refresh the site.'
    )
  })
  test('Selected seat pre-booked for another team', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(mockBooksReservedByManager)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period is pre-booked for another team, please select another one.'
    )
  })
  test('Selected seat pre-booked for my team. Booking for the future', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammateFuture)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatReserved)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedBookingWithPreBookForTheFuture)
  })
  test('Selected seat for the future which has seat owner (seat owner is the same that books).', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(mockSeatOwner)
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBooked)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedSeatBooking)
  })
  test('Selected seat for the future which has seat owner (seat owner is the same that books) and the seat has a pre-booking.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammateFuture)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(mockSeatOwner)
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatReserved)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedBookingWithPreBookForTheFuture)
  })
  test('Selected seat that is available for the future and the seat belongs to a hood.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammateFuture)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(mockSeatHood)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodes)
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBooked)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).resolves.toStrictEqual(successfulExpectedSeatBooking)
  })
  test('Selected seat that is booked for the future and the seat belongs to a hood.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBooked)
    SeatHoodDAO.getAll.mockImplementation(mockSeatHoodOther)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodesOther)
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period has already been booked, please refresh the site.'
    )
  })
  test('Selected seat that is available for the future and the seat belongs to a hood, but to a different one than the reserver`s.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammateFuture)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(mockSeatHoodOther)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodesOther)
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementationOnce(mockBookSeatBooked)
    BookingDAO.getAll.mockImplementation(jest.fn(() => []))
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError('The selected seat does not belong to your hood.')
  })
})
describe('Tests for the future before the limit. User cancels for himself and is not manager', () => {
  test('Cancel seat booking  - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedReservation)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.update.mockImplementation(mockCancelBookedReservation)
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking(1, 'JohnDoe')).resolves.toBeNull()
  })
  test('Cancel parking lot booking - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelBookedParkingLotReservation)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.update.mockImplementation(mockCancelBookedParkingLotReservation)
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking(1, 'JohnDoe')).resolves.toBeNull()
  })
})
describe('Test for the future before the limit. User (manager) prebooks', () => {
  test('Reserve - OK', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    BookingDAO.getMaxTeamReservationsOnDates.mockImplementation(jest.fn(() => 0))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoeSupervisor'
      )
    ).resolves.toBeUndefined()
  })
  test('Reserve - already booked', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(mockBooksBooked)
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      'At least one of the selected seats for the indicated period has already been reserved, is disabled, or booked.'
    )
  })
  test('Reserve - disabled seat', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(mockBooksBooked)
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      'At least one of the selected seats for the indicated period has already been reserved, is disabled, or booked.'
    )
  })
  test('Reserve - already pre-booked', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammate)
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      'At least one of the selected seats for the indicated period has already been reserved, is disabled, or booked.'
    )
  })
  test('Reserve - Overdue', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarPast)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      `The pre-reserve must be after ${formatDate(new Date().setHours(new Date().getHours() + 24))}.`
    )
  })
  /** * TEST TERMINADO. VA A PODER DESCOMENTARSE CUANDO SE HAGA ARREGLO EN FUNCION reserveBooks SOBRE EL REDUCE***/
  test('Reserve - Max quantity exceded', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockTwoSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSuperSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(emptyArray)
    BookingDAO.getMaxTeamReservationsOnDates.mockImplementation(jest.fn(() => 0))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1, 2], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoeSupervisor'
      )
    ).rejects.toThrowError(
      'Request exceeds maximum allowed seats you can reserve at least for one of the selected dates.'
    )
  })
  test('Reserve - Pre-booking in the same hood that the manager belongs to', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockTwoSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(mockSeatHood)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodes)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    BookingDAO.getMaxTeamReservationsOnDates.mockImplementation(jest.fn(() => 0))
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1, 2], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).resolves.toBeUndefined()
  })
  test('Reserve - Pre-booking in other hood different to the one the manager belongs to', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockTwoSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatHoodDAO.getAll.mockImplementation(mockSeatHoodOther)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodesOther)
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1, 2], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError('The selected seat does not belong to your hood.')
  })
  test('Reserve - Person who pre-books is not manager of the place', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockTwoSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    AuthController.managedSites.mockImplementation(jest.fn(() => []))
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    await expect(
      BookingController.reserveBooks(
        { seatIds: [1, 2], initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError('Sir Test is not the manager of Utopia')
  })
})
describe('Tests for the future before limit. User books for other and is not manager', () => {
  test('Book seat for other - OK', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementation(mockBookSeatBookedOnBehalfByNoManager)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar',
        { username: 'JohnDoe' }
      )
    ).resolves.toStrictEqual(successfulExpectedSeatBookingOnBehalf)
  })
  test('Book seat for other, seat already booked for that date - Should fail', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(mockBookSeatBooked)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar'
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period has already been booked, please refresh the site.'
    )
  })
  test('Book seat for other, seat pre-booked for a different team than mine - Should fail', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarToday)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(mockBooksReservedByManager)
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar',
        { username: 'PeterParker' }
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period is pre-booked for another team, please select another one.'
    )
  })
  test('Book seat for other, seat pre-booked for my team - OK', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(mockBooksReservedByTeammateFuture)
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(jest.fn(() => []))
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementation(mockBookSeatBookedOnBehalfByNoManager)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar',
        { username: 'JohnDoe' }
      )
    ).resolves.toStrictEqual(successfulExpectedSeatBookingOnBehalf)
  })
  test('Book seat for other, seat has seat owner and the owner is the one getting the reservation done - OK', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(mockSeatOwnerDummyUserInSeatOne)
    BookingDAO.bulkCreate.mockImplementation(jest.fn(() => [{ id: 1 }]))
    BookingDAO.getAll.mockImplementation(mockBookSeatBookedOnBehalf)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar',
        { username: 'DummyUser' }
      )
    ).resolves.toStrictEqual(successfulExpectedSeatBookingOnBehalfDummyUser)
  })
  test('Book seat for other, seat has seat owner and the owner is different to the one getting the reservation done - Should fail', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(jest.fn(() => []))
    HoodOrgCodeDAO.getAll.mockImplementation(jest.fn(() => []))
    SeatOwnerDAO.getAll.mockImplementation(mockSeatOwnerNotJhonDoe)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar',
        { username: 'PeterParker' }
      )
    ).rejects.toThrowError('Booking could not be performed since you are not the owner of the seat')
  })
  test('Book seat for other, that does not belong to the hood - Should fail', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(mockSeatHoodOther)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodesOther)
    await expect(
      BookingController.booksForOther(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar',
        { username: 'PeterParker' }
      )
    ).rejects.toThrowError('The selected seat does not belong to your hood.')
  })
  test('Selected seat that is available for the future and the seat belongs to a hood, but to a different one than the reserver`s.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(jest.fn(() => []))
    UserController.getTeammatesUsernames.mockImplementation(jest.fn(() => ['user1', 'user2', 'user3', 'user4']))
    SeatHoodDAO.getAll.mockImplementation(mockSeatHoodOther)
    HoodOrgCodeDAO.getAll.mockImplementation(mockHoodOrgCodesOther)
    SeatOwnerDAO.getAll.mockImplementation(mockSeatOwnerNotJhonDoe)
    BookingDAO.getAll.mockImplementationOnce(mockBooksAvailable)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'fooBar'
      )
    ).rejects.toThrowError('The selected seat does not belong to your hood.')
  })
  test('Selected seat that is booked for the future and the seat belongs to a hood.', async () => {
    CalendarDAO.getAll.mockImplementationOnce(mockCalendarFuture)
    LDAPClient.getUser.mockImplementation(mockJohnDoeSirTestLDAPInfo)
    SeatDAO.getAll.mockImplementation(mockOneSeatInArrayOfSeats)
    BookingDAO.getAll.mockImplementationOnce(jest.fn(() => []))
    BookingDAO.getAll.mockImplementation(mockBookSeatBooked)
    await expect(
      BookingController.booksForUser(
        { seatId: 1, initialDate: dateBuilderWithoutMiliSec(5), finalDate: dateBuilderWithoutMiliSec(5) },
        'JohnDoe'
      )
    ).rejects.toThrowError(
      'The selected seat for the indicated period has already been booked, please refresh the site.'
    )
  })
})
describe('Cancellation done by the manager for the future before the limit.', () => {
  test('Cancel a pre-book with the same manager that the user - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockSameManagerPreBooking)
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUsers.mockImplementation(jest.fn().mockResolvedValue({}))
    BookingDAO.delete.mockImplementation(jest.fn(() => []))
    await expect(BookingController.cancelReservation(1, 'johndoesupervisor')).resolves.toStrictEqual([])
  })
  test('Cancel a book with the same manager that the user - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockSameManagerAndUserIdReservation)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.delete.mockImplementation(mockSameManagerAndUserIdReservation)
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1, 2, 3], 'JohnDoeSupervisor')).resolves.toBeNull()
  })
  test('Cancel a book with someone that is not the actual manager of the user that has the booking done. Should fail', async () => {
    BookingDAO.getAll.mockImplementation(mockSameManagerAndUserIdReservation)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1, 2, 3], 'PeterParker')).rejects.toThrowError(
      'At least one of the selected books could not be cancelled, please check your reservations table.'
    )
  })
  test('Cancel a book of a parking lot with the same manager that the user - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockSameManagerAndUserIdReservationForParkingLot)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1, 2, 3], 'JohnDoeSupervisor')).resolves.toBeNull()
  })
  test('Cancel a pre-book with a manager that is not the user`s - Should fail', async () => {
    BookingDAO.getAll.mockImplementation(mockSameManagerPreBooking)
    AuthController.managedSites.mockImplementation(mockSitesOk)
    LDAPClient.getUsers.mockImplementation(jest.fn().mockResolvedValue({}))
    await expect(BookingController.cancelReservation(1, 'PeterParker')).rejects.toThrowError(
      'The pre-book does not meet the requirements to be canceled.'
    )
  })
})

/** * Other tests that where considered ***/

describe('Validate manager in site', () => {
  test('Validation should fail', async () => {
    AuthController.managedSites.mockImplementation(mockSites)
    await expect(BookingController.validateManagerSite('fooBar', seats)).rejects.toThrow()
  })

  test('Validation OK', async () => {
    AuthController.managedSites.mockImplementation(mockSitesOk)
    await expect(BookingController.validateManagerSite('fooBar', seats)).resolves.not.toThrow()
  })
})

// #####################################################################################################################
describe('Cancel PreReservation', () => {
  test('Pre - reserves OK', async () => {
    BuildingDAO.getAll.mockImplementation(mockBuildings)
    BookingDAO.getAll.mockImplementation(mockBooksReserved)
    await expect(BookingController.cancelPreReservation()).resolves.not.toThrow()
  })
})

// #####################################################################################################################
describe('Cancel Booking', () => {
  test('Cancel book on an available seat', async () => {
    BookingDAO.getAll.mockImplementation(jest.fn(() => []))
    await expect(BookingController.cancelBooking([2], 'JohnDoe')).resolves.toBeNull()
  })
  test('Cancel book - Past date', async () => {
    BookingDAO.getAll.mockImplementation(mockCancelPastReservation)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoeSupervisor'))
    BookingDAO.update.mockImplementation(mockCancelPastReservation)
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([1], 'JohnDoe')).rejects.toThrow()
  })
  test('Cancel a book with the same manager that the user - OK', async () => {
    BookingDAO.getAll.mockImplementation(mockSameManagerAndUserIdReservation)
    UserController.getSupervisor.mockImplementation(jest.fn(() => 'JohnDoe'))
    BookingDAO.update.mockImplementation(mockSameManagerAndUserIdReservation)
    EventController.cancelBook.mockImplementation(mockCreateCancelBookEvent)
    MailController.cancelBooking.mockImplementation(mockMailData)
    await expect(BookingController.cancelBooking([2, 3], 'JohnDoe')).resolves.toBeNull()
  })
  // test('Cancel a book - That is a pre-book', async () => {
  //   BookingDAO.getAll.mockImplementation(mockBooksReservedByTeammateFuture)
  //   await expect(BookingController.cancelBooking([1], 'PeterParker')).rejects.toThrowError(
  //     'At least one of the books is a pre-book.'
  //   )
  // })
})
