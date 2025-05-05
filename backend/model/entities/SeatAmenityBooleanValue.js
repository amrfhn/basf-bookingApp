const { getSequelize, DataTypes, Model } = require('../config')
class SeatAmenityBooleanValue extends Model {}

module.exports = SeatAmenityBooleanValue

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatAmenityBooleanValue:
 *       required:
 *         - seatAmenityId
 *       properties:
 *         seatAmenityId:
 *           type: integer
 *         value:
 *           type: boolean
 *     SeatAmenityBooleanValues:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatAmenityBooleanValue"
 */
SeatAmenityBooleanValue.init(
  {
    seatAmenityId: { type: DataTypes.INTEGER, primaryKey: true },
    value: DataTypes.BOOLEAN,
  },
  { sequelize: getSequelize(), modelName: 'seatAmenityBooleanValue' }
)
