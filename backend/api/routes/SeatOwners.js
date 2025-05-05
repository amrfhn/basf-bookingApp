const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')
const SeatOwnerController = require('../../controllers/SeatOwnerController')

/**
 * @swagger
 * tags:
 * - name: SeatOwner Controller
 *   description: Manage SeatOwner repository.
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
 * /api/seat-owner/get-seat-owners/:
 *   get:
 *    tags:
 *      - SeatOwner Controller
 *    summary: "Get seats owners by seats ids"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: Get seats owners by seats ids
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/SeatOwner"
 */
router.get('/get-seat-owners/', async function (req, res, next) {
  try {
    const all = await SeatOwnerController.getAll(req.query)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seat-owner/:
 *   post:
 *    tags:
 *      - SeatOwner Controller
 *    summary: "Adds a new SeatOwner"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/SeatOwner"
 *          example:
 *            userId: 12
 *            seatId: 1
 *    responses:
 *      '200':
 *        description: The SeatOwners were created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/SeatOwner"
 */
router.post('/', async function (req, res, next) {
  try {
    if (!req.body.seatId || !req.body.userId) {
      throw new Errors.BadRequestError('Parameters missing, user and/or seat can not be empty.')
    }
    const elem = await SeatOwnerController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/seat-owner/delete:
 *   patch:
 *    tags:
 *      - SeatOwners Controller
 *    summary: "Delete seatOwners by a list of ids"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/SeatOwners"
 *    responses:
 *      '200':
 *        description: SeatOwners were deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/SeatOwners"
 */
router.post('/delete', async function (req, res, next) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    await SeatOwnerController.bulkDelete(req.body)
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
