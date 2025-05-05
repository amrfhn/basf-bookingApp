const ReportController = require('../../controllers/ReportController')
const MailController = require('../../controllers/MailController')

const moment = require('moment')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Report Controller
 *   description: Manage Reports.
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
 * /api/reports/lack-of-seat:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Get a list of users that couldn't go to the office"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Out of office report
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
// Fixme - response Schema in Swagger
router.get('/lack-of-seat', async function (req, res, next) {
  try {
    const report = await ReportController.lackOfSeatList(
      req.username,
      req.query.mode,
      req.query.site,
      req.query.initialDate,
      req.query.finalDate
    )
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/cancellation-report:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Manager: Get a list of cancelled books of the team mates"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Team Cancellation Report
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
// Fixme - response Schema in Swagger
router.get('/cancellation-report', async function (req, res, next) {
  try {
    const report = await ReportController.cancellationReport(
      req.username,
      req.query.mode,
      req.query.building,
      req.query.initialDate,
      req.query.finalDate
    )
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/first-aiders-report:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Manager: Get a list of the brigadiers that booked"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: First Aiders Report
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
// Fixme - response Schema in Swagger
router.get('/first-aiders-report', async function (req, res, next) {
  try {
    const report = await ReportController.firstAidersReport(
      req.username,
      req.query.site,
      req.query.initialDate,
      req.query.finalDate
    )
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/work-stream-dashboard:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Manager: Get the occupation by workStream between two dates listed by dates"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Get the occupation by workStream between two dates listed by dates
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
// Fixme - response Schema in Swagger
router.get('/work-stream-dashboard-report', async function (req, res, next) {
  const dateFormat = 'YYYY-MM-DD'
  const dateValidator = (toValidate) => moment(toValidate, dateFormat, true).isValid()
  try {
    const initialDate = req.query.initialDate
    const finalDate = req.query.finalDate
    const siteId = req.query.siteId

    if (!req.isManager && !req.isAdmin) {
      throw new Errors.ForbiddenError('User must have either manager or admin role to perform this operation.')
    }

    if (!initialDate || !finalDate) {
      throw new Errors.BadRequestError('Date param is missing: initialDate and finalDate are required.')
    }

    if (!dateValidator(initialDate) || !dateValidator(finalDate)) {
      throw new Errors.BadRequestError(`Invalid date format. Expected format: ${dateFormat}.`)
    }

    if (initialDate > finalDate) {
      throw new Errors.BadRequestError('Invalid date range.')
    }

    if (siteId === parseInt(siteId, 10)) {
      throw new Errors.BadRequestError('Invalid site.')
    }

    const report = await ReportController.workStreamDashboard(req.username, siteId, initialDate, finalDate)
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/my-bookings:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Given a certain period, return all my bookings for those days"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: History of my bookings
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
router.get('/my-bookings', async function (req, res, next) {
  try {
    const report = await ReportController.myBookingHistory(
      req.username,
      req.query.teammates,
      req.query.initialDate,
      req.query.finalDate,
      false
    )
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/team-bookings-history:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Given a certain period, return all the team history bookings and my bookings history"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: History of my bookings and my team bookings
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
router.get('/team-bookings-history', async function (req, res, next) {
  try {
    const report = await ReportController.myBookingHistory(
      req.username,
      req.query.teammates,
      req.query.initialDate,
      req.query.finalDate,
      false
    )
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/admin-bookings-history:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Given a certain period, return all bookings for those days by building"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: History of bookings by building
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
router.get('/admin-bookings-history', async function (req, res, next) {
  try {
    const report = await ReportController.myBookingHistory(
      req.username,
      req.query.teammates,
      req.query.initialDate,
      req.query.finalDate,
      true,
      req.query.buildingId,
      req.query.isParkingOnly
    )
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/work-stream-dashboard:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Manager: Get the occupation by workStream between two dates listed by dates"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Get the occupation by workStream between two dates listed by dates
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
// Fixme - response Schema in Swagger
router.get('/landing-zones-occupation-report', async function (req, res, next) {
  const dateFormat = 'YYYY-MM-DD'
  const dateValidator = (toValidate) => moment(toValidate, dateFormat, true).isValid()
  try {
    const initialDate = req.query.initialDate
    const finalDate = req.query.finalDate
    const siteId = req.query.siteId

    if (!req.isManager && !req.isAdmin) {
      throw new Errors.ForbiddenError('User must have either manager or admin role to perform this operation.')
    }

    if (!initialDate || !finalDate) {
      throw new Errors.BadRequestError('Date param is missing: initialDate and finalDate are required.')
    }

    if (!dateValidator(initialDate) || !dateValidator(finalDate)) {
      throw new Errors.BadRequestError(`Invalid date format. Expected format: ${dateFormat}.`)
    }

    if (initialDate > finalDate) {
      throw new Errors.BadRequestError('Invalid date range.')
    }

    if (siteId === parseInt(siteId, 10)) {
      throw new Errors.BadRequestError('Invalid site.')
    }

    const report = await ReportController.landingZonesOccupation(req.username, siteId, initialDate, finalDate)
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/occupation:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Manager: Get the occupation by each floor for a specific building between two dates listed by dates"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: An object with the floors and its information
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Reports"
 */
router.get('/occupation', async function (req, res, next) {
  const dateFormat = 'YYYY-MM-DD'
  const dateValidator = (toValidate) => moment(toValidate, dateFormat, true).isValid()
  try {
    const initialDate = req.query.initialDate
    const finalDate = req.query.finalDate
    const buildingId = req.query.buildingId
    if (!req.isManager && !req.isAdmin) {
      throw new Errors.ForbiddenError('User must have either manager or admin role to perform this operation.')
    }

    if (!initialDate || !finalDate) {
      throw new Errors.BadRequestError('Date param is missing: initialDate and finalDate are required.')
    }

    if (!dateValidator(initialDate) || !dateValidator(finalDate)) {
      throw new Errors.BadRequestError(`Invalid date format. Expected format: ${dateFormat}.`)
    }

    if (initialDate > finalDate) {
      throw new Errors.BadRequestError('Invalid date range.')
    }

    if (buildingId === parseInt(buildingId, 10) || !buildingId) {
      throw new Errors.BadRequestError('Invalid site.')
    }

    const report = await ReportController.buildingOccupation(buildingId, initialDate, finalDate)
    res.json(report)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/out-of-seat:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all Out of seat report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all Out of seat report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/out-of-seat', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeOutOfSeatReport(
      req.username,
      req.query.mode,
      req.query.site,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/cancellation:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all Cancellation report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all Cancellation report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/cancellation', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeCancellationReport(
      req.username,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/booking-history:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all Booking History report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all Booking History report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/booking-history', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeBookingHistoryReport(
      req.username,
      req.query.teammates,
      req.query.initialDate,
      req.query.finalDate,
      req.query.buildingId,
      req.query.isParkingOnly
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/workstream-dashboard:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all WorkStream dashboard report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all WorkStream dashboard report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/workstream-dashboard', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeWorkStreamDashboard(
      req.username,
      req.query.siteId,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/landingzones-occupation:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all LandingZones Occupation report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all LandingZones Occupation report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/landingzones-occupation', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeLandingZonesOccupation(
      req.username,
      req.query.siteId,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/first-aiders:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all First aiders report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all First aiders report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/first-aiders', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeFirstAidersReport(
      req.username,
      req.query.siteId,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/seat-booking-report-day:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all Seat Booking for a specific day report data"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '202':
 *        description: List of all Seat Booking for a specific day report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/seat-booking-report-day', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeSeatBookingHistoryDay(
      req.username,
      req.query.buildingId,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/reports/make/seat-booking-report-period:
 *   get:
 *    tags:
 *      - Report Controller
 *    summary: "Downloads an excel file with all Seat Booking for a period of days report data"
 *    responses:
 *      '202':
 *        description: List of all Seat Booking for a period of days report data
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/make/seat-booking-report-period', async function (req, res, next) {
  try {
    res.status(202).send('Processing request. An email will be sent to you with the download URL once it is completed.')
    const reportUrl = await ReportController.makeSeatBookingHistoryPeriod(
      req.username,
      req.query.buildingId,
      req.query.initialDate,
      req.query.finalDate
    )
    MailController.sendUrlReport(req.username, reportUrl).then()
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
