const AmenitiesController = require('../../controllers/AmenitiesController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Amenity Controller
 *   description: Manage Amenities repository.
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
 * /api/amenities/:
 *   get:
 *    tags:
 *      - Amenity Controller
 *    summary: "Get a list of amenities"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of Amenities
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Amenities"
 */
router.get('/', async function (req, res, next) {
  try {
    const all = await AmenitiesController.getAll(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/amenities/:
 *   post:
 *    tags:
 *      - Amenity Controller
 *    summary: "Adds a new amenity"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Amenities"
 *          example:
 *            name: "dock"
 *            type: "MULTI"
 *            value: 75
 *    responses:
 *      '200':
 *        description: The Amenity created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Amenities"
 */
router.post('/', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    const elem = await AmenitiesController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/amenities/{id}:
 *   put:
 *    tags:
 *      - Amenity Controller
 *    summary: "Update the amenity by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the amenity to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Amenity"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The amenity updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Amenity"
 */
router.put('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await AmenitiesController.update(req.params.id, req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/amenities/{id}:
 *   delete:
 *    tags:
 *      - Amenity Controller
 *    summary: "Delete the amenity by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the amenity to delete
 *    responses:
 *      '200':
 *        description: The amenity deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Amenity"
 */
router.delete('/:id(\\d+)', async function (req, res, next) {
  try {
    const elem = await AmenitiesController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/massive', async function (req, res, next) {
  try {
    const elem = await AmenitiesController.massive(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
