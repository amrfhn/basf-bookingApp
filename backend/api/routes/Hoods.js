const hoodController = require('../../controllers/HoodController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Hood Controller
 *   description: Manage Hood repository.
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
 * /api/hood/:
 *   get:
 *    tags:
 *      - Hood Controller
 *    summary: "Get a list of Hoods"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Hoods
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hoods"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await hoodController.getAll(req.query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/{id}:
 *   get:
 *    tags:
 *      - hood Controller
 *    summary: "Get a hood by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the hood to get
 *    responses:
 *      '200':
 *        description: The hood queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hood"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await hoodController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/:
 *   post:
 *    tags:
 *      - hood Controller
 *    summary: "Adds a new hood"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/hood"
 *          example:
 *            name: "name"
 *    responses:
 *      '200':
 *        description: The hood created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hood"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await hoodController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/{id}:
 *   put:
 *    tags:
 *      - hood Controller
 *    summary: "Update the hood by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the hood to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/hood"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The hood updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hood"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await hoodController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/{id}:
 *   delete:
 *    tags:
 *      - hood Controller
 *    summary: "Delete the hood by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the hood to delete
 *    responses:
 *      '200':
 *        description: The hood deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hood"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await hoodController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/org_codes:
 *   get:
 *    tags:
 *      - Hood Controller
 *    summary: "Get a list of Org Codes"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Org Codes
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hoods"
 */
router.get('/org_codes', async function (req, res, next) {
  try {
    const all = await hoodController.getOrgCodes(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/location/{id}:
 *   get:
 *    tags:
 *      - Hood Controller
 *    summary: "Get a all buildings, floors, areas where there are seats with a specific hood"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Object with buildings, floors and areas
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hoods"
 */
router.get('/locations/:id(\\d+)', async function (req, res, next) {
  try {
    const all = await hoodController.getLocations(req.params.id)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/{id}:
 *   put:
 *    tags:
 *      - hood Controller
 *    summary: "Remove orgCodes of the hood by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the hood whose org code is being removed
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/hood"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The hood whose org codes are going to be removed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hood"
 */
router.post('/removeOrgCodes/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await hoodController.removeOrgCodes(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/{id}:
 *   put:
 *    tags:
 *      - hood Controller
 *    summary: "Add orgCodes of the hood by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the hood whose org codes are created
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/hood"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The hood whose org codes are going to be created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hood"
 */
router.post('/addOrgCodes/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await hoodController.addOrgCodes(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/hood/validate/{orgCode}:
 *   get:
 *    tags:
 *      - Hood Controller
 *    summary: "Validate the existence of an org code"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: path
 *      name: orgCode
 *      schema:
 *        type: string
 *        example: GB
 *      required: true
 *      description: Org Code to validate
 *    responses:
 *      '200':
 *        description: Boolean indicating whether the org code exists or not
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/hoods"
 */
router.get('/validate/:orgCode', async function (req, res, next) {
  try {
    const all = await hoodController.validateOrgCode(req.params.orgCode)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
