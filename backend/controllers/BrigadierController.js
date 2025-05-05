const BrigadierDAO = require('../model/dao/BrigadierDAO')
const LDAPClient = require('basf-gtu-utils/client/LDAP')

module.exports = {
  async getAll(filter) {
    const firstAiders = await BrigadierDAO.getAll(filter)
    const users = firstAiders.map((fa) => fa.username)
    const usersLDAP = await LDAPClient.getUsers(users)

    return firstAiders.map((fa) => {
      const u = JSON.parse(JSON.stringify(fa))
      u.user = usersLDAP[u.username]
      return u
    })
  },
  get: BrigadierDAO.get,
  async create(data) {
    const [fa, ldap] = await Promise.all([BrigadierDAO.create(data), LDAPClient.getUser(data.username)])
    const tmp = JSON.parse(JSON.stringify(fa))
    tmp.user = ldap
    return tmp
  },
  update: BrigadierDAO.update,
  delete: BrigadierDAO.delete,
}
