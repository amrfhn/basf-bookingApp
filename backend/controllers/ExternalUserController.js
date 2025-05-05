const ExternalUserDAO = require('../model/dao/ExternalUserDAO')

module.exports = {
  async anonymizeExternalUser(externalUserId) {
    const data = await ExternalUserDAO.get(externalUserId)
    data.name = 'anonymized'
    data.email = 'anonymized'
    data.surname = 'anonymized'
    ExternalUserDAO.update(externalUserId, data.dataValues)
  },
}
