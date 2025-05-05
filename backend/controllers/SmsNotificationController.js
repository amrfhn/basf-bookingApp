const axios = require('axios')
const { client } = require('basf-gtu-utils')
const LDAPClient = client.LDAP

const MACROKIOSK_USERID = process.env.MACROKIOSK_USERID
const MACROKIOSK_PASSWORD = process.env.MACROKIOSK_PASSWORD

const baseURL = process.env.BASEURL ? `https://${process.env.BASEURL}` : 'http://localhost:9000'
const FOW_SMS_NOTIFICATION_ENDPOINT = `${baseURL}/future_of_work/api/notifications/smsNotification`

const macroKioskParams = (phoneNumber, message) => {
  return {
    User: MACROKIOSK_USERID, /* MK client's account */
    Pass: MACROKIOSK_PASSWORD, /* MK client's password */
    ServID: 'MES01',
    To: phoneNumber, /* user phoneNumber */
    Type: 0, /* 0 - ASCII, 5 - Unicode */
    From: 'FoW', /* Char - FutureOfWork */
    Text: message, /* Message content */
    Title: 'Future of Work', /* optional */
    Detail: 1, /* optional 1 - show response detail (for debug), 0 - hide (default) */
  }
}

module.exports = {
  async confirmBooking(userId, data) {
    const userInfo = await LDAPClient.getUser(userId)
    let phoneNumber = userInfo.mobile

    if (!phoneNumber) {
      console.debug(`User ${userInfo.username} has not added their phone number.`)
      return
    }
    phoneNumber = phoneNumber.replace(/[+\s]/g, '')
    phoneNumber = parseInt(phoneNumber)

    const message = `FutureOfWork: Your booking on ${data.dates} is confirmed. Your assigned seat is ${data.seat}. Please check in before 10 am using your access card, otherwise the seat will be released. Thank you.`
    try {
      const getInstance = axios.create()
      const resp = await getInstance.get(FOW_SMS_NOTIFICATION_ENDPOINT, {
        params: macroKioskParams(phoneNumber, message)
      })
      console.log('SMS execution response:', resp.status)
    } catch (e) {
      return { exception: e.toString() }
    }
  },
  async seatsNotAvailable (userId, data) {
    const userInfo = await LDAPClient.getUser(userId)
    let phoneNumber = userInfo.mobile

    if (!phoneNumber) {
      console.debug(`User ${userInfo.username} has not added their phone number.`)
      return
    }
    phoneNumber = phoneNumber.replace(/[+\s]/g, '')
    phoneNumber = parseInt(phoneNumber)

    const message = `FutureOfWork: No seats available for your booking on ${data.date}. Please try to make a new booking after 10 am tomorrow.`
    try {
      const getInstance = axios.create()
      const resp = await getInstance.get(FOW_SMS_NOTIFICATION_ENDPOINT, {
        params: macroKioskParams(phoneNumber, message)
      })
      console.log('SMS execution response:', resp.status)
    } catch (e) {
      return { exception: e.toString() }
    }
  }
}