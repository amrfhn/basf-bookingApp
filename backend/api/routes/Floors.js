const FloorController = require('../../controllers/FloorController')
const AreaController = require('../../controllers/AreaController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Floor Controller
 *   description: Manage Floors repository.
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
 * /api/floors/:
 *   get:
 *    tags:
 *      - Floor Controller
 *    summary: "Get a list of floors"
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
router.get('/', async function (req, res, next) {
  try {
    const all = await FloorController.getAll(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/{id}:
 *   get:
 *    tags:
 *      - Floor Controller
 *    summary: "Get the floor by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the floor to get
 *    responses:
 *      '200':
 *        description: The floor queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floor"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await FloorController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/:
 *   post:
 *    tags:
 *      - Floor Controller
 *    summary: "Adds a new floor"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Floor"
 *    responses:
 *      '200':
 *        description: The Floor created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floor"
 */
router.post('/', async function (req, res, next) {
  try {
    if (!req.body.building.id || !req.body.number) {
      throw new Errors.BadRequestError('Parameters missing, building and/or floor can not be empty.')
    }
    let elem
    if (req.body.parkingLots) {
      elem = await FloorController.createParking(req.body)
    } else {
      elem = await FloorController.create(req.body)
    }
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/{id}:
 *   put:
 *    tags:
 *      - Floor Controller
 *    summary: "Update the floor by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the floor to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Floor"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The floor updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floor"
 */
router.put('/:id', async function (req, res, next) {
  try {
    let elem
    if (req.body.parkingLots) {
      elem = await FloorController.updateParking(req.params.id, req.body)
    } else elem = await FloorController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/{id}:
 *   delete:
 *    tags:
 *      - Floor Controller
 *    summary: "Delete the floor by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the floor to delete
 *    responses:
 *      '200':
 *        description: The floor deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floor"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await FloorController.deleteParking(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/{id}/map:
 *   get:
 *    tags:
 *      - Floor Controller
 *    summary: "Get map of the floor by floor `id`"
 *    produces:
 *    - "image/svg+xml"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the floor to get
 *    responses:
 *      '200':
 *        description: The floor queried
 *        content:
 *          image/svg+xml:
 *            schema:
 *              type: string
 */
router.get('/:id(\\d+)/map', async function (req, res, next) {
  try {
    const map = await FloorController.getMap(req.params.id)
    res.send(map)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/{id}/areas:
 *   get:
 *    tags:
 *      - Floor Controller
 *      - Area Controller
 *    summary: "Get a list of areas for the floor"
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
router.get('/:id/areas', async function (req, res, next) {
  try {
    const query = { ...req.query, floorId: req.params.id }
    const all = await AreaController.getAll(query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/floors/{id}/area/{code}:
 *   get:
 *    tags:
 *      - Floor Controller
 *      - Area Controller
 *    summary: "Get an area by code in the floor"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: The Area queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Area"
 */
router.get('/:id/area/:code', async function (req, res, next) {
  try {
    const query = { ...req.query, floorId: req.params.id, code: req.params.code }
    const all = await AreaController.getAll(query)
    switch (all.length) {
      case 0:
        throw new Errors.NotFoundError('Area not found.')
      case 1:
        res.json(all[0])
        break
      default:
        throw new Errors.ConflictError(`Too many results in floor ${query.floorId} with code ${query.code}.`)
    }
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
/**
 * @swagger
 * /api/floors/:
 *   get:
 *    tags:
 *      - Floor Controller
 *    summary: "Get a list of parking floors"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Parking Floors
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Floors"
 */
router.get('/parking', async function (req, res, next) {
  try {
    const all = await FloorController.getParking(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
