const SiteController = require('../../controllers/SiteController')
const BuildingController = require('../../controllers/BuildingController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Site Controller
 *   description: Manage Sites repository.
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
 * /api/sites/:
 *   get:
 *    tags:
 *      - Site Controller
 *    summary: "Get a list of sites"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Sites
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Sites"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await SiteController.getAll(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/sites/{id}:
 *   get:
 *    tags:
 *      - Site Controller
 *    summary: "Get the site by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the site to get
 *    responses:
 *      '200':
 *        description: The site queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Site"
 */
router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await SiteController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/sites/:
 *   post:
 *    tags:
 *      - Site Controller
 *    summary: "Adds a new site"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Site"
 *          example:
 *            number: 0
 *            map: "vector"
 *            buildingId: 12
 *            enabledId: 1
 *    responses:
 *      '200':
 *        description: The Site created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Site"
 */
router.post('/', async function (req, res, next) {
  try {
    const elem = await SiteController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/sites/{id}:
 *   put:
 *    tags:
 *      - Site Controller
 *    summary: "Update the site by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the site to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Site"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The site updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Site"
 */
router.put('/:id', async function (req, res, next) {
  try {
    const elem = await SiteController.update(req.params.id, req.username, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/sites/{id}:
 *   delete:
 *    tags:
 *      - Site Controller
 *    summary: "Delete the site by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the site to delete
 *    responses:
 *      '200':
 *        description: The site deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Site"
 */
router.delete('/:id', async function (req, res, next) {
  try {
    const elem = await SiteController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/sites/{id}/buildings:
 *   get:
 *    tags:
 *      - Building Controller
 *      - Site Controller
 *    summary: "Get a list of buildings for the site"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of buildings
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Buildings"
 */
router.get('/:id/buildings', async function (req, res, next) {
  try {
    const query = { ...req.query, siteId: req.params.id }
    const all = await BuildingController.getAll(query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
