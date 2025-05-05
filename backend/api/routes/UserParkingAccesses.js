const UserParkingAccessesController = require('../../controllers/UserParkingAccessController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: userParkingAccesses Controller
 *   description: Manage userParkingAccess repository.
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
 * /api/userParkingAccesses/:
 *   get:
 *    tags:
 *      - userParkingAccesses Controller
 *    summary: "Get a list of userParkingAccesses"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of userParkingAccesses
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccesses"
 */
router.get('/', async function (req, res) {
  try {
    const all = await UserParkingAccessesController.getAll(req.query)

    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccesses/{id}:
 *   get:
 *    tags:
 *      - userParkingAccesses Controller
 *    summary: "Get a userParkingAccesses by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the userParkingAccesses to get
 *    responses:
 *      '200':
 *        description: The userParkingAccesses queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccesses"
 */
router.get('/:id(\\d+)', async function (req, res) {
  try {
    const elem = await UserParkingAccessesController.get(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccess:
 *   post:
 *    tags:
 *      - userParkingAccess Controller
 *    summary: "Adds a new userParkingAccess"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/userParkingAccess"
 *    responses:
 *      '200':
 *        description: The userParkingAccess created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccess"
 */
router.post('/', async function (req, res) {
  try {
    if (!req.isAdmin) {
      throw new Errors.ForbiddenError('User must have admin role to perform this operation.')
    }
    if (
      !(
        req.body.userId &&
        req.body.startDate &&
        req.body.parkingLotOwner !== null &&
        req.body.userMail &&
        (!req.body.parkingLotOwner ||
          (req.body.parkingLotOwner && req.body.parkingFloor !== null && req.body.parkingLot !== null)) &&
        ((req.body.carBrand && req.body.carModel && req.body.carLicensePlate) ||
          (!req.body.carBrand && !req.body.carModel && !req.body.carLicensePlate))
      )
    ) {
      throw new Errors.BadRequestError('Parameters missing, or there is an inconsistency in the data received.')
    }
    const isUserRegistered = await UserParkingAccessesController.getAll({ userId: req.body.userId })
    if (isUserRegistered.length > 0) {
      throw new Errors.ConflictError('User is already registred for parking access.')
    }
    const elem = await UserParkingAccessesController.create(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccess:
 *   post:
 *    tags:
 *      - userParkingAccess Controller
 *    summary: "Adds a new data for userParkingAccess"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/userParkingAccess"
 *    responses:
 *      '200':
 *        description: The userParkingAccess created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccess"
 */
router.post('/user-create', async function (req, res) {
  try {
    const isUserRegistered = await UserParkingAccessesController.getAll({ userId: req.body.userId })
    if (isUserRegistered[0].carBrand === null) {
      const elem = await UserParkingAccessesController.update(isUserRegistered[0].id, req.body)
      res.json(elem)
    } else {
      const elem = await UserParkingAccessesController.createByUser(req.body)
      res.json(elem)
    }
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccess/{id}:
 *   put:
 *    tags:
 *      - userParkingAccesses Controller
 *    summary: "Update the userParkingAccess by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the userParkingAccess to update
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/userParkingAccess"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The userParkingAccess updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccess"
 */
router.put('/:id', async function (req, res) {
  try {
    if (req.body.updatedByAdmin || req.body.updatedByUser) {
      const elem = await UserParkingAccessesController.update(req.params.id, req.body)
      res.json(elem)
    } else {
      const elem = await UserParkingAccessesController.updateByEdit(req.params.id, req.body)
      res.json(elem)
    }
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccess/{id}:
 *   delete:
 *    tags:
 *      - userParkingAccesses Controller
 *    summary: "Delete the userParkingAccess by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the userParkingAccess to delete
 *    responses:
 *      '200':
 *        description: The userParkingAccess deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccess"
 */
router.delete('/:id', async function (req, res) {
  try {
    const elem = await UserParkingAccessesController.delete(req.params.id)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccess/:
 *   post:
 *    tags:
 *      - UserParkingController Controller
 *    summary: "Delete the user parking access and the information by `id`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          example: 152
 *        required: true
 *        description: Id of the user parking access to delete
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/UserParking"
 *          example:
 *            example_code: 1410000
 *    responses:
 *      '200':
 *        description: The user parking access updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserParking"
 */
router.post('/delete-user-info', async function (req, res) {
  try {
    const elem = await UserParkingAccessesController.deleteUserInfo(req.body)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccess/user:
 *   get:
 *    tags:
 *      - userParkingAccess Controller
 *    summary: "Get a list of userParkingAccesses of the authenticated user"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of userParkingAccesses of the user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccess"
 */
// TODO: Sacar este endpoint y agregar la/s llamadas al mismo a una llamada al endpoint "GET /api/userParkingAccesses/"
router.get('/user', async function (req, res) {
  try {
    const all = await UserParkingAccessesController.getAll({ userId: req.username })
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userParkingAccesses/getUserInfo/{userId}/{buildingId}:
 *   get:
 *    tags:
 *      - userParkingAccesses Controller
 *    summary: "Get a userParkingAccesses info of the user with corresponding `userId`, and gets the buildingId to identify if the related seats are in the building"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: userId of the user
 *      - in: path
 *        name: buildingId
 *        schema:
 *          type: number
 *        required: true
 *        description: buildingId where the seat must be (in case there is one)
 *    responses:
 *      '200':
 *        description: The userParkingAccesses queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userParkingAccesses"
 */
router.get('/getUserInfo/:userId/:buildingId', async function (req, res) {
  try {
    const elem = await UserParkingAccessesController.getUserInfo(req.params.userId, req.params.buildingId)
    res.json(elem)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
