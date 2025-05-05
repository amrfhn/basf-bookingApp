const { getSequelize, DataTypes, Model } = require('../config')
class SeatOwner extends Model {}

module.exports = SeatOwner

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatOwner:
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
 *         $ref: "#/components/schemas/SeatOwner"
 */
SeatOwner.init(
  {
    userId: DataTypes.STRING,
    seatId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'seatOwner' }
)
