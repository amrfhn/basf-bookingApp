const { ExternalUser, config } = require('../model')
const { raw, nest } = config

module.exports = {
  getAll() {
    console.log('GetAll external users')
    return ExternalUser.findAll({ raw, nest })
  },
  get(id) {
    console.log('Get external user', id)
    return ExternalUser.findByPk(id)
  },
  create(data) {
    console.log('Create external user', data)
    return ExternalUser.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update external user', id, data)
    return ExternalUser.update(data, { where: { id } }).then(() => ExternalUser.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete external user', id)
    return ExternalUser.findByPk(id, { raw, nest }).then((u) => ExternalUser.destroy({ where: { id } }).then(() => u))
  },
}
