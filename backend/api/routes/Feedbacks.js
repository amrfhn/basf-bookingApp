const FeedbackController = require('../../controllers/FeedbackController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

/**
 * @swagger
 * tags:
 * - name: Feedback Controller
 *   description: Manage Feedbacks.
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
 * /api/feedbacks/:
 *   post:
 *    tags:
 *      - Feedback Controller
 *    summary: "Send a new feedback"
 *    produces:
 *    - "application/json"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            text: string
 *            anonymous: boolean
 *          example:
 *            text: "text of feedback"
 *            anonymous: false
 *    responses:
 *      '202':
 *        description: The feedback was accepted
 *        content:
 *          application/json:
 *            schema:
 *              response: boolean
 */
router.post('/', async function (req, res, next) {
  try {
    const data = {
      username: req.username,
      site: req.body.site ? req.body.site : null,
      file: req.files ? req.files.file : null,
      type: req.body.type,
      text: req.body.text,
      anonymous: req.body.anonymous === 'true',
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
    }

    await FeedbackController.feedback(data)
    res.sendStatus(202)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})
