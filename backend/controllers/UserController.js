const LDAPClient = require('basf-gtu-utils/client/LDAP')
const NodeCache = require('node-cache')
const UserDetailController = require("./UserDetailController");
const environment = process.env.NODE_ENV || 'development'
const isDev = environment === 'development'
const userCache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 60 }) // 1 hour
const type = 'employee;contractor'

module.exports = {
  async getSupervisor(username) {
    const user = await LDAPClient.getUser(username).catch(ldapError)
    if (isDev && !user) {
      return 'managerdev'
    } else {
      let supervisorId = userCache.get('USER_SUPERVISORID_' + username)
      let supervisor = userCache.get('SUPERVISOR_' + username)
      if (typeof supervisor === 'undefined') {
        const usernames = await LDAPClient.getUsername({ id: supervisorId, type }).catch(ldapError)
        supervisor = usernames.length > 0 ? usernames[0].toLocaleLowerCase() : null
        userCache.set('SUPERVISOR_' + username, supervisor)
      }
      return supervisor
    }
  },

  async getTeammatesUsernames(username) {
    const user = await LDAPClient.getUser(username).catch(ldapError)
    if (isDev && !user) {
      return ['managerdev']
    } else {
      /*
       * If user is supervisor, then his/her teammates are the ones supervised by him/her.
       * If the user is not supervisor, then his/her teammates are the ones supervised by the same person as
       * him/her, plus the supervisor itself.
       */

      if (!user.supervisor_id) {
        const userEntry = await UserDetailController.getByUserId(username)
        if (userEntry) {
          user.supervisor_id = userEntry.supervisorId
        }
      }
      userCache.set('USER_SUPERVISORID_' + username, user.supervisor_id)

      let teammates = userCache.get('TEAMMATES_' + username)
      if (typeof teammates === 'undefined') {
        teammates = await LDAPClient.getUsername({ supervisorId: user.id, companyId: user.company_id, type }).catch(
          ldapError
        )
        if (!teammates || !teammates[0]) {
          const filter = { supervisorId: user.supervisor_id, companyId: user.company_id, type }
          teammates = await LDAPClient.getUsername(filter).catch(ldapError)
          const supervisor = await this.getSupervisor(username)
          if (supervisor) {
            teammates.push(supervisor)
          }
        }
        teammates = teammates.map((teammate) => teammate.toLowerCase())
        teammates = teammates.filter((u) => u !== username)
        userCache.set('TEAMMATES_' + username, teammates)
      }
      return teammates
    }
  },

  async getTeammatesUsers(username) {
    const usernames = await this.getTeammatesUsernames(username)
    const teammatesUsers = await LDAPClient.getUsers(usernames)
    return { usernames: usernames, users: teammatesUsers }
  },
}

function ldapError(e) {
  console.warn(' ## Unable to get user:', e.message)
  return null
}
