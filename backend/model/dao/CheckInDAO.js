const {
  Booking,
  config
} = require('../model')

const { raw, nest, sequelize } = config
const { Op } = require('sequelize')

module.exports = {
  update(id, data) {
    return Booking.update(data, { where: {id} }).then(() =>
      Booking.findByPk(id, {raw, nest})
    )
  },
}
