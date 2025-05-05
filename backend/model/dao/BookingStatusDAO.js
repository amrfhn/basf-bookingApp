const { BookingStatus, config } = require('../model')
const { raw, nest } = config

module.exports = {
  getAll() {
    console.log('GetAll booking status')
    return BookingStatus.findAll({ raw, nest })
  },
  get(id) {
    console.log('Get booking status', id)
    return BookingStatus.findByPk(id)
  },
  create(data) {
    console.log('Create booking status', data)
    return BookingStatus.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update booking status', id, data)
    return BookingStatus.update(data, { where: { id } }).then(() => BookingStatus.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete booking status', id)
    return BookingStatus.findByPk(id, { raw, nest }).then((u) => BookingStatus.destroy({ where: { id } }).then(() => u))
  },
}
