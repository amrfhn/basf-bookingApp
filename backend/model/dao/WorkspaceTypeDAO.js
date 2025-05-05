const { WorkspaceType, config } = require('../model')
const { raw, nest } = config

module.exports = {
  getAll() {
    console.log('GetAll workspace types')
    return WorkspaceType.findAll({ raw, nest })
  },
  get(id) {
    console.log('Get workspace types', id)
    return WorkspaceType.findByPk(id)
  },
  create(data) {
    console.log('Create workspace types', data)
    return WorkspaceType.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update workspace types', id, data)
    return WorkspaceType.update(data, { where: { id } }).then(() => WorkspaceType.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete workspace types', id)
    return WorkspaceType.findByPk(id, { raw, nest }).then((u) => WorkspaceType.destroy({ where: { id } }).then(() => u))
  },
}
