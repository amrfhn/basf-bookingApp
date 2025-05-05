const AreaController = require('../../controllers/AreaController')
const SeatController = require('../../controllers/SeatController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Area Controller
 *   description: Manage Areas repository.
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
 * /api/areas/:
 *   get:
 *    tags:
 *      - Area Controller
 *    summary: "Get a list of areas"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Areas
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Areas"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await AreaController.getAll(req.query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *    tags:
 *      - Area Controller
 *    summary: "Get the area by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the area to get
 *    responses:
 *      '200':
 *        description: The area queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Area"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await AreaController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/:
 *   post:
 *    tags:
 *      - Area Controller
 *    summary: "Adds a new area"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Area"
 *          example:
 *            number: 0
 *            map: "vector"
 *            buildingId: 12
 *            enabledId: 1
 *    responses:
 *      '200':
 *        description: The Area created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Area"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await AreaController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/{id}:
 *   put:
 *    tags:
 *      - Area Controller
 *    summary: "Update the area by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the area to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Area"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The area updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Area"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await AreaController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/{id}:
 *   delete:
 *    tags:
 *      - Area Controller
 *    summary: "Delete the area by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the area to delete
 *    responses:
 *      '200':
 *        description: The area deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Area"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await AreaController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/{id}/map:
 *   get:
 *    tags:
 *      - Area Controller
 *    summary: "Get map of the area by area `id`"
 *    produces:
 *    - "image/svg+xml"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the area to get
 *    responses:
 *      '200':
 *        description: The area queried
 *        content:
 *          image/svg+xml:
 *            schema:
 *              type: string
 */
router.get('/:id(\\d+)/map', async function (req, res, next) {
  try {
    const map = await AreaController.getMap(req.params.id)
    res.send(map)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/{id}/seats:
 *   get:
 *    tags:
 *      - Area Controller
 *    summary: "Get a list of seats for the area"
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
router.get('/:id/seats', async function (req, res, next) {
  try {
    const query = { ...req.query, areaId: req.params.id }
    const all = await SeatController.getAll(query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/areas/{id}/seat/{code}:
 *   get:
 *    tags:
 *      - Area Controller
 *    summary: "Get a seat by code in the area"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: The Seat queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Seat"
 */
router.get('/:id/seat/:code', async function (req, res, next) {
  try {
    const query = { ...req.query, areaId: req.params.id, code: req.params.code, disabled: 'true' }

    const all = await SeatController.getAll(query)
    switch (all.length) {
      case 0:
        throw new Errors.ForbiddenError('Seat not found.')
      case 1:
        res.json(all[0])
        break
      default:
        throw new Errors.ConflictError(`To many results in area ${query.areaId} with code ${query.code}.`)
    }
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
