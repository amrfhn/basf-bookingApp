const { Calendar, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll calendars')
    const where = {}

    if (filter.initialDate && filter.finalDate) {
      where.date = { [Op.between]: [filter.initialDate, filter.finalDate] }
    }
    if (filter.date) {
      where.date = filter.date
    }
    if (filter.datePast) {
      where.date = { [Op.lt]: filter.datePast }
    }

    return Calendar.findAll({ where, raw, nest })
  },
  get(id) {
    console.log('Get calendar', id)
    return Calendar.findByPk(id)
  },
  create(data) {
    console.log('Create calendar', data)
    return Calendar.create(data, { raw, nest })
  },
  bulkCreate(data) {
    console.log('Bulk Create calendar', data)
    return Calendar.bulkCreate(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update calendar', id, data)
    return Calendar.update(data, { where: { id } }).then(() => Calendar.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete calendar', id)
    return Calendar.findByPk(id, { raw, nest }).then((u) => Calendar.destroy({ where: { id } }).then(() => u))
  },
}
