const BookingController = require('../../controllers/BookingController')
const UserParkingAccessController = require('../../controllers/UserParkingAccessController')
const EventController = require('../../controllers/EventController')
const QuickBookingController = require('../../controllers/QuickBookingController')
const moment = require('moment')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')
const res = require("express/lib/response");

/**
 * @swagger
 * tags:
 * - name: Booking Controller
 *   description: Manage Bookings repository.
 * components:
 *   securitySchemes:
 *     basfAuth:
 *       type: http
 *       scheme: bearer
 *     token:
 *       type: http
 *       scheme: bearer
 *   responses:
 *     NoTokenError:
 *       description: Authorization token is missing or invalid (must be prefixed with Bearer).
 *     NoPermissionsError:
 *       description: No permissions to perform this task.
 */
const router = Router()

module.exports = router

/**
 * @swagger
 * /api/bookings/:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get a list of bookings"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Bookings
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.get('/', async function (req, res, next) {
  try {
    req.query.areaId = parseInt(req.query.areaId)
    const all = await BookingController.getAll(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get the booking by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the booking to get
 *    responses:
 *      '200':
 *        description: The booking queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Booking"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await BookingController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Adds a new booking"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Booking"
 *          example:
 *            number: 0
 *            map: "vector"
 *            buildingId: 12
 *            enabledId: 1
 *    responses:
 *      '200':
 *        description: The Booking created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Booking"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await BookingController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *    tags:
 *      - Booking Controller
 *    summary: "Delete the booking by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the booking to delete
 *    responses:
 *      '200':
 *        description: The booking is available to be booked again
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Booking"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await BookingController.cancelBooking([req.params.id], req.username)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/cancellations:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Deletes all the bookings by `id`s present in the array"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              bookIds:
 *                type: array
 *                items:
 *                  type: integer
 *                example:  [1, 3, 7, 9]
 *    responses:
 *      '200':
 *        description: The bookings are available to be booked again
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */

router.post('/cancellations', async function (req, res, next) {
  try {
    const bookIds = req.body.bookIds
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      throw new Errors.BadRequestError('bookIds is missing: At least 1 bookId is required.')
    }
    await BookingController.cancelBooking(bookIds, req.username)
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/cancellations-admin:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Deletes all the bookings by `id`s present in the array trigged by an Admin"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              bookIds:
 *                type: array
 *                items:
 *                  type: integer
 *                example:  [1, 3, 7, 9]
 *    responses:
 *      '200':
 *        description: The bookings are available to be booked again
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */

router.post('/cancellations-admin', async function (req, res, next) {
  try {
    const bookIds = req.body.bookIds
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      throw new Errors.BadRequestError('bookIds is missing: At least 1 bookId is required.')
    }
    await BookingController.cancelBooking(bookIds, 'Admin', { bookingStatus: 'Booked' })
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/cancellations-parkings-admin:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Deletes all the bookings by `id`s present in the array"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              bookIds:
 *                type: array
 *                items:
 *                  type: integer
 *                example:  [1, 3, 7, 9]
 *    responses:
 *      '200':
 *        description: The bookings are available to be booked again
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */

router.post('/cancellations-parkings-admin', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    const bookIds = req.body.bookIds
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      throw new Errors.BadRequestError('bookIds is missing: At least 1 bookId is required.')
    }
    await BookingController.cancelBooking(bookIds, 'Admin')
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/user:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get a list of bookings reserved by the authenticated user"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Bookings where the user is the reserver
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.get('/user', async function (req, res, next) {
  try {
    const all = await BookingController.getUserBooks(req.username)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/area-on-dates:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get seats by `areaId` between 2 dates"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: query
 *        name: areaId
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: AreaId of the seats
 *      - in: query
 *        name: initialDate
 *        schema:
 *          type: string
 *          format: date
 *          example: "2021-01-01"
 *        required: true
 *        description: Initial date for the period
 *      - in: query
 *        name: finalDate
 *        schema:
 *          type: string
 *          format: date
 *          example: "2021-12-31"
 *        required: true
 *        description: Final date for the period
 *    responses:
 *      '200':
 *        description: The booking is available to be booked again
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Booking"
 */
router.get('/area-on-dates', async function (req, res, next) {
  const dateFormat = 'YYYY-MM-DD'
  const dateValidator = (toValidate) => moment(toValidate, dateFormat, true).isValid()
  try {
    const initialDate = req.query.initialDate
    const finalDate = req.query.finalDate

    if (!initialDate || !finalDate) {
      throw new Errors.BadRequestError('Date param is missing: initialDate and finalDate are required.')
    }

    if (!dateValidator(initialDate) || !dateValidator(finalDate)) {
      throw new Errors.BadRequestError(`Invalid date format. Expected format: ${dateFormat}.`)
    }

    if (initialDate > finalDate) {
      throw new Errors.BadRequestError('Invalid date range.')
    }

    const elem = await BookingController.getSeatsOnArea(req.query.areaId, initialDate, finalDate, req.username)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/book:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Books the booking by `id` changing the status to booked and the username to userId"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: integer
 *            example:  [1, 3, 7, 9]
 *    responses:
 *      '200':
 *        description: The bookings updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.post('/book', async function (req, res, _next) {
  try {
    let response = null
    /** * When the body inside payload param does not arrive as array, means there's either seat or parking booking(s) to be made ***/
    if (!req.body.parking) {
      if (req.body.onBehalfOf) {
        response = await BookingController.bookForOtherSeat(
          req.body.bookings[0],
          req.username,
          req.body.onBehalfOfUserID
        )
      } else {
        response = await BookingController.bookForUserSeatOrParking(req.body.bookings[0], req.username)
      }
      /** * When the body inside payload param arrives as array, this means there's coming both seat and parking bookings to be made ***/
    } else if (req.body.parking && (req.body.bookings.length > 1 || req.body.onlyParking === true)) {
      const userInfo = req.body.onBehalfOf
        ? await UserParkingAccessController.getUserInfo(req.body.onBehalfOfUserID.username, req.body.buildingId)
        : await UserParkingAccessController.getUserInfo(req.username, req.body.buildingId)
      if (userInfo.userRegisteredForParkingAccess) {
        if (req.body.onBehalfOf) {
          response = await BookingController.bookForOtherSeatAndParking(
            req.body.bookings,
            req.username,
            req.body.onBehalfOfUserID
          )
        } else {
          response = await BookingController.bookForUserSeatAndParking(req.body.bookings, req.username)
        }
      } else {
        throw new Errors.BadRequestError('Must have parking access.')
      }
    } else {
      throw new Errors.BadRequestError('Information is missing: At least 1 book is required.')
    }
    console.log(
      'from: ' +
        req.body.bookings[0].initialDate +
        ', to: ' +
        req.body.bookings[0].finalDate +
        ', username: ' +
        req.username +
        ', buildingId: ' +
        req.body.buildingId
    )
    res.json(response)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/user/reservations:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get a list of bookings reserved by the user"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Bookings where the user is the reserver
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.get('/user/reservations', async function (req, res, next) {
  try {
    if (!req.isManager) {
      throw new Errors.ForbiddenError('User must have manager role to perform this operation.')
    }
    const all = await BookingController.getUserReservations(req.username)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/user/parking-bookings-admin:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get a list of bookings reserved by the admin"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Bookings with status 2 and user null
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.get('/user/parking-bookings-admin', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    const all = await BookingController.getAll({
      seatStatus: 'Booked',
      reserverUserIdNull: true,
      userIdNull: true,
      typeId: 2,
      future: true,
      siteId: req.query.siteId,
    })
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/user/max-reservations-on-dates:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get the maximum amount of seats that can be pre-booked by the user in any given period"
 *    description: Only available to __managers__ and will return a `403` when used by regular users
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Max allowed number of reservations for each day in the given period
 *        content:
 *          application/json:
 *            schema:
 *              type: integer
 *              example: 2
 */
router.get('/user/max-reservations-on-dates', async function (req, res, next) {
  try {
    if (!req.isManager) {
      throw new Errors.ForbiddenError('User must have manager role to perform this operation.')
    }
    const dateFormat = 'YYYY-MM-DD'
    const dateValidator = (toValidate) => moment(toValidate, dateFormat, true).isValid()
    const initialDate = req.query.initialDate
    const finalDate = req.query.finalDate
    if (!initialDate || !finalDate) {
      throw new Errors.BadRequestError('Date param is missing: initialDate and finalDate are required.')
    }
    if (!dateValidator(initialDate) || !dateValidator(finalDate)) {
      throw new Errors.BadRequestError(`Invalid date format. Expected format: ${dateFormat}.`)
    }
    if (initialDate > finalDate) {
      throw new Errors.BadRequestError('Invalid date range.')
    }
    const maxValue = await BookingController.getMaxAllowedReservations(req.username, initialDate, finalDate)
    res.send(maxValue.toString())
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/reserve:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Reserves the array of bookings changing the status to reserved and the reserverUserId to userId"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: integer
 *            example:  [1, 3, 7, 9]
 *    responses:
 *      '200':
 *        description: The bookings were updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.post('/reserve', async function (req, res, next) {
  try {
    if (!req.isManager) {
      throw new Errors.ForbiddenError('User must have manager role to perform this operation.')
    }
    if (!(req.body && req.body.initialDate && req.body.finalDate && req.body.seatIds && req.body.seatIds.length)) {
      throw new Errors.BadRequestError('Some of the required parameters are missing.')
    }
    const booksUpdated = await BookingController.reserveBooks(req.body, req.username)
    res.json(booksUpdated)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.post('/quickbook', async function (req, res, next) {
  try {
    if (!(req.body && req.body.initialDate && req.body.finalDate && req.body.siteId && req.body.buildingId)) {
      throw new Errors.BadRequestError('Some of the required parameters are missing.')
    }

    await QuickBookingController.quickBooksForUser(req.body, req.username)
    res.json({ isSuccess: true })
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.get('/quickbook/user', async function (req, res, next) {
  try {
    const all = await QuickBookingController.getUserBooks(req.username)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.post('/quickbook/cancellations', async function (req, res, next) {
  try {
    const qbIds = req.body.quickBookIds
    if (!Array.isArray(qbIds) || qbIds.length === 0) {
      throw new Errors.BadRequestError('Quick bookIds is missing: At least 1 bookId is required.')
    }
    await QuickBookingController.cancelQuickBooking(qbIds, req.username)
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/book-parkings-admin:
 *   post:
 *    tags:
 *      - Booking Controller
 *    summary: "Reserves the array of bookings changing the status to reserved and the reserverUserId to userId"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: integer
 *            example:  [1, 3, 7, 9]
 *    responses:
 *      '200':
 *        description: The bookings were updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.post('/book-parkings-admin', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }

    const data = req.body.parkingsToCreate
    if (!Array.isArray(data) || data.length === 0) {
      throw new Errors.BadRequestError('Booking data is missing.')
    }
    const booksUpdated = await BookingController.bookParkingsAdmin(data)

    res.json(booksUpdated)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/reservation/{id}:
 *   delete:
 *    tags:
 *      - Booking Controller
 *    summary: "Delete the reservation for booking by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the booking to delete reservation
 *    responses:
 *      '200':
 *        description: The booking is available to be booked or reserved again
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Booking"
 */
router.delete('/:id/reservation', async function (req, res, next) {
  try {
    if (!req.isManager) {
      throw new Errors.ForbiddenError('User must have manager role to perform this operation.')
    }
    const book = await BookingController.cancelReservation(req.params.id, req.username)

    res.json(book)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/team:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Get a list of bookings reserved by the user's team"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Bookings where the reserver are in the same team as the user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.get('/team', async function (req, res, next) {
  try {
    const all = await BookingController.getTeamBooks(req.username)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/init:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Initialize the bookings for the available days"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Init Bookings
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */
router.get('/init', async function (req, res, next) {
  try {
    await BookingController.populateCalendars()
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bookings/fillOrgCodes:
 *   get:
 *    tags:
 *      - Booking Controller
 *    summary: "Populates users org codes in bookings table and calls EventController to populate org codes for users in events table as well"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: Message indicating that the org codes attributes could be populated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Bookings"
 */

router.get('/fillOrgCodes', async function (req, res, next) {
  try {
    BookingController.populateOrgCodes()
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

// ENDPOINTS GENERATED FOR TESTING PURPOSES

router.get('/anonymizeBookings', async function (req, res, next) {
  try {
    BookingController.anonymizeUsersData()
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.get('/anonymizeEvents', async function (req, res, next) {
  try {
    EventController.anonymizeUsersData()
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
