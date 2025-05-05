const { SeatPreferable, config } = require('../model')
const { raw, nest, Op } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll seats preferable')
    const where = {}
    if (filter.userId) {
      where.userId = filter.userId
    }
    if (filter.seatIds) {
      where.seatId = { [Op.in]: filter.seatIds }
    }
    if (filter.seatId) {
      where.seatId = filter.seatId
    }
    return SeatPreferable.findAll({ raw, nest, where })
  },
  get(id) {
    console.log('Get seat preferable', id)
    return SeatPreferable.findByPk(id)
  },
  create(data) {
    console.log('Create seat preferable', data)
    return SeatPreferable.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update seat preferable', id, data)
    return SeatPreferable.update(data, { where: { id } }).then(() => SeatPreferable.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete seat preferable', id)
    return SeatPreferable.findByPk(id, { raw, nest }).then((u) =>
      SeatPreferable.destroy({ where: { id } }).then(() => u)
    )
  },
  async bulkDelete(ids) {
    console.log('Deleting seats preferables:', ids)
    const where = {}
    where.id = { [Op.in]: ids }
    const seatsPref = await SeatPreferable.findAll({ raw, nest, where })
    const seatsPrefIds = seatsPref.map((b) => b.id)
    where.id = { [Op.in]: seatsPrefIds }
    return SeatPreferable.destroy({ raw, nest, where })
  },
}
