const MailController = require('./MailController')
const EventController = require('./EventController')
const SiteController = require('./SiteController')
const { formatDate } = require('basf-gtu-utils/utils/DateUtils')
const dateFormat = 'YYYY-MM-DD'

module.exports = {
  async feedback(data) {
    // FIXME Backend Validation must be here
    data.dateFrom = data.dateFrom ? formatDate(data.dateFrom, dateFormat) : undefined
    data.dateTo = data.dateTo ? formatDate(data.dateTo, dateFormat) : undefined
    data.siteData = data.site ? (await SiteController.getAll({ name: data.site }))[0] : null
    await MailController.feedback(data)
    delete data.file
    await EventController.feedback({ userId: data.username, payload: data })
  },
}
