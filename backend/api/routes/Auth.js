const isDev = process.env.NODE_ENV === 'development'

const LDAPClient = require('basf-gtu-utils/client/LDAP')

const UserController = require('../../controllers/UserController')
const HoodController = require('../../controllers/HoodController')
const EventController = require('../../controllers/EventController')
const UserDetailController = require('../../controllers/UserDetailController')

const apiActionResponses = require('../ApiActionResponses')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { Router } = require('express')

const router = Router()
module.exports = router

router.get('/', async function (req, res, next) {
  try {
    let user = await LDAPClient.getUser(req.username).catch(ldapError)
    if (isDev && !user) {
      user = { username: 'userDev' }
    }
    if (user && !user.org_code) {
      const userEntry = await UserDetailController.getByUserId(req.username || user.username)
      if (userEntry) {
        user.org_code = userEntry.orgCode
      }
    }
    if (user && !user.supervisorId) {
      const userEntry = await UserDetailController.getByUserId(req.username || user.username)
      if (userEntry) {
        user.supervisor_id = userEntry.supervisorId
      }
    }
    const hoods = await HoodController.getAll({ orgCode: user.org_code })
    const teammates = await UserController.getTeammatesUsernames(req.username)

    const responseBody = {
      user,
      roles: {
        isAdmin: !!req.isAdmin,
        isManager: !!req.isManager,
        isSuperAdmin: !!req.isSuperAdmin,
        managedSites: req.managedSites,
        adminSites: req.adminSites,
      },
      teammates: teammates,
      hoods: hoods,
    }
    res.json(responseBody)

    const forwardedFor = req.headers['x-forwarded-for']
    const remoteAddress = req.connection.remoteAddress
    EventController.login({ userId: req.username, payload: { ...responseBody, forwardedFor, remoteAddress } })
  } catch (e) {
    console.error('Error on Auth:\n\t', e)
    apiActionResponses(e)(res, e.message)
  }
})

function ldapError(e) {
  console.warn('Error ldap: ', e.message)
  return null
}
