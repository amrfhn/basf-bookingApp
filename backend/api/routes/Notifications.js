const axios = require('axios')
const { Router } = require('express')
const apiActionResponses = require('../ApiActionResponses')
// const SmsNotificationController = require("../../controllers/SmsNotificationController");
const { ACCEPTED_STATUS_CODE } = require("../../common/Utils")
const MACROKIOSK_API_ENDPOINT = process.env.MACROKIOSK_API_ENDPOINT

/**
 * @swagger
 * tags:
 * - name: MacroKiosk SMS Notification
 *   description: Handle sms event.
 */
const router = Router()

module.exports = router

router.get('/smsNotification', async function (req, res, next) {
  console.log(req.body)
  try {
    const getInstance = axios.create()
    console.debug('SMS execute...')
    const { data: getRes } = await getInstance.get(
      MACROKIOSK_API_ENDPOINT,
      {
        params: req.body
      }
    )
    const resp = { response: getRes }
    console.log('SMS notification executed..', resp)
    res.status(ACCEPTED_STATUS_CODE)
  } catch (e) {
    console.debug('There is an error in Post SMS Notification by MacroKiosk in SmsNotificationController.', e.toString())
    apiActionResponses(e)(res, e.message)
    return { exception: e.toString() }
  }
})
