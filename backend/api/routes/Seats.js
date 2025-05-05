const SeatController = require('../../controllers/SeatController')
const SeatPreferableController = require('../../controllers/SeatPreferableController')
const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Seat Controller
 *   description: Manage Seats repository.
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
 * /api/seats/:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get a list of Seats"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Seats
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await SeatController.getAll(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/{id}:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get the Seat by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the Seat to get
 *    responses:
 *      '200':
 *        description: The Seat queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seat"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await SeatController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/:
 *   post:
 *    tags:
 *      - Seat Controller
 *    summary: "Adds a new Seat"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Seat"
 *          example:
 *            startDate: 0
 *            endDate: "vector"
 *            code: 12
 *            areaId: 1
 *    responses:
 *      '200':
 *        description: The Seat created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seat"
 */
router.post('/', async function (req, res, next) {
  try {
    if (!req.body.seat.areaId || !req.body.seat.code) {
      throw new Errors.BadRequestError('Parameters missing, area and/or code can not be empty.')
    }
    const elem = await SeatController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/{id}:
 *   put:
 *    tags:
 *      - Seat Controller
 *    summary: "Update the Seat by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the Seat to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Seat"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The Seat updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seat"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await SeatController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/{id}:
 *   delete:
 *    tags:
 *      - Seat Controller
 *    summary: "Delete the Seat by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the Seat to delete
 *    responses:
 *      '200':
 *        description: The Seat deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seat"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    const elem = await SeatController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/config:
 *   post:
 *    tags:
 *      - Seat Controller
 *    summary: "Updates all the Seats in the array"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Seats"
 *    responses:
 *      '200':
 *        description: Update Seats
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.post('/config', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    if (!Array.isArray(req.body.seatsToUpdate) || req.body.seatsToUpdate.length === 0) {
      throw new Errors.BadRequestError('Seats are missing: At least 1 Seat is required.')
    }
    if (req.body.flag) {
      SeatController.updateDisableSeats(req.body.seatsToUpdate)
    } else {
      SeatController.updateSeats(req.body.seatsToUpdate)
    }
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/hoods:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get the hoods of a list of seats"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: query
 *      name: seatId
 *      schema:
 *        type: array
 *        items:
 *          type: number
 *    responses:
 *      '200':
 *        description: Get Seats with Hoods
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.get('/hoods', async function (req, res, next) {
  try {
    const seatsIds = req.query.seatId

    if (!Array.isArray(seatsIds) || seatsIds.length === 0) {
      throw new Errors.BadRequestError('Seats are missing: At least 1 Seat is required.')
    }
    const seatHoods = await SeatController.getSeatsHoods(seatsIds)
    res.json(seatHoods)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/hoods:
 *   patch:
 *    tags:
 *      - Seat Controller
 *    summary: "Updates relation Seat - Hood in the array"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/SeatHoods"
 *    responses:
 *      '200':
 *        description: Update SeatHoods
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/SeatHoods"
 */
router.put('/hoods/update-seat-hood', async function (req, res, next) {
  try {
    const seats = req.body.data

    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      throw new Errors.BadRequestError('Seats are missing: At least 1 Seat is required.')
    }

    await SeatController.updateSeatHoods(seats)
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/get-quantity-by-hood/:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get the quantity of seats by hood"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Quantity of Seats
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.get('/get-quantity-by-hood/', async function (req, res, next) {
  try {
    const all = await SeatController.getSeatQuantityByHood(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/get-seats-without-seatowners/:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get seats (of any type) with no seatowners associated"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: All seats without seatowners associated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.get('/get-seats-without-seatowners/', async function (req, res, next) {
  try {
    if (!req.query.floorId) {
      throw new Errors.BadRequestError('Floor is missing: The floor is a required parameter.')
    }
    const all = await SeatController.getParkingLotsWithoutSeatOwner(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/get-seats-with-seatowners/:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get seats (of any type) with seatowners or seatpreferables"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: All seats with seatowners or seatpreferables
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.get('/get-seats-with-seatowners/', async function (req, res, next) {
  try {
    const all = await SeatController.getParkingLotsOwners(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seats/get-parkings-by-building/:
 *   get:
 *    tags:
 *      - Seat Controller
 *    summary: "Get seats (type parking) with seatowners & seatpreferables"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: All parkings with seatowners & seatpreferables
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seats"
 */
router.get('/get-parkings-by-building/', async function (req, res, next) {
  try {
    const all = await SeatController.getParkingsByBuilding(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
