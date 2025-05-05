const BuildingController = require('../../controllers/BuildingController')
const FloorController = require('../../controllers/FloorController')
const BookingController = require('../../controllers/BookingController')
const moment = require('moment')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Building Controller
 *   description: Manage Buildings repository.
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
 * /api/buildings/:
 *   get:
 *    tags:
 *      - Building Controller
 *    summary: "Get a list of buildings"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Buildings
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Buildings"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await BuildingController.getAll(req.query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/{id}:
 *   get:
 *    tags:
 *      - Building Controller
 *    summary: "Get the building by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the building to get
 *    responses:
 *      '200':
 *        description: The building queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Building"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await BuildingController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/:
 *   post:
 *    tags:
 *      - Building Controller
 *    summary: "Adds a new building"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Building"
 *          example:
 *            number: 0
 *            map: "vector"
 *            buildingId: 12
 *            enabledId: 1
 *    responses:
 *      '200':
 *        description: The Building created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Building"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await BuildingController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/{id}:
 *   put:
 *    tags:
 *      - Building Controller
 *    summary: "Update the building by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the building to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Building"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The building updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Building"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await BuildingController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/{id}:
 *   delete:
 *    tags:
 *      - Building Controller
 *    summary: "Delete the building by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the building to delete
 *    responses:
 *      '200':
 *        description: The building deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Building"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await BuildingController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/{id}/floors:
 *   get:
 *    tags:
 *      - Building Controller
 *      - Floor Controller
 *    summary: "Get a list of floors for the building"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Floors
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floors"
 */
router.get('/:id/floors', async function (req, res, next) {
  try {
    const query = { ...req.query, buildingId: req.params.id }
    const all = await FloorController.getAll(query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/{id}/floor/{number}:
 *   get:
 *    tags:
 *      - Building Controller
 *      - Floor Controller
 *    summary: "Get a floor by number in the building"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: The floor queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floor"
 */
router.get('/:id/floor/:number', async function (req, res, next) {
  try {
    const query = { ...req.query, buildingId: req.params.id, number: req.params.number }

    const all = await FloorController.getAll(query)
    switch (all.length) {
      case 0:
        throw new Errors.NotFoundError('Floor not found.')
      case 1:
        res.json(all[0])
        break
      default:
        throw new Errors.ConflictError(`To many results in building ${query.buildingId} with number ${query.number}.`)
    }
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/user/latest:
 *   get:
 *    tags:
 *      - Building Controller
 *    summary: "Get the latest building for which the user made a booking"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Building
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Building"
 */
router.get('/user/latest', async function (req, res, next) {
  try {
    const book = await BookingController.getUserLatestBooking(req.username)
    res.json(book.seat.area.floor.building)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/buildings/{id}/floorsSeats:
 *   get:
 *    tags:
 *      - Building Controller
 *      - Floor Controller
 *    summary: "Get an array of floors with the amount of seats available for the building selected, per date in the indicated date range"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Array of object with floor id, floor number, date and quantity.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/SeatsPerFloors"
 * components:
 *   schemas:
 *     SeatsPerFloor:
 *       properties:
 *         floorId:
 *           type: integer
 *         floorNumber:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         quantity:
 *           type: integer
 *       example:
 *         floorId: 5
 *         floorNumber: 5
 *         date: '2021-01-01'
 *         quantity: 5
 *     SeatsPerFloors:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatsPerFloor"
 */
router.get('/:id(\\d+)/floorsSeats/', async function (req, res, next) {
  try {
    const daysQuantity = req.query.days
    if (!daysQuantity || daysQuantity <= 0) {
      throw new Errors.BadRequestError(`The amount of days can't be empty or lower than 1`)
    }
    const initialDate = moment().format()
    const finalDate = moment()
      .add(daysQuantity - 1, 'days')
      .format()
    const query = { initialDate: initialDate, finalDate: finalDate, id: req.params.id }
    const all = await BuildingController.getQSeatsPerFloor(query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
