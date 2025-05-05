const { WorkStreamOrgCode, config } = require('../model')
const { raw, nest } = config

module.exports = {
  getAll() {
    console.log('GetAll WorkStreamOrgCode')
    return WorkStreamOrgCode.findAll({ raw, nest })
  },
  get(id) {
    console.log('Get WorkStreamOrgCode', id)
    return WorkStreamOrgCode.findByPk(id)
  },
  create(data) {
    console.log('Create WorkStreamOrgCode', data)
    return WorkStreamOrgCode.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update WorkStreamOrgCode', id, data)
    return WorkStreamOrgCode.update(data, { where: { id } }).then(() => WorkStreamOrgCode.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete WorkStreamOrgCode', id)
    return WorkStreamOrgCode.findByPk(id, { raw, nest }).then((u) =>
      WorkStreamOrgCode.destroy({ where: { id } }).then(() => u)
    )
  },
}
