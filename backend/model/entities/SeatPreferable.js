const { getSequelize, DataTypes, Model } = require('../config')
class SeatPreferable extends Model {}

module.exports = SeatPreferable

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatPreferable:
 *       required:
 *         - userId
 *         - seatId
 *       properties:
 *         userId:
 *           type: string
 *         seatId:
 *           type: integer
 *     SeatOwners:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatPreferable"
 */
SeatPreferable.init(
  {
    userId: DataTypes.STRING,
    seatId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'seatPreferable' }
)
