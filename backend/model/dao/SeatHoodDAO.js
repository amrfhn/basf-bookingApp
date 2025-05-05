const { SeatHood, config } = require('../model')
const {Op} = require("sequelize");
const { raw, nest } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll seats hood')
    const where = {}

    if (filter) {
      if (filter.seatId) {
        where.seatId = filter.seatId
      }
      if (filter.hoodId) {
        where.hoodId = filter.hoodId
      }
      if (filter.seatIds) {
        where.seatId = { [Op.in]: filter.seatIds }
      }
    }

    return SeatHood.findAll({ where, raw, nest })
  },
  getQuantity(filter) {
    console.log('GetAll seats quantity by hood')
    const where = {}

    if (filter) {
      if (filter.hoodId) {
        where.hoodId = filter.hoodId
      }
    }
    return SeatHood.count({ where, raw, nest })
  },
  get(id) {
    console.log('Get seat hood', id)
    return SeatHood.findByPk(id)
  },
  create(data) {
    console.log('Create seat hood', data)
    return SeatHood.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update seat hood', id, data)
    return SeatHood.update(data, { where: { id } }).then(() => SeatHood.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete seat hood', id)
    return SeatHood.findByPk(id, { raw, nest }).then((u) => SeatHood.destroy({ where: { id } }).then(() => u))
  },
  async getBySeatId(seatId) {
    console.log('Get seat hood by seatId', seatId)
    return SeatHood.findAll({ where: { seatId: seatId }, raw })
  },
  batchDelete(filter) {
    const where = {}
    if (filter.hoodId) {
      where.hoodId = filter.hoodId
    }
    return SeatHood.destroy({ where })
  },
  createIfNotExist(data) {
    console.log('Create seatHood if not exist', data)
    return SeatHood.findOrCreate({ where: data })
  },
  deleteIfExist(data) {
    console.log('Delete seatHood if exist', data)
    return SeatHood.destroy({ where: data })
  },
}
