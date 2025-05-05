const { getSequelize, DataTypes, Model } = require('../config')
class SeatHood extends Model {}

module.exports = SeatHood

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatHood:
 *       required:
 *         - seatId
 *         - hoodId
 *       properties:
 *         seatId:
 *           type: integer
 *         hoodId:
 *           type: integer
 *     SeatHoods:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatHood"
 */
SeatHood.init(
  {
    seatId: DataTypes.INTEGER,
    hoodId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'seatHood' }
)
