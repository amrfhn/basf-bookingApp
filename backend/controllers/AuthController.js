const NodeCache = require('node-cache')
const AccessIT = require('basf-gtu-utils/client/AccessIT')
const accessCache = new NodeCache({ stdTTL: 60 * 15, checkperiod: 60 }) // 15 minutes

const siteController = require('./SiteController')
const Errors = require('./errors/CustomErrorTypes')

const REQ_AUTH_A360_APPID = 'x-api-appid'
const REQ_AUTH_A360_APPKEY = 'x-api-key'

const requestersAllowed = function () {
  try {
    return JSON.parse(process.env.REQUESTERS_ALLOWED)
  } catch (e) {
    console.error(
      'Internal server error: REQUESTERS_ALLOWED env variable is not set in the right way. Its syntax should be as follows: ["allowed_requester_1","allowed_requester_2",...,"allowed_requester_n"]'
    )
    throw new Errors.InternalServerError('Internal server error. Contact app administrator.')
  }
}

/*
* Auth requesters for Access360 Check In
*/
const a360RequestersAllowed = function (key) {
  const requesterAllowed = key === REQ_AUTH_A360_APPID ? process.env.A360_APPID : key === REQ_AUTH_A360_APPKEY ? process.env.A360_APPKEY : null

  try {
    return requesterAllowed
  } catch (e) {
    console.error(
      `Internal server error: A360_REQUESTERS_ALLOWED env ${key} variable is not set in the right way.`
    )
    throw new Errors.InternalServerError('Internal server error. Contact app administrator.')
  }
}

const APP_ID = 3994
const MANAGER_ROLE_ID = 11141617
const SUPER_ADMIN_ROLE_ID = 11170909

module.exports = {
  async managedSites(username) {
    const rolesUser = await roles(username)
    const managerRoleId = rolesUser.map((r) => r.id)
    return siteController.getAll({ managerRoleId })
  },

  async adminSites(username) {
    const rolesUser = await roles(username)
    const isSuperAdmin = rolesUser.some((r) => r.id === SUPER_ADMIN_ROLE_ID)
    // If is super admin, filter is not needed
    const adminRoleId = isSuperAdmin ? undefined : rolesUser.map((r) => r.id)
    return siteController.getAll({ adminRoleId })
  },

  async isSuperAdmin(username) {
    const rolesUser = await roles(username)
    return rolesUser.some((r) => r.id === SUPER_ADMIN_ROLE_ID)
  },
  isRequesterAuthorized(authHeader) {
    return requestersAllowed().indexOf(authHeader) !== -1
  },
  isRequesterA360Authorized(authHeader, authKey) {
    return a360RequestersAllowed(authKey).indexOf(authHeader) !== -1
  }
}

async function roles(username) {
  try {
    const keyUser = username.toLowerCase()
    let value = accessCache.get('ROLES' + keyUser)
    if (typeof value === 'undefined') {
      value = await AccessIT.user.search(keyUser)
      value = value.roles.filter((r) => r.application_id === APP_ID)
      accessCache.set('ROLES' + keyUser, value)
    }
    return value
  } catch (e) {
    console.error('ERROR accessIT roles', e.message)
    return []
  }
}
