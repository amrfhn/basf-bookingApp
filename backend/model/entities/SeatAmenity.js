const { getSequelize, DataTypes, Model } = require('../config')
class SeatAmenity extends Model {}

module.exports = SeatAmenity

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatAmenity:
 *       required:
 *         - seatId
 *         - amenityId
 *       properties:
 *         seatId:
 *           type: integer
 *         amenityId:
 *           type: integer
 *         value:
 *           type: string
 *     SeatAmenities:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/SeatAmenity"
 */
SeatAmenity.init(
  {
    seatId: DataTypes.INTEGER,
    amenityId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'seatAmenity' }
)
