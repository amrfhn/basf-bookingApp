const { getSequelize, DataTypes, Model } = require('../config')
class SeatAmenityNumericValue extends Model {}

module.exports = SeatAmenityNumericValue

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatAmenityNumericValue:
 *       required:
 *         - seatAmenityId
 *       properties:
 *         seatAmenityId:
 *           type: integer
 *         value:
 *           type: integer
 *     SeatAmenities:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatAmenityNumericValue"
 */
SeatAmenityNumericValue.init(
  {
    seatAmenityId: { type: DataTypes.INTEGER, primaryKey: true },
    value: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'seatAmenityNumericValue' }
)
