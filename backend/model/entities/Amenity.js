const { getSequelize, DataTypes, Model } = require('../config')
class Amenity extends Model {}

module.exports = Amenity

/**
 * @swagger
 * components:
 *   schemas:
 *     Amenity:
 *       required:
 *         - key
 *         - type
 *       properties:
 *         key:
 *           type: string
 *         type:
 *           type: enum {'NUMERIC', 'BOOLEAN', 'MULTI'}
 *         filterable:
 *           type: boolean
 *         siteId:
 *           type: number
 *     Amenities:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Amenity"
 */
Amenity.init(
  {
    key: DataTypes.STRING,
    type: DataTypes.ENUM('NUMERIC', 'BOOLEAN', 'MULTI'),
    filterable: DataTypes.BOOLEAN,
    siteId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'amenity' }
)
