const UserDetailDAO = require('../model/dao/UserDetailDAO')

module.exports = {
  getAll: UserDetailDAO.getAll,

  async update(userId, body) {
    const user = userId.toLowerCase()
    const dataToUpdate = { orgCode: body.orgCode }
    await UserDetailDAO.update(user, dataToUpdate)
  },

  async create(body) {
    await UserDetailDAO.create({
      userId: body.userId.toLowerCase(),
      orgCode: body.orgCode,
    })
  },

  async getByUserId(userId) {
    return await UserDetailDAO.getByUserId(userId.toLowerCase())
  },
  async delete(userId) {
    await UserDetailDAO.delete(userId.toLowerCase())
  },
}
