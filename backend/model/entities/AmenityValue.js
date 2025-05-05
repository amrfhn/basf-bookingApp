const { getSequelize, DataTypes, Model } = require('../config')
class AmenityValue extends Model {}

module.exports = AmenityValue

/**
 * @swagger
 * components:
 *   schemas:
 *     AmenityValue:
 *       required:
 *         - amenityId
 *         - value
 *       properties:
 *         amenityId:
 *           type: integer
 *         value:
 *           type: string
 *     amenityValues:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/AmenityValue"
 */
AmenityValue.init(
  {
    amenityId: DataTypes.INTEGER,
    value: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'amenityValues' }
)
