const { SeatOwner, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll seats owner')
    const where = {}
    if (filter.ids) {
      where.id = { [Op.in]: filter.ids }
    }
    if (filter.userId) {
      where.userId = filter.userId
    }
    if (filter.seatIds) {
      where.seatId = { [Op.in]: filter.seatIds }
    }
    if (filter.seatId) {
      where.seatId = filter.seatId
    }
    return SeatOwner.findAll({ raw, nest, where })
  },
  get(id) {
    console.log('Get seat owner', id)
    return SeatOwner.findByPk(id)
  },
  create(data) {
    console.log('Create seat owner', data)
    return SeatOwner.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update seat owner', id, data)
    return SeatOwner.update(data, { where: { id } }).then(() => SeatOwner.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete seat owner', id)
    return SeatOwner.findByPk(id, { raw, nest }).then((u) => SeatOwner.destroy({ where: { id } }).then(() => u))
  },
  async bulkDelete(ids) {
    console.log('Deleting seats owners:', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const seatsOwn = await SeatOwner.findAll({ raw, nest, where })
    const seatsOwnIds = seatsOwn.map((b) => b.id)
    where.id = { [Op.in]: seatsOwnIds }
    return SeatOwner.destroy({ raw, nest, where })
  },
}
