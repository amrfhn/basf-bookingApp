const UserDetailController = require('../../controllers/UserDetailController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')
const {commonGlobals} = require("eslint-plugin-node/lib/configs/_commons");

/**
 * @swagger
 * tags:
 * - name: UserDetails Controller
 *   description: Manage missing LDAP data.
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
 * /api/userDetails/:
 *   get:
 *    tags:
 *      - UserDetails Controller
 *    summary: "Get a list of user with orgCode"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: List of user with orgCode
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserDetails"
 */
router.get('/', async function (req, res, next) {
  try {
    const getAllUser = await UserDetailController.getAll(req.query)
    console.log('all users', getAllUser)
    res.json(getAllUser)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userDetails/{userId}:
 *   get:
 *    tags:
 *      - UserDetails Controller
 *    summary: "Get user details by `userId`"
 *    produces:
 *    - "application/json"
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *          example: 'username'
 *        required: true
 *        description: userId of the orgCode to get
 *    responses:
 *      '200':
 *        description: The missing orgCode queried
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserDetails"
 */
router.get('/:userId', async function (req, res) {
  try {
    const userId = req.params.userId
    const getOrgCodeById = await UserDetailController.getByUserId(userId)
    if (!getOrgCodeById) {
      throw new Errors.NotFoundError('User not found')
    }
    console.log('User: ', req.params.userId, 'is', getOrgCodeById.orgCode)
    res.json(getOrgCodeById)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userDetails:
 *   post:
 *    tags:
 *      - UserDetails Controller
 *    summary: "Creat a new user detail when their LDAP has missing data"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/userDetails"
 *    responses:
 *      '200':
 *        description: The userDetails created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserDetails"
 */
router.post('/', async function (req, res, next) {
  try {
    if (!req.body.orgCode || !req.body.userId) {
      throw new Errors.ForbiddenError('OrgCode and User ID cant be null')
    }
    const createUser = await UserDetailController.create(req.body)
    console.log('DATA: ', req.body, 'is added')
    res.json(createUser)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userDetails:
 *   put:
 *    tags:
 *      - UserDetails Controller
 *    summary: "Update existing user data based on `userId`"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *     content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/userDetails"
 *    responses:
 *      '200':
 *        description: The user data updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserDetails"
 */
router.put('/', async function (req, res, next) {
  try {
    const user = await UserDetailController.getByUserId(req.body.userId)
    if (!user) {
      throw new Errors.NotFoundError('User not found')
    }
    const updateByUserId = await UserDetailController.update(user.userId, req.body)
    console.log('USER: ', user.userId, 'updated')
    res.json(updateByUserId)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/userDetails:
 *   delete:
 *    tags:
 *      - UserDetails Controller
 *    summary: "Delete a user data based on `userId`"
 *    produces:
 *    - "application/json"
 *    responses:
 *      '200':
 *        description: The User Details deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/userDetails"
 */
router.delete('/', async function (req, res, next) {
  try {
    const user = await UserDetailController.getByUserId(req.body.userId)
    if (!user) {
      throw new Errors.NotFoundError('User not found')
    }
    const deleteByUserId = await UserDetailController.delete(user.userId)
    console.log('User: ', user.userId, 'deleted')
    res.json(deleteByUserId)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
