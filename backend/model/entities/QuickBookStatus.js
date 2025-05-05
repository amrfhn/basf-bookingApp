const { getSequelize, DataTypes, Model } = require('../config')
class QuickBookingStatus extends Model {}

module.exports = QuickBookingStatus

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
QuickBookingStatus.init(
  {
    status: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'quickBookingStatuses' }
)
