const { client } = require('basf-gtu-utils')
const MailClient = client.Mail
const LDAPClient = client.LDAP
const BuildingController = require('./BuildingController')
const SiteController = require('./SiteController')

const BASE_URL = process.env.BASEURL
const ENV = process.env.ENV === 'true' || false

module.exports = {
  async cancelBooking(userId, where, cancellation) {
    const to = await LDAPClient.getUser(userId)
      .then((u) => u.mail)
      .catch(ldapError)
    const mail = {}
    mail.to = to
    let text = ''
    const manager = await LDAPClient.getUser(cancellation.username)
      .then((u) => u)
      .catch(ldapError)
    for (const w of where) {
      text =
        '<li><strong>Date: </strong>' +
        w.date +
        '<ul>' +
        '<li><strong>Floor: </strong>' +
        w.floor +
        '</li>' +
        '<li><strong>Area: </strong>' +
        w.area +
        '</li>' +
        '<li><strong>Seat: </strong>' +
        w.seat +
        '</li>' +
        '</ul></li>' +
        text
    }
    switch (cancellation.source) {
      case 'Manager':
        mail.subject = 'Future of Work | Seat Booking Cancellation by Manager'
        if (!ENV) {
          mail.subject += ' - Test Environment'
        }
        mail.cc = manager.mail
        mail.text =
          '<h3>Seat Booking Cancellation by Manager</h3>' +
          '<p><b>Your reservation has been canceled by your Manager</b>' +
          '<ul>' +
          text +
          '</ul></p>' +
          `<p>If you have any comment, please contact ${manager.full_name}.</p>` +
          "<p>If you'd like to make a new reservation, you can do it through <a href='" +
          `https://${BASE_URL}/future_of_work/'>this link</a></p>`
        break
      case 'Admin':
        mail.subject = 'Future of Work | Seat Booking Cancellation by Admin'
        if (!ENV) {
          mail.subject += ' - Test Environment'
        }
        mail.text =
          '<h3>Seat Booking Cancellation by Admin</h3>' +
          '<p><b>Your reservation has been canceled by your Admin</b>' +
          '<ul>' +
          text +
          '</ul></p>' +
          `<p>If you have any doubts/comment, please contact ${cancellation.site.feedbackContact}</p>` +
          "<p>If you'd like to make a new reservation, you can do it through <a href='" +
          `https://${BASE_URL}/future_of_work/'>this link</a></p>`
        break
      default:
        mail.subject = 'Future of Work | Seat Booking Cancellation'
        if (!ENV) {
          mail.subject += ' - Test Environment'
        }
        mail.text =
          '<h3>Seat Booking Cancellation</h3>' +
          '<p><b>Your reservation has been successfully canceled!</b>' +
          '<ul>' +
          text +
          '</ul></p>' +
          '<p>Thanks for contributing to the responsible use of the office spaces.</p>' +
          "<p>If you'd like to make a new reservation, you can do it through <a href='" +
          `https://${BASE_URL}/future_of_work/'>this link</a></p>`
    }
    return MailClient.mail(mail).catch(logWaring)
  },
  async confirmBooking(userId, where) {
    const to = await LDAPClient.getUser(userId)
      .then((u) => u.mail)
      .catch(ldapError)
    const mail = {}
    mail.to = to
    mail.subject = 'Future of Work | Seat Booking Confirmation'
    if (!ENV) {
      mail.subject += ' - Test Environment'
    }
    if (where.originUserId) {
      const originUserId = await LDAPClient.getUser(where.originUserId)
        .then((u) => u.mail)
        .catch(ldapError)
      mail.cc = originUserId
      mail.text =
        '<h3>Booking Confirmation - Booked by other</h3>' +
        `<p><b>Please note a reservation for you has been made by ${originUserId}</b>`
    } else {
      mail.text = '<h3>Booking Confirmation</h3>' + '<p><b>Your reservation has been successfully confirmed!</b>'
    }
    const buildings = await BuildingController.getAll({ siteId: where.site.id })
    mail.text =
      mail.text +
      '<ul>' +
      '<li><strong>Site: </strong>' +
      where.site.name +
      '</li>' +
      (buildings.length > 1 ? '<li><strong>Building: </strong>' + where.building + '</li>' : '') +
      (where.floor ? '<li><strong>Floor: </strong>' + where.floor + '</li>' : '') +
      (where.area ? '<li><strong>Area: </strong>' + where.area + '</li>' : '') +
      (where.seat ? '<li><strong>Seat: </strong>' + where.seat + '</li>' : '') +
      (where.dates ? '<li><strong>Date: </strong>' + where.dates + '</li>' : '') +
      '</ul></p>'
    if (where.parkingLots && where.parkingLots.length > 0) {
      mail.text = mail.text + '<p><b>Your parking lot reservations: </b><ul>'
      for (const parkingLot of where.parkingLots) {
        mail.text =
          mail.text +
          '<li><strong>Date: </strong>' +
          parkingLot.date +
          '<ul>' +
          '<li><strong>Floor: </strong>' +
          parkingLot.floor +
          '</li>' +
          '<li><strong>Parking lot: </strong>' +
          parkingLot.parkingLot +
          '</li>' +
          '</ul></li>'
      }
      mail.text = mail.text + '</ul></p>'
    }
    mail.text =
      mail.text +
      '<p>Please use our space responsibly and cancel your booking if needed.</p>' +
      '<p>Your booking can be cancelled latest 8 am on the day the desk is reserved for via ' +
      '<a href="' +
      `https://${BASE_URL}/future_of_work/reservation">this link</a>.</p>`
    return MailClient.mail(mail).catch(logWaring)
  },
  async feedback(data) {
    try {
      console.log(new Date(), 'Feedback:', data.username, data.text)
      const user = await LDAPClient.getUser(data.username).catch(ldapError)
      const anonymousFeedback = data.anonymous
      const site = data.site ? data.site : '-'
      const fromUser = anonymousFeedback ? 'Anonymous' : user.full_name
      const mail = {}
      mail.subject = 'Future of Work | ' + data.type
      if (!ENV) mail.subject += ' - Test Environment'
      if (data.siteData) {
        mail.to = data.siteData.feedbackContact
        mail.bcc = process.env.FEEDBACK_MAIL
      } else mail.to = process.env.FEEDBACK_MAIL
      mail.cc = anonymousFeedback ? null : user.mail
      mail.text = 'From: ' + fromUser + '<br>'
      mail.text += 'Site: ' + site + '<br>'
      mail.text += data.text ? 'Comment: ' + data.text + '<br>' : ''
      mail.text += data.dateFrom ? 'From: ' + data.dateFrom + '<br>' : ''
      mail.text += data.dateTo ? 'To: ' + data.dateTo + '<br>' : ''
      if (data.file) {
        mail.attachments = [{ file: data.file.data, name: data.file.name }]
        mail.text = mail.text.replace(/<br>/g, '\n\n')
        return await MailClient.attachment(mail)
      } else return await MailClient.mail(mail)
    } catch (e) {
      logWaring(e)
    }
  },
  async sendUrlReport(userId, url) {
    const to = await LDAPClient.getUser(userId)
      .then((u) => u.mail)
      .catch(ldapError)
    const mail = {}
    mail.to = to
    mail.subject = 'Future of Work | Report URL Information'
    if (!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text = `The file with the information requested can be found here:<br><br><a href="${BASE_URL}/future_of_work/data/${url}.xlsx">${BASE_URL}/future_of_work/data/${url}.xlsx</a>`
    mail.text += '<br>' + '<br>' + `Remember that the link is valid only for 24hs`
    return MailClient.mail(mail).catch(logWaring)
  },
  async notifyUserParkingCreation(userMail) {
    const mail = {}
    mail.to = userMail
    mail.subject = 'Future of Work | User Registration for parking access'
    if (!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text =
      "<p>You have been registered in the application Future of Work to access the parking. <br><br> To register your car/s you have to go to the <a href='" +
      `https://${BASE_URL}/future_of_work/parking'>Parking</a> section in the application.</p>`
    return MailClient.mail(mail).catch(logWaring)
  },
  async notifyUserParkingAccess(body) {
    const mail = {}
    const to = await LDAPClient.getUser(body.userId)
      .then((u) => u.mail)
      .catch(ldapError)
    mail.to = to
    mail.subject = 'Future of Work | Parking access available'
    if (!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text =
      '<p>You have been authorized to book a parking space with vehicle: ' +
      body.carBrand +
      ' ' +
      body.carModel +
      ' ' +
      body.carLicensePlate +
      ' in the Future of Work application. ' +
      "<br><br> To add a parking lot to your book, you should proceed as a normal booking and click on 'I want my reservation to include parking lot'. <br> " +
      'If you already have a book, you can add a parking lot in <a href="' +
      `https://${BASE_URL}/future_of_work/reservation">My Reservations</a> clicking 'Add parking' button.</p>`
    mail.text += body.endDate ? 'Parking access available until: ' + body.endDate + '<br>' : ''

    return MailClient.mail(mail).catch(logWaring)
  },
  async notifyVehicleCreation(body) {
    const user = await LDAPClient.getUser(body.userId)
      .then((u) => u.full_name)
      .catch(ldapError)
    const site = await SiteController.get(body.siteId)
    const mail = {}
    mail.to = site.dataValues.feedbackContact
    mail.subject = 'Future of Work | User Vehicle creation'
    if (!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text = 'New vehicle was registered by ' + user + '<br>'
    mail.text += 'Site: ' + site.dataValues.name + '<br>'
    mail.text +=
      'Vehicle: ' +
      body.carBrand +
      ' ' +
      body.carModel +
      ' ' +
      body.carLicensePlate +
      '<br><br>'
    mail.text +=
      '<p> To enable parking access: <a href=' +
      `https://${BASE_URL}/future_of_work/configuration/parkings'>Parking configuration </a> </p>`

    return MailClient.mail(mail).catch(logWaring)
  },
  async confirmCheckIn(userId ) {
    const to = await LDAPClient.getUser(userId)
      .then((u) => u.mail)
      .catch(ldapError)

    const mail = {}
    mail.to = to
    mail.subject = 'Future of Work | Check In Confirmation'

    if (!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text = '<h3>Check In Confirmation</h3>' + '<p>You have successfully checked-in!</p>' // need to revise further

    return MailClient.mail(mail).catch(logWaring)
  },
  async checkInReminder(userId) {
    const to = await LDAPClient.getUser(userId)
      .then((u) => u.mail)
      .catch(ldapError)

    const mail = {}
    mail.to = to
    mail.subject = 'Future of Work | Seat Check-in Reminder'
    if(!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text = '<h3>Check-in Reminder</h3>' + '<p>We have no record of your check-in today.</p><p>Kindly tap your access card at an entry point of Service Hub KL premises, otherwise the seat will be released.</p>'
    return MailClient.mail(mail).catch(logWaring)
  },
  async checkInReleaseSeat(data) {
    const to = await LDAPClient.getUser(data.userId)
      .then((u) => u.mail)
      .catch(ldapError)

    const mail = {}
    mail.to = to
    mail.subject = 'Future of Work | Release Seat'
    if(!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text = '<h3>Release Seat</h3>' + `<p>We have no record of your check-in today.</p><p>Your booking on ${data.calendar.date}, seat ${data.seat.code}, has been removed. Kindly make a new booking if you still need to use a workspace.</p>`
    return MailClient.mail(mail).catch(logWaring)
  },
  async notifyNoSeatsAvailbleOnRandomBooking (data) {
    const to = await LDAPClient.getUser(data.userId)
      .then((u) => u.mail)
      .catch(ldapError)

    const mail = {}
    mail.to = to
    mail.subject = 'Future of Work | No Seats Available'
    if(!ENV) {
      mail.subject += ' - Test Environment'
    }
    mail.text = '<h3>No Seats Available</h3>' + `<p>Thank you for your booking. Unfortunately, there are no seats left for your booking on ${data.date}. Please try to make a new booking after 10 am tomorrow.</p>`
    return MailClient.mail(mail).catch(logWaring)
  }
}

function logWaring(e) {
  console.warn(' ## Unable to send mail:', e.message)
}

function ldapError(e) {
  console.warn(' ## Unable to get user:', e.message)
  return ''
}
