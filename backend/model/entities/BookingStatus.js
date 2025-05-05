const { getSequelize, DataTypes, Model } = require('../config')
class BookingStatus extends Model {}

module.exports = BookingStatus

/**
 * @swagger
 * components:
 *   schemas:
 *     Status:
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 */
BookingStatus.init(
  {
    status: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'bookingStatus' }
)
