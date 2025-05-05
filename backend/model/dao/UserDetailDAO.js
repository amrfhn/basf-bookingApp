const { UserDetail, config} = require('../model')
const { raw, nest, sequelize } = config

module.exports = {
  async getAll(filter) {
    console.log('GetAll User')
    const where = {}

    if (filter) {
      if (filter.orgCode) {
        where.orgCode = filter.orgCode
      }
      if (filter.userId) {
        where.userId = filter.userId.toLowerCase()
      }
    }
    const order = sequelize.col('userId')
    const attributes = [
      'id',
      'userId',
      'orgCode',
      'supervisorId'
    ]

    return UserDetail.findAll({ attributes, where, order, raw, nest })
  },

  get(userId) {
    console.log('Get user', userId)
    return UserDetail.findOne({ where: { userId: userId }, raw })
  },
  create(data) {
    console.log('Create OrgCodes', data)
    return UserDetail.create(data, { raw, nest })
  },
  update(userId, data) {
    console.log('Update OrgCodes', userId, data)
    return UserDetail.update(data, { where: { userId } })
  },
  delete(userId) {
    console.log('Delete user', userId)
    return UserDetail.findOne({ where: { userId: userId }, raw }).then((u) =>
      UserDetail.destroy({ where: { userId } }).then(() => u)
    )
  },
  async getByUserId(userId) {
    console.log('Get user', userId)
    return await UserDetail.findOne({ where: { userId: userId }, raw })
  },
}
