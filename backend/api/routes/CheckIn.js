const AuthController = require('../../controllers/AuthController')
const apiActionResponses = require('../ApiActionResponses')
const { Router } = require('express')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const {
  OP_CREATE,
  OP_UPDATE,
  OP_DELETE,
  CREATED_STATUS_CODE,
  ACCEPTED_STATUS_CODE,
  NOT_FOUND_STATUS_CODE
} = require('../../common/Utils')
const { updateCheckIn, releaseSeat } = require("../../controllers/CheckInController");
const REQ_AUTH_HEADER = 'x-req-key'
const REQ_AUTH_A360_APPID = 'x-api-appid'
const REQ_AUTH_A360_APPKEY = 'x-api-key'
const EVENT_ENTER = 'enter'
const EVENT_EXIT = 'exit'

/**
 * @swagger
 * tags:
 * - name: A360 Check-in Controller
 *   description: Handle check-in event.
 */
const router = Router()

module.exports = router

/**
 * @swagger
 * /api/a360Interop/check-in:
 *   put:
 *    tags:
 *      - A360 Check-in Controller
 *    summary: "Update the booking table with the check-in status 2 (success) when users tap the Access 360 device at the office."
 *    parameters:
 *      - name: x-api-appid
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: x-api-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/A360Interop-checkIn"
 *    responses:
 *      '200':
 *        description: Successful operation, booking is updated with check-in status 'success'.
 *      '400':
 *        description: Bad Request occurs when the x-key is not defined
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the booking does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */


router.put('/check-in', async function (req, res, _next) {
  try {
    await checkInCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/release-seat', async function (req, res, _next) {
  try {
    await releaseSeatCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

async function checkInCRUD (req, res, opType) {
  console.log('Request arriving for check in event..')
  requesterA360AuthValidation(req)
  const data = req.body
  data.operation = opType

  if(!data.event) {
    throw new Errors.BadRequestError('Event value is required in request body.')
  }

  if(!data.userId) {
    throw new Errors.BadRequestError('User ID value is required in request body.')
  }

  if (data.event.toLowerCase() === EVENT_ENTER) {
    await updateCheckIn(data, data.operation)
    res.json({
      type: 'Accepted', message: 'Successfully check-in.'
    })
  } else {
    return res.json({Result: {Success: false, Message: `${data.event} / exit event - no check-in action update.`}})
  }
  res.status(ACCEPTED_STATUS_CODE).send()
}

async function releaseSeatCRUD (req, res, opType) {
  console.log('Release seat as no check in received after 10.00 am..')
  requesterAuthValidation(req)
  const data = req.body
  data.operation = opType
  const all = await releaseSeat(data)
  res.json(all)
  res.status(ACCEPTED_STATUS_CODE).send()
}

function requesterA360AuthValidation (req) {
  if (!req.headers[REQ_AUTH_A360_APPID]) {
    console.error(REQ_AUTH_A360_APPID, ' header is missing')
    throw new Errors.BadRequestError(REQ_AUTH_A360_APPID + ' header is missing.')
  }
  if (!req.headers[REQ_AUTH_A360_APPKEY]) {
    console.error(REQ_AUTH_A360_APPKEY, ' header is missing')
    throw new Errors.BadRequestError(REQ_AUTH_A360_APPKEY + ' header is missing.')
  }

  if (!AuthController.isRequesterA360Authorized(req.headers[REQ_AUTH_A360_APPID], REQ_AUTH_A360_APPID)) {
    console.error(
      'Requester not allowed to make requests to FoW Access 360 endpoints.',
      REQ_AUTH_A360_APPID,
      ' header value arriving: ',
      req.headers[REQ_AUTH_A360_APPID]
    )
    throw new Errors.UnauthorizedError('Requester not allowed to make requests to FoW Access 360 endpoints.')
  }

  if (!AuthController.isRequesterA360Authorized(req.headers[REQ_AUTH_A360_APPKEY], REQ_AUTH_A360_APPKEY)) {
    console.error(
      'Requester not allowed to make requests to FoW Access 360 endpoints.',
      REQ_AUTH_A360_APPKEY,
      ' header value arriving: ',
      req.headers[REQ_AUTH_A360_APPKEY]
    )
    throw new Errors.UnauthorizedError('Requester not allowed to make requests to FoW Access 360 endpoints.')
  }
}

function requesterAuthValidation (req) {
  if (!req.headers[REQ_AUTH_HEADER]) {
    console.error(REQ_AUTH_HEADER, ' header is missing')
    throw new Errors.BadRequestError(REQ_AUTH_HEADER + ' header is missing')
  }
  if (!AuthController.isRequesterAuthorized(req.headers[REQ_AUTH_HEADER])) {
    console.error(
      'Requester not allowed to make requests to FoW endpoints. ',
      REQ_AUTH_HEADER,
      ' header value arriving: ',
      req.headers[REQ_AUTH_HEADER]
    )
    throw new Errors.UnauthorizedError('Requester not allowed to make requests to FoW endpoints.')
  }
}
