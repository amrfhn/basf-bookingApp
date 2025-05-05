const { getSequelize, DataTypes, Model } = require('../config')
class SeatAmenityMultiValue extends Model {}

module.exports = SeatAmenityMultiValue

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatAmenityMultiValue:
 *       required:
 *         - seatAmenityId
 *       properties:
 *         seatAmenityId:
 *           type: integer
 *         value:
 *           type: string
 *     SeatAmenities:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatAmenityMultiValue"
 */
SeatAmenityMultiValue.init(
  {
    seatAmenityId: { type: DataTypes.INTEGER, primaryKey: true },
    amenityValueId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'seatAmenityMultiValue' }
)
