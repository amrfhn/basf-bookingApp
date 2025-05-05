const workStreamController = require('../../controllers/WorkStreamController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: workStream Controller
 *   description: Manage workStream repository.
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
 * /api/workStream/:
 *   get:
 *    tags:
 *      - workStream Controller
 *    summary: "Get a list of workStreams"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of workStreams
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/workStreams"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await workStreamController.getAll(req.query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/workStream/{id}:
 *   get:
 *    tags:
 *      - workStream Controller
 *    summary: "Get a workStream by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the workStream to get
 *    responses:
 *      '200':
 *        description: The workStream queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/workStream"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await workStreamController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/workStream/:
 *   post:
 *    tags:
 *      - workStream Controller
 *    summary: "Adds a new workStream"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/workStream"
 *          example:
 *            name: "name"
 *            siteId: id
 *    responses:
 *      '200':
 *        description: The workStream created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/workStream"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await workStreamController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/workStream/{id}:
 *   put:
 *    tags:
 *      - workStream Controller
 *    summary: "Update the workStream by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the workStream to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/workStream"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The workStream updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/workStream"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await workStreamController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/workStream/{id}:
 *   delete:
 *    tags:
 *      - workStream Controller
 *    summary: "Delete the workStream by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the workStream to delete
 *    responses:
 *      '200':
 *        description: The workStream deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/workStream"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await workStreamController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
