const EventDAO = require('../model/dao/EventDAO')
const moment = require('moment')
const LDAPClient = require('basf-gtu-utils/client/LDAP')
const { SiteDAO } = require('../model/dao')
const { formatDate } = require('basf-gtu-utils/utils/DateUtils')
const Errors = require('./errors/CustomErrorTypes')
const dateFormat = 'YYYY-MM-DD'

module.exports = {
  async feedback({ userId, payload = null }) {
    const userInfo = await LDAPClient.getUser(userId)
    EventDAO.create({ date: new Date(), userId, type: 'FEEDBACK', payload, userOrgCode: userInfo.org_code })
  },
  async login({ userId, payload = null }) {
    const userInfo = await LDAPClient.getUser(userId)
    // console.log(JSON.stringify({ date: new Date(), userId, type: 'LOGIN', payload, userOrgCode: userInfo.org_code }))
  },
  async cancelBook({ userId, payload = null }) {
    if (payload !== null) {
      EventDAO.create({
        date: new Date(moment().utc().format()),
        userId,
        type: 'CANCEL_BOOK',
        payload,
        userOrgCode: payload.userOrgCode,
      })
    } else {
      throw new Errors.BadRequestError('Not receiving payload for booking cancellation event')
    }
  },
  async populateOrgCodes() {
    const events = await EventDAO.getAll({ notAnonymizedNorNullUserId: true })
    const usersInfo = await LDAPClient.getUsers(events.map((b) => b.userId))
    Object.entries(events).forEach(([key, value]) => {
      try {
        value.userOrgCode = usersInfo[value.userId.toLowerCase()].org_code
        EventDAO.update(value.id, value)
      } catch (e) {
        console.warn('Exception when populating event specific UserId. User data: ', value)
        console.warn('Specific exception thrown: ', e)
      }
    })
  },

  // Method that anonymizes all personal data stored in the events table.
  async anonymizeUsersData() {
    console.log('Running anonymization on Events table ...')
    const today = new Date()
    const allSites = await SiteDAO.getAll({})
    for (const key of allSites) {
      const tempExpDate = new Date()
      tempExpDate.setDate(today.getDate() - key.anonymizationDaysConfig)
      const eventsForSite = await EventDAO.getAll({
        anonymizationDate: formatDate(tempExpDate, dateFormat),
        notAnonymizedUsers: true,
      })
      for (const event of eventsForSite) {
        let siteId
        switch (event.type) {
          case 'CANCEL_BOOK':
            siteId = event.payload.seat.area.floor.building.site.id
            break
          case 'FEEDBACK':
            siteId = event.payload.siteData.id
            break
          case 'LOGIN':
            // TODO: Currently we cannot resolve this anonymization because the data brought from LDAP doesn't allow us to distinguish the site in the DB, so that the anonymization date cannot be resolved
            continue
          default:
            console.warn(
              'The new event type must be taken into consideration for data anonymization. New event type received: ',
              event.type
            )
            continue
        }
        event.userId = event.userId != null ? 'anonymized' : null
        event.payload = event.payload != null ? 'anonymized' : null
        if (event.userId != null || event.payload != null) EventDAO.update(event.id, event)
      }
    }
  },
  async deleteUsersData() {
    console.log('Running deletion on Events table ...')
    const today = new Date()
    const allSites = await SiteDAO.getAll({})
    for (const site of allSites) {
      const tempExpDate = new Date()
      tempExpDate.setDate(today.getDate() - site.deletionDays)
      console.log(tempExpDate)
      const eventsForSite = await EventDAO.getAll({
        deletionDate: formatDate(tempExpDate, dateFormat),
      })
      for (const event of eventsForSite) {
        let siteId
        switch (event.type) {
          case 'CANCEL_BOOK':
            siteId = event.payload.seat.area.floor.building.site.id
            break
          case 'FEEDBACK':
            siteId = event.payload.siteData.id
            break
          default:
            console.warn(
              'The new event type must be taken into consideration for data deletion. New event type received: ',
              event.type
            )
            continue
        }
        await EventDAO.delete(event.id)
      }
    }
  },
}
