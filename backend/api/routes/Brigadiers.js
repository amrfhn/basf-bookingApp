const BrigadierController = require('../../controllers/BrigadierController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Brigadier Controller
 *   description: Manage Brigadiers repository.
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
 * /api/Brigadiers/:
 *   get:
 *    tags:
 *      - Brigadier Controller
 *    summary: "Get a list of Brigadiers"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Brigadiers
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Brigadiers"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await BrigadierController.getAll(req.query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/Brigadiers/{id}:
 *   get:
 *    tags:
 *      - Brigadier Controller
 *    summary: "Get the Brigadier by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the Brigadier to get
 *    responses:
 *      '200':
 *        description: The Brigadier queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Brigadier"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await BrigadierController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/Brigadiers/:
 *   post:
 *    tags:
 *      - Brigadier Controller
 *    summary: "Adds a new Brigadier"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Brigadier"
 *          example:
 *            username: "userdev"
 *    responses:
 *      '200':
 *        description: The Brigadier created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Brigadier"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await BrigadierController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/Brigadiers/{id}:
 *   put:
 *    tags:
 *      - Brigadier Controller
 *    summary: "Update the Brigadier by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the Brigadier to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Brigadier"
 *          example:
 *            username: "userdev"
 *    responses:
 *      '200':
 *        description: The Brigadier updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Brigadier"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await BrigadierController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/Brigadiers/{id}:
 *   delete:
 *    tags:
 *      - Brigadier Controller
 *    summary: "Delete the Brigadier by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the Brigadier to delete
 *    responses:
 *      '200':
 *        description: The Brigadier deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Brigadier"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await BrigadierController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
